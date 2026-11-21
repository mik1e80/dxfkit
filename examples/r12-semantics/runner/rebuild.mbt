///|
fn rebuild_mesh_cases() -> Unit raise {
  let doc = load("refit-frames.dxf")
  let report = doc.r12_semantics()
  assert_true(report.complete && report.findings.is_empty())
  assert_eq(report.entries.length(), 5)
  let controls = [(1.0, 1.0, 0.75), (1.5, 1.5, 0.421875), (0.5, 0.5, 1.0)]
  for i, expected in controls {
    guard report.entries[i].entity is @dxfkit.FittedMesh(frame) else {
      fail("expected a control-only mesh")
    }
    assert_true(frame.samples.is_empty())
    guard frame.refit(3, 3) is Ok(refitted) else {
      fail("expected fitted surface")
    }
    assert_eq(refitted.samples.length(), 9)
    assert_xyz(refitted.samples[4], expected.0, expected.1, expected.2)
    assert_xyz(refitted.samples[0], 0.0, 0.0, 0.0)
    assert_true(frame.samples.is_empty())
    assert_true(refitted.quad(1, 1) is Some(_))
    assert_true(frame.refit(3, 3, max_points=8) is Err(_))
  }
  guard report.entries[3].entity is @dxfkit.FittedMesh(frame) &&
    frame.refit(4, 3) is Ok(periodic) &&
    periodic.quad(3, 0) is Some((a, b, _, _)) else {
    fail("expected periodic quadratic B-spline seam")
  }
  assert_xyz(a, 1.5, 0.0, 0.0)
  assert_xyz(b, 0.5, 0.0, 0.0)
  guard report.entries[4].entity is @dxfkit.FittedMesh(closed) &&
    closed.refit(4, 2) is Ok(bezier) &&
    bezier.quad(3, 0) is Some((c, d, _, _)) else {
    fail("expected periodic cubic Bézier seam")
  }
  assert_xyz(c, 3.75, 0.0, 0.0)
  assert_xyz(d, 0.0, 0.0, 0.0)
  println(
    "surface refit: analytic quadratic/cubic/Bézier values, periodic seams, point budget",
  )
}

///|
fn test_glyph_run(
  style : @dxfkit.R12FontStyle,
  value : String,
) -> @dxfkit.R12GlyphRun? {
  if style.name != "DEMO" || style.font_file != "Demo.shx" || value != "K-9" {
    return None
  }
  Some({
    advance: 2.0,
    ascent: 1.0,
    descent: 0.2,
    paths: [
      [@dxfkit.Vec2::new(0.0, 0.0), @dxfkit.Vec2::new(0.0, 1.0)],
      [
        @dxfkit.Vec2::new(0.65, 1.0),
        @dxfkit.Vec2::new(0.0, 0.45),
        @dxfkit.Vec2::new(0.65, 0.0),
      ],
      [@dxfkit.Vec2::new(0.8, 0.5), @dxfkit.Vec2::new(1.1, 0.5)],
      [@dxfkit.Vec2::new(2.0, 0.0), @dxfkit.Vec2::new(2.0, 1.0)],
      [
        @dxfkit.Vec2::new(2.0, 1.0),
        @dxfkit.Vec2::new(1.4, 1.0),
        @dxfkit.Vec2::new(1.4, 0.5),
        @dxfkit.Vec2::new(2.0, 0.5),
        @dxfkit.Vec2::new(2.0, 1.0),
      ],
    ],
  })
}

