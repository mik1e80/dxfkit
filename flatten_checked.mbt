// 带错误结果的离散入口，供检查和块展开使用。

///|
fn flat_is_finite(flat : Flat) -> Bool {
  match flat {
    Outline(points~, ..) => {
      for p in points {
        if !finite_number(p.x) || !finite_number(p.y) {
          return false
        }
      }
      true
    }
    Dot(at~) => finite_number(at.x) && finite_number(at.y)
    Label(at~, height~, ..) =>
      finite_number(at.x) && finite_number(at.y) && finite_number(height)
    Empty => true
  }
}

///|
fn arc_cap_exceeded(radius : Double, sweep : Double, tol : Double) -> Bool {
  let s = @math.sin(sweep / 16384.0)
  // 4096段封顶时的弦高；用 sin² 形式避免极小角度时 1-cos 的相消。
  2.0 * radius.abs() * s * s > tol * (1.0 + 1.0e-12)
}

///|
fn ellipse_points_checked(
  center : Vec3,
  major : Vec3,
  ratio : Double,
  start_param : Double,
  end_param : Double,
  tol : Double,
) -> Result[Array[Vec2], String] {
  if !positive_tolerance(tol) ||
    !finite_number(start_param) ||
    !finite_number(end_param) ||
    !finite_number(ratio) ||
    ratio <= 0.0 || ratio > 1.0 {
    return Err("椭圆需要有限参数、正容差；短长轴比必须大于0且不超过1")
  }
  let c = center.xy()
  let m = major.xy()
  let n = Vec2::new(-m.y * ratio, m.x * ratio)
  if m.length() == 0.0 {
    return Err("椭圆长轴的 XY 投影长度为零")
  }
  let span = ellipse_span(start_param, end_param)
  if !finite_number(span) || span > 6.283185307179586 + 1.0e-12 {
    return Err("椭圆参数跨度超出一周")
  }
  let mut segments = (span / 1.5707963267948966).to_int()
  if segments.to_double() * 1.5707963267948966 < span {
    segments = segments + 1
  }
  if segments < 1 {
    segments = 1
  }
  let out : Array[Vec2] = []
  for i = 0; i < segments; i = i + 1 {
    let a = start_param + span * i.to_double() / segments.to_double()
    let b = start_param + span * (i + 1).to_double() / segments.to_double()
    let mid = 0.5 * a + 0.5 * b
    let w = @math.cos(0.5 * (b - a))
    let p0 = c.add(m.scale(@math.cos(a))).add(n.scale(@math.sin(a)))
    let p1 = c.add(m.scale(@math.cos(mid) / w)).add(n.scale(@math.sin(mid) / w))
    let p2 = c.add(m.scale(@math.cos(b))).add(n.scale(@math.sin(b)))
    let points = match
      spline_points_checked(
        2,
        [0.0, 0.0, 0.0, 1.0, 1.0, 1.0],
        [
          Vec3::new(p0.x, p0.y, 0.0),
          Vec3::new(p1.x, p1.y, 0.0),
          Vec3::new(p2.x, p2.y, 0.0),
        ],
        [1.0, w, 1.0],
        tol,
      ) {
      Ok(points) => points
      Err(msg) => return Err(msg)
    }
    for j = (if i == 0 { 0 } else { 1 }); j < points.length(); j = j + 1 {
      out.push(points[j])
    }
    if out.length() > 65536 {
      return Err("椭圆离散超过65536点上限")
    }
  }
  if span >= 6.283185307179586 - 1.0e-12 {
    let closed : Array[Vec2] = []
    for i = 0; i + 1 < out.length(); i = i + 1 {
      closed.push(out[i])
    }
    Ok(closed)
  } else {
    Ok(out)
  }
}

///|
/// 检查和展开使用此入口：达到上限或无法处理时返回错误，不把占位点当成正确曲线。
pub fn Geometry::flatten_checked(
  self : Geometry,
  tol : Double,
) -> Result[Flat, String] {
  if !positive_tolerance(tol) {
    return Err("离散容差必须是正的有限数字")
  }
  match self {
    Circle(radius~, ..) =>
      if !finite_number(radius) ||
        arc_cap_exceeded(radius, 6.283185307179586, tol) {
        return Err(
          "圆离散需要超过4096段，或半径非有限；未满足指定容差",
        )
      }
    Arc(radius~, start_angle~, end_angle~, ..) => {
      if !finite_number(radius) ||
        !finite_number(start_angle) ||
        !finite_number(end_angle) {
        return Err("圆弧参数必须有限")
      }
      if arc_cap_exceeded(radius, arc_sweep(start_angle, end_angle), tol) {
        return Err("圆弧离散超过4096段上限；未满足指定容差")
      }
    }
    Polyline(vertices~, closed~) => {
      let count = if closed { vertices.length() } else { vertices.length() - 1 }
      for i = 0; i < count; i = i + 1 {
        let a = vertices[i]
        let b = vertices[(i + 1) % vertices.length()]
        if !finite_number(a.bulge) {
          return Err("多段线 bulge 必须有限")
        }
        if a.bulge != 0.0 && a.at.xy().distance(b.at.xy()) > 0.0 {
          let arc = arc_from_bulge(a.at.xy(), b.at.xy(), a.bulge)
          if !finite_number(arc.radius) ||
            arc_cap_exceeded(
              arc.radius,
              angle_span(arc.start_angle, arc.end_angle),
              tol,
            ) {
            return Err(
              "多段线圆弧超出数值或4096段上限；未满足指定容差",
            )
          }
        }
      }
    }
    _ => ()
  }
  let flat = match self {
    Spline(degree~, knots~, control_points~, weights~) =>
      match spline_points_checked(degree, knots, control_points, weights, tol) {
        Ok(points) => Outline(points~, closed=false)
        Err(msg) => return Err(msg)
      }
    Ellipse(center~, major~, ratio~, start_param~, end_param~) =>
      match
        ellipse_points_checked(
          center, major, ratio, start_param, end_param, tol,
        ) {
        Ok(points) =>
          Outline(
            points~,
            closed=ellipse_span(start_param, end_param) >=
              6.283185307179586 - 1.0e-12,
          )
        Err(msg) => return Err(msg)
      }
    _ => self.flatten(tol)
  }
  if !flat_is_finite(flat) {
    return Err("离散结果含非有限坐标或字高")
  }
  Ok(flat)
}
