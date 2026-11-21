///|
fn load(name : String) -> @dxfkit.ReadDocument raise {
  let doc = @dxfkit.read_document(
    @fs.read_file_to_bytes("examples/r12-semantics/" + name),
  )
  assert_true(doc.profile is @dxfkit.R12)
  assert_true(doc.read_status() is @dxfkit.ReadComplete)
  doc
}

///|
fn assert_xyz(
  p : @dxfkit.Vec3,
  x : Double,
  y : Double,
  z : Double,
) -> Unit raise {
  assert_true((p.x - x).abs() < 1.0e-9)
  assert_true((p.y - y).abs() < 1.0e-9)
  assert_true((p.z - z).abs() < 1.0e-9)
}

///|
fn record_index(doc : @dxfkit.ReadDocument, kind : String) -> Int raise {
  for i, record in doc.records {
    if record.kind == kind && record.section == "ENTITIES" {
      return i
    }
  }
  fail("Missing \{kind}")
}

///|
fn mesh() -> Unit raise {
  let doc = load("fitted-mesh.dxf")
  let report = doc.r12_semantics()
  assert_true(report.complete)
  assert_true(report.findings.is_empty())
  assert_eq(report.entries.length(), 1)
  guard report.entries[0].entity is @dxfkit.FittedMesh(mesh) else {
    fail("expected fitted mesh")
  }
  assert_true(mesh.fit is @dxfkit.CubicBSpline)
  assert_eq((mesh.m, mesh.n, mesh.sample_m, mesh.sample_n), (2, 2, 3, 2))
  assert_eq(mesh.controls.length(), 4)
  assert_eq(mesh.samples.length(), 6)
  assert_xyz(mesh.controls[2], 2.0, 0.0, 2.0)
  guard mesh.quad(2, 0) is Some((a, b, c, d)) else {
    fail("expected closed M seam")
  }
  assert_xyz(a, 2.0, 0.0, 3.0)
  assert_xyz(b, 0.0, 0.0, 1.0)
  assert_xyz(c, 0.0, 2.0, 1.0)
  assert_xyz(d, 2.0, 2.0, 3.0)
  assert_true(mesh.quad(0, 1) is None)
  let frame_only = {
    ..doc,
    records: doc.records.filter(r => {
      !(r.kind == "VERTEX" &&
      r.tags.any(t => t.code == 70 && t.value.as_int() == 72))
    }),
  }
  guard frame_only.r12_semantics().entries[0].entity
    is @dxfkit.FittedMesh(frame) else {
    fail("expected control frame")
  }
  assert_true(frame.samples.is_empty())
  assert_true(frame.quad(0, 0) is None)
  let truncated = {
    ..doc,
    records: doc.records.filter(r => {
      !(r.kind == "VERTEX" &&
      r.tags.any(t => t.code == 70 && t.value.as_int() == 72) &&
      r.tags.any(t => t.code == 30 && t.value.as_double() == 3.0))
    }),
  }
  assert_true(truncated.r12_semantics().entries.is_empty())
  assert_true(truncated.r12_semantics().findings[0].message.contains("73/74"))
  assert_true(
    doc.drawing.check({ tol: 0.01, min_gap: 0.0, }).has_incomplete_checks(),
  )
  println(
    "fitted mesh: control grid, WCS sample grid, closed M seam, missing sample diagnosis",
  )
}

