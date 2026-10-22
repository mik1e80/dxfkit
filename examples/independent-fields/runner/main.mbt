///|
/// Extract declared fields only. No geometry oracle uses production evaluators.
fn main {
  let args = @env.args()
  let bytes = @fs.read_file_to_bytes(args[1]) catch { _ => return }
  let drawing = @dxfkit.build_drawing(@dxfkit.scan_tags(bytes))
  for e in drawing.entities().entities {
    let h = e.common.handle
    match e.geom {
      @dxfkit.Line(start~, end~) =>
        println(
          "LINE|\{h}|\{start.x}|\{start.y}|\{start.z}|\{end.x}|\{end.y}|\{end.z}",
        )
      @dxfkit.Circle(center~, radius~) =>
        println("CIRCLE|\{h}|\{center.x}|\{center.y}|\{center.z}|\{radius}")
      @dxfkit.Arc(center~, radius~, start_angle~, end_angle~) =>
        println(
          "ARC|\{h}|\{center.x}|\{center.y}|\{center.z}|\{radius}|\{start_angle}|\{end_angle}",
        )
      @dxfkit.Ellipse(center~, major~, ratio~, start_param~, end_param~) =>
        println(
          "ELLIPSE|\{h}|\{center.x}|\{center.y}|\{center.z}|\{major.x}|\{major.y}|\{major.z}|\{ratio}|\{start_param}|\{end_param}",
        )
      @dxfkit.Insert(at~, block~, scale~, rotation~) =>
        println(
          "INSERT|\{h}|\{block}|\{at.x}|\{at.y}|\{at.z}|\{scale.x}|\{scale.y}|\{scale.z}|\{rotation}",
        )
      @dxfkit.Polyline(vertices~, closed~) if e.kind() == "LWPOLYLINE" => {
        println("LWPOLYLINE|\{h}|\{closed}|\{vertices.length()}")
        for v in vertices {
          println("VERTEX|\{h}|\{v.at.x}|\{v.at.y}|\{v.bulge}")
        }
      }
      _ => ()
    }
  }
}
