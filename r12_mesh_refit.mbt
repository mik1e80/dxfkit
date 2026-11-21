///|
priv struct SurfaceWeights {
  indices : Array[Int]
  values : Array[Double]
}

///|
/// Re-evaluate the control frame on an M-major WCS grid without modifying
/// the saved samples. Open B-splines use clamped uniform knots and closed
/// directions use periodic knots. A closed Bézier axis uses cubic spans
/// with three controls per span and an implicit return to control zero.
pub fn R12FittedMesh::refit(
  self : R12FittedMesh,
  sample_m : Int,
  sample_n : Int,
  max_points? : Int = 100_000,
) -> Result[R12FittedMesh, String] {
  Ok(r12_refit_mesh(self, sample_m, sample_n, max_points)) catch {
    InvalidSemantic(message) => Err(message)
  }
}

///|
fn surface_width(
  fit : R12MeshFit,
  count : Int,
  closed : Bool,
) -> Int raise R12SemanticError {
  let width = match fit {
    QuadraticBSpline => 3
    CubicBSpline => 4
    Bezier => if closed { 4 } else { count }
  }
  let enough = count >= width || (fit is Bezier && closed && count == 3)
  guard enough && width <= 33 && (!(fit is Bezier && closed) || count % 3 == 0) else {
    raise InvalidSemantic(
      "控制点不足、Bézier 次数超过 32 或闭合 Bézier 控制点不能分成三点一段",
    )
  }
  width
}

///|
fn r12_refit_mesh(
  mesh : R12FittedMesh,
  sample_m : Int,
  sample_n : Int,
  max_points : Int,
) -> R12FittedMesh raise R12SemanticError {
  guard r12_grid_matches(mesh.controls.length(), mesh.m, mesh.n) &&
    sample_m >= 2 &&
    sample_n >= 2 &&
    max_points > 0 &&
    sample_m <= max_points / sample_n else {
    raise InvalidSemantic("控制框、采样尺寸或点数预算无效")
  }
  let width_m = surface_width(mesh.fit, mesh.m, mesh.closed_m)
  let width_n = surface_width(mesh.fit, mesh.n, mesh.closed_n)
  let count = sample_m * sample_n
  guard count <= 8_000_000 / width_m / width_n else {
    raise InvalidSemantic("曲面重拟合超过运算预算")
  }
  let rows = surface_axis(mesh.fit, mesh.m, sample_m, width_m, mesh.closed_m)
  let columns = surface_axis(mesh.fit, mesh.n, sample_n, width_n, mesh.closed_n)
  let samples = Array(capacity=count)
  for row in rows {
    for column in columns {
      let mut point = Vec3::zero()
      for i, mi in row.indices {
        for j, ni in column.indices {
          let weight = row.values[i] * column.values[j]
          point = add3(point, scale3(mesh.controls[mi * mesh.n + ni], weight))
        }
      }
      guard finite3(point) else {
        raise InvalidSemantic("曲面重拟合生成了非有限坐标")
      }
      samples.push(point)
    }
  }
  { ..mesh, samples, sample_m, sample_n, }
}

///|
fn surface_axis(
  fit : R12MeshFit,
  count : Int,
  samples : Int,
  width : Int,
  closed : Bool,
) -> Array[SurfaceWeights] {
  let degree = width - 1
  let denominator = (samples - (if closed { 0 } else { 1 })).to_double()
  let spans = if fit is Bezier {
    if closed {
      count / 3
    } else {
      1
    }
  } else if closed {
    count
  } else {
    count - degree
  }
  let result = Array(capacity=samples)
  for i in 0..<samples {
    let u = i.to_double() / denominator * spans.to_double()
    let segment = u.to_int().min(spans - 1)
    let weights = if fit is Bezier {
      surface_bezier_weights(degree, u - segment.to_double())
    } else {
      surface_spline_weights(degree, segment + degree, u, spans, closed)
    }
    let start = if fit is Bezier && closed { 3 * segment } else { segment }
    let indices = Array::makei(width, j => (start + j) % count)
    result.push({ indices, values: weights, })
  }
  result
}

///|
fn surface_bezier_weights(degree : Int, u : Double) -> Array[Double] {
  let weights = Array::make(degree + 1, 0.0)
  weights[0] = 1.0
  for d in 1..<=degree {
    for j = d; j > 0; j = j - 1 {
      weights[j] = (1.0 - u) * weights[j] + u * weights[j - 1]
    }
    weights[0] *= 1.0 - u
  }
  weights
}

///|
fn surface_knot(i : Int, degree : Int, spans : Int, closed : Bool) -> Double {
  let k = i - degree
  (if closed { k } else { k.max(0).min(spans) }).to_double()
}

///|
fn surface_spline_weights(
  degree : Int,
  knot : Int,
  u : Double,
  spans : Int,
  closed : Bool,
) -> Array[Double] {
  let values = Array::make(degree + 1, 0.0)
  values[0] = 1.0
  for j in 1..<=degree {
    let mut remainder = 0.0
    for k in 0..<j {
      let left = u - surface_knot(knot + 1 - (j - k), degree, spans, closed)
      let edge = surface_knot(knot + k + 1, degree, spans, closed) - u
      let width = edge + left
      let previous = if width == 0.0 { 0.0 } else { values[k] / width }
      values[k] = remainder + edge * previous
      remainder = left * previous
    }
    // The final entry comes from the left factor of the last term.
    values[j] = remainder
  }
  values
}
