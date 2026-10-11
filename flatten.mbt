// 几何离散：把曲线摊成折线点列。
//
// 加工检查（闭合、自相交、最小间隙）要跟线段打交道，所以圆弧、样条
// 这些曲线最终都得变成折线。这一层做转换本身，单位还是图纸自己的——
// **容差全由调用方传进来**（全项目的约定）：图纸单位跨度极大，
// 写死「0.01 就算平了」在米制图纸上是 1 厘米、在微米制图纸上是 10 米。
//
// 容差的含义统一是**弦高**：逼近用的弦和真实曲线之间允许的最大偏差
// （圆弧段就是弧的中点到弦的距离）。弦高比「每段多少度」好——
// 同一个容差在小圆上自动多分段、大圆上少分段，误差和尺寸无关。
//
// bulge（多段线顶点上的凸度）→ 圆弧的换算照 `ezdxf` 的 `math/bulge.py`
// 移植（MIT，源头是 Lee Mac 的 Bulge to Arc 公式，已核对源码）。

///|
/// bulge 换算出来的圆弧参数。
pub(all) struct BulgeArc {
  center : Vec2
  /// 半径，恒为正
  radius : Double
  /// 起始角（弧度）
  start_angle : Double
  /// 终止角（弧度）
  end_angle : Double
}

///|
/// bulge → 圆弧参数。
///
/// **返回值一律描述逆时针弧**（和 ezdxf 的 `bulge_to_arc` 同款约定）：
/// bulge 为负时起止角已经对调，从 `start_angle` 逆时针走到 `end_angle`
/// 覆盖的就是这段弧的点集。离散只关心点集，遍历方向在这里就消化掉。
///
/// 两个公式都是从源码核对的：圆心在弦中垂线上，
/// `r = 弦长·(1+b²)/(4b)`（带符号——负 bulge 会自然镜像到另一侧），
/// 方向角 `= 弦方向 + π/2 − 2·atan(b)`。
pub fn arc_from_bulge(a : Vec2, b : Vec2, bulge : Double) -> BulgeArc {
  let chord_angle = b.sub(a).angle()
  let signed_r = a.distance(b) * (1.0 + bulge * bulge) / 4.0 / bulge
  let center_angle = chord_angle + (1.5707963267948966 - @math.atan(bulge) * 2.0)
  let center = Vec2::new(
    a.x + signed_r * @math.cos(center_angle),
    a.y + signed_r * @math.sin(center_angle),
  )
  let radius = signed_r.abs()
  if bulge < 0.0 {
    // 顺时针弧：起止对调，把它描述成同一段点集的逆时针弧
    BulgeArc::{
      center,
      radius,
      start_angle: b.sub(center).angle(),
      end_angle: a.sub(center).angle(),
    }
  } else {
    BulgeArc::{
      center,
      radius,
      start_angle: a.sub(center).angle(),
      end_angle: b.sub(center).angle(),
    }
  }
}

// ── 离散 ────────────────────────────────────────────────────────────────

///|
/// 一段圆弧按弦高容差分几段。至少 1 段。
///
/// 每段跨角 Δ 的弦高是 `r(1 − cos(Δ/2))`，解出 `Δ = 2·acos(1 − tol/r)`。
/// 容差给得离谱小（或者非正）时按最小步长兜底，**4096 段封顶**——
/// 手滑写了个 0 不该把内存炸了。
fn arc_segments(radius : Double, sweep : Double, tol : Double) -> Int {
  let c = 1.0 - tol / radius
  let step = if c >= 1.0 {
    // 容差为零或负：解不出来，按 4096 段一圈的步长兜底
    6.283185307179586 / 4096.0
  } else if c <= -1.0 {
    // 容差比直径还大：一段跨到底
    6.283185307179586
  } else {
    2.0 * @math.acos(c)
  }
  let mut n = (sweep / step).to_int()
  if n.to_double() * step < sweep {
    n = n + 1
  }
  if n < 1 {
    n = 1
  }
  if n > 4096 {
    n = 4096
  }
  n
}

///|
/// 圆弧 → 折线点列（含首尾两点）。
pub fn arc_points(
  center : Vec2,
  radius : Double,
  start_angle : Double,
  end_angle : Double,
  tol : Double,
) -> Array[Vec2] {
  let r = radius.abs()
  if r == 0.0 {
    // 退化的弧（半径 0）就是圆心这一个点——不报错，检查环节去报半径问题
    return [center]
  }
  let sweep = angle_span(start_angle, end_angle)
  let n = arc_segments(r, sweep, tol)
  let points : Array[Vec2] = []
  let mut i = 0
  while i <= n {
    points.push(
      point_on_circle(center, r, start_angle + sweep * i.to_double() / n.to_double()),
    )
    i = i + 1
  }
  points
}

