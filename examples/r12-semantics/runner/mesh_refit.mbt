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
