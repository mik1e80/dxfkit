///|
fn r12_dimension_label(
  doc : ReadDocument,
  raw : RawRecord,
  dim : R12Dimension,
  value : Double,
  angular : Bool,
  precision : Int,
) -> String? raise R12SemanticError {
  if dim.text is Some(" ") {
    return None
  }
  if dim.text is Some(custom) && custom != "" && !custom.contains("<>") {
    guard custom.length() <= 65536 else {
      raise InvalidSemantic("标注文字超过长度预算")
    }
    return Some(custom)
  }
  let style : RawRecord? = match
    r12_table_link(doc.records, "DIMSTYLE", dim.style) {
    Resolved(i) => Some(doc.records[i])
    Missing if dim.style.to_upper() == "STANDARD" => None
    _ => raise InvalidSemantic("重算标注的 DIMSTYLE 缺失或含歧义")
  }
  let overrides = r12_dimension_overrides(raw)
  let read = fn(code : Int, header : String) raise R12SemanticError {
    for item in overrides {
      if item.group == code {
        return Some(item.value.value)
      }
    }
    if style is Some(r) && r12_single(r, code) is Some(v) {
      return Some(v)
    }
    r12_header_dimension_value(doc.records, header)
  }
  let numeric = if angular {
    value / to_radians(1.0)
  } else {
    let factor = r12_label_real(read(144, "$DIMLFAC"), 1.0)
    let rounding = r12_label_real(read(45, "$DIMRND"), 0.0)
    guard factor != 0.0 && rounding >= 0.0 else {
      raise InvalidSemantic("DIMLFAC 或 DIMRND 无效")
    }
    let paper = r12_integer(raw, 67, Some(0)) == 1
    let adjusted = value *
      (if factor > 0.0 || paper { factor.abs() } else { 1.0 })
    if rounding > 0.0 {
      (adjusted / rounding).round() * rounding
    } else {
      adjusted
    }
  }
  let suppress = if angular {
    0
  } else {
    match read(78, "$DIMZIN") {
      None => 0
      Some(I16(v)) => v
      _ => raise InvalidSemantic("DIMZIN 类型无效")
    }
  }
  let number = if angular {
    r12_decimal_label(numeric, precision, suppress)
  } else {
    r12_dimension_number(numeric, precision, suppress, read)
  }
  let base = if angular {
    number + "°"
  } else {
    match dim.flags & 15 {
      3 => "⌀" + number
      4 => "R" + number
      _ => number
    }
  }
  let display = if angular {
    base
  } else {
    match read(3, "$DIMPOST") {
      None | Some(Str("")) => base
      Some(Str(post)) =>
        if post.contains("<>") {
          r12_replace_dimension_text(post, base)
        } else {
          guard post.length() <= 65536 - base.length() else {
            raise InvalidSemantic("标注文字超过长度预算")
          }
          base + post
        }
      _ => raise InvalidSemantic("DIMPOST 类型无效")
    }
  }
  let display = if !angular && r12_label_int(read(170, "$DIMALT"), 0, 1) == 1 {
    let factor = r12_label_real(read(143, "$DIMALTF"), 25.4)
    guard factor > 0.0 else { raise InvalidSemantic("DIMALTF 必须为正数") }
    let places = r12_label_int(read(171, "$DIMALTD"), 2, 8)
    let alternate = r12_dimension_number(
      numeric,
      places,
      suppress,
      read,
      factor~,
    )
    match read(4, "$DIMAPOST") {
      None | Some(Str("")) => display + " [" + alternate + "]"
      Some(Str(post)) if post.contains("[]") =>
        display + " " + r12_replace_dimension_text(post, alternate, marker="[]")
      Some(Str(post)) => display + " [" + alternate + post + "]"
      _ => raise InvalidSemantic("DIMAPOST 类型无效")
    }
  } else {
    display
  }
  guard display.length() <= 65_536 else {
    raise InvalidSemantic("标注文字超过长度预算")
  }
  match dim.text {
    Some(text) if text != "" => Some(r12_replace_dimension_text(text, display))
    _ => Some(display)
  }
}

///|
fn r12_label_int(
  value : TagValue?,
  fallback : Int,
  maximum : Int,
) -> Int raise R12SemanticError {
  match value {
    None => fallback
    Some(I16(v)) if v >= 0 && v <= maximum => v
    _ => raise InvalidSemantic("标注样式开关或精度无效")
  }
}