///|
fn rebuild_glyph_case() -> Unit raise {
  let doc = load("glyph-layout.dxf")
  let insert = record_index(doc, "INSERT")
  guard doc.r12_cell_attributes(insert, 1, 1) is Ok(attrs) else {
    fail("expected placed attribute")
  }
  let attr = attrs[0]
  guard doc.r12_layout_attribute(attr, test_glyph_run) is Ok(layout) else {
    fail("expected shaped paths")
  }
  assert_true(layout.visible)
  assert_eq(layout.paths.length(), 5)
  assert_xyz(layout.paths[0][0], 8.0, 13.0, 5.0)
  assert_xyz(layout.paths[3][1], 6.0, 13.0, 6.0)
  assert_eq(layout.paths[2].length(), 2)
  assert_xyz(layout.paths[4][0], 6.0, 13.0, 6.0)
  assert_xyz(layout.paths[4][4], 6.0, 13.0, 6.0)
  let fit = {
    ..attr,
    data: { ..attr.data, horizontal: 5, },
    alignment: Some(@dxfkit.Vec3::new(10.0, 10.0, 6.0)),
  }
  guard doc.r12_layout_attribute(fit, test_glyph_run) is Ok(layout) else {
    fail("expected fitted text")
  }
  assert_xyz(layout.paths[3][0], 10.0, 10.0, 6.0)
  assert_xyz(layout.paths[3][1], 11.0, 10.0, 6.0)
  let aligned = { ..fit, data: { ..fit.data, horizontal: 3, }, }
  guard doc.r12_layout_attribute(aligned, test_glyph_run) is Ok(layout) else {
    fail("expected aligned text")
  }
  assert_xyz(layout.paths[3][1], 12.0, 10.0, 6.0)
  let top_right = {
    ..attr,
    data: {
      ..attr.data,
      horizontal: 2,
      vertical: 3,
      width_scale: 2.0,
      oblique: 45.0,
      generation_flags: 6,
    },
  }
  guard doc.r12_layout_attribute(top_right, test_glyph_run) is Ok(layout) else {
    fail("expected mirrored and sheared text")
  }
  assert_xyz(layout.paths[0][0], 2.0, 13.0, 6.0)
  assert_xyz(layout.paths[3][1], 7.0, 13.0, 5.0)
  let invisible = { ..attr, data: { ..attr.data, flags: 1, }, }
  guard doc.r12_layout_attribute(invisible, (_, _) => None) is Ok(hidden) else {
    fail("invisible glyphs must not need a font")
  }
  assert_false(hidden.visible)
  assert_true(hidden.paths.is_empty())
  assert_true(doc.r12_layout_attribute(attr, (_, _) => None) is Err(_))
  assert_true(
    doc.r12_layout_attribute(attr, test_glyph_run, max_points=3) is Err(_),
  )
  println(
    "glyph layout: STYLE, kerning-ready path data, center/top, fit/aligned, mirror, shear, hidden and budget",
  )
}

///|
fn rebuild_dimension_cases() -> Unit raise {
  let doc = load("recompute-dimensions.dxf")
  let cases = doc.r12_semantics()
  assert_eq(cases.entries.length(), 7)
  let values = [3.0, 5.0, 1.5707963267948966, 10.0, 5.0, 4.71238898038469, -1.0]
  let labels = [
    "[6 mm]", "5 mm", "90.00°", "⌀10 mm", "R5 mm", "270.00°", "-1 mm",
  ]
  for i, entry in cases.entries {
    guard doc.r12_recompute_dimension(entry.record_index, 1.0e-9)
      is Ok(measured) else {
      fail("expected recomputed type \{i}")
    }
    assert_true((measured.value - values[i]).abs() < 1.0e-9)
    assert_eq(measured.label, Some(labels[i]))
    if i == 0 {
      assert_xyz(measured.lines[2].0, 0.0, 2.0, 0.0)
      assert_xyz(measured.lines[2].1, 3.0, 2.0, 0.0)
      assert_xyz(measured.text_at, 1.5, 2.0, 0.0)
    }
    if i == 5 {
      guard measured.arc is Some(arc) else { fail("expected a reflex arc") }
      assert_xyz(arc.center, 0.0, 0.0, 0.0)
      assert_xyz(arc.start, 0.0, 4.242640687119285, 0.0)
    }
    if i == 6 {
      assert_xyz(measured.text_at, 20.0, 21.0, 0.0)
    }
  }
  let first = cases.entries[0]
  guard first.entity is @dxfkit.Dimension(dim) else {
    fail("expected editable dimension")
  }
  let edited = { ..dim, extension_end: Some(@dxfkit.Vec3::new(8.0, 4.0, 0.0)), }
  guard doc.r12_recompute_dimension(
      first.record_index,
      1.0e-9,
      definition=edited,
    )
    is Ok(update) else {
    fail("expected a changed measurement and label")
  }
  assert_eq(update.value, 8.0)
  assert_eq(update.label, Some("[16 mm]"))
  let silent = { ..edited, text: Some(" "), }
  guard doc.r12_recompute_dimension(
      first.record_index,
      1.0e-9,
      definition=silent,
    )
    is Ok(update) else {
    fail("expected suppressed label")
  }
  assert_true(update.label is None)
  let template = StringBuilder()
  for _ in 0..<30_000 {
    template.write_string("<>")
  }
  let large = { ..edited, text: Some(template.to_string()), }
  assert_true(
    doc.r12_recompute_dimension(first.record_index, 1.0e-9, definition=large)
    is Err(_),
  )
  let off_plane = {
    ..dim,
    extension_end: Some(@dxfkit.Vec3::new(8.0, 4.0, 7.0)),
  }
  assert_true(
    doc.r12_recompute_dimension(
      first.record_index,
      1.0e-9,
      definition=off_plane,
    )
    is Err(_),
  )
  println(
    "dimension rebuild: seven measurement types, definition edits, styling, reflex arc and degeneracy",
  )
}
