// 与生产用的节点插入 / Bézier 细分独立的 de Boor 求值参考，仅供测试。

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
      let alpha = if denom == 0.0 { 0.0 } else { (u - knots[i]) / denom }
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
