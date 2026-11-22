///|
/// An annotation arc in the DIMENSION plane, with WCS center and start
/// and a positive counterclockwise sweep around normal.
pub(all) struct R12DimensionArc {
  center : Vec3
  start : Vec3
  normal : Vec3
  sweep : Double
}

///|
/// Recomputed annotation geometry and decimal label. value is in drawing
/// units for distances and radians for angles, before display formatting.
pub(all) struct R12DimensionUpdate {
  value : Double
  angular : Bool
  label : String?
  label_parts : Array[R12DimensionLabelPart]
  text_at : Vec3
  lines : Array[(Vec3, Vec3)]
  arc : R12DimensionArc?
}

///|
/// Recompute from definition points without relying on the saved picture.
/// Override the definition data to recompute after edits. The original
/// record supplies the OCS and the per-entity DIMSTYLE overrides.
pub fn ReadDocument::r12_recompute_dimension(
  self : ReadDocument,
  record_index : Int,
  tol : Double,
  definition? : R12Dimension,
  precision? : Int = 2,
) -> Result[R12DimensionUpdate, String] {
  Ok(
    r12_recompute_dimension_impl(self, record_index, tol, definition, precision),
  ) catch {
    InvalidSemantic(message) => Err(message)
  }
}

///|
fn r12_recompute_dimension_impl(
  doc : ReadDocument,
  index : Int,
  tol : Double,
  definition : R12Dimension?,
  precision : Int,
) -> R12DimensionUpdate raise R12SemanticError {
  guard doc.profile == R12 &&
    index >= 0 &&
    index < doc.records.length() &&
    positive_tolerance(tol) &&
    precision >= 0 &&
    precision <= 8 else {
    raise InvalidSemantic(
      "重算需要 AC1009、有效记录、正容差及 0–8 位精度",
    )
  }
  let r = doc.records[index]
  guard r.kind == "DIMENSION" &&
    (r.section == "BLOCKS" || r.section == "ENTITIES") &&
    r12_standalone(r, Map([])) is Some(Dimension(original)) else {
    raise InvalidSemantic("记录不是 DIMENSION")
  }
  let dim = definition.unwrap_or(original)
  let ocs = r12_extrusion(r)
  let result = r12_measure(dim, ocs, tol)
  let label_parts = r12_dimension_label_parts(
    doc,
    r,
    dim,
    result.value,
    result.angular,
    precision,
  )
  let label = r12_flat_dimension_label(label_parts)
  { ..result, label, label_parts, }
}

///|
fn r12_project_dimension(
  ocs : Ocs,
  anchor : Vec3,
  p : Vec3,
  tol : Double,
) -> Vec2 raise R12SemanticError {
  let delta = p.sub(anchor)
  let xy = Vec2::new(delta.dot(ocs.x_axis), delta.dot(ocs.y_axis))
  guard finite_number(xy.x) &&
    finite_number(xy.y) &&
    delta.dot(ocs.normal).abs() <= tol else {
    raise InvalidSemantic("标注定义点不在同一有限平面")
  }
  xy
}

///|
fn r12_dimension_point(p : Vec3?) -> Vec3 raise R12SemanticError {
  guard p is Some(value) else { raise InvalidSemantic("缺少标注定义点") }
  value
}

