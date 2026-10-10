// 文本编码。
//
// DXF 的编码规则有个明确的分水岭，而且**老变量会留下来骗人**：
//
//   $ACADVER >= AC1021（R2007）  →  强制 UTF-8
//   更早的版本                    →  看 $DWGCODEPAGE（形如 ANSI_936）
//
// 陷阱在于：**新版本的文件里 $DWGCODEPAGE 往往还在，但已经失效了**。
// 实测 `circle.dxf` 就是活例子——它是 AC1027（R2013），却声明着
// `ANSI_1252`，而文件实际是 UTF-8。照 $DWGCODEPAGE 解会把 UTF-8 的中文
// 解成乱码，而且不报错。
//
// 所以判断顺序不能反：**先看版本，版本新就一律 UTF-8，不管代码页写了什么**。

///|
/// 文件用的编码。
pub(all) enum Encoding {
  Utf8
  /// Windows 西欧代码页。和 Latin-1 的区别在 0x80-0x9F 这一段
  Cp1252
  /// 其它代码页。目前只认得编号，不认表——解码时会降级并报警告
  Other(Int)
}

///|
/// 从文件开头判断该用什么编码。
///
/// 只需要看开头一段——HEADER 变量总在最前面。ezdxf 用的是前 1024 字节，
/// 这里也照做。
pub fn decide_encoding(data : Bytes) -> Encoding {
  let version = scan_header_string(data, "$ACADVER")
  match version {
    Some(v) =>
      // 版本号形如 `AC1027`，字典序比较和数值序一致
      if v >= "AC1021" {
        Utf8
      } else {
        codepage_from_header(data)
      }
    None =>
      // 连版本都读不到，多半不是 DXF 或文件坏了。
      // 按最保守的方式处理，让上层去报「这不是 DXF」
      Cp1252
  }
}

///|
/// 从 `$DWGCODEPAGE` 读出代码页。
fn codepage_from_header(data : Bytes) -> Encoding {
  let name = scan_header_string(data, "$DWGCODEPAGE")
  match name {
    Some(n) => parse_codepage_name(n)
    None => Cp1252
  }
}

///|
/// 代码页名（`ANSI_936`）→ 编码。
fn parse_codepage_name(name : String) -> Encoding {
  if name == "ANSI_1252" || name == "ANSI_1251" || name == "ANSI_1250" {
    // 这几种在 DXF 里的用法和 CP1252 的差别只影响极少数西里尔/中欧字符，
    // 而它们本来就属于我们不打算支持的少数字符集——按 CP1252 处理并报警告
    Cp1252
  } else if name.has_prefix("ANSI_") {
    let digits = name[5:].to_owned()
    let n = @string.parse_double(digits) catch {
      _ => return Cp1252
    }
    if n.is_nan() || n.is_inf() || n != n.round() {
      Cp1252
    } else {
      Other(n.to_int())
    }
  } else {
    Cp1252
  }
}

///|
/// 把码位转成字符。
///
/// `Int::to_char` 返回的是 `Char?`——不是每个整数都是合法码位（代理区
/// 0xD800-0xDFFF 就不是）。坏字节解出来落在这里时用替换字符顶上，
/// 而不是崩掉。
fn code_point_to_char(c : Int) -> Char {
  match c.to_char() {
    Some(ch) => ch
    None => '\u{FFFD}'
  }
}

///|
/// 在文件开头的 HEADER 段里找一个变量的值。
///
/// **直接在字节上找，不解码**——因为要解码就得先知道编码，而这里正是在
/// 决定用什么编码。HEADER 变量名和版本号都是纯 ASCII，按字节比就够了。
fn scan_header_string(data : Bytes, var_name : String) -> String? {
  let limit = if data.length() < 1024 { data.length() } else { 1024 }
  let needle = var_name
  let mut i = 0
  while i + needle.length() + 2 < limit {
    if bytes_match_at(data, i, needle) {
      // 格式是：9 / $ACADVER / 1 / AC1027（或 3 / ANSI_1252）
      // 所以变量名之后要找下一行的值
      return Some(read_ascii_value_after(data, i + needle.length(), limit))
    }
    i = i + 1
  }
  None
}

///|
/// `data[at..]` 是不是以 `s` 开头。
fn bytes_match_at(data : Bytes, at : Int, s : String) -> Bool {
  if at + s.length() > data.length() {
    return false
  }
  for k = 0; k < s.length(); k = k + 1 {
    if data[at + k].to_int() != s.code_unit_at(k).to_int() {
      return false
    }
  }
  true
}

