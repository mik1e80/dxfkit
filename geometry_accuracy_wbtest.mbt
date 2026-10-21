// Analytic reference values below do not call production geometry evaluators.
// Every entity is read from DXF text before exercising the public geometry API.

///|
fn accuracy_near(
  actual : Double,
  expected : Double,
  eps : Double,
) -> Unit raise {
  assert_true(
    !actual.is_nan() && (actual - expected).abs() <= eps,
    msg="expected \{expected} ± \{eps}, actual \{actual}",
  )
}

///|
fn accuracy_point(actual : Vec2, x : Double, y : Double) -> Unit raise {
  accuracy_near(actual.x, x, 1.0e-9)
  accuracy_near(actual.y, y, 1.0e-9)
}

///|
fn accuracy_entity(body : String) -> Entity raise {
  let drawing = delivery_drawing(body)
  assert_eq(drawing.warnings.length(), 0)
  let result = drawing.entities()
  assert_eq(result.warnings.length(), 0)
  assert_eq(result.entities.length(), 1)
  result.entities[0]
}

///|
fn accuracy_outline(geom : Geometry, tol : Double) -> (Array[Vec2], Bool) raise {
  match geom.flatten_checked(tol) {
    Ok(Outline(points~, closed~)) => {
      assert_true(points.length() >= 2)
      (points, closed)
    }
    Ok(_) => fail("expected an actual outline")
    Err(reason) => fail(reason)
  }
}

///|
fn accuracy_box(
  box : Aabb2,
  x0 : Double,
  y0 : Double,
  x1 : Double,
  y1 : Double,
) -> Unit raise {
  accuracy_point(box.min, x0, y0)
  accuracy_point(box.max, x1, y1)
  accuracy_point(box.size(), x1 - x0, y1 - y0)
}

///|
// Independent projection formula; do not use dist_to_segment or curve helpers.
fn accuracy_distance(p : Vec2, points : Array[Vec2], closed : Bool) -> Double {
  let count = if closed { points.length() } else { points.length() - 1 }
  let mut best = 1.0e300
  for i = 0; i < count; i = i + 1 {
    let a = points[i]
    let b = points[(i + 1) % points.length()]
    let dx = b.x - a.x
    let dy = b.y - a.y
    let len2 = dx * dx + dy * dy
    let t = if len2 == 0.0 {
      0.0
    } else {
      (((p.x - a.x) * dx + (p.y - a.y) * dy) / len2).max(0.0).min(1.0)
    }
    let ex = p.x - a.x - t * dx
    let ey = p.y - a.y - t * dy
    best = best.min((ex * ex + ey * ey).sqrt())
  }
  best
}

///|
fn accuracy_sample_error(
  points : Array[Vec2],
  closed : Bool,
  reference : (Double) -> Vec2,
  tol : Double,
) -> Unit raise {
  let mut max_error = 0.0
  let samples : Array[Vec2] = []
  for i = 0; i <= 2048; i = i + 1 {
    let expected = reference(i.to_double() / 2048.0)
    samples.push(expected)
    max_error = max_error.max(
      accuracy_distance(expected, points, closed),
    )
  }
  accuracy_near(max_error, 0.0, tol + 1.0e-9)
  // A close reference-to-output distance alone can miss extraneous excursions.
  for actual in points {
    accuracy_near(accuracy_distance(actual, samples, false), 0.0, tol + 1.0e-9)
  }
}

///|
test "accuracy LINE decoded XYZ, XY endpoints, length and bounds" {
  let e = accuracy_entity(
    "0\nLINE\n10\n-3\n20\n2\n30\n7\n11\n1\n21\n5\n31\n-2\n",
  )
  match e.geom {
    Line(start~, end~) => {
      accuracy_near(start.z, 7.0, 0.0)
      accuracy_near(end.z, -2.0, 0.0)
    }
    _ => fail("expected LINE")
  }
  let (points, closed) = accuracy_outline(e.geom, 0.001)
  assert_false(closed)
  accuracy_point(points[0], -3.0, 2.0)
  accuracy_point(points[points.length() - 1], 1.0, 5.0)
  accuracy_near(points[0].distance(points[1]), 5.0, 1.0e-12)
  accuracy_box(e.bounds().unwrap(), -3.0, 2.0, 1.0, 5.0)
}

///|
test "accuracy CIRCLE translated radius, diameter and sagitta" {
  let e = accuracy_entity("0\nCIRCLE\n10\n10\n20\n-4\n40\n3\n")
  let (points, closed) = accuracy_outline(e.geom, 0.002)
  assert_true(closed)
  accuracy_box(e.bounds().unwrap(), 7.0, -7.0, 13.0, -1.0)
  for i = 0; i < points.length(); i = i + 1 {
    accuracy_near(points[i].distance(Vec2::new(10.0, -4.0)), 3.0, 1.0e-10)
    let mid = points[i].add(points[(i + 1) % points.length()]).scale(0.5)
    let sagitta = 3.0 - mid.distance(Vec2::new(10.0, -4.0))
    assert_true(sagitta >= -1.0e-10 && sagitta <= 0.002 + 1.0e-10)
  }
}

