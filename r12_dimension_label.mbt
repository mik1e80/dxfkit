///|
fn r12_dimension_label_parts(
  doc : ReadDocument,
  raw : RawRecord,
  dim : R12Dimension,
  value : Double,
  angular : Bool,
  precision : Int32,
) -> Array[R12DimensionLabelPart] raise R12SemanticError {
  if dim.text is Some(" ") {
    return []
  }
  if dim.text is Some(custom) && custom != "" && !custom.contains("<>") {
    guard custom.length() <= 65536 else {
      raise InvalidSemantic("标注文字超过长度预算")
    }
    return [LabelText(custom)]
  }
  let style : RawRecord? = match
    r12_table_link(doc.records, "DIMSTYLE", dim.style) {
    Resolved(i) => Some(doc.records[i])
    Missing if dim.style.to_upper() == "STANDARD" => None
    _ => raise InvalidSemantic("重算标注的 DIMSTYLE 缺失或含歧义")
  }
  let overrides = r12_dimension_overrides(raw)
  let read = fn(code : Int32, header : String) raise R12SemanticError {
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
  let base : Array[R12DimensionLabelPart] = if angular {
    [LabelText(r12_decimal_label(numeric, precision, suppress) + "°")]
  } else {
    let prefix = match dim.flags & 15 {
      3 => "⌀"
      4 => "R"
      _ => ""
    }
    r12_dimension_number(numeric, precision, suppress, read, prefix~)
  }
  let display = if angular {
    base
  } else {
    match read(3, "$DIMPOST") {
      None | Some(Str("")) => base
      Some(Str(post)) =>
        if post.contains("<>") {
          r12_replace_dimension_parts(post, base, "<>")
        } else {
          r12_append_dimension_parts(base, [LabelText(post)])
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
      None | Some(Str("")) =>
        r12_append_dimension_parts(
          display,
          [LabelText(" ["), ..alternate, LabelText("]")],
        )
      Some(Str(post)) if post.contains("[]") =>
        r12_append_dimension_parts(
          display,
          [LabelText(" "), ..r12_replace_dimension_parts(post, alternate, "[]")],
        )
      Some(Str(post)) =>
        r12_append_dimension_parts(
          display,
          [LabelText(" ["), ..alternate, LabelText(post), LabelText("]")],
        )
      _ => raise InvalidSemantic("DIMAPOST 类型无效")
    }
  } else {
    display
  }
  match dim.text {
    Some(text) if text != "" => r12_replace_dimension_parts(text, display, "<>")
    _ => display
  }
}

///|
fn r12_label_int(
  value : TagValue?,
  fallback : Int32,
  maximum : Int32,
) -> Int32 raise R12SemanticError {
  match value {
    None => fallback
    Some(I16(v)) if v >= 0 && v <= maximum => v
    _ => raise InvalidSemantic("标注样式开关或精度无效")
  }
}

///|
fn r12_dimension_number(
  value : Double,
  places : Int32,
  suppress : Int32,
  read : (Int32, String) -> TagValue? raise R12SemanticError,
  factor~ : Double = 1.0,
  prefix~ : String = "",
) -> Array[R12DimensionLabelPart] raise R12SemanticError {
  let base = prefix + r12_decimal_label(value * factor, places, suppress)
  let tolerance = r12_label_int(read(71, "$DIMTOL"), 0, 1) == 1
  let limits = r12_label_int(read(72, "$DIMLIM"), 0, 1) == 1
  if !tolerance && !limits {
    return [LabelText(base)]
  }
  guard !(tolerance && limits) else {
    raise InvalidSemantic("DIMTOL 与 DIMLIM 同时启用")
  }
  let plus = r12_label_real(read(47, "$DIMTP"), 0.0)
  let minus = r12_label_real(read(48, "$DIMTM"), 0.0)
  let height_factor = r12_label_real(read(146, "$DIMTFAC"), 1.0)
  guard height_factor > 0.0 else {
    raise InvalidSemantic("DIMTFAC 必须为正数")
  }
  if limits {
    let high = r12_decimal_label((value + plus) * factor, places, suppress)
    let low = r12_decimal_label((value - minus) * factor, places, suppress)
    [
      ToleranceStack(
        upper=prefix + high,
        lower=Some(prefix + low),
        height_factor~,
        limits=true,
      ),
    ]
  } else if plus == minus && plus >= 0.0 {
    let upper = "±" + r12_decimal_label(plus * factor, places, suppress)
    [
      LabelText(base + " "),
      ToleranceStack(upper~, lower=None, height_factor~, limits=false),
    ]
  } else {
    let high = r12_decimal_label(plus * factor, places, suppress)
    let low = r12_decimal_label(-minus * factor, places, suppress)
    let high_sign = if high.has_prefix("-") { "" } else { "+" }
    let low_sign = if low.has_prefix("-") { "" } else { "+" }
    [
      LabelText(base + " "),
      ToleranceStack(
        upper=high_sign + high,
        lower=Some(low_sign + low),
        height_factor~,
        limits=false,
      ),
    ]
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
  places : Int32,
  suppress : Int32,
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
fn r12_replace_dimension_parts(
  template : String,
  parts : Array[R12DimensionLabelPart],
  marker : StringView,
) -> Array[R12DimensionLabelPart] raise R12SemanticError {
  guard template.length() <= 65536 else {
    raise InvalidSemantic("标注文字超过长度预算")
  }
  let output = []
  let payload = r12_parts_length(parts)
  let mut size = 0
  let mut first = true
  for chunk in template.split(marker) {
    size += chunk.length()
    if !first {
      size += payload
      guard size <= 65536 else {
        raise InvalidSemantic("标注文字超过长度预算")
      }
      output.append(parts)
    }
    first = false
    if !chunk.is_empty() {
      output.push(LabelText(chunk.to_owned()))
    }
  }
  output
}

///|
fn r12_append_dimension_parts(
  left : Array[R12DimensionLabelPart],
  right : Array[R12DimensionLabelPart],
) -> Array[R12DimensionLabelPart] raise R12SemanticError {
  guard r12_parts_length(left) <= 65536 - r12_parts_length(right) else {
    raise InvalidSemantic("标注文字超过长度预算")
  }
  let result = left.copy()
  result.append(right)
  result
}

///|
fn r12_parts_length(parts : Array[R12DimensionLabelPart]) -> Int32 {
  let mut size = 0
  for part in parts {
    size += match part {
      LabelText(text) => text.length()
      ToleranceStack(upper~, lower~, limits~, ..) =>
        upper.length() +
        (match lower {
          Some(text) => text.length() + (if limits { 3 } else { 1 })
          None => 0
        })
    }
  }
  size
}

///|
fn r12_flat_dimension_label(parts : Array[R12DimensionLabelPart]) -> String? {
  if parts.is_empty() {
    return None
  }
  let buf = StringBuilder()
  for part in parts {
    match part {
      LabelText(text) => buf.write_string(text)
      ToleranceStack(upper~, lower~, limits~, ..) => {
        buf.write_string(upper)
        if lower is Some(text) {
          buf.write_string(if limits { " / " } else { "/" })
          buf.write_string(text)
        }
      }
    }
  }
  Some(buf.to_string())
}
