///|
fn delivery_drawing(body : String) -> Drawing {
  drawing_utf8("0\nSECTION\n2\nENTITIES\n" + body + "0\nENDSEC\n0\nEOF\n")
}

///|
test "P0 ELLIPSE major axis is relative to a non-origin center" {
  let d = delivery_drawing(
    "0\nELLIPSE\n10\n10\n20\n20\n11\n2\n21\n0\n40\n0.5\n",
  )
  match d.entities().entities[0].geom {
    Ellipse(center~, major~, ..) => {
      assert_eq(center.x, 10.0)
      assert_eq(center.y, 20.0)
      assert_eq(major.x, 2.0)
      assert_eq(major.y, 0.0)
    }
    _ => fail("expected ELLIPSE")
  }
  match d.expand(0.01).placed[0].flat {
    Outline(points~, closed~) => {
      assert_true(closed)
      assert_eq(points[0].x, 12.0)
      assert_eq(points[0].y, 20.0)
    }
    _ => fail("expected ellipse outline")
  }
}

///|
test "P0 SVG numbers preserve large negative and sub-micron coordinates" {
  for value in [300000.0, -300000.0, 1.0e-9, -1.0e-9, 1.0e20] {
    let actual = @string.parse_double(fmt(value)[:])
    assert_eq(actual, value)
  }
}

///|
test "P0 LWPOLYLINE missing Y cannot silently bridge surviving vertices" {
  let d = delivery_drawing(
    "0\nLWPOLYLINE\n90\n3\n70\n0\n10\n0\n20\n0\n10\n1\n10\n2\n20\n0\n",
  )
  assert_true(d.entities().warnings.any(w => w.contains("顶点")))
  assert_false(d.entities().entities[0].is_decoded())
  assert_false(d.expand(0.05).placed.any(p => p.flat is Outline(..)))
  assert_true(
    d.check({ tol: 0.05, min_gap: 0.0, }).to_text().contains("LWPOLYLINE"),
  )
}

///|
test "P0 POLYLINE missing vertex coordinate cannot silently bridge vertices" {
  let d = delivery_drawing(
    "0\nPOLYLINE\n70\n0\n0\nVERTEX\n10\n0\n20\n0\n" +
    "0\nVERTEX\n10\n1\n0\nVERTEX\n10\n2\n20\n0\n0\nSEQEND\n",
  )
  assert_true(d.entities().warnings.any(w => w.contains("顶点")))
  assert_false(d.entities().entities[0].is_decoded())
  assert_false(d.expand(0.05).placed.any(p => p.flat is Outline(..)))
}

///|
test "P0 face records remain readable but never become checked outlines" {
  for kind in ["SOLID", "TRACE", "3DFACE"] {
    let d = delivery_drawing(
      "0\n\{kind}\n10\n0\n20\n0\n11\n2\n21\n0\n12\n0\n22\n1\n13\n2\n23\n1\n",
    )
    let e = d.entities().entities[0]
    assert_true(e.is_decoded())
    match e.geom {
      Face(corners~) => assert_eq(corners.length(), 4)
      _ => fail("face fields must remain available")
    }
    assert_true(e.geom.flatten(0.05) is Empty)
    assert_false(d.expand(0.05).placed.any(p => p.flat is Outline(..)))
    let report = d.check({ tol: 0.05, min_gap: 0.0, }).to_text()
    assert_true(report.contains("\{kind} 实体的轮廓未参与检查"))
    assert_false(report.contains("[自相交]"))
    assert_false(d.to_svg(0.05).contains("<polygon"))
  }
}

///|
test "P0 INSERT unsupported OCS is diagnosed before children lose its identity" {
  let d = drawing_with_insert(
    "0\nCIRCLE\n10\n0\n20\n0\n40\n5\n", "5\nAB\n8\nCUT\n10\n0\n20\n0\n210\n0\n220\n1\n230\n0\n",
  )
  let exp = d.expand(0.05)
  assert_eq(exp.placed.length(), 0)
  assert_true(
    exp.warnings.any(w => {
      w.contains("OCS") && w.contains("AB") && w.contains("CUT")
    }),
  )
  assert_true(d.check({ tol: 0.05, min_gap: 0.0, }).count(Warn) > 0)
}

