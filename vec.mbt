// 二维 / 三维向量与轴对齐包围盒。
//
// DXF 是**三维**格式——每个点都带 z，实体还有挤出方向和厚度拉伸。
// 但绝大多数图纸是平面图（实体都躺在 z=0 上），加工也是二维的。
// 所以两种向量都要有：解析阶段用得上三维的，几何求值和加工检查基本只用二维的。
//
// 这个文件里有一个不显眼但贯穿全项目的约定：**容差是参数，不是常量**。
//
// 图纸的单位跨度极大——`circle.dxf` 的 `$INSUNITS` 是 6（米），而机加工图纸
// 常常是毫米甚至微米。写死一个「1e-6 就算同一个点」，在公里级的图纸上会把
// 本来分开的点焊在一起，在微米级的图纸上又会把同一个点当成两个。
// 所以凡是需要判「相等 / 重合 / 闭合」的地方，容差都由调用方传进来。

// ── 二维向量 ────────────────────────────────────────────────────────────

///|
/// 平面上的一个点 / 向量。
pub(all) struct Vec2 {
  x : Double
  y : Double
}

///|
pub fn Vec2::new(x : Double, y : Double) -> Vec2 {
  { x, y }
}

///|
pub fn Vec2::zero() -> Vec2 {
  { x: 0.0, y: 0.0 }
}

///|
/// `self - other`。
pub fn Vec2::sub(self : Vec2, other : Vec2) -> Vec2 {
  { x: self.x - other.x, y: self.y - other.y }
}

///|
pub fn Vec2::add(self : Vec2, other : Vec2) -> Vec2 {
  { x: self.x + other.x, y: self.y + other.y }
}

///|
pub fn Vec2::scale(self : Vec2, k : Double) -> Vec2 {
  { x: self.x * k, y: self.y * k }
}

///|
/// 点乘。
pub fn Vec2::dot(self : Vec2, other : Vec2) -> Double {
  self.x * other.x + self.y * other.y
}

///|
/// 二维叉乘，返回一个**标量**（三维叉乘的结果是向量，二维退化成标量）。
///
/// 符号有几何含义：正表示 `other` 在 `self` 的逆时针一侧，
/// 负表示顺时针一侧，零表示共线。判断点在直线的哪一侧、判断多边形绕向，
/// 用的都是它。
pub fn Vec2::cross(self : Vec2, other : Vec2) -> Double {
  self.x * other.y - self.y * other.x
}

///|
/// 模长。
pub fn Vec2::length(self : Vec2) -> Double {
  (self.x * self.x + self.y * self.y).sqrt()
}

///|
/// 单位化。零向量原样返回——退化几何（长度为零的线段）在真实图纸里存在，
/// 不该让它把整个流程搞崩，交给检查环节去报。
pub fn Vec2::normalize(self : Vec2) -> Vec2 {
  let len = self.length()
  if len == 0.0 {
    self
  } else {
    { x: self.x / len, y: self.y / len }
  }
}

///|
/// 两点距离。
pub fn Vec2::distance(self : Vec2, other : Vec2) -> Double {
  self.sub(other).length()
}

///|
/// 逆时针旋转 rad 弧度。
pub fn Vec2::rotate(self : Vec2, rad : Double) -> Vec2 {
  let c = @math.cos(rad)
  let s = @math.sin(rad)
  { x: self.x * c - self.y * s, y: self.x * s + self.y * c }
}

///|
/// 极角，返回弧度，范围 `(-π, π]`。
pub fn Vec2::angle(self : Vec2) -> Double {
  @math.atan2(self.y, self.x)
}

///|
/// 逆时针转 90 度的法向量。
///
/// 算「点在直线的哪一侧」和「线段往哪边偏移」时用。
pub fn Vec2::perp(self : Vec2) -> Vec2 {
  { x: -self.y, y: self.x }
}

///|
/// 按容差判断是不是同一个点。
pub fn Vec2::approx_eq(self : Vec2, other : Vec2, tol : Double) -> Bool {
  self.distance(other) <= tol
}

// ── 三维向量 ────────────────────────────────────────────────────────────

///|
/// 三维空间里的一个点 / 向量。
///
/// DXF 的坐标组码都是三个一起出现（`10/20/30` 是 x/y/z），
/// 所以解析出来的点一律是三维的，哪怕 z 恰好是 0。
pub(all) struct Vec3 {
  x : Double
  y : Double
  z : Double
}

///|
pub fn Vec3::new(x : Double, y : Double, z : Double) -> Vec3 {
  { x, y, z }
}

///|
pub fn Vec3::zero() -> Vec3 {
  { x: 0.0, y: 0.0, z: 0.0 }
}

///|
/// 丢掉 z，投影到平面上。加工检查是二维的，用这个把三维点降下来。
pub fn Vec3::xy(self : Vec3) -> Vec2 {
  { x: self.x, y: self.y }
}

///|
pub fn Vec3::sub(self : Vec3, other : Vec3) -> Vec3 {
  { x: self.x - other.x, y: self.y - other.y, z: self.z - other.z }
}

///|
pub fn Vec3::cross(self : Vec3, other : Vec3) -> Vec3 {
  {
    x: self.y * other.z - self.z * other.y,
    y: self.z * other.x - self.x * other.z,
    z: self.x * other.y - self.y * other.x,
  }
}

///|
pub fn Vec3::dot(self : Vec3, other : Vec3) -> Double {
  self.x * other.x + self.y * other.y + self.z * other.z
}

///|
pub fn Vec3::length(self : Vec3) -> Double {
  (self.x * self.x + self.y * self.y + self.z * self.z).sqrt()
}

