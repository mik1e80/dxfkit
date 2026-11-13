///|
fn near(a : Double, b : Double) -> Unit raise {
  assert_true((a - b).abs() <= 1.0e-8)
}

///|
fn verify() -> Unit raise {
  let results : Array[Json] = []
  for
    (name, holes) in [
      ("01-four-hole-plate", 4),
      ("02-rectangle", 0),
      ("03-offset-ellipse", -1),
    ] {
    let source = @fs.read_file_to_bytes(
      "examples/cad-r12/models/" + name + ".dxf",
    )
    let doc = @dxfkit.read_document(source)
    assert_true(doc.profile is @dxfkit.R12)
    assert_eq(doc.drawing.version, "AC1009")
    assert_eq(doc.read_warnings.length(), 0)
    let es = doc.drawing.entities()
    let exp = doc.drawing.expand(0.002)
    assert_eq(es.warnings.length(), 0)
    assert_eq(exp.warnings.length(), 0)
    let report = doc.drawing.check({ tol: 0.002, min_gap: 0.0, })
    assert_eq(report.count(@dxfkit.Fatal), 0)
    assert_eq(report.count(@dxfkit.Warn), if holes < 0 { 1 } else { 0 })
    if holes < 0 {
      assert_true(report.to_text().contains("轮廓没闭合"))
    }
    assert_false(report.has_incomplete_checks())
    let mut max_error = 0.0
    let mut vertices = 0
    if holes >= 0 {
      let lines = es.entities.filter(e => e.kind() == "LINE")
      let circles = es.entities.filter(e => e.kind() == "CIRCLE")
      assert_eq(lines.length(), 4)
      assert_eq(circles.length(), holes)
      assert_eq(es.entities.length(), 4 + holes)
      let degrees = [0, 0, 0, 0]
      let mut length = 0.0
      let mut area2 = 0.0
      for line in lines {
        match line.geom {
          @dxfkit.Line(start~, end~) => {
            let a = start.xy()
            let b = end.xy()
            near(start.z, 0.0)
            near(end.z, 0.0)
            length += a.distance(b)
            area2 += a.x * b.y - a.y * b.x
            for p in [a, b] {
              let index = if p.x == 0.0 && p.y == 0.0 {
                0
              } else if p.x == 100.0 && p.y == 0.0 {
                1
              } else if p.x == 100.0 && p.y == 60.0 {
                2
              } else if p.x == 0.0 && p.y == 60.0 {
                3
              } else {
                fail("unexpected rectangle endpoint")
              }
              degrees[index] += 1
            }
          }
          _ => fail("expected LINE")
        }
      }
      for degree in degrees {
        assert_eq(degree, 2)
      }
      near(length, 320.0)
      near(area2.abs() / 2.0, 6000.0)
      let seen = [false, false, false, false]
      for circle in circles {
        match circle.geom {
          @dxfkit.Circle(center~, radius~) => {
            near(radius, 3.0)
            near(center.z, 0.0)
            let centers = [
              (10.0, 10.0),
              (90.0, 10.0),
              (90.0, 50.0),
              (10.0, 50.0),
            ]
            let mut found = false
            for i, (x, y) in centers {
              if center.x == x && center.y == y {
                assert_false(seen[i])
                seen[i] = true
                found = true
              }
            }
            assert_true(found)
          }
          _ => fail("expected CIRCLE")
        }
      }
      for p in exp.placed {
        match (p.entity.geom, p.flat) {
          (@dxfkit.Circle(center~, radius~), @dxfkit.Outline(points~, closed~)) => {
            assert_true(closed)
            for point in points {
              max_error = max_error.max(
                (point.distance(center.xy()) - radius).abs(),
              )
              vertices += 1
            }
          }
          _ => ()
        }
      }
      near(max_error, 0.0)
    } else {
      assert_eq(es.entities.length(), 1)
      assert_eq(es.entities[0].kind(), "POLYLINE")
      assert_eq(exp.placed.length(), 1)
      let raw = doc.records.filter(r => r.kind == "VERTEX")
      match exp.placed[0].flat {
        @dxfkit.Outline(points~, closed~) => {
          assert_false(closed)
          assert_eq(points.length(), raw.length())
          assert_true(points.length() >= 4)
          for i, point in points {
            let record : @dxfkit.Record = {
              kind: "VERTEX",
              common: raw[i].tags,
              subclasses: [],
            }
            let expected = record.point(0).unwrap().xy()
            near(point.x, expected.x)
            near(point.y, expected.y)
            let x = (point.x - 10.0) / 10.0
            let y = (point.y - 20.0) / 5.0
            max_error = max_error.max((x * x + y * y - 1.0).abs())
          }
          vertices = points.length()
        }
        _ => fail("expected CAD-exported polygon")
      }
      near(max_error, 0.0)
    }
    results.push({
      "model": name,
      "version": doc.drawing.version,
      "entities": es.entities.length(),
      "sampled_vertices": vertices,
      "max_equation_error": max_error,
      "incomplete": report.has_incomplete_checks(),
      "warnings": report.count(@dxfkit.Warn),
      "expected_strict_exit": if holes < 0 {
        1
      } else {
        0
      },
      "native_closed_ellipse_became_open_polyline": holes < 0,
      "unit": doc.drawing.declared_unit_label(),
      "passed": true,
    })
  }
  println(
    (
      {
        "suite": "FreeCAD-native-R12",
        "passed": results.length(),
        "total": 3,
        "cases": results,
      } : Json).stringify(indent=2),
  )
}

///|
fn main raise {
  verify() catch {
    err => {
      println("\{err}")
      fail("CAD verification failed")
    }
  }
}
