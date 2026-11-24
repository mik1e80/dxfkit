///|
test "use R12 records and OCS array from the published library" {
  let bytes = @fs.read_file_to_bytes("fixtures/ocs-array.dxf")
  let doc = @dxfkit.read_document(bytes)
  assert_true(doc.profile is @dxfkit.R12)
  assert_true(doc.read_status() is @dxfkit.ReadComplete)
  let world = doc.drawing.expand_world(0.01)
  assert_true(world.warnings.is_empty())
  assert_eq(world.placed.length(), 2)
  let last = world.placed[1]
  assert_eq(last.instances.length(), 1)
  assert_eq(last.instances[0].column, 1)
  guard last.flat is @dxfkit.Outline3(points~, closed=false) else {
    fail("expected an open WCS outline")
  }
  assert_eq(points.length(), 2)
  assert_true((points[1].x - 1.0).abs() < 1.0e-9)
  assert_true((points[1].y - 11.0).abs() < 1.0e-9)
  assert_true(points[1].z.abs() < 1.0e-9)
}

///|
test "read and compare the native BricsCAD R12 fitted mesh" {
  let bytes = @fs.read_file_to_bytes("fixtures/bricscad-v20-cubic-r12.dxf")
  let doc = @dxfkit.read_document(bytes)
  assert_true(doc.profile is @dxfkit.R12)
  assert_true(doc.read_status() is @dxfkit.ReadComplete)
  let meshes = doc.r12_semantics().entries.filter(entry => {
    entry.entity is @dxfkit.FittedMesh(_)
  })
  assert_eq(meshes.length(), 1)
  guard meshes[0].entity is @dxfkit.FittedMesh(mesh) else {
    fail("expected the native fitted polygon mesh")
  }
  assert_eq(mesh.controls.length(), 20)
  assert_eq((mesh.sample_m, mesh.sample_n), (8, 7))
  guard mesh.compare_refit(1.0e-12) is Ok(result) else {
    fail("expected a BricsCAD point comparison")
  }
  assert_eq(result.distances.length(), 56)
  assert_eq(result.outside_tolerance, 0)
}
