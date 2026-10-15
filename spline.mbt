// NURBS 离散：节点插入分解为有理 Bézier 段，再按控制凸包细分。
// 使用标准 Boehm 节点插入、de Casteljau 算法，未移植第三方实现。
// 正权重使曲线位于投影控制点凸包内，避免只测中点漏掉 S 形曲线。

///|
fn finite_number(x : Double) -> Bool {
  !x.is_nan() && !x.is_inf()
}

///|
fn positive_tolerance(tol : Double) -> Bool {
  finite_number(tol) && tol > 0.0
}

///|
fn mix_h(a : Vec3, b : Vec3, t : Double) -> Vec3 {
  Vec3::new(
    (1.0 - t) * a.x + t * b.x,
    (1.0 - t) * a.y + t * b.y,
    (1.0 - t) * a.z + t * b.z,
  )
}

///|
fn project_h(p : Vec3) -> Vec2 {
  Vec2::new(p.x / p.z, p.y / p.z)
}

///|
fn insert_spline_knot(
  ctrl : Array[Vec3],
  knots : Array[Double],
  degree : Int,
  value : Double,
) -> (Array[Vec3], Array[Double]) {
  // 在包括活动参数域右端点的最后一个等值节点后插入。
  let mut span = degree
  while span + 1 < knots.length() && knots[span + 1] <= value {
    span = span + 1
  }
  let mut multiplicity = 0
  for u in knots {
    if u == value {
      multiplicity = multiplicity + 1
    }
  }
  let result : Array[Vec3] = []
  for i = 0; i <= ctrl.length(); i = i + 1 {
    if i <= span - degree {
      result.push(ctrl[i])
    } else if i >= span - multiplicity + 1 {
      result.push(ctrl[i - 1])
    } else {
      let alpha = (value - knots[i]) / (knots[i + degree] - knots[i])
      result.push(mix_h(ctrl[i - 1], ctrl[i], alpha))
    }
  }
  let new_knots : Array[Double] = []
  for i = 0; i < knots.length(); i = i + 1 {
    new_knots.push(knots[i])
    if i == span {
      new_knots.push(value)
    }
  }
  (result, new_knots)
}

///|
fn sample_bezier(
  ctrl : Array[Vec3],
  tol : Double,
  depth : Int,
  out : Array[Vec2],
) -> Bool {
  if out.length() >= 65536 {
    return false
  }
  let a = project_h(ctrl[0])
  let b = project_h(ctrl[ctrl.length() - 1])
  let mut flat = true
  for h in ctrl {
    let p = project_h(h)
    if !finite_number(p.x) || !finite_number(p.y) {
      return false
    }
    let distance = dist_to_segment(p, a, b)
    if !finite_number(distance) {
      return false
    }
    if distance > tol {
      flat = false
    }
  }
  if flat {
    out.push(b)
    return true
  }
  // 有限资源下达不到容差要明确失败，不能悄悄当成合格折线。
  if depth == 0 {
    return false
  }
  let work = ctrl.copy()
  let left : Array[Vec3] = [work[0]]
  let right : Array[Vec3] = [work[work.length() - 1]]
  for level = 1; level < ctrl.length(); level = level + 1 {
    for i = 0; i < ctrl.length() - level; i = i + 1 {
      work[i] = mix_h(work[i], work[i + 1], 0.5)
    }
    left.push(work[0])
    right.push(work[ctrl.length() - level - 1])
  }
  let reversed : Array[Vec3] = []
  for i = right.length() - 1; i >= 0; i = i - 1 {
    reversed.push(right[i])
  }
  sample_bezier(left, tol, depth - 1, out) &&
  sample_bezier(reversed, tol, depth - 1, out)
}

///|
/// 将连续、正权重 NURBS 曲线投影到 XY 并离散。
/// 无效节点、非正权重、非有限坐标、断裂曲线或资源上限返回错误。
pub fn spline_points_checked(
  degree : Int,
  knots : Array[Double],
  control_points : Array[Vec3],
  weights : Array[Double],
  tol : Double,
) -> Result[Array[Vec2], String] {
  let count = control_points.length()
  if !positive_tolerance(tol) {
    return Err("离散容差必须是正的有限数字")
  }
  if degree < 1 ||
    degree > 32 ||
    count <= degree ||
    count > 4096 ||
    knots.length() != count + degree + 1 {
    return Err(
      "样条次数、控制点数或节点数无效（次数上限32，控制点上限4096）",
    )
  }
  if weights.length() != 0 && weights.length() != count {
    return Err("样条权重数必须为零或等于控制点数")
  }
  for i = 0; i < knots.length(); i = i + 1 {
    if !finite_number(knots[i]) || (i > 0 && knots[i] < knots[i - 1]) {
      return Err("样条节点必须有限且不递减")
    }
  }
  let start = knots[degree]
  let end = knots[count]
  if end <= start {
    return Err("样条没有非空参数域")
  }
  let mut ctrl : Array[Vec3] = []
  for i = 0; i < count; i = i + 1 {
    let p = control_points[i]
    let w = weight_at(weights, i)
    if !finite_number(p.x) ||
      !finite_number(p.y) ||
      !finite_number(p.z) ||
      !finite_number(w) ||
      w <= 0.0 ||
      !finite_number(p.x * w) ||
      !finite_number(p.y * w) {
      return Err("样条需要有限坐标与正的有限权重")
    }
    ctrl.push(Vec3::new(p.x * w, p.y * w, w))
  }
  let breaks : Array[Double] = []
  for u in knots {
    if u >= start &&
      u <= end &&
      (breaks.length() == 0 || breaks[breaks.length() - 1] != u) {
      breaks.push(u)
    }
  }
  let mut refined = knots.copy()
  for u in breaks {
    let mut multiplicity = 0
    for v in refined {
      if u == v {
        multiplicity = multiplicity + 1
      }
    }
    if multiplicity > degree + 1 {
      return Err("节点重复次数超过次数加一")
    }
    if u > start && u < end && multiplicity > degree {
      return Err("内部重节点使样条断裂，不能连接为单条折线")
    }
    while multiplicity < degree {
      let (next_ctrl, next_knots) = insert_spline_knot(ctrl, refined, degree, u)
      ctrl = next_ctrl
      refined = next_knots
      multiplicity = multiplicity + 1
    }
  }
  let out : Array[Vec2] = []
  for k = degree; k < ctrl.length(); k = k + 1 {
    if refined[k] < start ||
      refined[k + 1] > end ||
      refined[k + 1] <= refined[k] {
      continue
    }
    let segment : Array[Vec3] = []
    for i = k - degree; i <= k; i = i + 1 {
      segment.push(ctrl[i])
    }
    if out.length() == 0 {
      out.push(project_h(segment[0]))
    }
    if !sample_bezier(segment, tol, 16, out) {
      return Err(
        "样条离散超过深度或点数上限，或遇到数值溢出；未满足指定容差",
      )
    }
  }
  if out.length() == 0 {
    Err("样条没有可离散的节点区间")
  } else {
    Ok(out)
  }
}
