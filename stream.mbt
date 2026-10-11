// 流式扫描：分块喂字节，边喂边出 tag。
//
// 为什么要有这个：整份扫描（`scan_tags`）要把整个文件读进内存。
// 大图纸几百 MB 甚至上 GB，内存扛不住——流式这边内存只和
// 「一块 + 没消费完的碎行」有关，文件多大都一样。
//
// 正确性的地基是一个巧合：**编码判断只看文件前 1024 字节**
//（`decide_encoding` 的设计——HEADER 变量总在最前面）。所以流式这边
// 攒够前 1024 字节再定编码、再往外吐 tag，和整份扫描对同一个文件的
// 判断必然一致。语料上逐 tag 对过账（`corpus_wbtest` 里那条等价性测试）。
//
// `scan_tags` 自己也改成了这层的封装：一处状态机、两个入口，
// 行为不会有第二套。

///|
/// 流式扫描器：`feed` 分块喂入，`finish` 收尾。
///
/// tag 是「组码一行、值一行」的配对，配对可能横跨块边界——内部
/// 缓冲没读完的行，`feed` 之间不用调用方操心。
pub(all) struct TagStream {
  /// 没消费完的字节。定编码之前，这是攒着的文件头部前缀
  priv mut buffer : Bytes
  priv mut line_no : Int
  /// 上一行读到的组码（tag 成对，读到组码就得等它的值）
  priv mut pending : Int?
  priv warn : Array[String]
  /// 文件编码。**定下来之前不往外吐任何 tag**——值怎么解码全靠它
  priv mut enc : Encoding?
  priv mut finished : Bool
  /// 碰到 `0 / EOF` 之后一律不看了（EOF 后面可能是垃圾字节）
  priv mut eof_seen : Bool
}

///|
pub fn TagStream::new() -> TagStream {
  let empty : Array[Byte] = []
  {
    buffer: Bytes::from_array(empty),
    line_no: 0,
    pending: None,
    warn: [],
    enc: None,
    finished: false,
    eof_seen: false,
  }
}

///|
/// 分块喂入，返回这次新扫出来的 tag。
///
/// 头部攒够 1024 字节之前可能一个都不吐（在等编码判断）——
/// 这是设计，不是卡住了；`finish` 会把不足 1024 字节的文件收尾。
pub fn TagStream::feed(self : TagStream, chunk : Bytes) -> Array[Tag] {
  let out : Array[Tag] = []
  if self.finished || self.eof_seen {
    return out
  }
  self.buffer = concat_bytes(self.buffer, chunk)
  if self.enc is None {
    if self.buffer.length() < 1024 {
      return out
    }
    self.enc = Some(decide_encoding(self.buffer))
  }
  self.consume_lines(out)
  out
}

///|
/// 收尾：把缓冲里剩下的消费掉（最后一行没有换行符也算一整行），
/// 报出「组码后面没有值」这类截断警告。之后 `feed` 再喂什么都返回空。
pub fn TagStream::finish(self : TagStream) -> Array[Tag] {
  let out : Array[Tag] = []
  if self.finished {
    return out
  }
  self.finished = true
  if self.eof_seen {
    return out
  }
  if self.enc is None {
    // 不足 1024 字节的小文件：用现有的全部判断——和整份扫描对
    // 短文件的行为一致（decide_encoding 自己会截到 1024）
    self.enc = Some(decide_encoding(self.buffer))
  }
  self.consume_lines(out)
  match self.pending {
    Some(code) =>
      self.warn.push(
        "文件在最后一行截断了：组码 \{code} 后面没有值（可能是文件被切断了）",
      )
    None => ()
  }
  out
}

///|
/// 扫描中攒下的警告（和 `TagScan.warnings` 同源）。
pub fn TagStream::warnings(self : TagStream) -> Array[String] {
  self.warn.copy()
}

///|
/// 文件编码；还没定（还没攒够 1024 字节）时是 `None`。
pub fn TagStream::encoding(self : TagStream) -> Encoding? {
  self.enc
}

///|
/// 消费缓冲里所有**能确定边界**的行，产出 tag。
///
/// 一行算「确定」：看到了换行符——`\r\n` 要看得到下一个字节，
/// 不然不知道 `\r` 后面跟不跟 `\n`；或者正在收尾（缓冲末尾即文件末尾）。
fn TagStream::consume_lines(self : TagStream, out : Array[Tag]) -> Unit {
  let data = self.buffer
  let n = data.length()
  let mut pos = 0
  let mut done = false
  while pos < n && !done {
    let e = line_end(data, pos)
    if e >= n && !self.finished {
      // 行还没写完——留着等下一块
      break
    }
    if e < n && data[e] == b'\r' && e + 1 >= n && !self.finished {
      // `\r` 是块里的最后一个字节：可能是 `\r\n` 的前半——等下一块
      break
    }
    let start = pos
    pos = advance_past_newline(data, e)
    self.line_no = self.line_no + 1
    match self.pending {
      None =>
        match parse_group_code(data, start, e) {
          Some(code) => self.pending = Some(code)
          None =>
            if line_is_blank(data, start, e) {
              () // 空行是正常现象，不报警告
            } else {
              self.warn.push(
                "第 \{self.line_no} 行：这一行应该是组码，但读不出整数（" +
                "内容：\{preview(data, start, e)}），已跳过",
              )
            }
        }
      Some(code) => {
        let value = parse_value(code, data, start, e, self.enc.unwrap())
        out.push(Tag::new(code, value))
        self.pending = None
        // `0 / EOF` 是文件结束标志，后面的都不看
        if code == 0 && value.as_string() == "EOF" {
          self.eof_seen = true
          done = true
        }
      }
    }
  }
  // 丢掉消费过的部分；EOF 之后剩下的（垃圾字节）也一并丢掉
  if done {
    let empty : Array[Byte] = []
    self.buffer = Bytes::from_array(empty)
  } else if pos > 0 {
    self.buffer = slice_range(data, pos, n)
  }
}

///|
/// 拼两块字节。
fn concat_bytes(a : Bytes, b : Bytes) -> Bytes {
  if a.length() == 0 {
    return b
  }
  if b.length() == 0 {
    return a
  }
  let out : Array[Byte] = []
  for i = 0; i < a.length(); i = i + 1 {
    out.push(a[i])
  }
  for i = 0; i < b.length(); i = i + 1 {
    out.push(b[i])
  }
  Bytes::from_array(out)
}
