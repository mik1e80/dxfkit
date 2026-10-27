///|
fn assert_xyz(actual : Vec3, x : Double, y : Double, z : Double) -> Unit raise {
  assert_true((actual.x - x).abs() < 1.0e-9)
  assert_true((actual.y - y).abs() < 1.0e-9)
  assert_true((actual.z - z).abs() < 1.0e-9)
}

///|
fn ocs_for_test(x : Double, y : Double, z : Double) -> Ocs raise {
  match Ocs::from_extrusion(Vec3::new(x, y, z)) {
    Ok(o) => o
    Err(msg) => fail(msg)
  }
}

///|
test "R12 AAA default normal" {
  assert_xyz(
    ocs_for_test(0.0, 0.0, 1.0).to_wcs(Vec3::new(2.0, 3.0, 4.0)),
    2.0,
    3.0,
    4.0,
  )
}

///|
test "R12 AAA negative Z reverses X and Z" {
  assert_xyz(
    ocs_for_test(0.0, 0.0, -1.0).to_wcs(Vec3::new(2.0, 3.0, 4.0)),
    -2.0,
    3.0,
    -4.0,
  )
}

///|
test "R12 AAA X normal" {
  assert_xyz(
    ocs_for_test(1.0, 0.0, 0.0).to_wcs(Vec3::new(2.0, 3.0, 4.0)),
    4.0,
    2.0,
    3.0,
  )
}

///|
test "R12 AAA Y normal" {
  assert_xyz(
    ocs_for_test(0.0, 1.0, 0.0).to_wcs(Vec3::new(2.0, 3.0, 4.0)),
    -2.0,
    4.0,
    3.0,
  )
}

///|
test "R12 AAA oblique basis is orthonormal and preserves length" {
  let o = ocs_for_test(1.0, 1.0, 1.0)
  assert_xyz(
    o.to_wcs(Vec3::new(1.0, 0.0, 0.0)),
    -1.0 / 2.0.sqrt(),
    1.0 / 2.0.sqrt(),
    0.0,
  )
  assert_xyz(
    o.to_wcs(Vec3::new(0.0, 1.0, 0.0)),
    -1.0 / 6.0.sqrt(),
    -1.0 / 6.0.sqrt(),
    2.0 / 6.0.sqrt(),
  )
  let p = o.to_wcs(Vec3::new(2.0, 3.0, 4.0))
  assert_true((p.length() - 29.0.sqrt()).abs() < 1.0e-9)
}

///|
test "R12 AAA rejects zero and normalizes huge normals" {
  assert_true(Ocs::from_extrusion(Vec3::zero()) is Err(_))
  assert_xyz(
    ocs_for_test(0.0, 0.0, 1.0e300).to_wcs(Vec3::new(2.0, 3.0, 4.0)),
    2.0,
    3.0,
    4.0,
  )
}

///|
fn world_first(p : WorldPlaced) -> Vec3 raise {
  match p.flat {
    Outline3(points~, ..) => points[0]
    _ => fail("expected outline")
  }
}

///|
let r12_line : String = "0\nLINE\n5\nL1\n8\n0\n10\n1\n20\n2\n30\n0\n11\n2\n21\n2\n31\n0\n"

///|
test "R12 array 2 columns 3 rows has all positions and provenance" {
  let d = drawing_with_insert(
    r12_line, "5\nI1\n8\nCUT\n10\n10\n20\n20\n70\n2\n71\n3\n44\n7\n45\n9\n",
  )
  let w = d.expand_world(0.01)
  assert_eq(w.placed.length(), 6)
  assert_eq(w.warnings.length(), 0)
  for i, p in w.placed {
    assert_xyz(
      world_first(p),
      11.0 + (i % 2).to_double() * 7.0,
      22.0 + (i / 2).to_double() * 9.0,
      0.0,
    )
    assert_eq(p.layer, "CUT")
    assert_eq(p.entity.handle(), "L1")
    assert_eq(p.instances[0].handle, "I1")
    assert_eq(p.instances[0].column, i % 2)
    assert_eq(p.instances[0].row, i / 2)
  }
}

