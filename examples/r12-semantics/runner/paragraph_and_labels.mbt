///|
fn vertical_bigfont_case() -> Unit raise {
  let dir = "examples/r12-semantics/"
  guard @dxfkit.load_r12_shx(
      @fs.read_file_to_bytes(dir + "fixture-bigfont-vertical.shx"),
    )
    is Ok(big) &&
    @dxfkit.load_r12_shx(@fs.read_file_to_bytes(dir + "fixture.shx"))
    is Ok(primary) else {
    fail("expected a dual-mode BIGFONT")
  }
  let packed = fn(ch : Char) { if ch == '中' { Some(0x8140) } else { None } }
  guard big.bigfont_vertical_run(primary, "中A中", packed) is Ok(column) &&
    big.bigfont_run(primary, "中", packed) is Ok(horizontal) else {
    fail("expected separate horizontal and vertical stroke execution")
  }
  assert_true(horizontal.paths.is_empty())
  assert_eq(column.paths.length(), 3)
  assert_true((column.paths[0][0].x - 0.2).abs() < 1.0e-9)
  assert_true((column.paths[0][0].y + 0.8).abs() < 1.0e-9)
  assert_true((column.paths[2][0].y + 4.0).abs() < 1.0e-9)
  assert_true((column.advance - 5.2).abs() < 1.0e-9)
  assert_true(
    big.bigfont_vertical_run(primary, "中", packed, max_work=2) is Err(_),
  )
  guard @dxfkit.load_r12_shx(
      @fs.read_file_to_bytes(dir + "fixture-bigfont.shx"),
    )
    is Ok(horizontal_font) else {
    fail("expected horizontal BIGFONT")
  }
  assert_true(
    horizontal_font.bigfont_vertical_run(primary, "中", packed) is Err(_),
  )
  let doc = load("glyph-layout.dxf")
  guard doc.r12_cell_attributes(record_index(doc, "INSERT"), 1, 1) is Ok(attrs) else {
    fail("expected a placed attribute")
  }
  let attr = {
    ..attrs[0],
    data: { ..attrs[0].data, value: "中A中", horizontal: 0, vertical: 0, },
  }
  let resolver = fn(_style : @dxfkit.R12FontStyle, text : String) {
    match big.bigfont_vertical_run(primary, text, packed) {
      Ok(run) => Some(run)
      Err(_) => None
    }
  }
  guard doc.r12_layout_vertical_attribute(attr, resolver) is Ok(placed) else {
    fail("expected a WCS column")
  }
  assert_eq(placed.paths.length(), 3)
  assert_xyz(placed.paths[0][0], 9.8, 10.0, 1.2)
  println(
    "vertical BIGFONT: conditional strokes, upright fallback and downward cell advances",
  )
}

///|
fn read_paragraph(
  path : String,
  fonts : Array[@dxfkit.R12TrueType],
) -> Array[@dxfkit.R12PositionedFontRun] raise {
  let source = @fs.read_file_to_string(path)
  guard source.length() <= 8 * 1024 * 1024 &&
    @json.parse(source) is Array(items) &&
    items.length() <= 8192 else {
    fail("expected a bounded visual span array")
  }
  let result : Array[@dxfkit.R12PositionedFontRun] = []
  for item in items {
    guard item is { "font": Number(id, ..), "glyphs": Array(glyphs), .. } &&
      id >= 0.0 &&
      id < fonts.length().to_double() &&
      id == id.floor() else {
      fail("paragraph references an unknown font")
    }
    result.push({ font: fonts[id.to_int()], glyphs: positioned_rows(glyphs), })
  }
  result
}

///|
fn paragraph_fonts(paths : Array[String]) -> Array[@dxfkit.R12TrueType] raise {
  guard paths.length() > 0 && paths.length() <= 8 else {
    fail("expected one to eight fallback faces")
  }
  let fonts = []
  for path in paths {
    guard @dxfkit.load_r12_truetype(@fs.read_file_to_bytes(path)) is Ok(face) else {
      fail("expected a TrueType fallback face")
    }
    fonts.push(face)
  }
  fonts
}

///|
fn inspect_paragraph(path : String, paths : Array[String]) -> Unit raise {
  let spans = read_paragraph(path, paragraph_fonts(paths))
  guard @dxfkit.r12_positioned_fonts(spans, max_work=300_000) is Ok(run) else {
    fail("paragraph outline assembly failed")
  }
  println(
    "paragraph spans=\{spans.length()} paths=\{run.paths.length()} advance=\{run.advance}",
  )
}

