///|
fn main raise {
  let bytes = @fs.read_file_to_bytes("examples/cad-ocs/spatial-circle.dxf")
  let doc = @dxfkit.read_document(bytes)
  assert_true(doc.profile is @dxfkit.R12)
  assert_true(doc.read_status() is @dxfkit.ReadComplete)
  let raw = doc.records.filter(r => {
    r.section == "ENTITIES" && r.kind == "CIRCLE"
  })
  assert_eq(raw.length(), 1)
  assert_false(raw[0].tags.any(t => [210, 220, 230].contains(t.code)))
  let world = doc.drawing.expand_world(0.002)
  assert_eq(world.placed.length(), 1)
  let points = match world.placed[0].flat {
    @dxfkit.Outline3(points~, closed~) => {
      assert_true(closed)
      points
    }
    _ => fail("expected one closed world-space circle")
  }
  assert_true(points.length() >= 4)
  let mut max_radius_error = 0.0
  let mut z_min = points[0].z
  let mut z_max = points[0].z
  for p in points {
    let dx = p.x - 3.0
    let dy = p.y - 4.0
    let error = ((dx * dx + dy * dy).sqrt() - 2.0).abs()
    max_radius_error = max_radius_error.max(error)
    z_min = z_min.min(p.z)
    z_max = z_max.max(p.z)
  }
  assert_true(max_radius_error < 1.0e-9)
  assert_eq(z_min, 5.0)
  assert_eq(z_max, 5.0)
  let report = doc.drawing.check({ tol: 0.002, min_gap: 0.0, })
  assert_true(report.status() is @dxfkit.Incomplete)
  println(
    "AC1009 CIRCLE: no extrusion groups; \{points.length()} WCS samples; Z=[\{z_min},\{z_max}]; max radius error=\{max_radius_error}; XY check incomplete",
  )
}
