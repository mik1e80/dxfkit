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
///
/// 这是**整份扫描**的入口；分块扫描走 `stream.mbt` 的 `TagStream`。
/// 两个入口共用同一套状态机（这里就是它的一次性封装），
/// 行为不会有两套。
pub fn scan_tags(data : Bytes) -> TagScan {
  let stream = TagStream::new()
  let tags = stream.feed(data)
  tags.append(stream.finish())
  { tags, warnings: stream.warnings(), encoding: stream.encoding().unwrap(), }
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
    if value > 214748364 || (value == 214748364 && c - 0x30 > 7) {
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
) -> Result[TagValue, String] {
  let kind = code_type(code)
  if kind is Str || kind is Bin {
    return Ok(Str(decode_text(slice_range(data, from, to), encoding)))
  }
  let (start, stop) = trim_ascii_range(data, from, to)
  let text = bytes_to_ascii(data, start, stop)
  match kind {
    F64 => {
      let value = @string.parse_double(text[:]) catch {
        _ => return Err("不是有效浮点数")
      }
      if !finite_number(value) {
        return Err("数值必须有限")
      }
      Ok(F64(value))
    }
    I16 | I32 => {
      let value = @string.parse_int(text[:]) catch {
        _ => return Err("不是有效整数或超出32位范围")
      }
      if kind is I16 && (value < -32768 || value > 65535) {
        return Err("数值超出16位范围")
      }
      Ok(if kind is I16 { I16(value) } else { I32(value) })
    }
    I64 => {
      let value = @string.parse_int64(text[:]) catch {
        _ => return Err("不是有效64位整数")
      }
      Ok(I64(value))
    }
    Bool =>
      if text == "0" {
        Ok(Bool(false))
      } else if text == "1" {
        Ok(Bool(true))
      } else {
        Err("布尔数值必须为0或1")
      }
    Str | Bin => Ok(Str(text))
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
