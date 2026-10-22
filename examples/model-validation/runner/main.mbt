///|
/// Public API probe. Machine data stays separate from the human CLI report.
fn main {
  let args = @env.args()
  let bytes = @fs.read_file_to_bytes(args[1]) catch {
    @fs.IOError(message) => {
      println("READ_ERROR|\{message}")
      return
    }
  }
  let drawing = @dxfkit.build_drawing(@dxfkit.scan_tags(bytes))
  println("UNIT|\{drawing.declared_unit_label()}")
  let entities = drawing.entities()
  for entity in entities.entities {
    let h = entity.common.handle
    println("ENTITY|\{h}|\{entity.kind()}|\{entity.layer()}")
    match entity.geom {
      @dxfkit.Circle(center~, radius~) =>
        println("CIRCLE|\{h}|\{center.x}|\{center.y}|\{radius}")
      @dxfkit.Arc(center~, radius~, start_angle~, end_angle~) =>
        println("ARC|\{h}|\{center.x}|\{center.y}|\{radius}|\{start_angle}|\{end_angle}")
      @dxfkit.Ellipse(center~, major~, ratio~, start_param~, end_param~) =>
        println("ELLIPSE|\{h}|\{center.x}|\{center.y}|\{major.x}|\{major.y}|\{ratio}|\{start_param}|\{end_param}")
      @dxfkit.Polyline(vertices~, closed~) => {
        println("POLYLINE|\{h}|\{closed}|\{vertices.length()}")
        for v in vertices {
          println("VERTEX|\{h}|\{v.at.x}|\{v.at.y}|\{v.bulge}")
        }
      }
      @dxfkit.Spline(degree~, knots~, control_points~, weights~) => {
        println("SPLINE|\{h}|\{degree}|\{knots.length()}|\{control_points.length()}|\{weights.length()}")
        for k in knots { println("KNOT|\{h}|\{k}") }
        for p in control_points { println("CONTROL|\{h}|\{p.x}|\{p.y}|\{p.z}") }
      }
      @dxfkit.Insert(at~, block~, scale~, rotation~) =>
        println("INSERT|\{h}|\{block}|\{at.x}|\{at.y}|\{scale.x}|\{scale.y}|\{rotation}")
      _ => ()
    }
    if entity.bounds() is Some(box) {
      println("BOUNDS|\{h}|\{box.min.x}|\{box.min.y}|\{box.max.x}|\{box.max.y}")
    }
  }
  let expansion = drawing.expand(0.002)
  for placed in expansion.placed {
    match placed.flat {
      @dxfkit.Outline(points~, closed~) => {
        println("OUTLINE|\{placed.entity.common.handle}|\{placed.layer}|\{closed}|\{points.length()}")
        for p in points { println("POINT|\{p.x}|\{p.y}") }
      }
      _ => ()
    }
  }
  for reason in expansion.warnings { println("EXPANSION_WARNING|\{reason}") }
  let report = drawing.check({tol: 0.002, min_gap: 0.0})
  println("INCOMPLETE|\{report.has_incomplete_checks()}")
}