///|
fn r12_dimension_number(
  value : Double,
  places : Int,
  suppress : Int,
  read : (Int, String) -> TagValue? raise R12SemanticError,
  factor? : Double = 1.0,
) -> String raise R12SemanticError {
  let base = r12_decimal_label(value * factor, places, suppress)
  let tolerance = r12_label_int(read(71, "$DIMTOL"), 0, 1) == 1
  let limits = r12_label_int(read(72, "$DIMLIM"), 0, 1) == 1
  if !tolerance && !limits {
    return base
  }
  guard !(tolerance && limits) else {
    raise InvalidSemantic("DIMTOL 与 DIMLIM 同时启用")
  }
  let plus = r12_label_real(read(47, "$DIMTP"), 0.0)
  let minus = r12_label_real(read(48, "$DIMTM"), 0.0)
  if limits {
    let high = r12_decimal_label((value + plus) * factor, places, suppress)
    let low = r12_decimal_label((value - minus) * factor, places, suppress)
    high + " / " + low
  } else if plus == minus && plus >= 0.0 {
    base + " ±" + r12_decimal_label(plus * factor, places, suppress)
  } else {
    let high = r12_decimal_label(plus * factor, places, suppress)
    let low = r12_decimal_label(-minus * factor, places, suppress)
    let high_sign = if high.has_prefix("-") { "" } else { "+" }
    let low_sign = if low.has_prefix("-") { "" } else { "+" }
    base + " " + high_sign + high + "/" + low_sign + low
  }
}

///|
fn r12_header_dimension_value(
  records : Array[RawRecord],
  name : String,
) -> TagValue? {
  for r in records {
    if r.section == "HEADER" && r.kind == "SECTION" {
      for i, t in r.tags {
        if t.code == 9 &&
          t.value is Str(key) &&
          key == name &&
          i + 1 < r.tags.length() &&
          r.tags[i + 1].code != 9 {
          return Some(r.tags[i + 1].value)
        }
      }
    }
  }
  None
}

///|
fn r12_label_real(
  value : TagValue?,
  default : Double,
) -> Double raise R12SemanticError {
  match value {
    Some(F64(v)) if finite_number(v) => v
    None => default
    _ => raise InvalidSemantic("标注样式数值不是有限浮点数")
  }
}

///|
fn r12_decimal_label(
  value : Double,
  places : Int,
  suppress : Int,
) -> String raise R12SemanticError {
  let mut multiplier = 1L
  for _ in 0..<places {
    multiplier *= 10L
  }
  let scaled = (value.abs() * multiplier.to_double()).round()
  guard finite_number(scaled) && scaled < 9.0e18 else {
    raise InvalidSemantic("标注值超出十进制定点显示范围")
  }
  let whole = scaled.to_int64()
  let integer = whole / multiplier
  let mut fraction = whole % multiplier
  let mut digits = places
  if (suppress & 8) != 0 {
    while digits > 0 && fraction % 10L == 0L {
      fraction /= 10L
      digits -= 1
    }
  }
  let integer_text = if integer == 0L && digits > 0 && (suppress & 4) != 0 {
    ""
  } else {
    "\{integer}"
  }
  let sign = if value < 0.0 && whole != 0L { "-" } else { "" }
  if digits == 0 {
    return sign + integer_text
  }
  let frac = "\{fraction}"
  let out = StringBuilder()
  out.write_string(sign)
  out.write_string(integer_text)
  out.write_char('.')
  for _ in frac.length()..<digits {
    out.write_char('0')
  }
  out.write_string(frac)
  out.to_string()
}

///|
fn r12_replace_dimension_text(
  template : String,
  value : String,
  marker? : String = "<>",
) -> String raise R12SemanticError {
  let maximum = 65_536
  guard template.length() <= maximum else {
    raise InvalidSemantic("标注文字超过长度预算")
  }
  let mut count = 0
  for i in 0..<(template.length() - 1) {
    if template[i] == marker[0] && template[i + 1] == marker[1] {
      count += 1
    }
  }
  let literal_length = template.length() - count * 2
  guard count == 0 || value.length() <= (maximum - literal_length) / count else {
    raise InvalidSemantic("标注文字替换后超过长度预算")
  }
  template.replace_all(old=marker, new=value)
}
