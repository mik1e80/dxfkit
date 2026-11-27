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
  /// Legacy code page number. ANSI_936 has a built-in two-byte decoder.
  Other(Int32)
}

///|
/// 从文件开头判断该用什么编码。
///
/// 仅探测前1024字节；声明不在这个范围时会使用回退编码。
pub fn decide_encoding(data : Bytes) -> Encoding {
  if utf8_bom(data) {
    return Utf8
  }
  let (version, codepage) = probe_header_encoding(data)
  if version >= "AC1021" {
    Utf8
  } else if version == "" || codepage == "" {
    Cp1252
  } else {
    parse_codepage_name(codepage)
  }
}

///|
/// 代码页名（`ANSI_936`）→ 编码。
fn parse_codepage_name(name : String) -> Encoding {
  if name == "ANSI_1252" {
    Cp1252
  } else if name.has_prefix("ANSI_") {
    let digits = name[5:].to_owned()
    let n = @string.parse_double(digits) catch { _ => return Cp1252 }
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
fn code_point_to_char(c : Int32) -> Char {
  match c.to_char() {
    Some(ch) => ch
    None => '\u{FFFD}'
  }
}

///|
/// Match complete tag pairs within the HEADER segment. Comments and values
/// in later segments cannot be mistaken for encoding declarations.
fn probe_header_encoding(data : Bytes) -> (String, String) {
  let limit = data.length().min(1024)
  let mut offset = 0
  let mut group : Int32? = None
  let mut awaiting_section = false
  let mut in_header = false
  let mut variable = ""
  let mut version = ""
  let mut codepage = ""
  while offset < limit {
    let start = offset
    while offset < limit && data[offset] != b'\n' && data[offset] != b'\r' {
      offset += 1
    }
    if offset == limit {
      break
    }
    let stop = offset
    offset += 1
    if data[stop] == b'\r' && offset < limit && data[offset] == b'\n' {
      offset += 1
    }
    match group {
      None => group = parse_group_code(data, start, stop)
      Some(code) => {
        group = None
        if code == 999 {
          continue
        }
        let (from, to) = trim_ascii_range(data, start, stop)
        let value = bytes_to_ascii(data, from, to)
        if code == 0 {
          if in_header {
            break
          }
          awaiting_section = value == "SECTION"
        } else if code == 2 && awaiting_section {
          in_header = value == "HEADER"
          awaiting_section = false
        } else if in_header {
          if code == 9 {
            variable = value
          } else {
            if variable == "$ACADVER" && code == 1 && version == "" {
              version = value
            } else if variable == "$DWGCODEPAGE" && code == 3 && codepage == "" {
              codepage = value
            }
            variable = ""
          }
        }
      }
    }
  }
  (version, codepage)
}

///|
fn utf8_bom(data : Bytes) -> Bool {
  data.length() >= 3 &&
  data[0] == b'\xEF' &&
  data[1] == b'\xBB' &&
  data[2] == b'\xBF'
}

///|
/// 把一段纯 ASCII 字节转成字符串。非 ASCII 字节丢掉——用在这里的都是
/// 变量名和版本号，本来就是 ASCII。
fn bytes_to_ascii(data : Bytes, from : Int32, to : Int32) -> String {
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
    Other(936) => decode_gbk(data).0
    Other(_) => decode_latin1(data)
  }
}

///|
/// 这个编码是不是只能降级处理。
pub fn Encoding::is_fallback(self : Encoding) -> Bool {
  match self {
    Other(936) => false
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
    Other(936) => "ANSI_936（GBK）"
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
fn cp1252_high(b : Int32) -> Char {
  let table : Array[Int32] = [
    0x20AC, 0x0081, 0x201A, 0x0192, 0x201E, 0x2026, 0x2020, 0x2021, 0x02C6, 0x2030,
    0x0160, 0x2039, 0x0152, 0x008D, 0x017D, 0x008F, 0x0090, 0x2018, 0x2019, 0x201C,
    0x201D, 0x2022, 0x2013, 0x2014, 0x02DC, 0x2122, 0x0161, 0x203A, 0x0153, 0x009D,
    0x017E, 0x0178,
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
