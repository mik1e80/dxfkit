///|
fn entity_world_flat(
  e : Entity,
  tol : Double,
  parent : Transform3,
) -> Result[WorldFlat, String] {
  if !positive_tolerance(tol) {
    return Err("离散容差必须是正的有限数字")
  }
  let kind = e.kind()
  let uses_ocs = [
    "CIRCLE", "ARC", "SOLID", "TRACE", "TEXT", "ATTRIB", "ATTDEF", "LWPOLYLINE",
    "POLYLINE",
  ].contains(kind)
  let transform = if uses_ocs {
    let o = match record_ocs(e.common.record) {
      Ok(o) => o
      Err(msg) => return Err(msg)
    }
    parent.compose({
      x: o.x_axis,
      y: o.y_axis,
      z: o.normal,
      origin: Vec3::zero(),
    })
  } else {
    parent
  }
  match e.geom {
    Line(start~, end~) => {
      let a = transform.apply(start)
      let b = transform.apply(end)
      if !finite3(a) || !finite3(b) {
        return Err("变换后坐标非有限")
      }
      return Ok(Outline3(points=[a, b], closed=false))
    }
    Point(at~) => {
      let p = transform.apply(at)
      if !finite3(p) {
        return Err("变换后坐标非有限")
      }
      return Ok(Dot3(at=p))
    }
    Face(corners~) if kind == "3DFACE" => {
      let out = corners.map(p => transform.apply(p))
      if !out.all(finite3) {
        return Err("变换后坐标非有限")
      }
      return Ok(Face3(corners=out))
    }
    _ => ()
  }
  let z = match e.geom {
    Circle(center~, ..) | Arc(center~, ..) => center.z
    Text(at~, ..) => at.z
    Polyline(vertices~, ..) => {
      let z = if kind == "POLYLINE" {
        e.common.record.get_double(30, 0.0)
      } else {
        e.common.record.get_double(38, 0.0)
      }
      if vertices.any(v => v.at.z != 0.0 && v.at.z != z) {
        return Err(
          "二维多段线包含不一致的顶点 Z；原记录保留",
        )
      }
      z
    }
    Face(corners~) => if corners.length() > 0 { corners[0].z } else { 0.0 }
    Ellipse(center~, major~, ..) => {
      if major.z != 0.0 ||
        e.common.record.get_double(210, 0.0) != 0.0 ||
        e.common.record.get_double(220, 0.0) != 0.0 ||
        e.common.record.get_double(230, 1.0) != 1.0 {
        return Err("非 R12 椭圆的空间平面未离散；原记录保留")
      }
      center.z
    }
    Spline(control_points~, ..) => {
      let z = if control_points.length() == 0 {
        0.0
      } else {
        control_points[0].z
      }
      if control_points.any(p => p.z != z) {
        return Err("非 R12 空间样条未离散；原记录保留")
      }
      z
    }
    _ => 0.0
  }
  let flat = match e.flatten_local_checked(tol) {
    Ok(f) => f
    Err(msg) => return Err(msg)
  }
  let f : WorldFlat = match flat {
    Outline(points~, closed~) =>
      Outline3(
        points=points.map(p => transform.apply(Vec3::new(p.x, p.y, z))),
        closed~,
      )
    Dot(at~) => Dot3(at=transform.apply(Vec3::new(at.x, at.y, z)))
    Label(at~, height~, value~) =>
      Label3(
        at=transform.apply(Vec3::new(at.x, at.y, z)),
        height=height * transform.x.cross(transform.y).length().sqrt(),
        value~,
      )
    Empty => Empty3
  }
  let valid = match f {
    Outline3(points~, ..) => points.all(finite3)
    Dot3(at~) => finite3(at)
    Label3(at~, height~, ..) => finite3(at) && finite_number(height)
    _ => true
  }
  if valid {
    Ok(f)
  } else {
    Err("变换后坐标或字高非有限")
  }
}

///|
fn world_to_xy(flat : WorldFlat, tol : Double) -> Result[Flat, String] {
  match flat {
    Outline3(points~, closed~) => {
      if points.any(p => p.z.abs() > tol) {
        return Err("已转换 WCS，但轮廓不在 Z=0 的 XY 检查平面")
      }
      Ok(Outline(points=points.map(p => p.xy()), closed~))
    }
    Dot3(at~) =>
      if at.z.abs() > tol {
        Err("点不在 XY 检查平面")
      } else {
        Ok(Dot(at=at.xy()))
      }
    Label3(at~, height~, value~) =>
      if at.z.abs() > tol {
        Err("文字插入点不在 XY 检查平面")
      } else {
        Ok(Label(at=at.xy(), height~, value~))
      }
    Face3(..) | Empty3 => Ok(Empty)
  }
}