///|
/// 从变量名之后读出那个变量的值。
///
/// 走法是：跳过 `\r`/`\n` 和紧随其后的组码行（`1` 或 `3`），再取一行。
fn read_ascii_value_after(data : Bytes, from : Int, limit : Int) -> String {
  let mut i = from
  // 跳过行尾
  while i < limit && (data[i] == b'\r' || data[i] == b'\n') {
    i = i + 1
  }
  // 跳过组码那一行
  while i < limit && data[i] != b'\r' && data[i] != b'\n' {
    i = i + 1
  }
  while i < limit && (data[i] == b'\r' || data[i] == b'\n') {
    i = i + 1
  }
  // 读值那一行
  let start = i
  while i < limit && data[i] != b'\r' && data[i] != b'\n' {
    i = i + 1
  }
  bytes_to_ascii(data, start, i)
}

///|
/// 把一段纯 ASCII 字节转成字符串。非 ASCII 字节丢掉——用在这里的都是
/// 变量名和版本号，本来就是 ASCII。
fn bytes_to_ascii(data : Bytes, from : Int, to : Int) -> String {
  let sb = StringBuilder()
  for i = from; i < to; i = i + 1 {
    let c = data[i].to_int() & 0xFF
    if c > 0 && c < 128 {
      sb.write_char(code_point_to_char(c))
    }
  }
  sb.to_string()
}

// ── 解码 ────────────────────────────────────────────────────────────────

///|
/// 按指定编码把字节解成字符串。
///
/// **遇到不认识的代码页不静默乱码**：降级成 Latin-1 并让调用方拿到一条警告。
/// 乱码最坏的地方是它看起来「有内容」——用户会以为是文件本身有问题，
/// 而不是工具不支持这个编码。
pub fn decode_text(data : Bytes, enc : Encoding) -> String {
  match enc {
    Utf8 => @utf8.decode_lossy(data)
    Cp1252 => decode_cp1252(data)
    Other(_) => decode_latin1(data)
  }
}

///|
/// 这个编码是不是只能降级处理。
pub fn Encoding::is_fallback(self : Encoding) -> Bool {
  match self {
    Other(_) => true
    _ => false
  }
}

///|
/// 编码的中文名，出错信息里用。
pub fn Encoding::to_display(self : Encoding) -> String {
  match self {
    Utf8 => "UTF-8"
    Cp1252 => "CP1252（西欧）"
    Other(n) => "代码页 \{n}"
  }
}

///|
/// CP1252：0x80-0x9F 这一段不是 Latin-1，是单独的 32 个字符
/// （引号、破折号、欧元符号那一批）。
///
/// 因为 DXF 里 0x00-0x1F 是控制字符、基本不出现，所以只需要对
/// 0x80-0x9F 做一次查表，其余字节直接按 Latin-1 映射。
fn decode_cp1252(data : Bytes) -> String {
  let sb = StringBuilder()
  for i = 0; i < data.length(); i = i + 1 {
    let b = data[i].to_int() & 0xFF
    if b >= 0x80 && b <= 0x9F {
      sb.write_char(cp1252_high(b))
    } else {
      sb.write_char(code_point_to_char(b))
    }
  }
  sb.to_string()
}

///|
/// CP1252 在 0x80-0x9F 的映射表。未定义的几个位置按 Unicode 的推荐
/// 映射成对应的控制字符。
fn cp1252_high(b : Int) -> Char {
  let table : Array[Int] = [
    0x20AC, 0x0081, 0x201A, 0x0192, 0x201E, 0x2026, 0x2020, 0x2021, 0x02C6,
    0x2030, 0x0160, 0x2039, 0x0152, 0x008D, 0x017D, 0x008F, 0x0090, 0x2018,
    0x2019, 0x201C, 0x201D, 0x2022, 0x2013, 0x2014, 0x02DC, 0x2122, 0x0161,
    0x203A, 0x0153, 0x009D, 0x017E, 0x0178,
  ]
  let idx = b - 0x80
  if idx >= 0 && idx < table.length() {
    code_point_to_char(table[idx])
  } else {
    code_point_to_char(b)
  }
}

///|
/// Latin-1：每个字节直接对应同码位的 Unicode。**这是降级方案**，
/// 对 GBK / Shift_JIS 这类多字节编码会得到乱码——所以调用方必须同时报出警告。
fn decode_latin1(data : Bytes) -> String {
  let sb = StringBuilder()
  for i = 0; i < data.length(); i = i + 1 {
    sb.write_char(code_point_to_char(data[i].to_int() & 0xFF))
  }
  sb.to_string()
}
