///|
pub(all) enum R12MeshFit {
  QuadraticBSpline
  CubicBSpline
  Bezier
}

///|
/// The stored sampled surface and editable control frame are separate grids.
/// Both use M-major order. An empty samples array means that the exporter
/// supplied only a control frame.
pub struct R12FittedMesh {
  fit : R12MeshFit
  controls : Array[Vec3]
  samples : Array[Vec3]
  m : Int
  n : Int
  sample_m : Int
  sample_n : Int
  closed_m : Bool
  closed_n : Bool
}

///|
/// Returns the four WCS vertices of a stored sampled quad. Closed directions
/// wrap once. A frame-only mesh has no sampled quads.
pub fn R12FittedMesh::quad(
  self : R12FittedMesh,
  m : Int,
  n : Int,
) -> (Vec3, Vec3, Vec3, Vec3)? {
  let m_faces = self.sample_m - (if self.closed_m { 0 } else { 1 })
  let n_faces = self.sample_n - (if self.closed_n { 0 } else { 1 })
  guard r12_grid_matches(self.samples.length(), self.sample_m, self.sample_n) &&
    m >= 0 &&
    n >= 0 &&
    m < m_faces &&
    n < n_faces else {
    return None
  }
  let next_m = (m + 1) % self.sample_m
  let next_n = (n + 1) % self.sample_n
  let stride = self.sample_n
  Some(
    (
      self.samples[m * stride + n],
      self.samples[next_m * stride + n],
      self.samples[next_m * stride + next_n],
      self.samples[m * stride + next_n],
    ),
  )
}

///|
fn r12_grid_matches(length : Int, m : Int, n : Int) -> Bool {
  m >= 2 && n >= 2 && length / m == n && length % m == 0
}

///|
fn r12_fitted_mesh(
  records : Array[RawRecord],
  first : Int,
  flags : Int,
  fit_code : Int,
) -> R12EntitySemantics raise R12SemanticError {
  let header = records[first]
  let fit = match fit_code {
    5 => QuadraticBSpline
    6 => CubicBSpline
    8 => Bezier
    _ => raise InvalidSemantic("未知的拟合网格曲面类型")
  }
  let m = r12_integer(header, 71, None)
  let n = r12_integer(header, 72, None)
  let sample_m = r12_integer(header, 73, Some(0))
  let sample_n = r12_integer(header, 74, Some(0))
  let controls : Array[Vec3] = []
  let samples : Array[Vec3] = []
  let mut i = first + 1
  while i < records.length() &&
        records[i].section == header.section &&
        records[i].kind == "VERTEX" {
    let vertex = records[i]
    let vf = r12_integer(vertex, 70, None)
    guard (vf & 224) == 64 &&
      (vf & 3) == 0 &&
      r12_number(vertex, 42, Some(0.0)) == 0.0 else {
      raise InvalidSemantic(
        "拟合网格顶点 \{i} 的类型或凸度不合法",
      )
    }
    let point = r12_point(vertex, 10, require_z=true)
    match vf & 24 {
      0 | 16 => controls.push(point)
      8 => samples.push(point)
      _ =>
        raise InvalidSemantic(
          "拟合网格顶点 \{i} 同时标为样点和控制点",
        )
    }
    i += 1
  }
  guard i < records.length() &&
    records[i].section == header.section &&
    records[i].kind == "SEQEND" else {
    raise InvalidSemantic("拟合网格缺少 SEQEND")
  }
  guard r12_grid_matches(controls.length(), m, n) else {
    raise InvalidSemantic("拟合网格控制点数与 71/72 不符")
  }
  guard (sample_m == 0 && sample_n == 0 && samples.is_empty()) ||
    (
      sample_m >= 2 &&
      sample_n >= 2 &&
      (
        samples.is_empty() ||
        r12_grid_matches(samples.length(), sample_m, sample_n)
      )
    ) else {
    raise InvalidSemantic("拟合网格样点数与 73/74 不符")
  }
  FittedMesh({
    fit,
    controls,
    samples,
    m,
    n,
    sample_m,
    sample_n,
    closed_m: (flags & 1) != 0,
    closed_n: (flags & 32) != 0,
  })
}
