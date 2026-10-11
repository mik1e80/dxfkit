// 白盒测试：几何离散（bulge 换算、圆弧 / 圆 / 多段线的折线化）。
//
// 容差在这里的含义统一是**弦高**：弧的中点到弦的最大距离。
//
// 最重要的一条是方向约定：**bulge > 0 = 从起点到终点逆时针**——
// A(0,0)→B(1,0)、bulge 1 的半圆从弦**下方**穿过。这个符号错了
// 所有带圆弧的轮廓都会镜像，所以专门拿测试钉死。

///|
test "bulge 转圆弧：四分之一圆" {
  // b = tan(90° / 4) = tan(22.5°)
  let arc = arc_from_bulge(
    Vec2::new(0.0, 0.0),
    Vec2::new(1.0, 0.0),
    0.41421356237309503,
  )
  // 圆心在弦的逆时针一侧：(0.5, 0.5)
  assert_true((arc.center.x - 0.5).abs() < 1.0e-9)
  assert_true((arc.center.y - 0.5).abs() < 1.0e-9)
  assert_true((arc.radius - 0.7071067811865476).abs() < 1.0e-9)
  // 逆时针弧跨 90°
  assert_true(
    (angle_span(arc.start_angle, arc.end_angle) - 1.5707963267948966).abs() < 1.0e-9,
  )
}

///|
test "bulge 1 是半圆，从弦下方过" {
  // 方向约定：b > 0 从起点到终点逆时针。圆心落在弦中点，
  // 逆时针 180° → 270° → 360°，弧走弦的下方
  let arc = arc_from_bulge(Vec2::new(0.0, 0.0), Vec2::new(1.0, 0.0), 1.0)
  assert_true((arc.center.x - 0.5).abs() < 1.0e-9)
  assert_true(arc.center.y.abs() < 1.0e-9)
  assert_true((arc.radius - 0.5).abs() < 1.0e-9)
  let pts = arc_points(arc.center, arc.radius, arc.start_angle, arc.end_angle, 0.01)
  let mut min_y = 0.0
  let mut max_y = 0.0
  for p in pts {
    min_y = min_y.min(p.y)
    max_y = max_y.max(p.y)
  }
  // 最低点 (0.5, -0.5) 被采到；而且不该有任何点在弦上方（没镜像）
  assert_true((min_y + 0.5).abs() < 1.0e-9)
  assert_true(max_y < 1.0e-9)
}

///|
test "负 bulge 镜像到弦的另一侧" {
  let arc = arc_from_bulge(
    Vec2::new(0.0, 0.0),
    Vec2::new(1.0, 0.0),
    -0.41421356237309503,
  )
  // 圆心镜像到 (0.5, -0.5)；依然被描述成逆时针弧（起止角对调过）
  assert_true((arc.center.x - 0.5).abs() < 1.0e-9)
  assert_true((arc.center.y + 0.5).abs() < 1.0e-9)
  let pts = arc_points(arc.center, arc.radius, arc.start_angle, arc.end_angle, 0.001)
  let mut max_y = -1.0
  for p in pts {
    max_y = max_y.max(p.y)
  }
  // 弧在弦上方鼓过，最高点 ≈ -0.5 + √2/2
  assert_true(max_y > 0.206)
  assert_true(max_y <= 0.2071067811865476 + 1.0e-9)
}

///|
test "圆的离散：弦高不超过容差" {
  // r = 10、容差 0.1：每段跨角满足 10·(1 − cos(Δ/2)) ≤ 0.1，
  // 解出来 2π 需要 23 段
  let pts = circle_points(Vec2::zero(), 10.0, 0.1)
  assert_eq(pts.length(), 23)
  // 相邻两点的弦：中点到圆心的距离是 r·cos(Δ/2)，弦高 = r − 它
  let mut i = 0
  while i < pts.length() {
    let a = pts[i]
    let b = pts[(i + 1) % pts.length()]
    let mid = a.add(b).scale(0.5)
    let sagitta = 10.0 - mid.length()
    assert_true(sagitta <= 0.1 + 1.0e-9)
    assert_true(sagitta > 0.0)
    i = i + 1
  }
}

///|
test "圆弧离散含首尾点" {
  let pts = arc_points(Vec2::zero(), 2.0, 0.0, 1.5707963267948966, 0.01)
  // 起点就是 0° 处的点，精确
  assert_true(pts[0].x == 2.0 && pts[0].y == 0.0)
  let last = pts[pts.length() - 1]
  assert_true(last.x.abs() < 1.0e-9)
  assert_true((last.y - 2.0).abs() < 1.0e-9)
  assert_true(pts.length() > 2)
}

///|
test "退化半径：圆和弧只给圆心一个点" {
  let c = circle_points(Vec2::new(1.0, 2.0), 0.0, 0.01)
  assert_eq(c.length(), 1)
  assert_true(c[0].x == 1.0 && c[0].y == 2.0)
  // 负半径按 |r| 出形状——符号问题归检查环节
  assert_true(circle_points(Vec2::zero(), -5.0, 1.0).length() > 1)
  assert_eq(arc_points(Vec2::zero(), 0.0, 0.0, 1.0, 0.01).length(), 1)
}

///|
test "多段线离散：闭合不重复首点" {
  // 3-4-5 直角三角形，bulge 全 0
  let verts : Array[PolyVertex] = [
    { at: Vec3::new(0.0, 0.0, 0.0), bulge: 0.0 },
    { at: Vec3::new(3.0, 0.0, 0.0), bulge: 0.0 },
    { at: Vec3::new(3.0, 4.0, 0.0), bulge: 0.0 },
  ]
  let pts = polyline_points(verts, true, 0.01)
  assert_eq(pts.length(), 3)
  assert_true(pts[2].x == 3.0 && pts[2].y == 4.0)
  // 放开的收尾点就是最后那个顶点，也不多不少
  let open = polyline_points(verts, false, 0.01)
  assert_eq(open.length(), 3)
  assert_true(open[2].x == 3.0 && open[2].y == 4.0)
}

///|
test "多段线离散：bulge 段换成弧点" {
  let verts : Array[PolyVertex] = [
    { at: Vec3::new(0.0, 0.0, 0.0), bulge: 1.0 },
    { at: Vec3::new(1.0, 0.0, 0.0), bulge: 0.0 },
  ]
  let pts = polyline_points(verts, false, 0.01)
  // 首点是顶点本身，精确；末点是算出来的（sin(2π) ≈ 1e-16，不精确为 0）
  assert_true(pts[0].x == 0.0 && pts[0].y == 0.0)
  let last = pts[pts.length() - 1]
  assert_true((last.x - 1.0).abs() < 1.0e-9 && last.y.abs() < 1.0e-9)
  // 半圆从下方过：最低点 -0.5 被采到
  let mut min_y = 0.0
  for p in pts {
    min_y = min_y.min(p.y)
  }
  assert_true(min_y < -0.4)
}

///|
test "零长弦上的 bulge 当直线" {
  // 两个重合的顶点 + bulge：没有几何意义，不出点也不炸
  let verts : Array[PolyVertex] = [
    { at: Vec3::new(2.0, 2.0, 0.0), bulge: 1.0 },
    { at: Vec3::new(2.0, 2.0, 0.0), bulge: 0.0 },
  ]
  let pts = polyline_points(verts, false, 0.01)
  assert_eq(pts.length(), 1)
}