///|
test "rotated ellipse arc retains its parameter endpoints" {
  let d = delivery_drawing(
    "0\nELLIPSE\n10\n10\n20\n20\n11\n0\n21\n4\n40\n0.5\n41\n0\n42\n1.5707963267948966\n",
  )
  match d.expand(0.001).placed[0].flat {
    Outline(points~, closed~) => {
      assert_false(closed)
      assert_true(points[0].distance(Vec2::new(10.0, 24.0)) < 1.0e-10)
      assert_true(
        points[points.length() - 1].distance(Vec2::new(8.0, 20.0)) < 1.0e-10,
      )
    }
    _ => fail("expected ellipse arc")
  }
}

///|
test "LWPOLYLINE orphan Y and unfinished X are diagnosed" {
  for
    body in [
      "0\nLWPOLYLINE\n10\n0\n20\n0\n20\n9\n10\n2\n20\n0\n", "0\nLWPOLYLINE\n10\n0\n20\n0\n10\n2\n20\n0\n10\n9\n",
    ] {
    let d = delivery_drawing(body)
    assert_true(d.entities().warnings.any(w => w.contains("顶点")))
    assert_false(d.expand(0.05).placed.any(p => p.flat is Outline(..)))
  }
}

///|
test "LWPOLYLINE declared vertex mismatch is visible without discarding valid coordinates" {
  let d = delivery_drawing("0\nLWPOLYLINE\n90\n3\n10\n0\n20\n0\n10\n2\n20\n0\n")
  assert_true(d.entities().warnings.any(w => w.contains("顶点数")))
  assert_true(d.entities().entities[0].is_decoded())
}

///|
test "POLYLINE fitted and spatial variants are outside the ordinary 2D contract" {
  for flags in [2, 4, 8, 16, 64] {
    let d = delivery_drawing(
      "0\nPOLYLINE\n70\n\{flags}\n0\nVERTEX\n10\n0\n20\n0\n0\nVERTEX\n10\n2\n20\n0\n0\nSEQEND\n",
    )
    assert_false(d.entities().entities[0].is_decoded())
    assert_false(d.expand(0.05).placed.any(p => p.flat is Outline(..)))
    assert_true(
      d.check({ tol: 0.05, min_gap: 0.0, }).to_text().contains("POLYLINE"),
    )
  }
}

///|
test "POLYLINE missing SEQEND retains valid vertices and reports recovery" {
  let d = delivery_drawing(
    "0\nPOLYLINE\n70\n0\n0\nVERTEX\n10\n0\n20\n0\n0\nVERTEX\n10\n2\n20\n0\n",
  )
  assert_true(d.entities().entities[0].is_decoded())
  assert_true(d.entities().warnings.any(w => w.contains("SEQEND")))
}

///|
test "POLYLINE spatial vertex flags cannot masquerade as ordinary 2D vertices" {
  let d = delivery_drawing(
    "0\nPOLYLINE\n70\n0\n0\nVERTEX\n70\n32\n10\n0\n20\n0\n" +
    "0\nVERTEX\n10\n2\n20\n0\n0\nSEQEND\n",
  )
  assert_false(d.entities().entities[0].is_decoded())
  assert_true(
    d.entities().warnings.any(w => w.contains("顶点") && w.contains("标志")),
  )
}

///|
test "INSERT nesting accepts eight levels and diagnoses the ninth" {
  for depth in [8, 9] {
    let text = StringBuilder()
    text.write_string("0\nSECTION\n2\nBLOCKS\n")
    for i = 0; i < depth; i = i + 1 {
      text.write_string("0\nBLOCK\n2\nB\{i}\n10\n0\n20\n0\n")
      if i + 1 < depth {
        text.write_string("0\nINSERT\n2\nB\{i + 1}\n10\n0\n20\n0\n")
      } else {
        text.write_string("0\nLINE\n10\n0\n20\n0\n11\n1\n21\n0\n")
      }
      text.write_string("0\nENDBLK\n")
    }
    text.write_string(
      "0\nENDSEC\n0\nSECTION\n2\nENTITIES\n0\nINSERT\n2\nB0\n10\n0\n20\n0\n0\nENDSEC\n0\nEOF\n",
    )
    let exp = drawing_utf8(text.to_string()).expand(0.05)
    if depth == 8 {
      assert_eq(exp.placed.length(), 1)
      assert_eq(exp.warnings.length(), 0)
    } else {
      assert_eq(exp.placed.length(), 0)
      assert_true(exp.warnings.any(w => w.contains("超过 8 层")))
    }
  }
}