///|
test "R12 scaled array spacing is not scaled" {
  let d = drawing_with_insert(
    r12_line, "10\n0\n20\n0\n41\n2\n42\n2\n70\n2\n71\n2\n44\n10\n45\n20\n",
  )
  let w = d.expand_world(0.01)
  assert_eq(w.placed.length(), 4)
  assert_xyz(world_first(w.placed[0]), 2.0, 4.0, 0.0)
  assert_xyz(world_first(w.placed[1]), 12.0, 4.0, 0.0)
  assert_xyz(world_first(w.placed[3]), 12.0, 24.0, 0.0)
}

///|
test "R12 90 degree array rotates grid and scaled geometry separately" {
  let d = drawing_with_insert(
    r12_line, "10\n0\n20\n0\n41\n2\n42\n3\n50\n90\n70\n2\n71\n2\n44\n10\n45\n20\n",
  )
  let w = d.expand_world(0.01)
  assert_xyz(world_first(w.placed[0]), -6.0, 2.0, 0.0)
  assert_xyz(world_first(w.placed[1]), -6.0, 12.0, 0.0)
  assert_xyz(world_first(w.placed[3]), -26.0, 12.0, 0.0)
}

///|
test "R12 array subtracts XYZ block base before scaling" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nBLOCKS\n0\nBLOCK\n2\nB\n10\n1\n20\n2\n30\n3\n0\nLINE\n10\n1\n20\n2\n30\n3\n11\n2\n21\n2\n31\n4\n0\nENDBLK\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n0\nINSERT\n2\nB\n10\n4\n20\n5\n30\n6\n41\n2\n42\n3\n43\n4\n70\n2\n44\n10\n0\nENDSEC\n0\nEOF\n",
  )
  let w = d.expand_world(0.01)
  assert_xyz(world_first(w.placed[0]), 4.0, 5.0, 6.0)
  match w.placed[1].flat {
    Outline3(points~, ..) => assert_xyz(points[1], 16.0, 5.0, 10.0)
    _ => fail("expected line")
  }
}

///|
test "R12 nested array retains both instance paths" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nBLOCKS\n0\nBLOCK\n2\nA\n10\n0\n20\n0\n" +
    r12_line +
    "0\nENDBLK\n0\nBLOCK\n2\nB\n10\n0\n20\n0\n0\nINSERT\n2\nA\n10\n3\n20\n0\n70\n2\n44\n10\n0\nENDBLK\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n0\nINSERT\n2\nB\n10\n0\n20\n5\n41\n2\n42\n2\n71\n2\n45\n20\n0\nENDSEC\n0\nEOF\n",
  )
  let w = d.expand_world(0.01)
  assert_eq(w.placed.length(), 4)
  assert_xyz(world_first(w.placed[0]), 8.0, 9.0, 0.0)
  assert_xyz(world_first(w.placed[3]), 28.0, 29.0, 0.0)
  assert_eq(w.placed[3].instances.length(), 2)
  assert_eq(w.placed[3].instances[0].row, 1)
  assert_eq(w.placed[3].instances[1].column, 1)
}

///|
test "R12 OCS array preserves YZ WCS and refuses XY checks" {
  let d = drawing_with_insert(
    r12_line, "10\n0\n20\n0\n70\n2\n44\n10\n210\n1\n220\n0\n230\n0\n",
  )
  let w = d.expand_world(0.01)
  assert_eq(w.warnings.length(), 0)
  assert_xyz(world_first(w.placed[0]), 0.0, 1.0, 2.0)
  assert_xyz(world_first(w.placed[1]), 0.0, 11.0, 2.0)
  assert_true(d.check({ tol: 0.01, min_gap: 0.0, }).has_incomplete_checks())
  assert_true(d.expand(0.01).warnings.any(w => w.contains("已转换 WCS")))
}

