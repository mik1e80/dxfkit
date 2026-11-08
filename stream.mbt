///|
/// Parsing budgets include malformed input; exhaustion stops with an explicit warning.
pub(all) struct ReadLimits {
  max_file_bytes : Int
  max_line_bytes : Int
  max_tags : Int
  max_records : Int
  max_warnings : Int
  max_string_bytes : Int
}

///|
pub fn ReadLimits::default() -> ReadLimits {
  {
    max_file_bytes: 67108864,
    max_line_bytes: 1048576,
    max_tags: 1000000,
    max_records: 200000,
    max_warnings: 1000,
    max_string_bytes: 1048576,
  }
}

///|
/// Byte-linear streaming scanner with a bounded encoding prefix and growing line.
/// Caller-owned input bytes are not freed by scanner limits.
pub(all) struct TagStream {
  priv prefix : Array[Byte]
  priv mut line : Array[Byte]
  priv mut line_no : Int
  priv mut pending : Int?
  priv warn : Array[String]
  priv mut enc : Encoding?
  priv mut finished : Bool
  priv mut eof_seen : Bool
  priv mut skip_lf : Bool
  priv limits : ReadLimits
  priv mut bytes : Int
  priv mut tags : Int
  priv mut records : Int
  priv mut limited : Bool
}

///|
pub fn TagStream::new() -> TagStream {
  TagStream::with_limits(ReadLimits::default())
}

///|
pub fn TagStream::with_limits(limits : ReadLimits) -> TagStream {
  let stream : TagStream = {
    prefix: [],
    line: [],
    line_no: 0,
    pending: None,
    warn: [],
    enc: None,
    finished: false,
    eof_seen: false,
    skip_lf: false,
    limits,
    bytes: 0,
    tags: 0,
    records: 0,
    limited: false,
  }
  if limits.max_file_bytes <= 0 ||
    limits.max_line_bytes <= 0 ||
    limits.max_tags <= 0 ||
    limits.max_records <= 0 ||
    limits.max_warnings <= 0 ||
    limits.max_string_bytes <= 0 {
    stream.stop_limit("读取预算必须为正整数")
  }
  stream
}

///|
/// Further feeds after exhaustion are ignored; partial tags are not a complete file.
pub fn TagStream::is_limited(self : TagStream) -> Bool {
  self.limited
}

///|
fn TagStream::stop_limit(self : TagStream, reason : String) -> Unit {
  if self.limited {
    return
  }
  self.limited = true
  self.line = []
  let cap = self.limits.max_warnings.max(1)
  if self.warn.length() >= cap {
    self.warn.pop() |> ignore
  }
  self.warn.push("读取资源上限：" + reason + "；读取/检查不完整")
}

///|
fn TagStream::warning(self : TagStream, message : String) -> Unit {
  if self.warn.length() >= self.limits.max_warnings {
    self.stop_limit("警告数量")
  } else {
    self.warn.push(message)
  }
}

///|
pub fn TagStream::feed(self : TagStream, chunk : Bytes) -> Array[Tag] {
  let out : Array[Tag] = []
  if self.finished || self.eof_seen || self.limited {
    return out
  }
  // Reject before copying. Overflow cannot wrap the cumulative byte counter.
  if chunk.length() > self.limits.max_file_bytes - self.bytes {
    self.stop_limit("文件字节数")
    return out
  }
  self.bytes += chunk.length()
  for byte in chunk {
    if self.eof_seen || self.limited {
      break
    }
    if self.enc is None {
      self.prefix.push(byte)
      if self.prefix.length() == 1024 {
        self.choose_encoding(out)
      }
    } else {
      self.consume_byte(byte, out)
    }
  }
  out
}

///|
pub fn TagStream::finish(self : TagStream) -> Array[Tag] {
  let out : Array[Tag] = []
  if self.finished {
    return out
  }
  self.finished = true
  if self.enc is None {
    self.choose_encoding(out)
  }
  if self.eof_seen || self.limited {
    return out
  }
  if self.line.length() > 0 {
    self.consume_line(out)
  }
  if !self.limited {
    match self.pending {
      Some(code) =>
        self.warning(
          "文件在最后一行截断了：组码 \{code} 后面没有值（可能是文件被切断了）",
        )
      None => ()
    }
  }
  out
}

///|
pub fn TagStream::warnings(self : TagStream) -> Array[String] {
  self.warn.copy()
}

///|
pub fn TagStream::encoding(self : TagStream) -> Encoding? {
  self.enc
}

///|
fn TagStream::choose_encoding(self : TagStream, out : Array[Tag]) -> Unit {
  let enc = decide_encoding(Bytes::from_array(self.prefix))
  self.enc = Some(enc)
  if enc.is_fallback() {
    self.warning(
      "未支持的\{enc.to_display()}按Latin-1降级解码；文字可能失真",
    )
  }
  for byte in self.prefix {
    if self.eof_seen || self.limited {
      break
    }
    self.consume_byte(byte, out)
  }
  self.prefix.clear()
}

///|
fn TagStream::consume_byte(
  self : TagStream,
  byte : Byte,
  out : Array[Tag],
) -> Unit {
  if self.skip_lf {
    self.skip_lf = false
    if byte == b'\n' {
      return
    }
  }
  if byte == b'\r' || byte == b'\n' {
    self.skip_lf = byte == b'\r'
    self.consume_line(out)
  } else if self.line.length() >= self.limits.max_line_bytes {
    self.stop_limit("单行字节数")
  } else {
    self.line.push(byte)
  }
}

///|
fn TagStream::consume_line(self : TagStream, out : Array[Tag]) -> Unit {
  let data = Bytes::from_array(self.line)
  self.line = []
  self.line_no += 1
  let n = data.length()
  match self.pending {
    None =>
      match parse_group_code(data, 0, n) {
        Some(code) => self.pending = Some(code)
        None =>
          if !line_is_blank(data, 0, n) {
            self.warning(
              "第 \{self.line_no} 行：这一行应该是组码，但读不出整数（内容：\{preview(data, 0, n)}），已跳过",
            )
          }
      }
    Some(code) => {
      if self.tags >= self.limits.max_tags ||
        (code == 0 && self.records >= self.limits.max_records) {
        self.stop_limit("tag 或记录数量")
        return
      }
      if (code_type(code) is Str || code_type(code) is Bin) &&
        n > self.limits.max_string_bytes {
        self.stop_limit("字符串字节数")
        return
      }
      let value = match parse_value(code, data, 0, n, self.enc.unwrap()) {
        Ok(value) => value
        Err(msg) => {
          self.warning(
            "第\{self.line_no}行组码\{code}：\{msg}；保留原文，几何结果需复核",
          )
          Str(decode_text(data, self.enc.unwrap()))
        }
      }
      if self.limited {
        return
      }
      out.push(Tag::new(code, value))
      self.tags += 1
      if code == 0 {
        self.records += 1
      }
      self.pending = None
      if code == 0 && value.as_string() == "EOF" {
        self.eof_seen = true
      }
    }
  }
}
