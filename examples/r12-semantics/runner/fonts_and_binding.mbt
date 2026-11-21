///|
fn font_decoders() -> Unit raise {
  let dir = "examples/r12-semantics/"
  let ttf_bytes = @fs.read_file_to_bytes(dir + "fixture.ttf")
  guard @dxfkit.load_r12_truetype(ttf_bytes) is Ok(ttf) else {
    fail("expected single-face TrueType")
  }
  guard ttf.glyph_run("AB ") is Ok(run) else {
    fail("expected simple and composite glyphs")
  }
  assert_eq(run.paths.length(), 2)
  assert_true((run.advance - 5.3).abs() < 1.0e-9)
  assert_true(
    run.paths[0].any(p => {
      (p.x - 1.0).abs() < 1.0e-9 && (p.y - 1.0).abs() < 1.0e-9
    }),
  )
  assert_true((run.paths[1][0].x - 2.6).abs() < 1.0e-9)
  assert_true(ttf.glyph_run("AB", max_work=3) is Err(_))
  assert_true(@dxfkit.load_r12_truetype(b"bad") is Err(_))
  let shx_bytes = @fs.read_file_to_bytes(dir + "fixture.shx")
  guard @dxfkit.load_r12_shx(shx_bytes) is Ok(shx) else {
    fail("expected legacy shapes font")
  }
  guard shx.glyph_run("AB") is Ok(run) else {
    fail("expected vector and subshape strokes")
  }
  assert_eq(run.paths.length(), 2)
  assert_true((run.advance - 2.4).abs() < 1.0e-9)
  assert_true((run.paths[0][1].x - 0.5).abs() < 1.0e-9)
  assert_true((run.paths[0][1].y - 1.0).abs() < 1.0e-9)
  assert_true((run.paths[1][0].x - 1.2).abs() < 1.0e-9)
  assert_true(shx.glyph_run("C") is Err(_))
  assert_true(shx.glyph_run("AB", max_work=4) is Err(_))
  assert_true(@dxfkit.load_r12_shx(b"AutoCAD-86 shapes 1.0") is Err(_))
  let unicode_bytes = @fs.read_file_to_bytes(dir + "fixture-unicode.shx")
  guard @dxfkit.load_r12_shx(unicode_bytes) is Ok(unicode) &&
    unicode.glyph_run("中") is Ok(run) else {
    fail("expected Unicode SHX and a 16-bit subshape reference")
  }
  assert_eq(run.paths.length(), 1)
  assert_true((run.advance - 1.0).abs() < 1.0e-9)
  let drawing = load("glyph-layout.dxf")
  let idx = record_index(drawing, "INSERT")
  guard drawing.r12_cell_attributes(idx, 1, 1) is Ok(attrs) else {
    fail("expected attribute")
  }
  let attr = { ..attrs[0], data: { ..attrs[0].data, value: "AB", }, }
  let resolver = fn(_style : @dxfkit.R12FontStyle, value : String) {
    match ttf.glyph_run(value) {
      Ok(run) => Some(run)
      Err(_) => None
    }
  }
  guard drawing.r12_layout_attribute(attr, resolver) is Ok(placed) else {
    fail("expected TrueType paths in OCS-derived layout")
  }
  assert_eq(placed.paths.length(), 2)
  assert_true(placed.paths[0].all(p => (p.y - 13.0).abs() < 1.0e-9))
  println(
    "font decoding: real sfnt/SHX bytes, quadratic contour, composite, subshape and rejected truncation/cycle",
  )
}

///|
fn bound_style_cases() -> Unit raise {
  let doc = load("bound-style.dxf")
  let binding : @dxfkit.R12DimensionBinding = {
    dimension_handle: "0d1",
    anchors: [
      {
        slot: @dxfkit.ExtensionStart,
        handle: "A0",
        point: @dxfkit.FeatureStart,
      },
      { slot: @dxfkit.ExtensionEnd, handle: "00a0", point: @dxfkit.FeatureEnd, },
    ],
  }
  guard doc.r12_refresh_bound_dimension(binding, 1.0e-9) is Ok(before) else {
    fail("expected binding")
  }
  assert_eq(before.value, 10.0)
  let records = doc.records.map(r => {
    if r.kind == "LINE" {
      {
        ..r,
        tags: r.tags.map(t => {
          if t.code == 11 {
            { code: 11, value: @dxfkit.F64(14.0), }
          } else {
            t
          }
        }),
      }
    } else {
      r
    }
  })
  let after_doc = { ..doc, records, }
  guard after_doc.r12_refresh_bound_dimension(binding, 1.0e-9) is Ok(update) else {
    fail("expected live handle update")
  }
  assert_eq(update.value, 14.0)
  assert_eq(update.label, Some("14.00"))
  let dim = record_index(after_doc, "DIMENSION")
  guard after_doc.r12_render_dimension(dim, update, label_width=2.0)
    is Ok(styled) else {
    fail("expected styled dimension")
  }
  assert_eq(styled.text_height, 2.5)
  assert_eq(
    (styled.dimension_color, styled.extension_color, styled.text_color),
    (1, 2, 3),
  )
  assert_eq(styled.extension_lines.length(), 1)
  assert_xyz(styled.extension_lines[0].0, 0.0, 0.5, 0.0)
  assert_xyz(styled.extension_lines[0].1, 0.0, 5.5, 0.0)
  assert_eq(styled.dimension_lines.length(), 2)
  assert_xyz(styled.dimension_lines[0].1, 5.5, 4.0, 0.0)
  assert_xyz(styled.dimension_lines[1].0, 8.5, 4.0, 0.0)
  assert_eq(styled.arrows.length(), 2)
  assert_xyz(styled.arrows[0].0, 0.0, 4.0, 0.0)
  let missing = { ..doc, records: doc.records.filter(r => r.kind != "LINE"), }
  assert_true(missing.r12_refresh_bound_dimension(binding, 1.0e-9) is Err(_))
  let duplicate = doc.records.copy()
  duplicate.push(doc.records[record_index(doc, "LINE")])
  assert_true(
    { ..doc, records: duplicate, }.r12_refresh_bound_dimension(binding, 1.0e-9)
    is Err(_),
  )
  println(
    "bound/style: stable handles after edit, suppression, ACI, extension, gap and arrows",
  )
}

///|
fn refit_comparison_case() -> Unit raise {
  let doc = load("mesh-compare.dxf")
  guard doc.r12_semantics().entries[0].entity is @dxfkit.FittedMesh(mesh) else {
    fail("expected sampled mesh")
  }
  guard mesh.compare_refit(0.01) is Ok(comparison) else {
    fail("expected ordered comparison")
  }
  assert_eq(comparison.distances.length(), 9)
  assert_eq(comparison.outside_tolerance, 1)
  assert_eq(comparison.worst_index, 4)
  assert_eq(comparison.max_error, 0.125)
  assert_true(mesh.compare_refit(0.01, max_points=8) is Err(_))
  println(
    "refit comparison: 9 ordered signed-space samples, one analytically known deviation",
  )
}