///|
test "R12 LINE POINT and 3DFACE coordinates remain WCS regardless of extrusion" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n" +
    r12_line +
    "210\n1\n220\n0\n230\n0\n0\nPOINT\n10\n2\n20\n3\n30\n4\n210\n1\n230\n0\n0\n3DFACE\n10\n1\n20\n2\n30\n3\n11\n4\n21\n5\n31\n6\n12\n7\n22\n8\n32\n9\n13\n7\n23\n8\n33\n9\n210\n1\n230\n0\n0\nENDSEC\n0\nEOF\n",
  )
  let w = d.expand_world(0.01)
  assert_xyz(world_first(w.placed[0]), 1.0, 2.0, 0.0)
  match w.placed[1].flat {
    Dot3(at~) => assert_xyz(at, 2.0, 3.0, 4.0)
    _ => fail("point")
  }
  match w.placed[2].flat {
    Face3(corners~) => assert_xyz(corners[1], 4.0, 5.0, 6.0)
    _ => fail("face")
  }
}

///|
test "R12 circle OCS center elevation and radius are preserved" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nCIRCLE\n10\n2\n20\n3\n30\n4\n40\n5\n210\n0\n220\n1\n230\n0\n0\nENDSEC\n0\nEOF\n",
  )
  let w = d.expand_world(0.01)
  match w.placed[0].flat {
    Outline3(points~, closed~) => {
      assert_true(closed)
      for p in points {
        assert_true(
          (p.sub(Vec3::new(-2.0, 4.0, 3.0)).length() - 5.0).abs() < 1.0e-9,
        )
      }
    }
    _ => fail("circle")
  }
}

///|
test "R12 invalid OCS and invalid array fail with diagnostics" {
  let bad = drawing_with_insert(r12_line, "10\n0\n20\n0\n230\n0\n")
  assert_eq(bad.expand_world(0.01).placed.length(), 0)
  assert_true(bad.expand_world(0.01).warnings.any(w => w.contains("OCS")))
  let bad = drawing_with_insert(r12_line, "10\n0\n20\n0\n70\n0\n")
  assert_eq(bad.expand_world(0.01).placed.length(), 0)
  assert_true(bad.check({ tol: 0.01, min_gap: 0.0, }).has_incomplete_checks())
}

///|
test "R12 large empty arrays stop at visit budget" {
  let d = drawing_with_insert("", "10\n0\n20\n0\n70\n30000\n71\n30000\n")
  let w = d.expand_world_with_limits(0.01, {
    max_placed: 8,
    max_points: 64,
    max_visits: 10,
  })
  assert_eq(w.placed.length(), 0)
  assert_true(w.warnings.any(w => w.contains("实体访问次数")))
}

///|
test "R12 overlapping zero spacing cells keep distinct provenance" {
  let d = drawing_with_insert(r12_line, "10\n0\n20\n0\n70\n2\n44\n0\n")
  let w = d.expand_world(0.01)
  assert_eq(w.placed.length(), 2)
  assert_xyz(world_first(w.placed[1]), 1.0, 2.0, 0.0)
  assert_eq(w.placed[1].instances[0].column, 1)
}

///|
test "R12 linked attributes cannot silently claim complete array reconstruction" {
  let d = drawing_with_insert(
    r12_line, "5\nI1\n10\n0\n20\n0\n66\n1\n70\n2\n44\n10\n",
  )
  let world = d.expand_world(0.01)
  assert_eq(world.placed.length(), 2)
  assert_true(world.warnings.any(w => w.contains("ATTRIB") && w.contains("I1")))
  assert_xyz(world_first(world.placed[1]), 11.0, 2.0, 0.0)
  assert_true(d.check({ tol: 0.01, min_gap: 0.0, }).has_incomplete_checks())
}
