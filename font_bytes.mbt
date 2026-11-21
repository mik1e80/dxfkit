///|
priv suberror FontError {
  InvalidFont(String)
}

///|
priv struct FontBytes {
  bytes : Bytes
  start : Int
  size : Int
}

///|
fn FontBytes::region(
  self : FontBytes,
  offset : Int,
  size : Int,
) -> FontBytes raise FontError {
  guard offset >= 0 &&
    size >= 0 &&
    offset <= self.size &&
    size <= self.size - offset else {
    raise InvalidFont("字体字段超出记录范围")
  }
  { bytes: self.bytes, start: self.start + offset, size, }
}

///|
fn FontBytes::u8(self : FontBytes, i : Int) -> Int raise FontError {
  guard i >= 0 && i < self.size else {
    raise InvalidFont("字体记录被截断")
  }
  self.bytes[self.start + i].to_int()
}

///|
fn FontBytes::i8(self : FontBytes, i : Int) -> Int raise FontError {
  let v = self.u8(i)
  if v >= 128 {
    v - 256
  } else {
    v
  }
}

///|
fn FontBytes::u16(self : FontBytes, i : Int) -> Int raise FontError {
  (self.u8(i) << 8) + self.u8(i + 1)
}

///|
fn FontBytes::i16(self : FontBytes, i : Int) -> Int raise FontError {
  let v = self.u16(i)
  if v >= 32768 {
    v - 65536
  } else {
    v
  }
}

///|
fn FontBytes::le16(self : FontBytes, i : Int) -> Int raise FontError {
  self.u8(i) + (self.u8(i + 1) << 8)
}

///|
fn FontBytes::u32(self : FontBytes, i : Int) -> Int raise FontError {
  let high = self.u16(i)
  guard high < 32768 else {
    raise InvalidFont("字体偏移或长度无法表示")
  }
  (high << 16) + self.u16(i + 2)
}

///|
fn FontBytes::ascii_at(
  self : FontBytes,
  i : Int,
  value : String,
) -> Bool raise FontError {
  for j in 0..<value.length() {
    if self.u8(i + j) != value[j].to_int() {
      return false
    }
  }
  true
}

///|
fn font_input(data : Bytes) -> FontBytes raise FontError {
  guard data.length() <= 32 * 1024 * 1024 else {
    raise InvalidFont("字体超过 32 MiB")
  }
  { bytes: data, start: 0, size: data.length(), }
}

///|
priv struct FontBudget {
  mut remaining : Int
}

///|
fn FontBudget::take(self : FontBudget, n : Int) -> Unit raise FontError {
  guard n >= 0 && self.remaining >= n else {
    raise InvalidFont("字形超过全局工作预算")
  }
  self.remaining -= n
}
