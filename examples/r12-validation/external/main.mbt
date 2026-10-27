///|
struct ExternalArrayEvidence {
  file : String
  acadver : String
  polyline_instances : Int
  polyline_vertices : Int
  polyline_xyz_fields : Int
  max_coordinate_error : Double
  circle_instances : Int
  sampled_circle_points : Int
  max_circle_radius_error : Double
  max_circle_start_error : Double
  self_intersection_findings : Int
  linked_attributes_complete : Bool
  full_document_geometry_verified : Bool
} derive(ToJson)

///|
fn main raise {
  let file = "testdata/ezdxf/multi_insert_with_attribs.dxf"
  let drawing = @dxfkit.build_drawing(
    @dxfkit.scan_tags(@fs.read_file_to_bytes(file)),
  )
  let world = drawing.expand_world(0.05)
  let flags = world.placed.filter(p => p.entity.handle() == "31")
  let circles = world.placed.filter(p => p.entity.handle() == "37")
  assert_eq(flags.length(), 25)
  assert_eq(circles.length(), 25)
  // Exact special-angle identities provide an independent analytical reference.
  let cs = (6.0.sqrt() + 2.0.sqrt()) / 4.0
  let sn = (6.0.sqrt() - 2.0.sqrt()) / 4.0
  let vertices = [(0.0, 0.0), (0.0, 5.0), (4.0, 3.0), (0.0, 3.0)]
  let mut coord_error = 0.0
  let mut radius_error = 0.0
  let mut start_error = 0.0
  let mut sampled = 0
  for index, flag in flags {
    assert_eq(flag.instances[0].handle, "3B")
    assert_eq(flag.instances[0].row, index / 5)
    assert_eq(flag.instances[0].column, index % 5)
    let gx = (index % 5).to_double() * 10.0
    let gy = (index / 5).to_double() * 10.0
    match flag.flat {
      @dxfkit.Outline3(points~, closed~) => {
        assert_false(closed)
        assert_eq(points.length(), 4)
        for j, p in points {
          let x = vertices[j].0 + gx
          let y = vertices[j].1 + gy
          coord_error = coord_error
            .max((p.x - (cs * x - sn * y)).abs())
            .max((p.y - (sn * x + cs * y)).abs())
            .max(p.z.abs())
        }
      }
      _ => fail("expected FLAG polyline")
    }
    let center = @dxfkit.Vec3::new(cs * gx - sn * gy, sn * gx + cs * gy, 0.0)
    match circles[index].flat {
      @dxfkit.Outline3(points~, closed~) => {
        assert_true(closed)
        for p in points {
          radius_error = radius_error.max((p.sub(center).length() - 0.4).abs())
          sampled += 1
        }
        start_error = start_error
          .max((points[0].x - center.x - 0.4 * cs).abs())
          .max((points[0].y - center.y - 0.4 * sn).abs())
          .max(points[0].z.abs())
      }
      _ => fail("expected FLAG circle")
    }
  }
  assert_true(
    coord_error < 1.0e-9 && radius_error < 1.0e-9 && start_error < 1.0e-9,
  )
  let report = drawing.check({ tol: 0.05, min_gap: 0.0, })
  let crossings = report.findings.filter(f => f.check == "自相交").length()
  assert_eq(crossings, 0)
  assert_true(report.to_text().contains("25 处轮廓没闭合"))
  assert_true(report.to_text().contains("关联 ATTRIB"))
  assert_true(report.has_incomplete_checks())
  let evidence : ExternalArrayEvidence = {
    file,
    acadver: drawing.version,
    polyline_instances: flags.length(),
    polyline_vertices: 100,
    polyline_xyz_fields: 300,
    max_coordinate_error: coord_error,
    circle_instances: circles.length(),
    sampled_circle_points: sampled,
    max_circle_radius_error: radius_error,
    max_circle_start_error: start_error,
    self_intersection_findings: crossings,
    linked_attributes_complete: false,
    full_document_geometry_verified: false,
  }
  println(@json.to_json(evidence).stringify())
}