///|
test "accuracy ARC crossing zero degrees has correct endpoints and quadrant bounds" {
  let e = accuracy_entity("0\nARC\n10\n-2\n20\n3\n40\n4\n50\n300\n51\n60\n")
  let (points, closed) = accuracy_outline(e.geom, 0.002)
  assert_false(closed)
  let h = 2.0 * 3.0.sqrt()
  for p in points {
    accuracy_near(p.distance(Vec2::new(-2.0, 3.0)), 4.0, 1.0e-10)
    assert_true(p.x >= -1.0e-9 && p.x <= 2.0 + 1.0e-9)
  }
  accuracy_point(points[0], 0.0, 3.0 - h)
  accuracy_point(points[points.length() - 1], 0.0, 3.0 + h)
  accuracy_box(e.bounds().unwrap(), 0.0, 3.0 - h, 2.0, 3.0 + h)
  accuracy_sample_error(
    points,
    false,
    t => {
      let angle = (300.0 + 120.0 * t) * 3.141592653589793 / 180.0
      Vec2::new(-2.0 + 4.0 * @math.cos(angle), 3.0 + 4.0 * @math.sin(angle))
    },
    0.002,
  )
}

///|
test "accuracy ELLIPSE rotated axes, exact bounds and analytic curve error" {
  let e = accuracy_entity("0\nELLIPSE\n10\n10\n20\n20\n11\n3\n21\n4\n40\n0.5\n")
  let (points, closed) = accuracy_outline(e.geom, 0.002)
  assert_true(closed)
  accuracy_point(points[0], 13.0, 24.0)
  accuracy_box(
    e.bounds().unwrap(),
    10.0 - 13.0.sqrt(),
    20.0 - 18.25.sqrt(),
    10.0 + 13.0.sqrt(),
    20.0 + 18.25.sqrt(),
  )
  for p in points {
    let x = p.x - 10.0
    let y = p.y - 20.0
    let u = (3.0 * x + 4.0 * y) / 25.0
    let v = (-4.0 * x + 3.0 * y) / 12.5
    accuracy_near(u * u + v * v, 1.0, 1.0e-10)
  }
  accuracy_sample_error(
    points,
    true,
    t => {
      let a = t * 6.283185307179586
      Vec2::new(
        10.0 + 3.0 * @math.cos(a) - 2.0 * @math.sin(a),
        20.0 + 4.0 * @math.cos(a) + 1.5 * @math.sin(a),
      )
    },
    0.002,
  )
}

///|
test "accuracy LWPOLYLINE negative bulge preserves side, joins and dimensions" {
  let e = accuracy_entity(
    "0\nLWPOLYLINE\n90\n3\n70\n0\n10\n2\n20\n3\n42\n-1\n10\n6\n20\n3\n10\n6\n20\n0\n",
  )
  let (points, closed) = accuracy_outline(e.geom, 0.002)
  assert_false(closed)
  accuracy_point(points[0], 2.0, 3.0)
  accuracy_point(points[points.length() - 2], 6.0, 3.0)
  accuracy_point(points[points.length() - 1], 6.0, 0.0)
  accuracy_box(e.bounds().unwrap(), 2.0, 0.0, 6.0, 5.0)
  let arc_only : Array[Vec2] = []
  for i = 0; i + 1 < points.length(); i = i + 1 {
    arc_only.push(points[i])
    accuracy_near(points[i].distance(Vec2::new(4.0, 3.0)), 2.0, 1.0e-10)
    assert_true(points[i].y >= 3.0 - 1.0e-10)
  }
  accuracy_sample_error(
    arc_only,
    false,
    t => {
      let a = 3.141592653589793 * (1.0 - t)
      Vec2::new(4.0 + 2.0 * @math.cos(a), 3.0 + 2.0 * @math.sin(a))
    },
    0.002,
  )
}

