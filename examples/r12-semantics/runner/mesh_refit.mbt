///|
fn inspect_mesh_refit(path : String, tolerance : String) -> Unit raise {
  let tol = @string.parse_double(tolerance)
  let doc = @dxfkit.read_document(@fs.read_file_to_bytes(path))
  guard doc.profile is @dxfkit.R12 && doc.read_status() is @dxfkit.ReadComplete else {
    fail("point comparison requires a complete ASCII DXF AC1009 file")
  }
  let report = doc.r12_semantics()
  let mut compared = 0
  println("record_index,m,n,error")
  for entry in report.entries {
    if entry.entity is @dxfkit.FittedMesh(mesh) {
      guard mesh.compare_refit(tol) is Ok(comparison) else {
        fail("fitted mesh lacks a usable control frame or sample grid")
      }
      for i, error in comparison.distances {
        println(
          "\{entry.record_index},\{i / mesh.sample_n},\{i % mesh.sample_n},\{error}",
        )
      }
      compared += 1
    }
  }
  guard compared > 0 else { fail("no fitted polygon mesh in the input") }
}

///|
fn legacy_mesh_export_input() -> Unit raise {
  let doc = load("legacy-refit-input.dxf")
  let report = doc.r12_semantics()
  assert_true(report.complete)
  assert_eq(report.entries.length(), 1)
  guard report.entries[0].entity
    is @dxfkit.PolygonMesh(points~, m~, n~, closed_m~, closed_n~) else {
    fail(
      "expected an unfitted mesh for acquisition in a legacy CAD application",
    )
  }
  assert_eq((m, n), (5, 4))
  assert_false(closed_m || closed_n)
  assert_eq(points.length(), 20)
  assert_xyz(points[0], 0.0, 0.0, 0.0)
  assert_xyz(points[10], 4.0, 6.0, 5.0)
  assert_xyz(points[19], 8.0, 9.0, 4.0)
  println(
    "legacy export input: 5 by 4 open control frame, no precomputed samples",
  )
}

///|
fn bricscad_fitted_mesh_case() -> Unit raise {
  let doc = load("legacy-cad/bricscad-v20-cubic-r12.dxf")
  let meshes = doc.r12_semantics().entries.filter(entry => {
    entry.entity is @dxfkit.FittedMesh(_)
  })
  assert_eq(meshes.length(), 1)
  guard meshes[0].entity is @dxfkit.FittedMesh(mesh) else {
    fail("expected fitted mesh from BricsCAD V20")
  }
  assert_true(mesh.fit is @dxfkit.CubicBSpline)
  assert_eq((mesh.m, mesh.n), (5, 4))
  assert_eq((mesh.sample_m, mesh.sample_n), (8, 7))
  assert_false(mesh.closed_m || mesh.closed_n)
  assert_eq(mesh.controls.length(), 20)
  assert_xyz(mesh.controls[10], 4.0, 6.0, 5.0)
  assert_xyz(mesh.samples[9], 1.492711370262391, 3.0, 1.154087031638052)
  guard mesh.compare_refit(1.0e-12) is Ok(result) else {
    fail("expected a point-by-point BricsCAD comparison")
  }
  assert_eq(result.distances.length(), 56)
  assert_eq(result.outside_tolerance, 0)
  println("BricsCAD V20 native AC1009: 56 stored samples match the refit")
}
