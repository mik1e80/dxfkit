///|
fn styled_dimensions() -> Unit raise {
  let doc = load("advanced-dimension.dxf")
  let dimension = record_index(doc, "DIMENSION")
  let anchors : Array[@dxfkit.R12DimensionAnchor] = [
    { slot: @dxfkit.ExtensionStart, handle: "A0", point: @dxfkit.FeatureStart, },
    { slot: @dxfkit.ExtensionEnd, handle: "A0", point: @dxfkit.FeatureEnd, },
  ]
  let binding : @dxfkit.R12DimensionBinding = {
    dimension_handle: "D1",
    anchors,
  }
  guard doc.r12_refresh_bound_dimension(binding, 1.0e-9) is Ok(update) else {
    fail("expected tolerances and alternate units")
  }
  assert_eq(update.label, Some("10.00 +0.20/-0.10 [1.000 +0.020/-0.010 cm]"))
  guard doc.r12_render_dimension(dimension, update, label_width=2.0) is Ok(fit) &&
    fit.custom_arrows[0].flat is @dxfkit.Outline3(points=first, ..) &&
    fit.custom_arrows[1].flat is @dxfkit.Outline3(points=second, ..) else {
    fail("expected distinct arrows from scaled blocks")
  }
  assert_eq(fit.arrows.length(), 0)
  guard fit.r12_dimension_obstacles() is Ok(mark_boxes) else {
    fail("expected dimension obstacle boxes")
  }
  assert_eq(mark_boxes.length(), 5)
  assert_xyz(first[0], 0.0, 4.0, 0.0)
  assert_xyz(first[1], 1.0, 4.0, 0.0)
  assert_xyz(second[1], 8.0, 5.0, 0.0)
  guard doc.r12_render_dimension(dimension, update, label_width=8.0)
    is Ok(crowded) &&
    crowded.custom_arrows[0].flat is @dxfkit.Outline3(points=outside, ..) &&
    doc.r12_render_dimension(dimension, update, label_width=12.0) is Ok(wide) else {
    fail("expected deterministic fit")
  }
  assert_xyz(outside[1], -1.0, 4.0, 0.0)
  assert_eq(crowded.dimension_lines.length(), 4)
  assert_xyz(wide.text_at, 16.5, 4.0, 0.0)
  assert_eq(wide.dimension_lines.length(), 1)
  let records = doc.records.copy()
  let broken = {
    ..doc,
    records: records.map(r => {
      if r.kind == "DIMSTYLE" {
        {
          ..r,
          tags: r.tags.map(t => {
            if t.code == 6 {
              { code: 6, value: @dxfkit.Str("MISSING"), }
            } else {
              t
            }
          }),
        }
      } else {
        r
      }
    }),
  }
  assert_true(broken.r12_render_dimension(dimension, update) is Err(_))
  let limits = {
    ..doc,
    records: records.map(r => {
      if r.kind == "DIMSTYLE" {
        {
          ..r,
          tags: r.tags.map(t => {
            if t.code == 71 {
              { code: 72, value: @dxfkit.I16(1), }
            } else {
              t
            }
          }),
        }
      } else {
        r
      }
    }),
  }
  guard limits.r12_refresh_bound_dimension(binding, 1.0e-9) is Ok(limit) else {
    fail("expected absolute tolerance limits")
  }
  assert_eq(limit.label, Some("10.20 / 9.90 [1.020 / 0.990 cm]"))
  println(
    "dimension styles: alternate units, deviations, limits, independent arrow blocks and short-span fit",
  )
}

