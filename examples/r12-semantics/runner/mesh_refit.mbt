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
