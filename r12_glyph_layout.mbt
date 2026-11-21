///|
/// The DXF text style passed to a caller-supplied font shaper. File names are
/// metadata. The library never opens a path obtained from DXF.
pub(all) struct R12FontStyle {
  name : String
  font_file : String
  big_font_file : String
  flags : Int
}

///|
/// A shaped single-line run in units where one cap height is 1.0. Include
/// kerning, glyph positioning, and holes in paths. Ascent and descent are
/// distances from the baseline, and paths retain their provider's ordering.
pub(all) struct R12GlyphRun {
  paths : Array[Array[Vec2]]
  advance : Double
  ascent : Double
  descent : Double
}

///|
/// Positioned font paths in the attribute's containing space. Invisible
/// attributes return visible=false and an empty list without shaping text.
pub(all) struct R12GlyphLayout {
  visible : Bool
  paths : Array[Array[Vec3]]
}

///|
/// Lay out user-supplied glyphs for an R12 cell attribute. The shaper receives
/// the original text and resolved STYLE metadata, including vertical flags.
/// The font shaper owns the glyph orientation within the run. Nonzero extrusion
/// thickness is outside this planar API.
pub fn ReadDocument::r12_layout_attribute(
  self : ReadDocument,
  attribute : R12CellAttribute,
  shape : (R12FontStyle, String) -> R12GlyphRun?,
  max_points? : Int = 100_000,
) -> Result[R12GlyphLayout, String] {
  if self.profile != R12 {
    return Err("属性字形排版需要 AC1009")
  }
  Ok(r12_layout_attribute_impl(self, attribute, shape, max_points)) catch {
    InvalidSemantic(message) => Err(message)
  }
}

