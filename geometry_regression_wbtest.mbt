///|
test "负bulge保持多段线端点顺序" {
  let vertices : Array[PolyVertex] = [
    { at: Vec3::new(0.0, 0.0, 0.0), bulge: -1.0, },
    { at: Vec3::new(2.0, 0.0, 0.0), bulge: 0.0, },
  ]
  let points = polyline_points(vertices, false, 0.01)
  let last = points[points.length() - 1]
  assert_true(last.distance(Vec2::new(2.0, 0.0)) < 1.0e-8)
}

///|
test "S形样条不能退化成直线" {
  let points = spline_points(
    3,
    [0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0],
    [
      Vec3::new(0.0, 0.0, 0.0),
      Vec3::new(0.0, 1.0, 0.0),
      Vec3::new(1.0, -1.0, 0.0),
      Vec3::new(1.0, 0.0, 0.0),
    ],
    [],
    0.01,
  )
  // Bernstein polynomial of this exact cubic, independent of the evaluator.
  accuracy_sample_error(
    points,
    false,
    t => {
      Vec2::new(
        3.0 * t * t - 2.0 * t * t * t,
        3.0 * t * (1.0 - t) * (1.0 - 2.0 * t),
      )
    },
    0.01,
  )
}

///|
fn assert_spline_distance(
  degree : Int,
  knots : Array[Double],
  ctrl : Array[Vec2],
  weights : Array[Double],
  tol : Double,
) -> Unit raise {
  let points3 : Array[Vec3] = []
  for p in ctrl {
    points3.push(Vec3::new(p.x, p.y, 0.0))
  }
  let polyline = match
    spline_points_checked(degree, knots, points3, weights, tol) {
    Ok(points) => points
    Err(msg) => fail(msg)
  }
  assert_true(polyline.length() >= 2)
  let start = knots[degree]
  let end = knots[ctrl.length()]
  for i = 0; i <= 512; i = i + 1 {
    let u = start + (end - start) * i.to_double() / 512.0
    let expected = nurbs_point(degree, knots, ctrl, weights, u)
    let mut distance = 1.0e300
    for j = 0; j + 1 < polyline.length(); j = j + 1 {
      distance = distance.min(
        dist_to_segment(expected, polyline[j], polyline[j + 1]),
      )
    }
    assert_true(distance <= tol * (1.0 + 1.0e-8))
  }
  assert_true(
    polyline[0].distance(nurbs_point(degree, knots, ctrl, weights, start)) <
    1.0e-8,
  )
  assert_true(
    polyline[polyline.length() - 1].distance(
      nurbs_point(degree, knots, ctrl, weights, end),
    ) <
    1.0e-8,
  )
}

///|
test "未钳制样条与独立deBoor求值对照" {
  assert_spline_distance(
    2,
    [0.0, 1.0, 2.0, 3.0, 4.0, 5.0],
    [Vec2::new(0.0, 0.0), Vec2::new(1.0, 2.0), Vec2::new(2.0, 0.0)],
    [],
    0.001,
  )
}

///|
test "非均匀节点和有理权重与deBoor对照" {
  assert_spline_distance(
    3,
    [0.0, 0.0, 0.0, 0.0, 0.1, 0.6, 1.0, 1.0, 1.0, 1.0],
    [
      Vec2::new(0.0, 0.0),
      Vec2::new(1.0, 4.0),
      Vec2::new(2.0, -4.0),
      Vec2::new(3.0, 4.0),
      Vec2::new(4.0, -4.0),
      Vec2::new(5.0, 0.0),
    ],
    [1.0, 2.0, 0.3, 3.0, 0.5, 1.0],
    0.002,
  )
}

///|
test "重节点尖点与deBoor对照" {
  assert_spline_distance(
    3,
    [0.0, 0.0, 0.0, 0.0, 0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 1.0],
    [
      Vec2::new(0.0, 0.0),
      Vec2::new(1.0, 3.0),
      Vec2::new(2.0, 3.0),
      Vec2::new(3.0, 0.0),
      Vec2::new(4.0, -3.0),
      Vec2::new(5.0, -3.0),
      Vec2::new(6.0, 0.0),
    ],
    [],
    0.003,
  )
}

///|
test "高次曲线与deBoor密集采样对照" {
  assert_spline_distance(
    5,
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
    [
      Vec2::new(0.0, 0.0),
      Vec2::new(1.0, 4.0),
      Vec2::new(2.0, -3.0),
      Vec2::new(3.0, 3.0),
      Vec2::new(4.0, -4.0),
      Vec2::new(5.0, 0.0),
    ],
    [],
    0.001,
  )
}

///|
test "无效节点和非正权重返回错误" {
  let ctrl = [
    Vec3::new(0.0, 0.0, 0.0),
    Vec3::new(1.0, 1.0, 0.0),
    Vec3::new(2.0, 0.0, 0.0),
  ]
  assert_true(
    spline_points_checked(
      2,
      [0.0, 0.0, 0.0, 1.0, 1.0, 1.0],
      ctrl,
      [1.0, -1.0, 1.0],
      0.01,
    )
    is Err(_),
  )
  assert_true(
    spline_points_checked(2, [0.0, 0.0, 1.0, 0.0, 1.0, 1.0], ctrl, [], 0.01)
    is Err(_),
  )
  assert_true(
    spline_points_checked(2, [0.0, 0.0, 0.0, 1.0, 1.0, 1.0], ctrl, [], 0.0)
    is Err(_),
  )
}

///|
test "极小容差不能在达到上限后静默通过" {
  assert_true(
    Circle(center=Vec3::zero(), radius=10.0).flatten_checked(1.0e-20) is Err(_),
  )
  assert_true(
    spline_points_checked(
      2,
      [0.0, 0.0, 0.0, 1.0, 1.0, 1.0],
      [
        Vec3::new(0.0, 0.0, 0.0),
        Vec3::new(1.0, 1.0, 0.0),
        Vec3::new(2.0, 0.0, 0.0),
      ],
      [],
      1.0e-20,
    )
    is Err(_),
  )
}

///|
test "负bulge与后续线段连续连接" {
  let points = polyline_points(
    [
      { at: Vec3::new(0.0, 0.0, 0.0), bulge: -1.0, },
      { at: Vec3::new(2.0, 0.0, 0.0), bulge: 0.0, },
      { at: Vec3::new(2.0, -2.0, 0.0), bulge: 0.0, },
    ],
    false,
    0.01,
  )
  assert_true(
    points[points.length() - 2].distance(Vec2::new(2.0, 0.0)) < 1.0e-9,
  )
  assert_true(
    points[points.length() - 1].distance(Vec2::new(2.0, -2.0)) < 1.0e-9,
  )
}
