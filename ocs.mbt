///|
/// DXF Arbitrary Axis Algorithm basis. Coordinates are expressed in WCS.
pub struct Ocs {
  x_axis : Vec3
  y_axis : Vec3
  normal : Vec3
}

///|
/// Normalize a finite, nonzero extrusion vector without squaring huge values.
pub fn Ocs::from_extrusion(normal : Vec3) -> Result[Ocs, String] {
  let m = normal.x.abs().max(normal.y.abs()).max(normal.z.abs())
  if !finite3(normal) || !finite_number(m) || m == 0.0 {
    return Err("OCS 挤出方向必须是有限非零向量")
  }
  let n = Vec3::new(normal.x / m, normal.y / m, normal.z / m).normalize()
  let helper = if n.x.abs() < 0.015625 && n.y.abs() < 0.015625 {
    Vec3::new(0.0, 1.0, 0.0)
  } else {
    Vec3::new(0.0, 0.0, 1.0)
  }
  let x = helper.cross(n).normalize()
  Ok({ x_axis: x, y_axis: n.cross(x), normal: n, })
}

///|
/// Transform an OCS position, including its elevation, to WCS.
pub fn Ocs::to_wcs(self : Ocs, p : Vec3) -> Vec3 {
  Vec3::new(
    self.x_axis.x * p.x + self.y_axis.x * p.y + self.normal.x * p.z,
    self.x_axis.y * p.x + self.y_axis.y * p.y + self.normal.y * p.z,
    self.x_axis.z * p.x + self.y_axis.z * p.y + self.normal.z * p.z,
  )
}

///|
fn record_ocs(record : Record) -> Result[Ocs, String] {
  Ocs::from_extrusion(
    Vec3::new(
      record.get_double(210, 0.0),
      record.get_double(220, 0.0),
      record.get_double(230, 1.0),
    ),
  )
}

///|
priv struct Transform3 {
  x : Vec3
  y : Vec3
  z : Vec3
  origin : Vec3
}

///|
fn add3(a : Vec3, b : Vec3) -> Vec3 {
  Vec3::new(a.x + b.x, a.y + b.y, a.z + b.z)
}

///|
fn scale3(a : Vec3, s : Double) -> Vec3 {
  Vec3::new(a.x * s, a.y * s, a.z * s)
}

///|
fn Transform3::identity() -> Transform3 {
  {
    x: Vec3::new(1.0, 0.0, 0.0),
    y: Vec3::new(0.0, 1.0, 0.0),
    z: Vec3::new(0.0, 0.0, 1.0),
    origin: Vec3::zero(),
  }
}

///|
fn Transform3::vector(self : Transform3, p : Vec3) -> Vec3 {
  add3(add3(scale3(self.x, p.x), scale3(self.y, p.y)), scale3(self.z, p.z))
}

///|
fn Transform3::apply(self : Transform3, p : Vec3) -> Vec3 {
  add3(self.vector(p), self.origin)
}

///|
fn Transform3::compose(self : Transform3, inner : Transform3) -> Transform3 {
  {
    x: self.vector(inner.x),
    y: self.vector(inner.y),
    z: self.vector(inner.z),
    origin: self.apply(inner.origin),
  }
}

///|
fn finite3(p : Vec3) -> Bool {
  finite_number(p.x) && finite_number(p.y) && finite_number(p.z)
}

///|
/// sqrt(||A||1 * ||A||infinity) bounds stretching; identity has bound one.
fn Transform3::stretch_bound(self : Transform3) -> Double {
  let a = [
    self.x.x,
    self.x.y,
    self.x.z,
    self.y.x,
    self.y.y,
    self.y.z,
    self.z.x,
    self.z.y,
    self.z.z,
  ]
  let mut m = 0.0
  for v in a {
    m = m.max(v.abs())
  }
  if m == 0.0 || !finite_number(m) {
    return m
  }
  let x = scale3(self.x, 1.0 / m)
  let y = scale3(self.y, 1.0 / m)
  let z = scale3(self.z, 1.0 / m)
  let one = (x.x.abs() + x.y.abs() + x.z.abs())
    .max(y.x.abs() + y.y.abs() + y.z.abs())
    .max(z.x.abs() + z.y.abs() + z.z.abs())
  let inf = (x.x.abs() + y.x.abs() + z.x.abs())
    .max(x.y.abs() + y.y.abs() + z.y.abs())
    .max(x.z.abs() + y.z.abs() + z.z.abs())
  m * (one * inf).sqrt()
}

///|
/// Grid offsets rotate with the INSERT, but are NOT scaled by its scale factors.
fn insert_transform3(
  at : Vec3,
  base : Vec3,
  scale : Vec3,
  rotation : Double,
  offset : Vec3,
  ocs : Ocs,
) -> Transform3 {
  let c = @math.cos(rotation)
  let s = @math.sin(rotation)
  let t : Transform3 = {
    x: ocs.to_wcs(Vec3::new(c * scale.x, s * scale.x, 0.0)),
    y: ocs.to_wcs(Vec3::new(-s * scale.y, c * scale.y, 0.0)),
    z: ocs.to_wcs(Vec3::new(0.0, 0.0, scale.z)),
    origin: Vec3::zero(),
  }
  let grid = Vec3::new(
    c * offset.x - s * offset.y,
    s * offset.x + c * offset.y,
    0.0,
  )
  { ..t, origin: ocs.to_wcs(add3(at, grid)).sub(t.vector(base)), }
}