///|
/// 单位化。零向量原样返回，理由和 `Vec2::normalize` 一样。
pub fn Vec3::normalize(self : Vec3) -> Vec3 {
  let len = self.length()
  if len == 0.0 {
    self
  } else {
    { x: self.x / len, y: self.y / len, z: self.z / len }
  }
}

///|
/// 按容差判断是不是零向量。
pub fn Vec3::is_zero(self : Vec3, tol : Double) -> Bool {
  self.length() <= tol
}

// ── 包围盒 ──────────────────────────────────────────────────────────────

///|
/// 平面轴对齐包围盒。
///
/// **空盒用 min > max 表示**——`Aabb2::empty()` 给的是 `min = +∞, max = -∞`，
/// 这样第一个点一并进来就自然变成「只包含那一个点」的盒子，
/// 不用额外记「有没有点」的状态。
pub(all) struct Aabb2 {
  min : Vec2
  max : Vec2
}

///|
/// 空盒：min 是正无穷、max 是负无穷。往里并第一个点就会得到正确的盒子。
pub fn Aabb2::empty() -> Aabb2 {
  {
    min: { x: 1.0e308, y: 1.0e308 },
    max: { x: -1.0e308, y: -1.0e308 },
  }
}

///|
/// 并进一个点。
pub fn Aabb2::expand(self : Aabb2, p : Vec2) -> Aabb2 {
  {
    min: { x: self.min.x.min(p.x), y: self.min.y.min(p.y) },
    max: { x: self.max.x.max(p.x), y: self.max.y.max(p.y) },
  }
}

///|
/// 并进另一个盒子。
pub fn Aabb2::union(self : Aabb2, other : Aabb2) -> Aabb2 {
  {
    min: { x: self.min.x.min(other.min.x), y: self.min.y.min(other.min.y) },
    max: { x: self.max.x.max(other.max.x), y: self.max.y.max(other.max.y) },
  }
}

///|
/// 是不是空盒（一个点都没并进来过）。
pub fn Aabb2::is_empty(self : Aabb2) -> Bool {
  self.min.x > self.max.x || self.min.y > self.max.y
}

///|
/// 宽高。空盒返回零。
pub fn Aabb2::size(self : Aabb2) -> Vec2 {
  if self.is_empty() {
    Vec2::zero()
  } else {
    self.max.sub(self.min)
  }
}

///|
/// 中心。空盒返回原点。
pub fn Aabb2::center(self : Aabb2) -> Vec2 {
  if self.is_empty() {
    Vec2::zero()
  } else {
    self.min.add(self.max).scale(0.5)
  }
}

///|
/// 按容差判断点是否落在盒子里。
pub fn Aabb2::contains(self : Aabb2, p : Vec2, tol : Double) -> Bool {
  p.x >= self.min.x - tol &&
  p.x <= self.max.x + tol &&
  p.y >= self.min.y - tol &&
  p.y <= self.max.y + tol
}

///|
/// 两个盒子是否相交（按容差）。
///
/// 加工检查里用来做**线段求交的粗筛**：两个包围盒不相交，它们里面的
/// 线段一定不相交，可以整块跳过。这是把 O(n²) 降到能跑的关键。
pub fn Aabb2::intersects(self : Aabb2, other : Aabb2, tol : Double) -> Bool {
  if self.is_empty() || other.is_empty() {
    return false
  }
  self.min.x <= other.max.x + tol &&
  other.min.x <= self.max.x + tol &&
  self.min.y <= other.max.y + tol &&
  other.min.y <= self.max.y + tol
}

///|
/// 三维轴对齐包围盒。约定和 `Aabb2` 完全一样。
pub(all) struct Aabb3 {
  min : Vec3
  max : Vec3
}

///|
pub fn Aabb3::empty() -> Aabb3 {
  {
    min: { x: 1.0e308, y: 1.0e308, z: 1.0e308 },
    max: { x: -1.0e308, y: -1.0e308, z: -1.0e308 },
  }
}

///|
pub fn Aabb3::expand(self : Aabb3, p : Vec3) -> Aabb3 {
  {
    min: {
      x: self.min.x.min(p.x),
      y: self.min.y.min(p.y),
      z: self.min.z.min(p.z),
    },
    max: {
      x: self.max.x.max(p.x),
      y: self.max.y.max(p.y),
      z: self.max.z.max(p.z),
    },
  }
}

///|
pub fn Aabb3::is_empty(self : Aabb3) -> Bool {
  self.min.x > self.max.x || self.min.y > self.max.y || self.min.z > self.max.z
}

///|
/// 三个方向的尺寸。空盒返回零向量。
pub fn Aabb3::size(self : Aabb3) -> Vec3 {
  if self.is_empty() {
    Vec3::zero()
  } else {
    self.max.sub(self.min)
  }
}

// ── 角度 ────────────────────────────────────────────────────────────────

///|
/// 把角度（弧度）归一到 `[0, 2π)`。
///
/// DXF 里圆弧的起止角是**度数**、逆时针、而且可以大于 360
/// （`370` 度这种写法真实存在），所以算圆弧跨度之前必须归一到同一圈里，
/// 否则 `370 - 10` 会算成 360 度而不是 0 度。
pub fn normalize_angle(rad : Double) -> Double {
  let two_pi = 6.283185307179586
  let mut a = rad % two_pi
  if a < 0.0 {
    a = a + two_pi
  }
  a
}

///|
/// 从 `from` 逆时针转到 `to` 跨过的角度，结果落在 `[0, 2π)`。
pub fn angle_span(from : Double, to : Double) -> Double {
  normalize_angle(to - from)
}
