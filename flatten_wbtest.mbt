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
    (angle_span(arc.start_angle, arc.end_angle) - 1.5707963267948966).abs() <
    1.0e-9,
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
  let pts = arc_points(
    arc.center,
    arc.radius,
    arc.start_angle,
    arc.end_angle,
    0.01,
  )
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
  let pts = arc_points(
    arc.center,
    arc.radius,
    arc.start_angle,
    arc.end_angle,
    0.001,
  )
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
    { at: Vec3::new(0.0, 0.0, 0.0), bulge: 0.0, },
    { at: Vec3::new(3.0, 0.0, 0.0), bulge: 0.0, },
    { at: Vec3::new(3.0, 4.0, 0.0), bulge: 0.0, },
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
    { at: Vec3::new(0.0, 0.0, 0.0), bulge: 1.0, },
    { at: Vec3::new(1.0, 0.0, 0.0), bulge: 0.0, },
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
    { at: Vec3::new(2.0, 2.0, 0.0), bulge: 1.0, },
    { at: Vec3::new(2.0, 2.0, 0.0), bulge: 0.0, },
  ]
  let pts = polyline_points(verts, false, 0.01)
  assert_eq(pts.length(), 1)
}

// ── 椭圆 ────────────────────────────────────────────────────────────────

///|
test "椭圆离散：点都在椭圆上，极值对得上" {
  // 长轴 2、短长轴比 0.5（短轴 1）——整椭圆的盒子是 (-2,-1) 到 (2,1)
  let pts = ellipse_points(
    Vec3::new(0.0, 0.0, 0.0),
    Vec3::new(2.0, 0.0, 0.0),
    0.5,
    0.0,
    6.283185307179586,
    0.01,
  )
  let mut lo_x = 1.0e9
  let mut hi_x = -1.0e9
  let mut lo_y = 1.0e9
  let mut hi_y = -1.0e9
  for p in pts {
    lo_x = lo_x.min(p.x)
    hi_x = hi_x.max(p.x)
    lo_y = lo_y.min(p.y)
    hi_y = hi_y.max(p.y)
    // 点在椭圆上：(x/2)² + y² = 1
    assert_true((p.x / 2.0 * (p.x / 2.0) + p.y * p.y - 1.0).abs() < 1.0e-9)
  }
  // 细分的半分割会把 0° / 90° / 180° / 270° 四个参数点都采到
  assert_true((lo_x + 2.0).abs() < 1.0e-9 && (hi_x - 2.0).abs() < 1.0e-9)
  assert_true((lo_y + 1.0).abs() < 1.0e-9 && (hi_y - 1.0).abs() < 1.0e-9)
}

///|
test "椭圆弧：起点是起始参数处的点" {
  // 圆心 (1,1)、长轴 (3,0)、比例 0.5（短轴 (0, 1.5)），取四分之一
  let pts = ellipse_points(
    Vec3::new(1.0, 1.0, 0.0),
    Vec3::new(3.0, 0.0, 0.0),
    0.5,
    0.0,
    1.5707963267948966,
    0.01,
  )
  // 参数 0 = 圆心 + 长轴
  assert_true((pts[0].x - 4.0).abs() < 1.0e-9)
  assert_true((pts[0].y - 1.0).abs() < 1.0e-9)
  // 参数 π/2 = 圆心 + 短轴 = (1, 2.5)
  let last = pts[pts.length() - 1]
  assert_true((last.x - 1.0).abs() < 1.0e-9)
  assert_true((last.y - 2.5).abs() < 1.0e-9)
}

// ── 样条（NURBS）──────────────────────────────────────────────────────

