///|
fn ttf_outline_point(
  contours : Array[Array[TtfPoint]],
  index : Int,
  budget : FontBudget,
) -> Vec2 raise FontError {
  let mut point = index
  for contour in contours {
    budget.take(1)
    if point < contour.length() {
      return contour[point].p
    }
    point -= contour.length()
  }
  raise InvalidFont("复合字形的附着点超出真实轮廓范围")
}

///|
/// A glyph placement from an OpenType shaper, in font design units. The
/// array order is the shaper's visual order; glyphs are not remapped via cmap.
pub(all) struct R12PositionedGlyph {
  glyph_id : Int
  x_advance : Double
  y_advance : Double
  x_offset : Double
  y_offset : Double
}

///|
/// Convert a positioned run (for example HarfBuzz output scaled to units
/// per em) into normalized outlines usable by the R12 layout API.
pub fn R12TrueType::positioned_run(
  self : R12TrueType,
  glyphs : Array[R12PositionedGlyph],
  tol? : Double = 0.001,
  max_work? : Int = 100_000,
) -> Result[R12GlyphRun, String] {
  r12_positioned_fonts([{ font: self, glyphs, }], tol~, max_work~)
}

///|
/// One shaped span in visual order, paired with the exact font face used to shape it.
pub(all) struct R12PositionedFontRun {
  font : R12TrueType
  glyphs : Array[R12PositionedGlyph]
}

///|
/// Join fallback spans in visual order under one outline budget. Each face
/// uses its own cap-height normalization and shares the horizontal baseline.
pub fn r12_positioned_fonts(
  runs : Array[R12PositionedFontRun],
  tol? : Double = 0.001,
  max_work? : Int = 100_000,
) -> Result[R12GlyphRun, String] {
  Ok(ttf_positioned_spans(runs, tol, max_work)) catch {
    InvalidFont(msg) => Err(msg)
  }
}

///|
fn ttf_positioned_spans(
  runs : Array[R12PositionedFontRun],
  tol : Double,
  max_work : Int,
) -> R12GlyphRun raise FontError {
  guard positive_tolerance(tol) &&
    max_work > 0 &&
    max_work <= 2_000_000 &&
    runs.length() <= max_work else {
    raise InvalidFont("整形结果超过工作预算或容差无效")
  }
  let budget = { remaining: max_work, }
  let paths : Array[Array[Vec2]] = []
  let mut advance = 0.0
  let mut ascent = 0.0
  let mut descent = 0.0
  for run in runs {
    budget.take(1)
    let shaped = ttf_positioned(run.font, run.glyphs, tol, budget)
    let offset = Vec2::new(advance, 0.0)
    for path in shaped.paths {
      if advance != 0.0 {
        budget.take(path.length())
        paths.push(path.map(p => p.add(offset)))
      } else {
        paths.push(path)
      }
    }
    advance += shaped.advance
    ascent = ascent.max(shaped.ascent)
    descent = descent.max(shaped.descent)
  }
  { paths, advance, ascent, descent, }
}

///|
fn ttf_positioned(
  font : R12TrueType,
  glyphs : Array[R12PositionedGlyph],
  tol : Double,
  budget : FontBudget,
) -> R12GlyphRun raise FontError {
  guard glyphs.length() <= budget.remaining else {
    raise InvalidFont("整形结果超过工作预算")
  }
  let paths : Array[Array[Vec2]] = []
  let mut pen = Vec2::new(0.0, 0.0)
  for g in glyphs {
    let origin = pen.add(Vec2::new(g.x_offset, g.y_offset))
    let end = pen.add(Vec2::new(g.x_advance, g.y_advance))
    guard [origin.x, origin.y, end.x, end.y].all(v => {
      finite_number(v) && v.abs() <= 1.0e12
    }) else {
      raise InvalidFont("整形结果的字形位置超出有限范围")
    }
    for contour in font.contours(g.glyph_id, 0, budget) {
      let points = contour.map(p => {
        on: p.on,
        p: p.p.add(origin).scale(1.0 / font.cap),
      })
      paths.push(ttf_flatten(points, tol, budget))
    }
    pen = end
  }
  let paths = if pen.x >= 0.0 {
    paths
  } else {
    // Rebase right-to-left runs into the positive nominal layout interval.
    let offset = Vec2::new(-pen.x / font.cap, 0.0)
    paths.map(path => path.map(p => p.add(offset)))
  }
  {
    paths,
    advance: pen.x.abs() / font.cap,
    ascent: font.ascent,
    descent: font.descent,
  }
}