///|
fn r12_layout_attribute_impl(
  doc : ReadDocument,
  attribute : R12CellAttribute,
  shape : (R12FontStyle, String) -> R12GlyphRun?,
  max_points : Int,
) -> R12GlyphLayout raise R12SemanticError {
  let data = attribute.data
  if (data.flags & 1) != 0 {
    return { visible: false, paths: [], }
  }
  if data.value == "" {
    return { visible: true, paths: [], }
  }
  let style = match r12_table_link(doc.records, "STYLE", data.style) {
    Resolved(i) => {
      let r = doc.records[i]
      {
        name: data.style,
        font_file: r12_string(r, 3).unwrap_or(""),
        big_font_file: r12_string(r, 4).unwrap_or(""),
        flags: r12_integer(r, 70, Some(0)),
      }
    }
    Missing if data.style.to_upper() == "STANDARD" =>
      { name: data.style, font_file: "", big_font_file: "", flags: 0, }
    _ => raise InvalidSemantic("属性文字样式缺失或含歧义")
  }
  guard data.thickness == 0.0 else {
    raise InvalidSemantic("非零文字厚度未覆盖")
  }
  guard max_points > 0 && shape(style, data.value) is Some(run) else {
    raise InvalidSemantic("缺少字形或字形点数预算无效")
  }
  guard finite_number(run.advance) &&
    run.advance >= 0.0 &&
    finite_number(run.ascent) &&
    run.ascent >= 0.0 &&
    finite_number(run.descent) &&
    run.descent >= 0.0 else {
    raise InvalidSemantic("字体提供器返回了无效度量")
  }
  let horizontal = data.horizontal
  let vertical = data.vertical
  guard horizontal >= 0 &&
    horizontal <= 5 &&
    vertical >= 0 &&
    vertical <= 3 &&
    (vertical == 0 || horizontal <= 2) &&
    finite_number(data.height) &&
    data.height > 0.0 &&
    finite_number(data.width_scale) &&
    data.width_scale > 0.0 &&
    data.oblique.abs() <= 85.0 else {
    raise InvalidSemantic("属性的对齐、尺寸或倾斜角无效")
  }
  guard attribute.baseline.normalize().cross(attribute.up.normalize()).length() >
    1.0e-12 else {
    raise InvalidSemantic("属性文字基向量退化")
  }
  let fits = horizontal == 3 || horizontal == 5
  let anchor = if (horizontal == 0 && vertical == 0) || fits {
    attribute.anchor
  } else {
    guard attribute.alignment is Some(point) else {
      raise InvalidSemantic("属性缺少对齐点")
    }
    point
  }
  let (basis_x, basis_y, fit_width) = if fits {
    guard attribute.alignment is Some(point) && run.advance > 0.0 else {
      raise InvalidSemantic("对齐/适配文字需要两个点和正字宽")
    }
    r12_attribute_fit_basis(attribute.baseline, attribute.up, point.sub(anchor))
  } else {
    (attribute.baseline, attribute.up, 0.0)
  }
  let sx = if fits {
    fit_width / run.advance
  } else {
    data.height * data.width_scale
  }
  let sy = if horizontal == 3 { sx / data.width_scale } else { data.height }
  let shift_x = if horizontal == 1 || horizontal == 4 {
    run.advance * 0.5
  } else if horizontal == 2 {
    run.advance
  } else {
    0.0
  }
  let shift_y = if vertical == 2 || horizontal == 4 {
    (run.ascent - run.descent) * 0.5
  } else if vertical == 3 {
    run.ascent
  } else if vertical == 1 {
    -run.descent
  } else {
    0.0
  }
  let shear = @math.tan(to_radians(data.oblique))
  let backward = (data.generation_flags & 2) != 0
  let upside_down = (data.generation_flags & 4) != 0
  let paths : Array[Array[Vec3]] = []
  let mut remaining = max_points
  // Counting paths as well as vertices prevents all-empty output from
  // bypassing the budget.
  guard run.paths.length() <= max_points else {
    raise InvalidSemantic("属性字形超过路径预算")
  }
  for path in run.paths {
    guard path.length() >= 2 && path.length() <= remaining else {
      raise InvalidSemantic("字形路径过短或超过点数预算")
    }
    remaining -= path.length()
    let placed : Array[Vec3] = []
    for v in path {
      let y = (v.y - shift_y) * sy
      let x = (v.x - shift_x) * sx + y * shear
      let px = if backward {
        (if fits { fit_width } else { 0.0 }) - x
      } else {
        x
      }
      let py = if upside_down { -y } else { y }
      let point = add3(anchor, add3(scale3(basis_x, px), scale3(basis_y, py)))
      guard finite3(point) else {
        raise InvalidSemantic("字形变换后超出有限坐标")
      }
      placed.push(point)
    }
    paths.push(placed)
  }
  { visible: true, paths, }
}

///|
fn r12_attribute_fit_basis(
  bx : Vec3,
  by : Vec3,
  target : Vec3,
) -> (Vec3, Vec3, Double) raise R12SemanticError {
  let lx = bx.length()
  let ly = by.length()
  guard finite_number(lx) && lx > 0.0 && finite_number(ly) && ly > 0.0 else {
    raise InvalidSemantic("属性文字基向量退化")
  }
  let ux = bx.normalize()
  let uy = by.normalize()
  let normal = ux.cross(uy)
  let area = normal.length()
  guard area > 1.0e-12 &&
    target.length() > 0.0 &&
    target.dot(normal).abs() <= 1.0e-9 * area * target.length() else {
    raise InvalidSemantic("属性对齐点不在文字平面或基向量退化")
  }
  let x = target.cross(uy).dot(normal) / (area * area) / lx
  let y = ux.cross(target).dot(normal) / (area * area) / ly
  let distance = scaled_hypot(x, y)
  guard finite_number(distance) && distance > 0.0 else {
    raise InvalidSemantic("属性对齐跨度无效")
  }
  (
    add3(scale3(bx, x / distance), scale3(by, y / distance)),
    add3(scale3(bx, -y / distance), scale3(by, x / distance)),
    distance,
  )
}
