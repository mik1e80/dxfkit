///|
/// A measured dimension label in the WCS XY plane. Input order is priority.
pub(all) struct R12DimensionLabelBox {
  center : Vec2
  size : Vec2
}

///|
pub(all) enum R12DimensionLabelPosition {
  LabelPlaced(Vec2)
  LabelBlocked(Vec2)
  LabelSearchLimited(Vec2)
}

///|
/// Search nearby anchors for a drawing's dimension labels. Supply the
/// WCS XY boxes of every obstacle to reserve. Accepted and pending labels
/// also reserve space. Result order corresponds to input order.
pub fn r12_avoid_dimension_labels(
  labels : Array[R12DimensionLabelBox],
  obstacles : Array[Aabb2],
  step : Double,
  clearance~ : Double = 0.0,
  rings~ : Int32 = 8,
  max_checks~ : Int32 = 100_000,
) -> Result[Array[R12DimensionLabelPosition], String] {
  guard step > 0.0 &&
    step <= 1.0e100 &&
    clearance >= 0.0 &&
    clearance <= 1.0e100 &&
    rings >= 0 &&
    rings <= 32 &&
    max_checks > 0 &&
    max_checks <= 2_000_000 &&
    labels.length() <= 10000 &&
    obstacles.length() <= 200000 &&
    obstacles.all(box => {
      !box.is_empty() && r12_finite_xy(box.min) && r12_finite_xy(box.max)
    }) &&
    labels.all(label => {
      r12_finite_xy(label.center) &&
      r12_finite_xy(label.size) &&
      label.size.x > 0.0 &&
      label.size.y > 0.0
    }) else {
    return Err("避碰包围盒、搜索步长或预算无效")
  }
  let occupancy = labels.map(label => r12_label_aabb(label.center, label.size))
  let results = []
  let budget = { checks_left: max_checks, }
  for index, label in labels {
    let result = r12_label_search(
      label, obstacles, occupancy, index, step, clearance, rings, budget,
    )
    if result is LabelPlaced(center) {
      occupancy[index] = r12_label_aabb(center, label.size)
    }
    results.push(result)
  }
  Ok(results)
}

///|
priv struct R12AvoidBudget {
  mut checks_left : Int32
}

///|
fn r12_label_search(
  label : R12DimensionLabelBox,
  obstacles : Array[Aabb2],
  occupancy : Array[Aabb2],
  index : Int32,
  step : Double,
  clearance : Double,
  rings : Int32,
  budget : R12AvoidBudget,
) -> R12DimensionLabelPosition {
  for ring in 0..<=rings {
    for x in -ring..<=ring {
      let y = ring - x.abs()
      for dy in (if y == 0 { [0] } else { [y, -y] }) {
        let center = label.center.add(
          Vec2::new(x.to_double(), dy.to_double()).scale(step),
        )
        let bounds = r12_label_aabb(center, label.size)
        match
          r12_label_clear(
            bounds, obstacles, occupancy, index, clearance, budget,
          ) {
          Some(true) => return LabelPlaced(center)
          None => return LabelSearchLimited(label.center)
          Some(false) => ()
        }
      }
    }
  }
  LabelBlocked(label.center)
}

///|
fn r12_label_clear(
  bounds : Aabb2,
  obstacles : Array[Aabb2],
  occupancy : Array[Aabb2],
  index : Int32,
  clearance : Double,
  budget : R12AvoidBudget,
) -> Bool? {
  if budget.checks_left == 0 {
    return None
  }
  budget.checks_left -= 1
  for box in obstacles {
    if budget.checks_left == 0 {
      return None
    }
    budget.checks_left -= 1
    if bounds.intersects(box, clearance) {
      return Some(false)
    }
  }
  for i, box in occupancy {
    if i == index {
      continue
    }
    if budget.checks_left == 0 {
      return None
    }
    budget.checks_left -= 1
    if bounds.intersects(box, clearance) {
      return Some(false)
    }
  }
  Some(true)
}

///|
fn r12_label_aabb(center : Vec2, size : Vec2) -> Aabb2 {
  let half = size.scale(0.5)
  { min: center.sub(half), max: center.add(half), }
}

///|
fn r12_finite_xy(p : Vec2) -> Bool {
  p.x.abs() <= 1.0e100 && p.y.abs() <= 1.0e100
}

///|
/// Reserve WCS XY wire edges and dots from a world expansion. Faces
/// reserve their full projected bounds. Text boxes should be measured by
/// the caller and appended. The expansion's diagnostics remain applicable.
pub fn WorldExpansion::r12_dimension_obstacles(
  self : WorldExpansion,
  plane_tol : Double,
  max_boxes~ : Int32 = 100_000,
) -> Result[Array[Aabb2], String] {
  Ok(r12_dimension_obstacles_impl(self, plane_tol, max_boxes)) catch {
    InvalidSemantic(message) => Err(message)
  }
}