///|
fn attributes() -> Unit raise {
  let doc = load("array-attributes.dxf")
  let index = record_index(doc, "INSERT")
  guard doc.r12_cell_attributes(index, 1, 1) is Ok(attributes) else {
    fail("expected both labels")
  }
  assert_eq(attributes.length(), 2)
  let variable = attributes[0]
  let fixed = attributes[1]
  assert_eq(variable.data.value, "K-9")
  assert_false(variable.from_constant_definition)
  assert_eq(doc.records[variable.source_record].kind, "ATTRIB")
  assert_eq(doc.records[variable.definition_record].kind, "ATTDEF")
  assert_xyz(variable.anchor, 10.0, 10.0, 2.0)
  guard variable.alignment is Some(p) else {
    fail("expected translated alignment")
  }
  assert_xyz(p, 7.0, 13.0, 5.0)
  assert_xyz(variable.baseline, -1.0, 0.0, 0.0)
  assert_xyz(variable.up, 0.0, 0.0, 1.0)
  assert_true(fixed.from_constant_definition)
  assert_eq(fixed.data.value, "fixed")
  assert_xyz(fixed.anchor, 1.0, 29.0, 0.0)
  assert_xyz(fixed.baseline, 0.0, 2.0, 0.0)
  assert_xyz(fixed.up, 1.0, 0.0, 0.0)
  assert_true(doc.r12_cell_attributes(index, 2, 0) is Err(_))
  let no_end = { ..doc, records: doc.records.filter(r => r.kind != "SEQEND"), }
  assert_true(no_end.r12_cell_attributes(index, 0, 0) is Err(_))
  println(
    "array attributes: variable and constant anchors, alignment, basis and invalid cell",
  )
}

///|
fn dimension() -> Unit raise {
  let doc = load("dimension-picture.dxf")
  let index = record_index(doc, "DIMENSION")
  guard doc.r12_dimension_picture(index, 0.01) is Ok(picture) else {
    fail("expected saved dimension picture")
  }
  assert_eq(doc.records[picture.block_record].kind, "BLOCK")
  guard picture.style_record is @dxfkit.Resolved(style) else {
    fail("expected DIMSTYLE reference")
  }
  assert_eq(doc.records[style].kind, "DIMSTYLE")
  assert_eq(picture.overrides.length(), 2)
  assert_eq(picture.overrides[0].group, 77)
  assert_eq(picture.overrides[1].group, 147)
  assert_eq(picture.overrides[1].value.value.as_double(), 0.2)
  assert_true(picture.world.warnings.is_empty())
  assert_eq(picture.world.placed.length(), 2)
  guard picture.world.placed[0].flat is @dxfkit.Outline3(points=main_line, ..) else {
    fail("expected dimension line")
  }
  assert_xyz(main_line[0], -4.0, 6.0, -7.0)
  assert_xyz(main_line[1], -7.0, 6.0, -7.0)
  let arrow = picture.world.placed[1]
  assert_eq(arrow.instances[0].block, "TIP")
  guard arrow.flat is @dxfkit.Outline3(points=arrow_line, ..) else {
    fail("expected nested arrow")
  }
  assert_xyz(arrow_line[0], -7.0, 6.0, -7.0)
  assert_xyz(arrow_line[1], -7.0, 7.0, -7.0)
  guard doc.r12_dimension_picture(index, 0.01, limits={
      max_placed: 1,
      max_points: 20,
      max_visits: 20,
    })
    is Ok(bounded) else {
    fail("expected bounded picture")
  }
  assert_eq(bounded.world.placed.length(), 1)
  assert_false(bounded.world.warnings.is_empty())
  let records = doc.records.copy()
  let bad = records[index]
  records[index] = {
    ..bad,
    tags: bad.tags.filter(t => !(t.code == 1002 && t.value is @dxfkit.Str("}"))),
  }
  let broken = { ..doc, records, }
  assert_true(broken.r12_dimension_picture(index, 0.01) is Err(_))
  println(
    "dimension: nested stored primitives, ECS/offset, style overrides and bounded output",
  )
}

///|
fn main raise {
  let args = @env.args()
  if args.length() == 4 && args[1] == "shape" {
    inspect_shaping(args[2], args[3])
    return
  }
  if args.length() == 4 && args[1] == "compare-mesh" {
    inspect_mesh_refit(args[2], args[3])
    return
  }
  mesh()
  attributes()
  dimension()
  rebuild_mesh_cases()
  rebuild_glyph_case()
  rebuild_dimension_cases()
  font_decoders()
  advanced_fonts()
  bound_style_cases()
  styled_dimensions()
  refit_comparison_case()
}
