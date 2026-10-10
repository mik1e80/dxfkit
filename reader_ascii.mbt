// DXF 的 ASCII 解析：把字节流切成 tag 列表。
//
// ASCII DXF 的正文是**一行组码、一行值**交替排列：
//
//       0          ← 组码按 3 位右对齐（这是规范里的 %3d 格式）
//     CIRCLE       ← 值不缩进
//      10
//     0.0
//
// 两个真实世界才暴露得出来的细节：
//
//   1. **组码行有前导空白，值行没有。** 实测 `circle.dxf` 有 1124/3016 行
//      带前导空白，`Minimal_DXF_AC1021.dxf` 一行都没有。所以组码必须 trim。
//   2. **值不能跟着 trim。** TEXT 实体的文字内容可能真的以空格开头，
//      一起 trim 掉就把用户的数据改了。数值类型的值当然可以 trim
//      （数字周围的空格无意义），字符串类型的必须原样留着。
//
// 换行三种都要认：`\n`、`\r\n`（Windows 导出的基本都这样）、以及裸 `\r`
// （老 Mac 的写法，在古董图纸里真的会遇到）。

///|
/// 一次扫描的结果。
///
/// 警告而不是异常：DXF 大量来自第三方导出器，坏文件比想象中多，
/// 「读了 90% 然后告诉你哪里坏了」比「抛异常什么都没读出来」有用得多。
pub(all) struct TagScan {
  tags : Array[Tag]
  warnings : Array[String]
  /// 文件用的编码（从 HEADER 判断出来的）
  encoding : Encoding
}

///|
/// 把 ASCII DXF 的字节流切成 tag。
///
/// 碰到 `EOF` 就停——真实的 DXF 文件在 `EOF` 之后还可能有垃圾字节
/// （实测 ezdxf 的语料里就有 `R12_with_trash_beyond_EOF.dxf`），
/// 那些不是数据，继续解会把噪声当成 tag。
pub fn scan_tags(data : Bytes) -> TagScan {
  let encoding = decide_encoding(data)
  let tags : Array[Tag] = []
  let warnings : Array[String] = []
  let mut pos = 0
  let mut line_no = 0
  // 上一行读到的组码。DXF 的 tag 是成对的，读到一个组码就得等它的值
  let mut pending : Int? = None
  let mut done = false

  while pos < data.length() && !done {
    let end = line_end(data, pos)
    let line_start = pos
    pos = advance_past_newline(data, end)
    line_no = line_no + 1

    match pending {
      None => {
        // 这一行应该是组码
        match parse_group_code(data, line_start, end) {
          Some(code) => pending = Some(code)
          None =>
            // 组码行读不出整数。跳过这一行继续——比整份文件失败强
            if line_is_blank(data, line_start, end) {
              () // 空行是正常现象，不报警告
            } else {
              warnings.push(
                "第 \{line_no} 行：这一行应该是组码，但读不出整数（" +
                "内容：\{preview(data, line_start, end)}），已跳过",
              )
            }
        }
      }
      Some(code) => {
        let value = parse_value(code, data, line_start, end, encoding)
        tags.push(Tag::new(code, value))
        pending = None
        // `0 / EOF` 是文件结束标志，后面的都不看
        if code == 0 && value.as_string() == "EOF" {
          done = true
        }
      }
    }
  }

  match pending {
    Some(code) =>
      warnings.push(
        "文件在最后一行截断了：组码 \{code} 后面没有值（可能是文件被切断了）",
      )
    None => ()
  }
  { tags, warnings, encoding }
}

///|
/// 从 `from` 开始找这一行的结束位置（不含换行符本身）。
fn line_end(data : Bytes, from : Int) -> Int {
  let mut i = from
  while i < data.length() && data[i] != b'\n' && data[i] != b'\r' {
    i = i + 1
  }
  i
}

///|
/// 从行尾跳到下一行的开头，三种换行都认。
fn advance_past_newline(data : Bytes, at : Int) -> Int {
  let mut i = at
  if i < data.length() && data[i] == b'\r' {
    i = i + 1
  }
  if i < data.length() && data[i] == b'\n' {
    i = i + 1
  }
  i
}