///|
fn r12_measure(
  dim : R12Dimension,
  ocs : Ocs,
  tol : Double,
) -> R12DimensionUpdate raise R12SemanticError {
  let anchor = dim.definition
  let kind = dim.flags & 15
  guard kind <= 6 && ((dim.flags & 64) == 0 || kind == 6) && finite3(anchor) else {
    raise InvalidSemantic("标注类型、标志或坐标无效")
  }
  let zero = Vec2::new(0.0, 0.0)
  let lines : Array[(Vec2, Vec2)] = []
  let mut arc : (Vec2, Vec2, Double)? = None
  let angular = kind == 2 || kind == 5
  let (value, label_point) = match kind {
    0 | 1 => {
      let a = r12_project_dimension(
        ocs,
        anchor,
        r12_dimension_point(dim.extension_start),
        tol,
      )
      let b = r12_project_dimension(
        ocs,
        anchor,
        r12_dimension_point(dim.extension_end),
        tol,
      )
      let delta = b.sub(a)
      let direction = if kind == 0 {
        Vec2::new(1.0, 0.0).rotate(to_radians(dim.rotation.unwrap_or(0.0)))
      } else {
        delta.normalize()
      }
      let value = delta.dot(direction).abs()
      guard finite_number(value) && value > tol else {
        raise InvalidSemantic("线性标注长度退化")
      }
      let perpendicular = direction.perp()
      let extension = match dim.oblique {
        Some(angle) => direction.rotate(to_radians(angle))
        None => perpendicular
      }
      let divisor = perpendicular.dot(extension)
      guard divisor.abs() > 1.0e-12 else {
        raise InvalidSemantic("标注延伸线与标注线平行")
      }
      let aa = a.sub(extension.scale(a.dot(perpendicular) / divisor))
      let bb = b.sub(extension.scale(b.dot(perpendicular) / divisor))
      lines.push((a, aa))
      lines.push((b, bb))
      lines.push((aa, bb))
      (value, aa.scale(0.5).add(bb.scale(0.5)))
    }
    3 | 4 => {
      let point = r12_project_dimension(
        ocs,
        anchor,
        r12_dimension_point(dim.pick_or_vertex),
        tol,
      )
      lines.push((zero, point))
      (point.length(), point.scale(0.5))
    }
    6 => {
      let point = r12_project_dimension(
        ocs,
        anchor,
        r12_dimension_point(dim.extension_start),
        tol,
      )
      let end = r12_project_dimension(
        ocs,
        anchor,
        r12_dimension_point(dim.extension_end),
        tol,
      )
      let axes = point.rotate(
        to_radians(dim.horizontal_direction.unwrap_or(0.0)),
      )
      lines.push((point, end))
      (if (dim.flags & 64) != 0 { axes.x } else { axes.y }, end)
    }
    _ => {
      let a = r12_project_dimension(
        ocs,
        anchor,
        r12_dimension_point(dim.extension_start),
        tol,
      )
      let b = r12_project_dimension(
        ocs,
        anchor,
        r12_dimension_point(dim.extension_end),
        tol,
      )
      let pick = r12_project_dimension(
        ocs,
        anchor,
        r12_dimension_point(dim.pick_or_vertex),
        tol,
      )
      let (center, first, second, selector) = if kind == 5 {
        (pick, a.sub(pick), b.sub(pick), zero.sub(pick))
      } else {
        let d = b.sub(a).normalize()
        let e = pick.normalize()
        let det = d.cross(e)
        guard det.abs() > 1.0e-12 else {
          raise InvalidSemantic("两线角度标注的延伸线平行")
        }
        let center = a.add(d.scale(a.scale(-1.0).cross(e) / det))
        let p = r12_project_dimension(
          ocs,
          anchor,
          r12_dimension_point(dim.arc_point),
          tol,
        )
        (center, d, e, p.sub(center))
      }
      let radius = selector.length()
      guard radius > tol &&
        finite_number(radius) &&
        first.length() > 0.0 &&
        second.length() > 0.0 else {
        raise InvalidSemantic("角度标注的半径或射线退化")
      }
      let (direction, sweep) = r12_angular_sector(
        first,
        second,
        selector,
        kind == 2,
      )
      let start = direction.scale(radius)
      arc = Some((center, center.add(start), sweep))
      (sweep, center.add(start.rotate(sweep * 0.5)))
    }
  }
  guard finite_number(value) &&
    (kind == 6 || value > (if angular { 1.0e-12 } else { tol })) else {
    raise InvalidSemantic("标注测量值退化或超出有限范围")
  }
  let place = fn(p : Vec2) {
    add3(anchor, ocs.to_wcs(Vec3::new(p.x, p.y, 0.0)))
  }
  let world_lines = lines.map(line => (place(line.0), place(line.1)))
  let world_arc = arc.map(part => {
    center: place(part.0),
    start: place(part.1),
    normal: ocs.normal,
    sweep: part.2,
  })
  let text_at = if (dim.flags & 128) != 0 {
    dim.text_midpoint
  } else {
    place(label_point)
  }
  guard finite3(text_at) &&
    world_lines.all(line => finite3(line.0) && finite3(line.1)) &&
    (
      world_arc is None ||
      (world_arc is Some(a) && finite3(a.center) && finite3(a.start))
    ) else {
    raise InvalidSemantic("重算后的标注几何超出有限坐标")
  }
  {
    value,
    angular,
    label: None,
    label_parts: [],
    text_at,
    lines: world_lines,
    arc: world_arc,
  }
}

///|
fn r12_angular_sector(
  first : Vec2,
  second : Vec2,
  pick : Vec2,
  full_lines : Bool,
) -> (Vec2, Double) raise R12SemanticError {
  let a = first.normalize()
  let b = second.normalize()
  let p = pick.normalize()
  let first_rays = if full_lines { [a, a.scale(-1.0)] } else { [a] }
  let second_rays = if full_lines { [b, b.scale(-1.0)] } else { [b] }
  let mut direction = a
  let mut best = 7.0
  for u in first_rays {
    for v in second_rays {
      for pair in [(u, v), (v, u)] {
        let (start, end) = pair
        let span = normalize_angle(end.angle() - start.angle())
        let selected = normalize_angle(p.angle() - start.angle())
        if span > 1.0e-12 && span < best && selected <= span + 1.0e-12 {
          direction = start
          best = span
        }
      }
    }
  }
  guard best < 7.0 else {
    raise InvalidSemantic("不能确定角度标注扇区")
  }
  (direction, best)
}