///|
test "accuracy POLYLINE ordinary 2D rectangle has exact vertices area and perimeter" {
  let e = accuracy_entity(
    "0\nPOLYLINE\n70\n1\n" +
    "0\nVERTEX\n10\n-2\n20\n-1\n0\nVERTEX\n10\n4\n20\n-1\n" +
    "0\nVERTEX\n10\n4\n20\n3\n0\nVERTEX\n10\n-2\n20\n3\n0\nSEQEND\n",
  )
  let (points, closed) = accuracy_outline(e.geom, 0.002)
  assert_true(closed)
  assert_eq(points.length(), 4)
  accuracy_point(points[0], -2.0, -1.0)
  accuracy_point(points[1], 4.0, -1.0)
  accuracy_point(points[2], 4.0, 3.0)
  accuracy_point(points[3], -2.0, 3.0)
  accuracy_box(e.bounds().unwrap(), -2.0, -1.0, 4.0, 3.0)
  let mut twice_area = 0.0
  let mut perimeter = 0.0
  for i = 0; i < 4; i = i + 1 {
    let a = points[i]
    let b = points[(i + 1) % 4]
    twice_area += a.x * b.y - b.x * a.y
    perimeter += a.distance(b)
  }
  accuracy_near(twice_area / 2.0, 24.0, 1.0e-12)
  accuracy_near(perimeter, 20.0, 1.0e-12)
}

///|
test "accuracy rational SPLINE quarter circle matches analytic radius and sampled arc" {
  let e = accuracy_entity(
    "0\nSPLINE\n71\n2\n72\n6\n73\n3\n" +
    "40\n0\n40\n0\n40\n0\n40\n1\n40\n1\n40\n1\n" +
    "41\n1\n41\n0.7071067811865476\n41\n1\n" +
    "10\n7\n20\n7\n10\n7\n20\n9\n10\n5\n20\n9\n",
  )
  let (points, closed) = accuracy_outline(e.geom, 0.002)
  assert_false(closed)
  accuracy_point(points[0], 7.0, 7.0)
  accuracy_point(points[points.length() - 1], 5.0, 9.0)
  accuracy_box(e.bounds().unwrap(), 5.0, 7.0, 7.0, 9.0)
  for p in points {
    accuracy_near(p.distance(Vec2::new(5.0, 7.0)), 2.0, 1.0e-10)
  }
  accuracy_sample_error(
    points,
    false,
    t => {
      let a = t * 1.5707963267948966
      Vec2::new(5.0 + 2.0 * @math.cos(a), 7.0 + 2.0 * @math.sin(a))
    },
    0.002,
  )
}

///|
test "accuracy cubic SPLINE S curve matches independent Bernstein polynomial" {
  let e = accuracy_entity(
    "0\nSPLINE\n71\n3\n" +
    "40\n0\n40\n0\n40\n0\n40\n0\n40\n1\n40\n1\n40\n1\n40\n1\n" +
    "10\n0\n20\n0\n10\n0\n20\n1\n10\n1\n20\n-1\n10\n1\n20\n0\n",
  )
  let (points, closed) = accuracy_outline(e.geom, 0.002)
  assert_false(closed)
  accuracy_point(points[0], 0.0, 0.0)
  accuracy_point(points[points.length() - 1], 1.0, 0.0)
  accuracy_sample_error(
    points,
    false,
    t => {
      Vec2::new(
        3.0 * t * t - 2.0 * t * t * t,
        3.0 * t * (1.0 - t) * (1.0 - 2.0 * t),
      )
    },
    0.002,
  )
  let mut low = 0.0
  let mut high = 0.0
  for p in points {
    low = low.min(p.y)
    high = high.max(p.y)
  }
  accuracy_near(high, 3.0.sqrt() / 6.0, 0.002)
  accuracy_near(low, -3.0.sqrt() / 6.0, 0.002)
}

///|
test "accuracy INSERT base point scale rotation and world tolerance compose" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nBLOCKS\n" +
    "0\nBLOCK\n2\nPART\n10\n1\n20\n2\n" +
    "0\nCIRCLE\n10\n1\n20\n2\n40\n1\n0\nENDBLK\n0\nENDSEC\n" +
    "0\nSECTION\n2\nENTITIES\n0\nINSERT\n2\nPART\n10\n-10\n20\n7\n41\n3\n42\n2\n50\n90\n0\nENDSEC\n0\nEOF\n",
  )
  let exp = d.expand(0.002)
  assert_eq(exp.warnings.length(), 0)
  assert_eq(exp.placed.length(), 1)
  match exp.placed[0].flat {
    Outline(points~, closed~) => {
      assert_true(closed)
      accuracy_point(points[0], -10.0, 10.0)
      for p in points {
        let u = (p.x + 10.0) / 2.0
        let v = (p.y - 7.0) / 3.0
        accuracy_near(u * u + v * v, 1.0, 1.0e-10)
      }
      accuracy_sample_error(
        points,
        true,
        t => {
          let a = t * 6.283185307179586
          Vec2::new(-10.0 - 2.0 * @math.sin(a), 7.0 + 3.0 * @math.cos(a))
        },
        0.002,
      )
    }
    _ => fail("expected transformed circle outline")
  }
}
