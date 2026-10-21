///|
fn example_drawing() -> @dxfkit.Drawing {
  let text = "0\nSECTION\n2\nENTITIES\n0\nCIRCLE\n10\n10\n20\n20\n40\n2\n0\nENDSEC\n0\nEOF\n"
  @dxfkit.build_drawing(@dxfkit.scan_tags(@utf8.encode(text)))
}

///|
fn main {
  let drawing = example_drawing()
  println("实体数：\{drawing.entities().entities.length()}")
  println(drawing.check({ tol: 0.01, min_gap: 0.0, }).to_text())
  println("SVG 预览已生成：\{drawing.to_svg(0.01).contains("<polygon")}")
}

///|
test "consumer package uses only the public drawing and geometry API" {
  let drawing = example_drawing()
  let es = drawing.entities()
  assert_eq(es.entities.length(), 1)
  match es.entities[0].geom {
    @dxfkit.Circle(center~, radius~) => {
      assert_eq(center.x, 10.0)
      assert_eq(center.y, 20.0)
      assert_eq(radius, 2.0)
    }
    _ => fail("expected a public Circle value")
  }
  assert_eq(drawing.check({ tol: 0.01, min_gap: 0.0, }).count(@dxfkit.Fatal), 0)
  assert_eq(drawing.check({ tol: 0.01, min_gap: 0.0, }).count(@dxfkit.Warn), 0)
  assert_false(drawing.check({ tol: 0.01, min_gap: 0.0, }).has_incomplete_checks())
  assert_true(drawing.to_svg(0.01).contains("<polygon"))
}