///|
/// 整圆 → 折线点列，从 0°（正 x 方向）起步。
///
/// **不重复首点**——闭合性用外层的 `closed` 标志表达，
/// 和多段线顶点的表示一致。
pub fn circle_points(center : Vec2, radius : Double, tol : Double) -> Array[Vec2] {
  let r = radius.abs()
  if r == 0.0 {
    return [center]
  }
  let n = arc_segments(r, 6.283185307179586, tol)
  let points : Array[Vec2] = []
  let mut i = 0
  while i < n {
    points.push(
      point_on_circle(center, r, 6.283185307179586 * i.to_double() / n.to_double()),
    )
    i = i + 1
  }
  points
}

///|
/// 多段线顶点序列 → 折线点列（bulge 段换成圆弧点）。
///
/// 闭合的不重复首点；放开的一个不少，第一个点还是第一个顶点。
pub fn polyline_points(
  vertices : Array[PolyVertex],
  closed : Bool,
  tol : Double,
) -> Array[Vec2] {
  let points : Array[Vec2] = []
  let n = vertices.length()
  if n == 0 {
    return points
  }
  points.push(vertices[0].at.xy())
  let segments = if closed { n } else { n - 1 }
  let mut i = 0
  while i < segments {
    let a = vertices[i]
    let b = vertices[(i + 1) % n]
    // 闭合多段线的收尾边终点就是首点，已经在了——不出重复的点
    let include_end = !(closed && i == segments - 1)
    append_segment_points(points, a, b, tol, include_end)
    i = i + 1
  }
  points
}

///|
/// 把一段（直线或 bulge 弧）的采样点接到 `points` 上。
///
/// 起点总是跳过（它已经在 `points` 里），终点由 `include_end` 决定。
fn append_segment_points(
  points : Array[Vec2],
  a : PolyVertex,
  b : PolyVertex,
  tol : Double,
  include_end : Bool,
) -> Unit {
  let pa = a.at.xy()
  let pb = b.at.xy()
  if a.bulge == 0.0 {
    if include_end {
      points.push(pb)
    }
    return
  }
  if pa.distance(pb) == 0.0 {
    // 零长弦上的 bulge 没有几何意义，当直线处理（终点和起点重合，不重复出点）
    return
  }
  let arc = arc_from_bulge(pa, pb, a.bulge)
  let pts = arc_points(arc.center, arc.radius, arc.start_angle, arc.end_angle, tol)
  // pts[0] 是段的起点，跳过；收尾点按 include_end 定
  let last = if include_end { pts.length() } else { pts.length() - 1 }
  let mut i = 1
  while i < last {
    points.push(pts[i])
    i = i + 1
  }
}

// ── 参数曲线：自适应细分 ────────────────────────────────────────────────
//
// 椭圆和样条没有像圆弧那样的简单分段公式（椭圆各处的曲率半径不一样、
// 样条连节点都不等距），所以共用一套自适应细分：曲线中点到弦的距离
// 不超过容差就收，超了就一分二。

///|
/// 点到线段（不是直线）的距离。自适应细分的判据用得上。
fn dist_to_segment(p : Vec2, a : Vec2, b : Vec2) -> Double {
  let ab = b.sub(a)
  let len2 = ab.dot(ab)
  if len2 == 0.0 {
    return p.distance(a)
  }
  let mut t = p.sub(a).dot(ab) / len2
  if t < 0.0 {
    t = 0.0
  }
  if t > 1.0 {
    t = 1.0
  }
  p.distance(a.add(ab.scale(t)))
}

///|
/// 参数曲线的自适应细分。`out` 进来时应该已经含有 `t0` 处的点；
/// 本函数只负责把后面的点补上。
///
/// 深度封顶 16 层——病态数据不该把内存炸了。
fn sample_curve(
  eval : (Double) -> Vec2,
  t0 : Double,
  t1 : Double,
  p0 : Vec2,
  p1 : Vec2,
  tol : Double,
  depth : Int,
  out : Array[Vec2],
) -> Unit {
  let tm = 0.5 * (t0 + t1)
  let pm = eval(tm)
  if depth <= 0 || dist_to_segment(pm, p0, p1) <= tol {
    out.push(p1)
    return
  }
  sample_curve(eval, t0, tm, p0, pm, tol, depth - 1, out)
  sample_curve(eval, tm, t1, pm, p1, tol, depth - 1, out)
}