///|
test "钳制三次 B 样条：过首末控制点，中点可手算" {
  // 节点 [0,0,0,0,1,1,1,1] 是标准钳制写法，两个端点就是首末控制点
  let ctrl : Array[Vec2] = [
    Vec2::new(0.0, 0.0),
    Vec2::new(1.0, 2.0),
    Vec2::new(3.0, 2.0),
    Vec2::new(4.0, 0.0),
  ]
  let knots : Array[Double] = [0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0]
  let w : Array[Double] = [1.0, 1.0, 1.0, 1.0]
  let p0 = nurbs_point(3, knots, ctrl, w, 0.0)
  assert_true(p0.x == 0.0 && p0.y == 0.0)
  let p1 = nurbs_point(3, knots, ctrl, w, 1.0)
  assert_true((p1.x - 4.0).abs() < 1.0e-9 && p1.y.abs() < 1.0e-9)
  // 对称位置的中点 = (P0 + 3P1 + 3P2 + P3) / 8 = (2, 1.5)
  let mid = nurbs_point(3, knots, ctrl, w, 0.5)
  assert_true((mid.x - 2.0).abs() < 1.0e-9)
  assert_true((mid.y - 1.5).abs() < 1.0e-9)
}

///|
test "有理样条：权重把曲线拉向控制点" {
  // 二次、控制点 (0,0) (1,1) (2,0)：非有理中点 (1, 0.5)
  let ctrl : Array[Vec2] = [
    Vec2::new(0.0, 0.0),
    Vec2::new(1.0, 1.0),
    Vec2::new(2.0, 0.0),
  ]
  let knots : Array[Double] = [0.0, 0.0, 0.0, 1.0, 1.0, 1.0]
  let plain = nurbs_point(2, knots, ctrl, [1.0, 1.0, 1.0], 0.5)
  assert_true((plain.x - 1.0).abs() < 1.0e-9)
  assert_true((plain.y - 0.5).abs() < 1.0e-9)
  // 中间权重 2：中点 = (1.5, 1) / 1.5 = (1, 2/3)——被拉向中间控制点
  let weighted = nurbs_point(2, knots, ctrl, [1.0, 2.0, 1.0], 0.5)
  assert_true((weighted.x - 1.0).abs() < 1.0e-9)
  assert_true((weighted.y - 0.6666666666666666).abs() < 1.0e-9)
}

///|
test "数据不自洽的样条退化成单点，不炸" {
  // 控制点比次数还少——求值退回第一个控制点，校验层负责报它
  let pts = spline_points(
    3,
    [0.0, 0.0, 0.0, 0.0, 1.0],
    [Vec3::new(5.0, 5.0, 0.0)],
    [1.0],
    0.1,
  )
  assert_eq(pts.length(), 1)
  assert_true(pts[0].x == 5.0)
}

// ── 伞函数 ──────────────────────────────────────────────────────────────

///|
test "flatten：圆出闭合轮廓、直线出两点" {
  let circle = Circle(center=Vec3::zero(), radius=1.0)
  match circle.flatten(0.05) {
    Outline(points~, closed~) => {
      assert_true(closed)
      assert_true(points.length() > 8)
    }
    _ => fail("圆应该出闭合轮廓")
  }
  let line = Line(start=Vec3::zero(), end=Vec3::new(1.0, 1.0, 0.0))
  match line.flatten(0.05) {
    Outline(points~, closed~) => {
      assert_false(closed)
      assert_eq(points.length(), 2)
    }
    _ => fail("线段应该出两点轮廓")
  }
}

///|
test "flatten：文字出 Label，块引用进 Empty" {
  // 文字没有折线形状，但有位置和原文——预览要靠 Label 画它
  let text = Text(
    at=Vec3::new(1.0, 2.0, 0.0),
    height=2.5,
    value="基准",
    rotation=0.0,
  )
  match text.flatten(0.1) {
    Label(at~, height~, value~) => {
      assert_true(at.x == 1.0 && at.y == 2.0)
      assert_true(height == 2.5)
      assert_true(value == "基准")
    }
    _ => fail("文字应该出 Label")
  }
  // 块引用自己会被展开层消化，离散这层对它没有几何
  let insert = Insert(
    at=Vec3::zero(),
    block="孔位",
    scale=Vec3::new(1.0, 1.0, 1.0),
    rotation=0.0,
  )
  assert_true(insert.flatten(0.1) is Empty)
}
