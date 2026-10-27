///|
fn review_face(kind : String, fourth : String, extra : String) -> Drawing {
  delivery_drawing(
    "0\n\{kind}\n5\nF1\n8\nCUT\n10\n0\n20\n0\n30\n0\n" +
    "11\n2\n21\n0\n31\n0\n12\n0\n22\n1\n32\n0\n" +
    fourth +
    extra,
  )
}

///|
fn review_outline(d : Drawing) -> Array[Vec2] raise {
  let expanded = d.expand(0.001)
  assert_eq(expanded.warnings.length(), 0)
  assert_eq(expanded.placed.length(), 1)
  match expanded.placed[0].flat {
    Outline(points~, closed~) => {
      assert_true(closed)
      points
    }
    _ => fail("expected an actual closed boundary")
  }
}

///|
fn review_polygon(
  d : Drawing,
  expected : Array[Vec2],
  area : Double,
) -> Unit raise {
  let points = review_outline(d)
  assert_eq(points.length(), expected.length())
  let mut twice_area = 0.0
  for i = 0; i < points.length(); i = i + 1 {
    assert_eq(points[i].x, expected[i].x)
    assert_eq(points[i].y, expected[i].y)
    let next = points[(i + 1) % points.length()]
    assert_true(points[i].distance(next) > 0.0)
    twice_area += points[i].x * next.y - points[i].y * next.x
  }
  assert_eq(twice_area / 2.0, area)
  let report = d.check({ tol: 0.001, min_gap: 0.0, })
  assert_false(report.has_incomplete_checks())
  assert_false(report.has_fatal())
  assert_eq(report.findings.length(), 0)
}

///|
test "review SOLID rectangle follows boundary order without changing stored vertices" {
  let d = review_face("SOLID", "13\n2\n23\n1\n33\n0\n", "")
  match d.entities().entities[0].geom {
    Face(corners~) => {
      assert_eq(corners.length(), 4)
      assert_eq(corners[2].x, 0.0)
      assert_eq(corners[3].x, 2.0)
    }
    _ => fail("expected raw Face fields")
  }
  review_polygon(
    d,
    [
      Vec2::new(0.0, 0.0),
      Vec2::new(2.0, 0.0),
      Vec2::new(2.0, 1.0),
      Vec2::new(0.0, 1.0),
    ],
    2.0,
  )
}

///|
test "review TRACE rectangle has no crossing diagonals or false self-intersection" {
  review_polygon(
    review_face("TRACE", "13\n2\n23\n1\n33\n0\n", ""),
    [
      Vec2::new(0.0, 0.0),
      Vec2::new(2.0, 0.0),
      Vec2::new(2.0, 1.0),
      Vec2::new(0.0, 1.0),
    ],
    2.0,
  )
}

///|
test "review triangular SOLID repeated fourth corner is not a zero-length edge" {
  let d = review_face("SOLID", "13\n0\n23\n1\n33\n0\n", "")
  match d.entities().entities[0].geom {
    Face(corners~) => assert_eq(corners.length(), 4)
    _ => fail("stored fourth corner must remain available")
  }
  review_polygon(
    d,
    [Vec2::new(0.0, 0.0), Vec2::new(2.0, 0.0), Vec2::new(0.0, 1.0)],
    1.0,
  )
}

///|
test "review 3DFACE keeps its own WCS vertex order and remains outside contour checks" {
  let d = delivery_drawing(
    "0\n3DFACE\n10\n0\n20\n0\n11\n2\n21\n0\n12\n2\n22\n1\n13\n0\n23\n1\n",
  )
  match d.entities().entities[0].geom {
    Face(corners~) => {
      assert_eq(corners.length(), 4)
      assert_eq(corners[2].x, 2.0)
      assert_eq(corners[2].y, 1.0)
      assert_eq(corners[3].x, 0.0)
      assert_eq(corners[3].y, 1.0)
    }
    _ => fail("expected 3DFACE fields")
  }
  assert_false(d.expand(0.001).placed.any(p => p.flat is Outline(..)))
  assert_true(d.check({ tol: 0.001, min_gap: 0.0, }).has_incomplete_checks())
}

