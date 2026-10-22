// 白盒测试：向量与包围盒。
//
// 这是整个项目的地基，所以先测它。几何计算的浮点结果不能用 `==` 比，
// 用下面的 `close`（相对容差）。

///|
/// 浮点比较。
///
/// 注意这是**测试用的**辅助函数，用的是固定容差；产品代码里的容差一律由
/// 调用方传参（见 `vec.mbt` 文件头的说明）。
fn close(a : Double, b : Double) -> Bool {
  (a - b).abs() < 1.0e-9
}

// ── 二维向量 ────────────────────────────────────────────────────────────

///|
test "加减与缩放" {
  let a = Vec2::new(3.0, 4.0)
  let b = Vec2::new(1.0, 2.0)
  let s = a.sub(b)
  assert_true(close(s.x, 2.0))
  assert_true(close(s.y, 2.0))
  let t = a.add(b)
  assert_true(close(t.x, 4.0))
  assert_true(close(t.y, 6.0))
  let k = a.scale(2.0)
  assert_true(close(k.x, 6.0))
  assert_true(close(k.y, 8.0))
}

///|
test "点乘与叉乘" {
  let a = Vec2::new(1.0, 0.0)
  let b = Vec2::new(0.0, 1.0)
  // 垂直向量点乘为零
  assert_true(close(a.dot(b), 0.0))
  // 单位向量点乘自己为 1
  assert_true(close(a.dot(a), 1.0))
  // 叉乘的符号表示方向：b 在 a 的逆时针侧
  assert_true(a.cross(b) > 0.0)
  assert_true(b.cross(a) < 0.0)
  // 共线时为零
  assert_true(close(a.cross(a.scale(3.0)), 0.0))
}

///|
test "模长与单位化" {
  let v = Vec2::new(3.0, 4.0)
  assert_true(close(v.length(), 5.0))
  let n = v.normalize()
  assert_true(close(n.length(), 1.0))
  assert_true(close(n.x, 0.6))
  assert_true(close(n.y, 0.8))
}

///|
test "零向量单位化后还是零向量，不产生 NaN" {
  // 真实图纸里有长度为零的线段（退化几何）。让它算出 NaN 的话，
  // 后面的所有计算都会被污染，而且很难定位到源头
  let z = Vec2::zero().normalize()
  assert_true(close(z.x, 0.0))
  assert_true(close(z.y, 0.0))
  assert_false(z.x.is_nan())
  assert_false(z.y.is_nan())
}

///|
test "旋转保持模长，且 90 度把 x 轴转到 y 轴" {
  let v = Vec2::new(1.0, 0.0)
  let r = v.rotate(3.141592653589793 / 2.0)
  assert_true(close(r.x, 0.0))
  assert_true(close(r.y, 1.0))
  // 转任意角度模长不变
  let w = Vec2::new(3.0, 4.0).rotate(1.234)
  assert_true(close(w.length(), 5.0))
}

///|
test "极角的四个象限" {
  assert_true(close(Vec2::new(1.0, 0.0).angle(), 0.0))
  assert_true(close(Vec2::new(0.0, 1.0).angle(), 3.141592653589793 / 2.0))
  assert_true(close(Vec2::new(-1.0, 0.0).angle(), 3.141592653589793))
  assert_true(close(Vec2::new(0.0, -1.0).angle(), -3.141592653589793 / 2.0))
}

///|
test "法向量是逆时针转 90 度" {
  let p = Vec2::new(1.0, 0.0).perp()
  assert_true(close(p.x, 0.0))
  assert_true(close(p.y, 1.0))
  // 和原向量垂直
  assert_true(close(Vec2::new(3.0, 4.0).dot(Vec2::new(3.0, 4.0).perp()), 0.0))
}

///|
test "按容差判断同一个点：容差两侧各测一次" {
  let a = Vec2::new(0.0, 0.0)
  let b = Vec2::new(0.001, 0.0)
  // 容差足够大时算同一个点
  assert_true(a.approx_eq(b, 0.01))
  // 容差不够时不算
  assert_false(a.approx_eq(b, 0.0001))
}

// ── 包围盒 ──────────────────────────────────────────────────────────────

///|
test "空盒的标志是没有点并进来过" {
  let e = Aabb2::empty()
  assert_true(e.is_empty())
  assert_true(close(e.size().x, 0.0))
}

///|
test "空盒并进一个点后，盒子里就那一个点" {
  // 这是「用 min>max 表示空盒」这个约定的意义所在：
  // 不需要额外记「有没有点」的状态
  let b = Aabb2::empty().expand(Vec2::new(3.0, 4.0))
  assert_false(b.is_empty())
  assert_true(close(b.size().x, 0.0))
  assert_true(close(b.center().x, 3.0))
  assert_true(close(b.center().y, 4.0))
}

