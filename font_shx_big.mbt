///|
fn shx_bigfont(file : FontBytes) -> R12ShxFont raise FontError {
  let header = "AutoCAD-86 bigfont 1.0".length()
  guard file.ascii_at(header, "\r\n\u001a") else {
    raise InvalidFont("BIGFONT 头部缺少终止符")
  }
  let count = file.le16(header + 5)
  let changes = file.le16(header + 7)
  guard count > 0 && changes <= 256 else {
    raise InvalidFont("BIGFONT 索引或换码表大小无效")
  }
  let index = header + 9 + changes * 4
  let body = index + count * 8
  let _ = file.region(0, body)
  let symbols : Map[Int, FontBytes] = Map([])
  for i in 0..<count {
    let offset = index + i * 8
    let code = file.le16(offset)
    let size = file.le16(offset + 2)
    let high = file.le16(offset + 6)
    guard high < 512 else { raise InvalidFont("BIGFONT 字形偏移超限") }
    let at = (high << 16) + file.le16(offset + 4)
    if code == 0 && size == 0 && at == 0 {
      continue
    }
    guard size > 0 && at >= body && !symbols.contains(code) else {
      raise InvalidFont("BIGFONT 字形索引无效或重复")
    }
    let record = file.region(at, size)
    let has_prefix = code > 255 && size > 2 && record.u16(0) == code
    let start = if has_prefix && record.u8(2) == 0 {
      3
    } else if has_prefix {
      2
    } else {
      0
    }
    symbols[code] = record.region(start, size - start)
  }
  guard symbols.get(0) is Some(info) else {
    raise InvalidFont("BIGFONT 缺少字高记录")
  }
  let start = shx_after_name(info)
  let remaining = info.size - start
  let above = info.u8(start).to_double()
  guard above > 0.0 &&
    (remaining >= 3 && remaining <= 5) &&
    info.u8(info.size - 1) == 0 else {
    raise InvalidFont("BIGFONT 度量记录无效")
  }
  let mode = info.u8(start + (if remaining == 3 { 1 } else { 2 }))
  guard mode <= 2 else { raise InvalidFont("BIGFONT 书写模式未知") }
  let below = if remaining == 3 { 0.0 } else { info.u8(start + 1).to_double() }
  let width = if remaining == 5 {
    let w = info.u8(start + 3).to_double()
    guard below == 0.0 && w > 0.0 else {
      raise InvalidFont("扩展 BIGFONT 字宽或基线无效")
    }
    w
  } else {
    above + below
  }
  {
    symbols,
    above,
    below,
    unicode: false,
    big_width: Some(width),
    big_extended: remaining == 5,
    vertical_mode: mode != 0,
  }
}

///|
fn shx_glyph(
  font : R12ShxFont,
  id : Int,
  advance : Double,
  paths : Array[Array[Vec2]],
  budget : FontBudget,
) -> Double raise FontError {
  let state : ShxPen = {
    paths,
    marks: [],
    path: None,
    at: Vec2::new(advance, 0.0),
    scale: 1.0 / font.above,
    drawing: font.big_width is None,
    vertical: false,
    budget,
  }
  shx_execute(font, id, state, 0)
  guard state.at.x >= advance && state.marks.is_empty() else {
    raise InvalidFont("SHX 前进宽度或坐标栈无效")
  }
  match font.big_width {
    Some(width) if state.at.x == advance => advance + width / font.above
    _ => state.at.x
  }
}

///|
/// Use the STYLE's primary font and its BIGFONT together. The caller maps
/// Unicode characters to this BIGFONT's packed code-page values.
pub fn R12ShxFont::bigfont_run(
  self : R12ShxFont,
  primary : R12ShxFont,
  text : String,
  packed_code : (Char) -> Int?,
  max_work? : Int = 100_000,
) -> Result[R12GlyphRun, String] {
  Ok(shx_mixed(self, primary, text, packed_code, max_work)) catch {
    InvalidFont(msg) => Err(msg)
  }
}

///|
fn shx_mixed(
  big : R12ShxFont,
  primary : R12ShxFont,
  text : String,
  packed_code : (Char) -> Int?,
  max_work : Int,
) -> R12GlyphRun raise FontError {
  guard big.big_width is Some(_) &&
    primary.big_width is None &&
    max_work > 0 &&
    max_work <= 2_000_000 else {
    raise InvalidFont("BIGFONT 搭配的字体类型或工作预算无效")
  }
  let paths = []
  let budget = { remaining: max_work, }
  let mut advance = 0.0
  for ch in text {
    advance = match packed_code(ch) {
      Some(id) => shx_glyph(big, id, advance, paths, budget)
      None => shx_glyph(primary, ch.to_int(), advance, paths, budget)
    }
  }
  {
    paths,
    advance,
    ascent: 1.0,
    descent: (big.below / big.above).max(primary.below / primary.above),
  }
}

///|
fn shx_primitive(
  font : R12ShxFont,
  id : Int,
  parent : ShxPen,
  origin : Vec2,
  sx : Double,
  sy : Double,
  depth : Int,
) -> Unit raise FontError {
  guard sx > 0.0 && sy > 0.0 else {
    raise InvalidFont("BIGFONT 子形尺寸必须为正")
  }
  let child : ShxPen = {
    paths: [],
    marks: [],
    path: None,
    at: Vec2::new(0.0, 0.0),
    scale: 1.0,
    drawing: true,
    vertical: parent.vertical,
    budget: parent.budget,
  }
  shx_execute(font, id, child, depth + 1)
  guard child.marks.is_empty() else {
    raise InvalidFont("BIGFONT 子形坐标栈未清空")
  }
  for path in child.paths {
    parent.budget.take(path.length())
    let placed = []
    for p in path {
      let point = origin.add(Vec2::new(p.x * sx, p.y * sy))
      guard [point.x, point.y].all(v => finite_number(v) && v.abs() < 1.0e12) else {
        raise InvalidFont("BIGFONT 子形坐标超限")
      }
      placed.push(point)
    }
    parent.paths.push(placed)
  }
  parent.path = None
}
