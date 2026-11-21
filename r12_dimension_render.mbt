///|
/// Supported R12 styling in WCS. Color values retain BYBLOCK and BYLAYER.
pub(all) struct R12StyledDimension {
  dimension_lines : Array[(Vec3, Vec3)]
  extension_lines : Array[(Vec3, Vec3)]
  arrows : Array[(Vec3, Vec3, Vec3)]
  ticks : Array[(Vec3, Vec3)]
  arc : R12DimensionArc?
  label : String?
  text_at : Vec3
  text_height : Double
  dimension_color : Int
  extension_color : Int
  text_color : Int
}

///|
/// Style the latest recomputation without changing the drawing. A supplied
/// label width cuts a gap in a straight dimension line.
pub fn ReadDocument::r12_render_dimension(
  self : ReadDocument,
  record_index : Int,
  update : R12DimensionUpdate,
  label_width? : Double = 0.0,
) -> Result[R12StyledDimension, String] {
  Ok(r12_render_dim(self, record_index, update, label_width)) catch {
    InvalidSemantic(msg) => Err(msg)
  }
}

///|
fn r12_render_dim(
  doc : ReadDocument,
  index : Int,
  update : R12DimensionUpdate,
  label_width : Double,
) -> R12StyledDimension raise R12SemanticError {
  guard doc.profile == R12 &&
    index >= 0 &&
    index < doc.records.length() &&
    finite_number(label_width) &&
    label_width >= 0.0 else {
    raise InvalidSemantic(
      "标注样式渲染需要 AC1009 和有效文本宽度",
    )
  }
  let raw = doc.records[index]
  guard raw.kind == "DIMENSION" &&
    r12_standalone(raw, Map([])) is Some(Dimension(dim)) else {
    raise InvalidSemantic("无效 DIMENSION 记录")
  }
  let style = match r12_table_link(doc.records, "DIMSTYLE", dim.style) {
    Resolved(i) => Some(doc.records[i])
    Missing if dim.style.to_upper() == "STANDARD" => None
    _ => raise InvalidSemantic("渲染使用的 DIMSTYLE 缺失或含歧义")
  }
  let overrides = r12_dimension_overrides(raw)
  let get = fn(group : Int, header : String) raise R12SemanticError {
    for item in overrides {
      if item.group == group {
        return Some(item.value.value)
      }
    }
    if style is Some(r) && r12_single(r, group) is Some(v) {
      return Some(v)
    }
    r12_header_dimension_value(doc.records, header)
  }
  // Preserve the saved picture for layouts that need external arrow blocks.
  for field in [(5, "$DIMBLK"), (6, "$DIMBLK1"), (7, "$DIMBLK2")] {
    match get(field.0, field.1) {
      None | Some(Str("")) => ()
      _ =>
        raise InvalidSemantic("自定义箭头块请使用已存标注图块")
    }
  }
  let scale = r12_label_real(get(40, "$DIMSCALE"), 1.0)
  let arrow = r12_label_real(get(41, "$DIMASZ"), 2.5) * scale
  let ext_offset = r12_label_real(get(42, "$DIMEXO"), 0.625) * scale
  let ext_over = r12_label_real(get(44, "$DIMEXE"), 1.25) * scale
  let height = r12_label_real(get(140, "$DIMTXT"), 2.5) * scale
  let tick = r12_label_real(get(142, "$DIMTSZ"), 0.0) * scale
  let gap = r12_label_real(get(147, "$DIMGAP"), 0.625) * scale
  guard scale > 0.0 &&
    height > 0.0 &&
    [arrow, ext_offset, ext_over, height, tick, gap].all(v => {
      finite_number(v) && v >= 0.0
    }) else {
    raise InvalidSemantic("标注样式长度、缩放或间隙无效")
  }
  let read_integer = fn(group : Int, name : String) raise R12SemanticError {
    match get(group, name) {
      None => 0
      Some(I16(v)) if v >= 0 && v <= 256 => v
      _ => raise InvalidSemantic("标注颜色或开关超出范围")
    }
  }
  let dimension_color = read_integer(176, "$DIMCLRD")
  let extension_color = read_integer(177, "$DIMCLRE")
  let text_color = read_integer(178, "$DIMCLRT")
  let suppressed = [
    read_integer(75, "$DIMSE1") != 0,
    read_integer(76, "$DIMSE2") != 0,
  ]
  let normal = r12_extrusion(raw).normal
  let lines : Array[(Vec3, Vec3)] = []
  let extension_lines : Array[(Vec3, Vec3)] = []
  let tips : Array[(Vec3, Vec3)] = []
  let kind = dim.flags & 15
  let extensions = if kind <= 1 { 2 } else { 0 }
  guard update.lines.length() >= extensions &&
    update.lines.length() <= 3 &&
    finite3(update.text_at) else {
    raise InvalidSemantic("标注重算结果与样式不相容")
  }
  for i, line in update.lines {
    let delta = line.1.sub(line.0)
    let length = delta.length()
    guard finite3(line.0) && finite3(line.1) && finite_number(length) else {
      raise InvalidSemantic("标注线段超出有限范围")
    }
    if length == 0.0 {
      continue
    }
    let direction = delta.normalize()
    if i < extensions {
      if !suppressed[i] && ext_offset < length + ext_over {
        extension_lines.push(
          (
            add3(line.0, scale3(direction, ext_offset)),
            add3(line.1, scale3(direction, ext_over)),
          ),
        )
      }
    } else {
      if i == extensions && (kind <= 1 || kind == 3) {
        tips.push((line.0, direction))
      }
      if i == extensions && (kind <= 1 || kind == 3 || kind == 4) {
        tips.push((line.1, scale3(direction, -1.0)))
      }
      if kind <= 1 && update.label is Some(_) && label_width > 0.0 {
        let offset = update.text_at.sub(line.0).dot(direction)
        let low = (offset - label_width * 0.5 - gap).max(0.0).min(length)
        let high = (offset + label_width * 0.5 + gap).min(length).max(0.0)
        if low > 0.0 {
          lines.push((line.0, add3(line.0, scale3(direction, low))))
        }
        if high < length {
          lines.push((add3(line.0, scale3(direction, high)), line.1))
        }
      } else {
        lines.push(line)
      }
    }
  }
  if update.arc is Some(arc) {
    let radial = arc.start.sub(arc.center)
    let tangent = normal.cross(radial)
    let end = add3(
      scale3(radial, @math.cos(arc.sweep)),
      scale3(tangent, @math.sin(arc.sweep)),
    )
    guard finite3(arc.center) &&
      finite3(arc.start) &&
      finite3(end) &&
      finite_number(arc.sweep) &&
      arc.sweep > 0.0 else {
      raise InvalidSemantic("标注圆弧无效")
    }
    tips.push((arc.start, tangent.normalize()))
    tips.push(
      (add3(arc.center, end), scale3(normal.cross(end).normalize(), -1.0)),
    )
  }
  let arrows = []
  let ticks = []
  for tip in tips {
    let side = normal.cross(tip.1).normalize()
    if tick > 0.0 {
      let d = scale3(add3(side, tip.1).normalize(), tick * 0.5)
      ticks.push((tip.0.sub(d), add3(tip.0, d)))
    } else if arrow > 0.0 {
      let wide = scale3(side, arrow / 6.0)
      let base = add3(tip.0, scale3(tip.1, arrow))
      arrows.push((tip.0, add3(base, wide), base.sub(wide)))
    }
  }
  guard lines.all(l => finite3(l.0) && finite3(l.1)) &&
    extension_lines.all(l => finite3(l.0) && finite3(l.1)) &&
    ticks.all(l => finite3(l.0) && finite3(l.1)) &&
    arrows.all(a => finite3(a.0) && finite3(a.1) && finite3(a.2)) else {
    raise InvalidSemantic("样式渲染超出有限坐标")
  }
  {
    dimension_lines: lines,
    extension_lines,
    arrows,
    ticks,
    arc: update.arc,
    label: update.label,
    text_at: update.text_at,
    text_height: height,
    dimension_color,
    extension_color,
    text_color,
  }
}
