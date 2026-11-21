///|
fn test_freecad_spatial_circle() -> Unit raise {
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

///|
fn cad_model(name : String) -> @dxfkit.ReadDocument raise {
  let doc = @dxfkit.read_document(
    @fs.read_file_to_bytes("examples/cad-ocs/" + name),
  )
  assert_true(doc.profile is @dxfkit.R12)
  assert_true(doc.read_status() is @dxfkit.ReadComplete)
  doc
}

///|
fn assert_position(
  point : @dxfkit.Vec3,
  x : Double,
  y : Double,
  z : Double,
) -> Unit raise {
  assert_true((point.x - x).abs() < 1.0e-9)
  assert_true((point.y - y).abs() < 1.0e-9)
  assert_true((point.z - z).abs() < 1.0e-9)
}

///|
fn test_freecad_array() -> Unit raise {
  let doc = cad_model("rectangular-array.dxf")
  assert_false(
    doc.records.any(r => r.section == "ENTITIES" && r.kind == "INSERT"),
  )
  let world = doc.drawing.expand_world(0.002)
  assert_true(world.warnings.is_empty())
  assert_eq(world.placed.length(), 12)
  let starts : Map[(Int, Int), Bool] = Map([])
  for placement in world.placed {
    assert_true(placement.instances.is_empty())
    guard placement.flat is @dxfkit.Outline3(points~, closed=false) else {
      fail("expected a flattened FreeCAD array edge")
    }
    assert_eq(points.length(), 2)
    let x = points[0].x.to_int()
    let y = points[0].y.to_int()
    assert_false(starts.contains((x, y)))
    starts[(x, y)] = true
    assert_position(points[0], x.to_double(), y.to_double(), 0.0)
    if [2, 9, 16].contains(x) {
      assert_position(points[1], x.to_double() + 3.0, y.to_double(), 0.0)
    } else {
      assert_true([5, 12, 19].contains(x))
      assert_position(points[1], x.to_double(), y.to_double() + 2.0, 0.0)
    }
    assert_true([3, 14].contains(y))
  }
  println(
    "FreeCAD AC1009: six copies, 12 WCS edges, array flattened by exporter",
  )
}

///|
fn test_qcad_array() -> Unit raise {
  let doc = cad_model("qcad-array.dxf")
  let inserts = doc.records.filter(r => {
    r.section == "ENTITIES" && r.kind == "INSERT"
  })
  assert_eq(inserts.length(), 1)
  for pair in [(70, 3.0), (71, 2.0), (44, 7.0), (45, 11.0)] {
    let (code, value) = pair
    assert_true(
      inserts[0].tags.any(t => t.code == code && t.value.as_double() == value),
    )
  }
  let world = doc.drawing.expand_world(0.002)
  assert_true(world.warnings.is_empty())
  assert_eq(world.placed.length(), 6)
  let seen : Map[(Int, Int), Bool] = Map([])
  for placement in world.placed {
    assert_eq(placement.instances.length(), 1)
    let instance = placement.instances[0]
    assert_eq(instance.block, "ARRAY_MARK")
    assert_true(instance.row >= 0 && instance.row < 2)
    assert_true(instance.column >= 0 && instance.column < 3)
    let cell = (instance.row, instance.column)
    assert_false(seen.contains(cell))
    seen[cell] = true
    let x = 10.0 - instance.row.to_double() * 11.0
    let y = 20.0 + instance.column.to_double() * 7.0
    guard placement.flat is @dxfkit.Outline3(points~, closed=false) else {
      fail("expected the QCAD block edge")
    }
    assert_eq(points.length(), 2)
    assert_position(points[0], x, y, 0.0)
    assert_position(points[1], x, y + 6.0, 0.0)
  }
  println("QCAD dxflib AC1009: six source cells and 36 WCS components verified")
}

///|
fn test_qcad_professional() -> Unit raise {
  let doc = cad_model("qcad-array-pro.dxf")
  let inserts = doc.records.filter(r => {
    r.section == "ENTITIES" && r.kind == "INSERT"
  })
  assert_eq(inserts.length(), 1)
  assert_false(inserts[0].tags.any(t => [70, 71, 44, 45].contains(t.code)))
  let world = doc.drawing.expand_world(0.002)
  let lines = world.placed.filter(p => p.entity.kind() == "LINE")
  assert_eq(lines.length(), 1)
  guard lines[0].flat is @dxfkit.Outline3(points~, closed=false) else {
    fail("expected the remaining QCAD block edge")
  }
  assert_eq(points.length(), 2)
  assert_position(points[0], 10.0, 20.0, 0.0)
  assert_position(points[1], 10.0, 26.0, 0.0)
  let report = doc.r12_semantics()
  assert_true(report.complete)
  assert_true(report.findings.is_empty())
  let viewports = report.entries.filter(entry => {
    entry.entity is @dxfkit.Viewport(..)
  })
  assert_eq(viewports.length(), 1)
  guard viewports[0].entity is @dxfkit.Viewport(id=1, view=Some(view), ..) else {
    fail("expected the default paper-space viewport and its MVIEW description")
  }
  assert_eq(view.height, 222.18)
  assert_position(view.direction, 0.0, 0.0, 1.0)
  println(
    "QCAD Professional AC1009: one WCS edge after array fields were omitted; MVIEW decoded",
  )
}

///|
fn test_notocad_tilted_circle() -> Unit raise {
  let doc = cad_model("notocad-tilted-circle.dxf")
  let raw = doc.records.filter(r => {
    r.section == "ENTITIES" && r.kind == "CIRCLE"
  })
  assert_eq(raw.length(), 1)
  for
    pair in [
      (10, -3.0),
      (20, -0.2),
      (30, 6.4),
      (40, 2.0),
      (210, 0.0),
      (220, 0.6),
      (230, 0.8),
    ] {
    let (code, value) = pair
    assert_true(
      raw[0].tags.any(t => {
        t.code == code && (t.value.as_double() - value).abs() < 1.0e-12
      }),
    )
  }
  let world = doc.drawing.expand_world(0.002)
  assert_true(world.warnings.is_empty())
  assert_eq(world.placed.length(), 1)
  guard world.placed[0].flat is @dxfkit.Outline3(points~, closed=true) else {
    fail("expected the original tilted circle in world space")
  }
  assert_true(points.length() >= 4)
  // The design center is (3,4,5). The +X OCS axis is (-1,0,0).
  assert_position(points[0], 1.0, 4.0, 5.0)
  let mut max_plane_error = 0.0
  let mut max_radius_error = 0.0
  let mut z_min = 5.0
  let mut z_max = 5.0
  for point in points {
    let dx = point.x - 3.0
    let dy = point.y - 4.0
    let dz = point.z - 5.0
    max_radius_error = max_radius_error.max(
      ((dx * dx + dy * dy + dz * dz).sqrt() - 2.0).abs(),
    )
    max_plane_error = max_plane_error.max((0.6 * dy + 0.8 * dz).abs())
    z_min = z_min.min(point.z)
    z_max = z_max.max(point.z)
  }
  assert_true(max_radius_error < 1.0e-9)
  assert_true(max_plane_error < 1.0e-9)
  assert_true((z_min - 3.8).abs() < 0.002)
  assert_true((z_max - 6.2).abs() < 0.002)
  assert_true(
    doc.drawing.check({ tol: 0.002, min_gap: 0.0, }).status()
    is @dxfkit.Incomplete,
  )
  println(
    "NotoCAD AC1009: \{points.length()} tilted samples; Z=[\{z_min},\{z_max}]; radius error=\{max_radius_error}; plane error=\{max_plane_error}",
  )
}

///|
fn main raise {
  test_freecad_spatial_circle()
  test_notocad_tilted_circle()
  test_freecad_array()
  test_qcad_array()
  test_qcad_professional()
}
