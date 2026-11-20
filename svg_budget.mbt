///|
pub(all) enum SvgError {
  InvalidPreviewGeometry
  SvgByteLimit
}

///|
/// The limit counts UTF-8 bytes in the serialized SVG, including markup.
pub fn Drawing::svg_with_limit(
  self : Drawing,
  tol : Double,
  max_bytes : Int,
) -> Result[String, SvgError] {
  if !positive_tolerance(tol) {
    return Err(InvalidPreviewGeometry)
  }
  if max_bytes <= 0 {
    return Err(SvgByteLimit)
  }
  self.render_svg(self.expand(tol), max_bytes)
}

///|
let default_svg_bytes : Int = 32 * 1024 * 1024

///|
priv struct SvgWriter {
  data : StringBuilder
  mut remaining : Int
  mut limited : Bool
}

///|
fn SvgWriter::write_string(self : SvgWriter, value : String) -> Unit {
  if self.limited {
    return
  }
  let bytes = @utf8.encode(value).length()
  if bytes > self.remaining {
    self.limited = true
  } else {
    self.remaining -= bytes
    self.data.write_string(value)
  }
}

///|
fn SvgWriter::result(self : SvgWriter) -> Result[String, SvgError] {
  if self.limited {
    Err(SvgByteLimit)
  } else {
    Ok(self.data.to_string())
  }
}