///|
fn advanced_fonts() -> Unit raise {
  let dir = "examples/r12-semantics/"
  let bytes = @fs.read_file_to_bytes(dir + "fixture-attachment.ttf")
  guard @dxfkit.load_r12_truetype(bytes) is Ok(ttf) &&
    ttf.glyph_run("B") is Ok(run) else {
    fail("expected a point-attached component")
  }
  assert_eq(run.paths.length(), 2)
  assert_eq(run.paths[0][0].x, 0.0)
  assert_eq(run.paths[1][0].x, 2.0)
  assert_true(
    run.paths[1].any(p => {
      (p.x - 2.5).abs() < 1.0e-9 && (p.y - 0.5).abs() < 1.0e-9
    }),
  )
  let placements = positioned_file(dir + "shaped-attachment.json")
  assert_eq(placements.length(), 1)
  guard ttf.positioned_run(placements) is Ok(shaped) else {
    fail("expected upstream shaped outlines")
  }
  assert_eq(shaped.paths.length(), 2)
  assert_eq(shaped.advance, 2.4)
  let rtl = [
    { ..placements[0], x_advance: -1200.0, x_offset: -100.0, y_offset: 150.0, },
  ]
  guard ttf.positioned_run(rtl) is Ok(rebased) else {
    fail("expected signed placements")
  }
  assert_eq(rebased.advance, 2.4)
  assert_true((rebased.paths[0][0].x - 2.2).abs() < 1.0e-9)
  assert_true((rebased.paths[0][0].y - 0.3).abs() < 1.0e-9)
  assert_true(ttf.positioned_run([{ ..rtl[0], glyph_id: 999, }]) is Err(_))
  let malformed = [ for b in bytes => b ]
  // Corrupt the second component's parent index without changing table bounds.
  for i in 0..<(malformed.length() - 7) {
    if malformed[i:i + 8]
      is [
        b'\x00',
        b'\x08',
        b'\x00',
        b'\x01',
        b'\x02',
        b'\x00',
        b'\x20',
        b'\x00',
      ] {
      malformed[i + 4] = b'\xff'
    }
  }
  guard @dxfkit.load_r12_truetype(Bytes::from_array(malformed)) is Ok(invalid) else {
    fail("expected valid table layout before outline decode")
  }
  assert_true(invalid.glyph_run("B") is Err(_))
  let bytes = @fs.read_file_to_bytes(dir + "fixture-bigfont.shx")
  guard @dxfkit.load_r12_shx(bytes) is Ok(big) &&
    @dxfkit.load_r12_shx(@fs.read_file_to_bytes(dir + "fixture.shx"))
    is Ok(primary) else {
    fail("expected BIGFONT and regular SHX")
  }
  assert_true(
    @dxfkit.load_r12_shx(
      Bytes::from_array([ for i in 0..<(bytes.length() - 1) => bytes[i] ]),
    )
    is Err(_),
  )
  let mapping = fn(ch : Char) { if ch == '中' { Some(0x8140) } else { None } }
  guard big.bigfont_run(primary, "A中", mapping) is Ok(mixed) else {
    fail("expected mixed single and double byte outlines")
  }
  assert_eq(mixed.paths.length(), 2)
  assert_true((mixed.advance - 3.2).abs() < 1.0e-9)
  assert_true((mixed.paths[1][0].x - 1.4).abs() < 1.0e-9)
  assert_true((mixed.paths[1][0].y - 0.3).abs() < 1.0e-9)
  assert_true((mixed.paths[1][1].x - 2.4).abs() < 1.0e-9)
  assert_true((mixed.paths[1][1].y - 1.1).abs() < 1.0e-9)
  assert_true(big.bigfont_run(primary, "A中", mapping, max_work=2) is Err(_))
  assert_true(big.glyph_run("未", map=_ => 0x81ff) is Err(_))
  println(
    "font shaping: quadratic point attachment, HarfBuzz ligature positions and mixed extended BIGFONT primitives",
  )
}

///|
fn positioned_file(path : String) -> Array[@dxfkit.R12PositionedGlyph] raise {
  let source = @fs.read_file_to_string(path)
  guard source.length() <= 8 * 1024 * 1024 else {
    fail("shape JSON exceeds 8 MiB")
  }
  let parsed = @json.parse(source)
  guard parsed is Array(rows) && rows.length() <= 65536 else {
    fail("expected a bounded JSON array of shaped glyphs")
  }
  positioned_rows(rows)
}

///|
fn positioned_rows(
  rows : Array[Json],
) -> Array[@dxfkit.R12PositionedGlyph] raise {
  guard rows.length() <= 65536 else { fail("too many positioned glyphs") }
  let glyphs : Array[@dxfkit.R12PositionedGlyph] = []
  for row in rows {
    guard row
      is {
        "glyph_id": Number(id, ..),
        "x_advance": Number(xa, ..),
        "y_advance": Number(ya, ..),
        "x_offset": Number(x, ..),
        "y_offset": Number(y, ..),
        ..
      } &&
      id >= 1.0 &&
      id <= 65535.0 &&
      id == id.floor() else {
      fail("invalid positioned glyph")
    }
    glyphs.push({
      glyph_id: id.to_int(),
      x_advance: xa,
      y_advance: ya,
      x_offset: x,
      y_offset: y,
    })
  }
  glyphs
}

///|
fn inspect_shaping(font_path : String, placements : String) -> Unit raise {
  guard @dxfkit.load_r12_truetype(@fs.read_file_to_bytes(font_path)) is Ok(ttf) else {
    fail("expected TrueType bytes")
  }
  let glyphs = positioned_file(placements)
  guard ttf.positioned_run(glyphs, max_work=300_000) is Ok(run) else {
    fail("expected positioned contours")
  }
  println(
    "glyphs=\{glyphs.length()} paths=\{run.paths.length()} normalized_advance=\{run.advance}",
  )
}