// ── 椭圆 ────────────────────────────────────────────────────────────────

///|
/// 椭圆（弧）的起止参数跨过的角度。
///
/// 起止相同（或反了）按**整椭圆**——和圆弧「起止相等按整圈」同精神。
fn ellipse_span(start_param : Double, end_param : Double) -> Double {
  let mut span = end_param - start_param
  if span < 0.0 {
    span = span + 6.283185307179586
  }
  if span < 1.0e-12 {
    span = 6.283185307179586
  }
  span
}

///|
/// 椭圆（弧）→ 折线点列。
///
/// 点 = 圆心 + 长轴·cos p + 短轴·sin p——p 是**参数**，不是极角，
/// 椭圆上等参数的点和等角度的点不是一回事。取到整椭圆时不重复首点。
pub fn ellipse_points(
  center : Vec3,
  major : Vec3,
  ratio : Double,
  start_param : Double,
  end_param : Double,
  tol : Double,
) -> Array[Vec2] {
  let c = center.xy()
  let m = major.xy()
  let n = Vec2::new(-m.y * ratio, m.x * ratio)
  let eval = fn (p : Double) -> Vec2 {
    Vec2::new(
      c.x + m.x * @math.cos(p) + n.x * @math.sin(p),
      c.y + m.y * @math.cos(p) + n.y * @math.sin(p),
    )
  }
  let span = ellipse_span(start_param, end_param)
  let full = span >= 6.283185307179586 - 1.0e-12
  let t0 = start_param
  let t1 = start_param + span
  let pts : Array[Vec2] = []
  let first = eval(t0)
  pts.push(first)
  sample_curve(eval, t0, t1, first, eval(t1), tol, 16, pts)
  if full {
    // 整椭圆是闭合的——去掉重复的收尾点，和多段线一个约定
    let out : Array[Vec2] = []
    let mut i = 0
    while i < pts.length() - 1 {
      out.push(pts[i])
      i = i + 1
    }
    return out
  }
  pts
}

// ── 样条（NURBS）──────────────────────────────────────────────────────

///|
/// 单个权重的安全取值：数组短了按 1（普通 B 样条）。
fn weight_at(weights : Array[Double], i : Int) -> Double {
  if i < weights.length() {
    weights[i]
  } else {
    1.0
  }
}

///|
/// NURBS 求值：参数 t 处的点（de Boor 算法，NURBS Book 的 A3.1）。
///
/// 有理样条走齐次坐标（w·x, w·y, w）算，最后除回去——权重全 1
/// 就退化成普通 B 样条。
///
/// **数据不自洽时退化成第一个控制点**（控制点不够、节点数对不上）：
/// 不猜形状，也不炸——校验层负责把这种记录报出来。
fn nurbs_point(
  degree : Int,
  knots : Array[Double],
  ctrl : Array[Vec2],
  weights : Array[Double],
  t : Double,
) -> Vec2 {
  let p = degree
  let n_ctrl = ctrl.length()
  if n_ctrl == 0 {
    return Vec2::zero()
  }
  // 节点数必须正好是「控制点数 + 次数 + 1」，不然 de Boor 的下标会错位
  if p < 1 || n_ctrl <= p || knots.length() != n_ctrl + p + 1 {
    return ctrl[0]
  }
  let n = n_ctrl - 1
  let mut u = t
  if u < knots[p] {
    u = knots[p]
  }
  if u > knots[n + 1] {
    u = knots[n + 1]
  }
  // 找 u 落在哪个节点区间（线性扫——控制点几十上百个，够用）
  let mut span = p
  while span < n && u >= knots[span + 1] {
    span = span + 1
  }
  // 齐次坐标：d = (w·x, w·y, w)
  let dx : Array[Double] = []
  let dy : Array[Double] = []
  let dw : Array[Double] = []
  let mut j = 0
  while j <= p {
    let i = span - p + j
    let w = weight_at(weights, i)
    dx.push(ctrl[i].x * w)
    dy.push(ctrl[i].y * w)
    dw.push(w)
    j = j + 1
  }
  let mut r = 1
  while r <= p {
    let mut jj = p
    while jj >= r {
      let i = span - p + jj
      let denom = knots[span + 1 + jj - r] - knots[i]
      // 重节点会让分母为零——那一步的贡献就是取左端，跳过
      let alpha = if denom == 0.0 {
        0.0
      } else {
        (u - knots[i]) / denom
      }
      dx[jj] = (1.0 - alpha) * dx[jj - 1] + alpha * dx[jj]
      dy[jj] = (1.0 - alpha) * dy[jj - 1] + alpha * dy[jj]
      dw[jj] = (1.0 - alpha) * dw[jj - 1] + alpha * dw[jj]
      jj = jj - 1
    }
    r = r + 1
  }
  let w = dw[p]
  if w == 0.0 {
    Vec2::new(dx[p], dy[p])
  } else {
    Vec2::new(dx[p] / w, dy[p] / w)
  }
}