///|
test "review SOLID negative Z OCS produces an actual reflected contour" {
  let d = review_face("SOLID", "13\n2\n23\n1\n33\n0\n", "230\n-1\n")
  let world = d.expand_world(0.001)
  assert_eq(world.warnings.length(), 0)
  match world.placed[0].flat {
    Outline3(points~, closed~) => {
      assert_true(closed)
      assert_true(points.any(p => p.x == -2.0 && p.y == 1.0 && p.z == 0.0))
    }
    _ => fail("reflected SOLID expected")
  }
  let report = d.check({ tol: 0.001, min_gap: 0.0, })
  assert_false(report.has_incomplete_checks())
}

///|
test "review nonparallel SOLID does not silently become a valid XY rectangle" {
  let d = review_face("SOLID", "13\n2\n23\n1\n33\n1\n", "")
  assert_false(d.expand(0.001).placed.any(p => p.flat is Outline(..)))
  let report = d.check({ tol: 0.001, min_gap: 0.0, })
  assert_true(report.has_incomplete_checks())
  assert_true(report.to_text().contains("平行"))
}

///|
test "review partially written fourth corner cannot masquerade as a triangle" {
  let d = review_face("SOLID", "13\n2\n", "")
  assert_true(d.entities().warnings.any(w => w.contains("第四")))
  assert_false(d.expand(0.001).placed.any(p => p.flat is Outline(..)))
  assert_true(d.check({ tol: 0.001, min_gap: 0.0, }).has_incomplete_checks())
}

///|
test "review nested cyclic INSERT remains incomplete while supported sibling survives" {
  let d = drawing_with_insert(
    "0\nINSERT\n2\n销\n5\nCD\n10\n0\n20\n0\n230\n-1\n0\nCIRCLE\n10\n0\n20\n0\n40\n2\n",
    "10\n0\n20\n0\n",
  )
  assert_eq(d.expand(0.01).placed.length(), 1)
  let report = d.check({ tol: 0.01, min_gap: 0.0, })
  assert_true(report.has_incomplete_checks())
  assert_true(report.to_text().contains("CD"))
  assert_true(report.to_text().contains("循环引用"))
}

///|
test "review recovered LWPOLYLINE count mismatch keeps coordinates but cannot claim completeness" {
  let d = delivery_drawing(
    "0\nLWPOLYLINE\n90\n4\n70\n1\n10\n0\n20\n0\n10\n2\n20\n0\n10\n0\n20\n1\n",
  )
  let report = d.check({ tol: 0.001, min_gap: 0.0, })
  assert_true(report.has_incomplete_checks())
  assert_true(report.to_text().contains("顶点数"))
  match d.expand(0.001).placed[0].flat {
    Outline(points~, closed~) => {
      assert_true(closed)
      assert_eq(points.length(), 3)
      assert_eq(points[1].x, 2.0)
      assert_eq(points[2].y, 1.0)
    }
    _ => fail("expected explicitly diagnosed recovery")
  }
}

///|
test "review SOLID nonzero thickness is explicitly outside the planar boundary contract" {
  let d = review_face("SOLID", "13\n2\n23\n1\n", "39\n1\n")
  assert_false(d.expand(0.001).placed.any(p => p.flat is Outline(..)))
  let report = d.check({ tol: 0.001, min_gap: 0.0, })
  assert_true(report.has_incomplete_checks())
  assert_true(report.to_text().contains("厚度"))
}

///|
test "review genuine duplicate SOLID edge remains a degeneracy diagnostic" {
  let d = delivery_drawing(
    "0\nSOLID\n10\n0\n20\n0\n11\n0\n21\n0\n12\n0\n22\n1\n13\n2\n23\n1\n",
  )
  let report = d.check({ tol: 0.001, min_gap: 0.0, })
  assert_false(report.has_incomplete_checks())
  assert_true(report.to_text().contains("零长度"))
}