///|
fn r12_dimension_obstacles_impl(
  world : WorldExpansion,
  plane_tol : Double,
  max_boxes : Int32,
) -> Array[Aabb2] raise R12SemanticError {
  guard positive_tolerance(plane_tol) &&
    max_boxes > 0 &&
    max_boxes <= 200000 &&
    world.placed.length() <= 200000 else {
    raise InvalidSemantic("标注障碍投影容差或数量预算无效")
  }
  let boxes : Array[Aabb2] = []
  let on_plane = fn(p : Vec3) {
    p.z.abs() <= plane_tol && r12_finite_xy(Vec2::new(p.x, p.y))
  }
  let add_box = fn(box : Aabb2) raise R12SemanticError {
    guard boxes.length() < max_boxes else {
      raise InvalidSemantic("标注障碍超过包围盒预算")
    }
    boxes.push(box)
  }
  let mut visits = 0
  for item in world.placed {
    match item.flat {
      Outline3(points~, closed~) => {
        let n = points.length()
        guard n <= 200000 - visits else {
          raise InvalidSemantic("标注障碍超过点数预算")
        }
        visits += n
        if n < 2 || !points.all(on_plane) {
          continue
        }
        let edges = if closed { n } else { n - 1 }
        for i in 0..<edges {
          let p = points[i]
          let q = points[(i + 1) % n]
          add_box(
            Aabb2::empty()
            .expand(Vec2::new(p.x, p.y))
            .expand(Vec2::new(q.x, q.y)),
          )
        }
      }
      Face3(corners~) => {
        guard corners.length() <= 200000 - visits else {
          raise InvalidSemantic("标注障碍超过点数预算")
        }
        visits += corners.length()
        if !corners.is_empty() && corners.all(on_plane) {
          let mut box = Aabb2::empty()
          for p in corners {
            box = box.expand(Vec2::new(p.x, p.y))
          }
          add_box(box)
        }
      }
      Dot3(at~) if on_plane(at) =>
        add_box(Aabb2::empty().expand(Vec2::new(at.x, at.y)))
      _ => ()
    }
  }
  boxes
}

///|
/// Reserve one rendered dimension's lines, ticks, arrows and arc in WCS XY.
/// Use only dimensions in the target drawing plane. The arc reserves a
/// conservative full-circle box, as do the bounds of custom arrow primitives.
pub fn R12StyledDimension::r12_dimension_obstacles(
  self : R12StyledDimension,
) -> Result[Array[Aabb2], String] {
  Ok(r12_styled_obstacles(self)) catch {
    InvalidSemantic(message) => Err(message)
  }
}

///|
fn r12_styled_obstacles(
  styled : R12StyledDimension,
) -> Array[Aabb2] raise R12SemanticError {
  let bounds = fn(box : Aabb2, p : Vec3) raise R12SemanticError {
    let xy = Vec2::new(p.x, p.y)
    guard finite3(p) && r12_finite_xy(xy) else {
      raise InvalidSemantic("标注障碍含无效坐标")
    }
    box.expand(xy)
  }
  let output : Array[Aabb2] = []
  let add_box = fn(box : Aabb2) raise R12SemanticError {
    guard output.length() < 200000 else {
      raise InvalidSemantic("样式障碍超过包围盒预算")
    }
    output.push(box)
  }
  guard styled.custom_arrows.length() <= 200000 else {
    raise InvalidSemantic("样式障碍超过箭头预算")
  }
  let mut visits = 0
  for group in [styled.dimension_lines, styled.extension_lines, styled.ticks] {
    for (start, end) in group {
      add_box(bounds(bounds(Aabb2::empty(), start), end))
    }
  }
  for (tip, left, right) in styled.arrows {
    add_box(bounds(bounds(bounds(Aabb2::empty(), tip), left), right))
  }
  for item in styled.custom_arrows {
    let points = match item.flat {
      Outline3(points~, ..) => points
      Face3(corners~) => corners
      Dot3(at~) => [at]
      _ => continue
    }
    guard points.length() <= 200000 - visits else {
      raise InvalidSemantic("样式障碍超过箭头点数预算")
    }
    visits += points.length()
    let mut box = Aabb2::empty()
    for p in points {
      box = bounds(box, p)
    }
    if !box.is_empty() {
      add_box(box)
    }
  }
  if styled.arc is Some(arc) {
    let radius = arc.start.sub(arc.center).length()
    let box = r12_label_aabb(
      Vec2::new(arc.center.x, arc.center.y),
      Vec2::new(2.0 * radius, 2.0 * radius),
    )
    guard r12_finite_xy(box.min) && r12_finite_xy(box.max) else {
      raise InvalidSemantic("标注圆弧障碍超出范围")
    }
    add_box(box)
  }
  output
}