///|
/// 这一行是不是只有空白。
fn line_is_blank(data : Bytes, from : Int, to : Int) -> Bool {
  for i = from; i < to; i = i + 1 {
    let c = data[i].to_int() & 0xFF
    if c != 0x20 && c != 0x09 {
      return false
    }
  }
  true
}

///|
/// 组码那一行的内容摘录，出错信息里用。太长的截断。
fn preview(data : Bytes, from : Int, to : Int) -> String {
  let sb = StringBuilder()
  let stop = if to - from > 40 { from + 40 } else { to }
  for i = from; i < stop; i = i + 1 {
    let c = data[i].to_int() & 0xFF
    if c >= 0x20 && c < 0x7F {
      sb.write_char(code_point_to_char(c))
    } else {
      sb.write_char('?')
    }
  }
  sb.to_string()
}

///|
/// 解析组码。
///
/// **必须 trim**：组码按 3 位右对齐（`  0`、` 70`、`100`），不 trim 的话
/// 除了三位数以外全都解析不出来。实测 `circle.dxf` 有一千多行是缩进的。
fn parse_group_code(data : Bytes, from : Int, to : Int) -> Int? {
  let (start, stop) = trim_ascii_range(data, from, to)
  if start >= stop {
    return None
  }
  // 逐位算，不转字符串——组码就在这几行里出现几十万次
  let mut value = 0
  let mut negative = false
  let mut i = start
  if data[i] == b'-' {
    negative = true
    i = i + 1
  }
  if i >= stop {
    return None
  }
  while i < stop {
    let c = data[i].to_int() & 0xFF
    if c < 0x30 || c > 0x39 {
      return None
    }
    value = value * 10 + (c - 0x30)
    i = i + 1
  }
  if negative {
    Some(-value)
  } else {
    Some(value)
  }
}

///|
/// 去掉一段字节两侧的空格和制表符。返回新的 `[start, stop)`。
fn trim_ascii_range(data : Bytes, from : Int, to : Int) -> (Int, Int) {
  let mut start = from
  let mut stop = to
  while start < stop {
    let c = data[start].to_int() & 0xFF
    if c == 0x20 || c == 0x09 {
      start = start + 1
    } else {
      break
    }
  }
  while stop > start {
    let c = data[stop - 1].to_int() & 0xFF
    if c == 0x20 || c == 0x09 {
      stop = stop - 1
    } else {
      break
    }
  }
  (start, stop)
}

///|
/// 解析一个值。
///
/// **字符串类型不 trim**，数值类型 trim——理由见文件头。
fn parse_value(
  code : Int,
  data : Bytes,
  from : Int,
  to : Int,
  encoding : Encoding,
) -> TagValue {
  match code_type(code) {
    Str => Str(decode_text(slice_range(data, from, to), encoding))
    Bin => Str(decode_text(slice_range(data, from, to), encoding))
    F64 => F64(parse_double_trimmed(data, from, to))
    I16 => I16(parse_double_trimmed(data, from, to).to_int())
    I32 => I32(parse_double_trimmed(data, from, to).to_int())
    I64 => I64(parse_double_trimmed(data, from, to).to_int64())
    Bool => Bool(parse_double_trimmed(data, from, to) != 0.0)
  }
}

///|
/// 解析一个数值（先 trim 两侧空白）。
///
/// 读不出数字时**返回 0 而不是报错**——报错会让一个格式良好但某个值
/// 写坏了的文件整份读不了。0 是安全的默认值（坐标 0、标志位假）。
/// 真要报的话应该由结构层去做，那里才知道这个值重不重要。
fn parse_double_trimmed(data : Bytes, from : Int, to : Int) -> Double {
  let (start, stop) = trim_ascii_range(data, from, to)
  if start >= stop {
    return 0.0
  }
  let s = bytes_to_ascii(data, start, stop)
  @string.parse_double(s[:]) catch {
    _ => 0.0
  }
}

///|
/// 把一段字节复制出来。
fn slice_range(data : Bytes, from : Int, to : Int) -> Bytes {
  let out : Array[Byte] = []
  for i = from; i < to; i = i + 1 {
    out.push(data[i])
  }
  Bytes::from_array(out)
}
