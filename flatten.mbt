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
