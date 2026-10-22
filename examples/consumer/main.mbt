///|
/// Application policy: print every diagnostic and optionally fail on warnings.
/// Parsing, entity decoding, geometry and checks all come from dxfkit.
fn main {
  let args = @env.args()
  if args.length() < 2 ||
    args.length() > 3 ||
    (args.length() == 3 && args[2] != "--strict") {
    println("Usage: moon run . -- <file.dxf> [--strict]")
    @sys.exit(2)
    return
  }
  let bytes = @fs.read_file_to_bytes(args[1]) catch {
    @fs.IOError(message) => {
      println("READ_ERROR: \{message}")
      @sys.exit(2)
      return
    }
  }
  // 1. Bytes -> tags -> a structured drawing. Scanner diagnostics are retained.
  let drawing = @dxfkit.build_drawing(@dxfkit.scan_tags(bytes))
  println("UNIT=\{drawing.declared_unit_label()}")

  // 2. Extract public entities and typed fields, without reading implementation.
  let entities = drawing.entities()
  println("ENTITIES=\{entities.entities.length()}")
  for entity in entities.entities {
    println(
      "ENTITY kind=\{entity.common.kind} handle=\{entity.common.handle} layer=\{entity.layer()}",
    )
    match entity.geom {
      @dxfkit.Circle(center~, radius~) =>
        println("CIRCLE center=\{center.x},\{center.y} radius=\{radius}")
      _ => ()
    }
    // 3a. Checked discretization in the entity's own coordinates.
    // INSERT needs Drawing::expand instead. Non-default OCS is unsupported.
    let record = entity.common.record
    if record.get_double(210, 0.0) == 0.0 &&
      record.get_double(220, 0.0) == 0.0 &&
      record.get_double(230, 1.0) == 1.0 {
      match entity.geom {
        @dxfkit.Line(..)
        | @dxfkit.Circle(..)
        | @dxfkit.Arc(..)
        | @dxfkit.Ellipse(..)
        | @dxfkit.Polyline(..)
        | @dxfkit.Spline(..)
        | @dxfkit.Face(..) =>
          match entity.flatten_checked(0.01) {
            Ok(@dxfkit.Outline(points~, closed~)) => {
              println(
                "LOCAL_OUTLINE vertices=\{points.length()} closed=\{closed}",
              )
              if points.length() > 0 {
                println("LOCAL_FIRST=\{points[0].x},\{points[0].y}")
              }
            }
            Ok(_) => println("NO_LOCAL_OUTLINE")
            Err(reason) => println("DISCRETIZATION_ERROR: \{reason}")
          }
        _ => ()
      }
    }
  }

  // 3b. For the complete drawing, use block expansion and world coordinates.
  let expansion = drawing.expand(0.01)
  let mut outlines = 0
  for placed in expansion.placed {
    match placed.flat {
      @dxfkit.Outline(..) => outlines += 1
      _ => ()
    }
  }
  println("WORLD_OUTLINES=\{outlines}")
  for reason in expansion.warnings {
    println("EXPANSION_DIAGNOSTIC: \{reason}")
  }

  // 4. The report includes unsupported and unexamined parts, even with contours.
  // min_gap=0 disables clearance checking; all values use drawing units.
  let report = drawing.check({ tol: 0.01, min_gap: 0.0, })
  println("INCOMPLETE=\{report.has_incomplete_checks()}")
  println(report.to_text())
  if report.has_fatal() ||
    (
      args.length() == 3 &&
      (report.has_incomplete_checks() || report.count(@dxfkit.Warn) > 0)
    ) {
    @sys.exit(1)
  }
}