///|
fn bidi_case() -> Unit raise {
  let dir = "examples/r12-semantics/"
  let fonts = paragraph_fonts([
    dir + "fixture-attachment.ttf",
    dir + "fixture-hebrew.ttf",
  ])
  let spans = read_paragraph(dir + "shaped-paragraph.json", fonts)
  assert_eq(spans.length(), 3)
  assert_eq(spans[0].glyphs.map(g => g.glyph_id), [2, 1, 3])
  assert_eq(spans[1].glyphs.map(g => g.glyph_id), [2])
  assert_eq(spans[2].glyphs.map(g => g.glyph_id), [3, 2, 1])
  guard @dxfkit.r12_positioned_fonts(spans) is Ok(run) else {
    fail("expected visually ordered mixed-font outlines")
  }
  assert_eq(run.paths.length(), 8)
  assert_true((run.advance - 13.0).abs() < 1.0e-9)
  assert_true((run.paths[3][0].x - 5.3).abs() < 1.0e-9)
  assert_true(@dxfkit.r12_positioned_fonts(spans, max_work=3) is Err(_))
  println(
    "bidirectional paragraph: RTL span order, Latin ligature, fallback faces and shared budget",
  )
}

///|
fn tolerance_stacking_case() -> Unit raise {
  let doc = load("advanced-dimension.dxf")
  let dimension = record_index(doc, "DIMENSION")
  guard doc.r12_recompute_dimension(dimension, 1.0e-9) is Ok(update) else {
    fail("expected label parts")
  }
  let measure = fn(text : String, height : Double) {
    text.length().to_double() * height * 0.5
  }
  guard update.layout_text(2.0, measure) is Ok(text) else {
    fail("expected measured stacked tolerances")
  }
  assert_eq(text.fragments[1].text, "+0.20")
  assert_eq(text.fragments[2].text, "-0.10")
  assert_true(text.fragments[1].at.y > 0.0 && text.fragments[2].at.y < 0.0)
  assert_true((text.fragments[1].height - 1.2).abs() < 1.0e-9)
  assert_true((text.size.y - 2.52).abs() < 1.0e-9)
  assert_eq(text.fragments[1].at.x, text.fragments[2].at.x)
  assert_true(text.fragments.any(f => f.text == "+0.020"))
  assert_true(update.layout_text(2.0, (_, _) => -1.0) is Err(_))
  println(
    "stacked tolerances: upper/lower rows, alternate units, scaling and measured bounds",
  )
}

///|
fn drawing_avoid_case() -> Unit raise {
  let doc = load("drawing-label-avoid.dxf")
  let world = doc.drawing.expand_world(0.001)
  assert_true(world.warnings.is_empty())
  guard world.r12_dimension_obstacles(1.0e-9) is Ok(boxes) else {
    fail("expected planar obstacles")
  }
  assert_eq(boxes.length(), 2)
  assert_true(world.r12_dimension_obstacles(1.0e-9, max_boxes=1) is Err(_))
  let labels : Array[@dxfkit.R12DimensionLabelBox] = [
    { center: @dxfkit.Vec2::new(0.0, 0.0), size: @dxfkit.Vec2::new(1.0, 1.0), },
    { center: @dxfkit.Vec2::new(0.0, 2.0), size: @dxfkit.Vec2::new(1.0, 1.0), },
  ]
  guard @dxfkit.r12_avoid_dimension_labels(labels, boxes, 2.0, rings=1)
    is Ok(result) &&
    result[0] is @dxfkit.LabelPlaced(first) &&
    result[1] is @dxfkit.LabelPlaced(second) else {
    fail("expected both labels to find space")
  }
  assert_eq((first.x, first.y), (0.0, -2.0))
  assert_eq((second.x, second.y), (0.0, 2.0))
  guard @dxfkit.r12_avoid_dimension_labels(labels, boxes, 2.0, rings=0)
    is Ok(blocked) &&
    @dxfkit.r12_avoid_dimension_labels(labels, boxes, 2.0, max_checks=1)
    is Ok(limited) else {
    fail("expected explicit failed placements")
  }
  assert_true(blocked[0] is @dxfkit.LabelBlocked(_))
  assert_true(limited[0] is @dxfkit.LabelSearchLimited(_))
  println(
    "drawing overlap: wire obstacles, other labels, blocked and exhausted results",
  )
}