///|
/// 样条 → 折线点列（xy 投影）。
///
/// 参数域是 [U[p], U[n+1]]——首尾各 p 个钳制节点的写法，端点正好是
/// 首末控制点。在这个区间里自适应细分；数据不自洽的退回单点。
pub fn spline_points(
  degree : Int,
  knots : Array[Double],
  control_points : Array[Vec3],
  weights : Array[Double],
  tol : Double,
) -> Array[Vec2] {
  let ctrl : Array[Vec2] = []
  for cp in control_points {
    ctrl.push(cp.xy())
  }
  let n_ctrl = ctrl.length()
  let p = degree
  if n_ctrl == 0 {
    return []
  }
  if p < 1 || n_ctrl <= p || knots.length() != n_ctrl + p + 1 {
    return [ctrl[0]]
  }
  let t0 = knots[p]
  let t1 = knots[n_ctrl]
  if t1 <= t0 {
    return [ctrl[0]]
  }
  let eval = fn (t : Double) -> Vec2 { nurbs_point(p, knots, ctrl, weights, t) }
  let pts : Array[Vec2] = []
  let first = eval(t0)
  pts.push(first)
  sample_curve(eval, t0, t1, first, eval(t1), tol, 16, pts)
  pts
}

// ── 伞函数：几何 → 折线 ────────────────────────────────────────────────

///|
/// 离散之后的形状。
pub(all) enum Flat {
  /// 折线点列；闭合的不重复首点
  Outline(points~ : Array[Vec2], closed~ : Bool)
  /// 孤点（POINT）
  Dot(at~ : Vec2)
  /// 文字（TEXT / MTEXT / ATTRIB / ATTDEF）的离散形态：
  /// 插入点、字高、原文。它没有「折线形状」可给——预览按位置画字，
  /// 加工检查把它当「未转曲线」的警告项。
  Label(at~ : Vec2, height~ : Double, value~ : String)
  /// 没有可离散的几何（块引用自己会被展开、填充、认不出的类型）——
  /// **不是错误**：检查环节要单独统计这些，而不是当成空图纸
  Empty
}

///|
/// 把实体几何离散成折线。容差是弦高。
pub fn Geometry::flatten(self : Geometry, tol : Double) -> Flat {
  match self {
    Line(start~, end~) => Outline(points=[start.xy(), end.xy()], closed=false)
    Point(at~) => Dot(at=at.xy())
    Circle(center~, radius~) =>
      Outline(points=circle_points(center.xy(), radius, tol), closed=true)
    Arc(center~, radius~, start_angle~, end_angle~) => {
      // DXF 的 ARC 是逆时针从起角到止角；起止一样按整圈（arc_sweep）
      let sweep = arc_sweep(start_angle, end_angle)
      if sweep >= two_pi - 1.0e-12 {
        Outline(points=circle_points(center.xy(), radius, tol), closed=true)
      } else {
        Outline(
          points=arc_points(center.xy(), radius, start_angle, start_angle + sweep, tol),
          closed=false,
        )
      }
    }
    Ellipse(center~, major~, ratio~, start_param~, end_param~) => {
      let span = ellipse_span(start_param, end_param)
      Outline(
        points=ellipse_points(center, major, ratio, start_param, end_param, tol),
        closed=span >= two_pi - 1.0e-12,
      )
    }
    Polyline(vertices~, closed~) =>
      Outline(points=polyline_points(vertices, closed, tol), closed=closed)
    Spline(degree~, knots~, control_points~, weights~) =>
      Outline(
        points=spline_points(degree, knots, control_points, weights, tol),
        closed=false,
      )
    Face(corners~) => {
      // 按文件顺序原样连线——SOLID 的角点是蝴蝶结顺序，自交是数据本身的
      let pts : Array[Vec2] = []
      for c in corners {
        pts.push(c.xy())
      }
      Outline(points=pts, closed=true)
    }
    Text(at~, height~, value~, ..) => Label(at=at.xy(), height=height, value=value)
    Insert(..) | Dimension(..) | Hatch(..) | Unknown => Empty
  }
}
