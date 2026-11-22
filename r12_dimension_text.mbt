///|
/// Structured label content. Limits omit the nominal value. A symmetric
/// tolerance has only one row. The scale is relative to the main text height.
pub(all) enum R12DimensionLabelPart {
  LabelText(String)
  ToleranceStack(
    upper~ : String,
    lower~ : String?,
    height_factor~ : Double,
    limits~ : Bool
  )
}

///|
/// Position of the lower-left corner of the measured text box, relative
/// to the center of the complete label. Units are drawing units.
pub(all) struct R12DimensionTextFragment {
  text : String
  at : Vec2
  height : Double
}

///|
pub(all) struct R12DimensionTextLayout {
  fragments : Array[R12DimensionTextFragment]
  size : Vec2
}

///|
/// Lay out nominal and tolerance text, centered vertically. The callback
/// returns the width of a text fragment at the requested height.
pub fn R12DimensionUpdate::layout_text(
  self : R12DimensionUpdate,
  height : Double,
  measure : (String, Double) -> Double,
) -> Result[R12DimensionTextLayout, String] {
  Ok(r12_layout_dimension_text(self.label_parts, height, measure)) catch {
    InvalidSemantic(message) => Err(message)
  }
}

///|
fn r12_layout_dimension_text(
  parts : Array[R12DimensionLabelPart],
  height : Double,
  measure : (String, Double) -> Double,
) -> R12DimensionTextLayout raise R12SemanticError {
  guard positive_tolerance(height) && parts.length() <= 65536 else {
    raise InvalidSemantic("标注排版字高或工作量无效")
  }
  let measure_width = fn(value : String, size : Double) raise R12SemanticError {
    guard value.length() <= 65536 && positive_tolerance(size) else {
      raise InvalidSemantic("标注容差文字或字高无效")
    }
    let width = measure(value, size)
    guard finite_number(width) && width >= 0.0 else {
      raise InvalidSemantic("标注字体提供器返回了无效宽度")
    }
    width
  }
  let mut width = 0.0
  let mut total_height = 0.0
  let fragments : Array[R12DimensionTextFragment] = []
  for part in parts {
    match part {
      LabelText(text) => {
        let size = measure_width(text, height)
        fragments.push({ text, at: Vec2::new(width, -height * 0.5), height, })
        width += size
        total_height = total_height.max(height)
      }
      ToleranceStack(upper~, lower~, height_factor~, ..) => {
        let sh = height * height_factor
        let upper_width = measure_width(upper, sh)
        let lower_width = match lower {
          Some(value) => measure_width(value, sh)
          None => 0.0
        }
        let col = upper_width.max(lower_width)
        let row_gap = if lower is Some(_) { sh * 0.1 } else { 0.0 }
        let top = if lower is Some(_) { row_gap * 0.5 } else { -sh * 0.5 }
        fragments.push({
          text: upper,
          at: Vec2::new(width + (col - upper_width) * 0.5, top),
          height: sh,
        })
        if lower is Some(value) {
          fragments.push({
            text: value,
            at: Vec2::new(
              width + (col - lower_width) * 0.5,
              -sh - row_gap * 0.5,
            ),
            height: sh,
          })
        }
        total_height = total_height.max(
          if lower is Some(_) {
            2.0 * sh + row_gap
          } else {
            sh
          },
        )
        width += col
      }
    }
    guard finite_number(width) && finite_number(total_height) else {
      raise InvalidSemantic("标注排版范围溢出")
    }
  }
  let shift = Vec2::new(width * 0.5, 0.0)
  {
    fragments: fragments.map(f => { ..f, at: f.at.sub(shift), }),
    size: Vec2::new(width, total_height),
  }
}
