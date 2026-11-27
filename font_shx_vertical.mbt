///|
/// An upright BIGFONT column. Paths advance down (negative Y) in cap-height
/// units. The reported width is the maximum nominal cell width.
pub(all) struct R12VerticalGlyphRun {
  paths : Array[Array[Vec2]]
  advance : Double
  width : Double
}

///|
/// Compose one vertical BIGFONT column using a caller-supplied code-page map.
/// Characters outside the map use upright glyphs from the primary SHX face.
pub fn R12ShxFont::bigfont_vertical_run(
  self : R12ShxFont,
  primary : R12ShxFont,
  text : String,
  packed_code : (Char) -> Int32?,
  max_work~ : Int32 = 100_000,
) -> Result[R12VerticalGlyphRun, String] {
  Ok(shx_column(self, primary, text, packed_code, max_work)) catch {
    InvalidFont(message) => Err(message)
  }
}

///|
fn shx_column(
  big : R12ShxFont,
  primary : R12ShxFont,
  text : String,
  packed_code : (Char) -> Int32?,
  max_work : Int32,
) -> R12VerticalGlyphRun raise FontError {
  guard big.vertical_mode &&
    big.big_width is Some(width) &&
    primary.big_width is None &&
    max_work > 0 &&
    max_work <= 2_000_000 else {
    raise InvalidFont(
      "竖排 BIGFONT 需要声明的竖排模式和有效工作预算",
    )
  }
  let cell = (big.above + big.below) / big.above
  let paths = []
  let budget = { remaining: max_work, }
  let mut advance = 0.0
  let mut column_width = width / big.above
  for ch in text {
    if packed_code(ch) is Some(id) {
      let state : ShxPen = {
        paths,
        marks: [],
        path: None,
        at: Vec2::new(0.0, -advance),
        scale: 1.0 / big.above,
        drawing: false,
        vertical: true,
        budget,
      }
      shx_execute(big, id, state, 0)
      guard state.marks.is_empty() else {
        raise InvalidFont("BIGFONT 坐标栈未清空")
      }
      let drop = -state.at.y - advance
      advance += if drop > 0.0 { drop } else { cell }
    } else {
      let glyph : Array[Array[Vec2]] = []
      let glyph_width = shx_glyph(primary, ch.to_int(), 0.0, glyph, budget)
      column_width = column_width.max(glyph_width)
      let offset = Vec2::new(-glyph_width * 0.5, -advance - 1.0)
      for path in glyph {
        budget.take(path.length())
        paths.push(path.map(p => p.add(offset)))
      }
      advance += cell.max(1.0 + primary.below / primary.above)
    }
  }
  { paths, advance, width: column_width, }
}