///|
test "并进多个点后包围盒包住全部" {
  let mut b = Aabb2::empty()
  for p in [Vec2::new(1.0, 1.0), Vec2::new(-2.0, 5.0), Vec2::new(4.0, -3.0)] {
    b = b.expand(p)
  }
  assert_true(close(b.min.x, -2.0))
  assert_true(close(b.min.y, -3.0))
  assert_true(close(b.max.x, 4.0))
  assert_true(close(b.max.y, 5.0))
  assert_true(close(b.size().x, 6.0))
  assert_true(close(b.size().y, 8.0))
  assert_true(close(b.center().x, 1.0))
  assert_true(close(b.center().y, 1.0))
}

///|
test "盒子相交判断：相离、相接、包含" {
  let a = Aabb2::empty().expand(Vec2::new(0.0, 0.0)).expand(Vec2::new(2.0, 2.0))
  let far = Aabb2::empty()
    .expand(Vec2::new(5.0, 5.0))
    .expand(Vec2::new(6.0, 6.0))
  // 相离
  assert_false(a.intersects(far, 0.0))
  // 边界相接（容差为零时恰好碰上算相交）
  let touch = Aabb2::empty()
    .expand(Vec2::new(2.0, 0.0))
    .expand(Vec2::new(3.0, 1.0))
  assert_true(a.intersects(touch, 0.0))
  // 包含
  let inner = Aabb2::empty()
    .expand(Vec2::new(0.5, 0.5))
    .expand(Vec2::new(1.0, 1.0))
  assert_true(a.intersects(inner, 0.0))
  // 空盒和谁都不相交
  assert_false(Aabb2::empty().intersects(a, 1.0))
}

///|
test "点是否在盒子里" {
  let b = Aabb2::empty().expand(Vec2::new(0.0, 0.0)).expand(Vec2::new(2.0, 2.0))
  assert_true(b.contains(Vec2::new(1.0, 1.0), 0.0))
  assert_true(b.contains(Vec2::new(0.0, 2.0), 0.0))
  assert_false(b.contains(Vec2::new(2.1, 1.0), 0.0))
  // 容差放宽之后就包含了
  assert_true(b.contains(Vec2::new(2.1, 1.0), 0.2))
}

// ── 角度归一化 ──────────────────────────────────────────────────────────

///|
test "角度归一到一圈之内" {
  let pi = 3.141592653589793
  assert_true(close(normalize_angle(0.0), 0.0))
  assert_true(close(normalize_angle(pi), pi))
  // 负数绕回正的一圈
  assert_true(close(normalize_angle(-pi / 2.0), pi * 1.5))
  // 超过一圈绕回来
  assert_true(close(normalize_angle(pi * 2.0 + 1.0), 1.0))
}

///|
test "圆弧角度跨度：DXF 里起止角可以超过一圈" {
  // 这是真实存在的情况：端点角写成 370 度表示绕了一圈又回到 10 度。
  // 直接相减会得到 360 度（一整圈），归一之后才是正确的 0 度
  let deg10 = 10.0 * 3.141592653589793 / 180.0
  let deg370 = 370.0 * 3.141592653589793 / 180.0
  assert_true(close(angle_span(deg10, deg370), 0.0))
  // 反过来从 370 到 10（也就是绕 360 度）
  assert_true(close(angle_span(deg370, deg10), 0.0))
  // 正常的 90 度跨度
  let deg90 = 90.0 * 3.141592653589793 / 180.0
  assert_true(close(angle_span(0.0, deg90), deg90))
}

// ── 三维向量 ────────────────────────────────────────────────────────────

///|
test "三维叉乘的右手定则" {
  let x = Vec3::new(1.0, 0.0, 0.0)
  let y = Vec3::new(0.0, 1.0, 0.0)
  let z = x.cross(y)
  assert_true(close(z.x, 0.0))
  assert_true(close(z.y, 0.0))
  assert_true(close(z.z, 1.0))
  // 反过来是负的
  let nz = y.cross(x)
  assert_true(close(nz.z, -1.0))
}

///|
test "投影到平面：丢掉 z" {
  let v = Vec3::new(3.0, 4.0, 5.0)
  let p = v.xy()
  assert_true(close(p.x, 3.0))
  assert_true(close(p.y, 4.0))
  assert_true(close(p.length(), 5.0))
}

///|
test "三维包围盒" {
  let mut b = Aabb3::empty()
  for
    p in [
      Vec3::new(1.0, 1.0, 1.0),
      Vec3::new(-1.0, 2.0, 0.0),
      Vec3::new(0.0, 0.0, 5.0),
    ] {
    b = b.expand(p)
  }
  assert_false(b.is_empty())
  let s = b.size()
  assert_true(close(s.x, 2.0))
  assert_true(close(s.y, 2.0))
  assert_true(close(s.z, 5.0))
}
