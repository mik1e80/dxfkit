///|
test "read budgets stop byte fragmented long lines and bound diagnostics" {
  let limits : ReadLimits = {
    ..ReadLimits::default(),
    max_line_bytes: 32,
    max_warnings: 3,
  }
  let stream = TagStream::with_limits(limits)
  for i = 0; i < 1100; i = i + 1 {
    stream.feed(b"x") |> ignore
  }
  stream.finish() |> ignore
  assert_true(stream.is_limited())
  assert_true(stream.warnings().any(w => w.contains("单行")))
  let bad = TagStream::with_limits(limits)
  for i = 0; i < 600; i = i + 1 {
    bad.feed(b"x\n") |> ignore
  }
  bad.finish() |> ignore
  assert_true(bad.is_limited())
  assert_true(bad.warnings().length() <= 3)
  assert_true(bad.warnings().any(w => w.contains("警告数量")))
}

///|
test "file tag record and string budgets stop with visible incomplete warning" {
  let defaults = ReadLimits::default()
  for
    limits in [
      { ..defaults, max_file_bytes: 5, },
      { ..defaults, max_tags: 1, },
      { ..defaults, max_records: 1, },
      { ..defaults, max_string_bytes: 2, },
    ] {
    let scan = scan_tags_with_limits(
      b"0\nSECTION\n2\nENTITIES\n0\nENDSEC\n0\nEOF\n", limits,
    )
    assert_true(scan.warnings.any(w => w.contains("资源上限")))
  }
}

///|
test "structure diagnostics reach every Drawing report entry" {
  let source = b"0\nSECTION\n2\nENTITIES\n0\nLINE\n10\n0\n20\n0\n11\n1\n21\n0\n0\nVERTEX\n10\n4\n20\n5\n0\nENDSEC\n0\nEOF\n"
  let doc = read_document(source)
  let drawing = build_drawing(scan_tags(source))
  let opt : CheckOptions = { tol: 0.01, min_gap: 0.0, }
  for
    report in [
      doc.drawing.check(opt),
      drawing.check(opt),
      drawing.analyze(opt).report,
    ] {
    assert_true(report.has_incomplete_checks())
    assert_true(report.to_text().contains("VERTEX"))
  }
}

///|
test "geometry work exhaustion is explicit and strict compatible" {
  let drawing = security_drawing(
    accuracy_polyline(
      [(-2.0, -2.0), (2.0, 2.0), (-2.0, 2.0), (2.0, -2.0)],
      true,
      "CUT",
    ),
  )
  let report = drawing.check_with_budget({ tol: 0.001, min_gap: 1.0, }, {
    max_candidates: 1,
  })
  assert_true(report.has_incomplete_checks())
  assert_true(report.to_text().contains("几何候选对"))
}

///|
test "branched endpoint component cannot be a closed contour" {
  let body = accuracy_line(0.0, 0.0, 2.0, 0.0, "CUT") +
    accuracy_line(2.0, 0.0, 1.0, 2.0, "CUT") +
    accuracy_line(1.0, 2.0, 0.0, 0.0, "CUT") +
    accuracy_line(0.0, 0.0, -2.0, 0.0, "CUT")
  let report = accuracy_report(body, 0.001, 0.0)
  assert_true(report.to_text().contains("分叉"))
}

///|
test "scaled lengths avoid overflow and underflow" {
  assert_true(
    (Vec2::new(3.0e200, 4.0e200).length() / 5.0e200 - 1.0).abs() < 1.0e-14,
  )
  assert_true(
    (Vec2::new(3.0e-200, 4.0e-200).length() / 5.0e-200 - 1.0).abs() < 1.0e-14,
  )
}

///|
test "unsafe numeric drawing refuses preview and marks checking incomplete" {
  let d = security_drawing(accuracy_line(-1.0e308, 0.0, 1.0e308, 0.0, "CUT"))
  let result = d.analyze({ tol: 0.01, min_gap: 0.0, })
  assert_true(result.report.has_incomplete_checks())
  assert_false(result.svg.contains("inf"))
  assert_false(result.svg.contains("NaN"))
  assert_false(result.svg.contains("polyline"))
}

///|
fn security_drawing(body : String) -> Drawing {
  drawing_utf8("0\nSECTION\n2\nENTITIES\n" + body + "0\nENDSEC\n0\nEOF\n")
}

///|
test "strict fields distinguish missing wrong type and numeric zero" {
  let r : Record = {
    kind: "CIRCLE",
    common: [Tag::new(10, F64(0.0)), Tag::new(40, Str("bad"))],
    subclasses: [],
  }
  assert_true(r.try_double(20) is Ok(None))
  assert_true(r.require_double(40) is Err(_))
  assert_true(r.require_double(10) is Ok(0.0))
  let d = security_drawing("0\nCIRCLE\n10\n0\n20\n0\n40\ninvalid\n")
  let exp = d.expand(0.01)
  assert_true(exp.warnings.any(w => w.contains("数值")))
  assert_false(exp.placed.any(p => p.flat is Outline(..)))
}

///|
test "duplicate block names are ambiguous and never silently last wins" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nBLOCKS\n0\nBLOCK\n2\nB\n0\nENDBLK\n0\nBLOCK\n2\nB\n0\nENDBLK\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n0\nINSERT\n2\nB\n10\n0\n20\n0\n0\nENDSEC\n0\nEOF\n",
  )
  let exp = d.expand(0.01)
  assert_true(
    exp.warnings.any(w => w.contains("重复") && w.contains("未展开")),
  )
  assert_eq(exp.placed.length(), 0)
  assert_true(d.check({ tol: 0.01, min_gap: 0.0, }).has_incomplete_checks())
}

///|
test "rational spline common weight scaling leaves its curve invariant" {
  let points = [
    Vec3::new(0.0, 0.0, 0.0),
    Vec3::new(1.0, 2.0, 0.0),
    Vec3::new(2.0, 0.0, 0.0),
  ]
  let small = spline_points_checked(
    2,
    [0.0, 0.0, 0.0, 1.0, 1.0, 1.0],
    points,
    [1.0, 0.5, 1.0],
    0.001,
  )
  let large = spline_points_checked(
    2,
    [0.0, 0.0, 0.0, 1.0, 1.0, 1.0],
    points,
    [1.0e308, 5.0e307, 1.0e308],
    0.001,
  )
  match (small, large) {
    (Ok(a), Ok(b)) => {
      assert_eq(a.length(), b.length())
      for i = 0; i < a.length(); i = i + 1 {
        assert_true(a[i].distance(b[i]) < 1.0e-12)
      }
    }
    _ => fail("common scaling must not overflow homogeneous coordinates")
  }
}

///|
test "spline repeated and discontinuous knot boundaries remain explicit" {
  let points = [
    Vec3::zero(),
    Vec3::new(1.0, 0.0, 0.0),
    Vec3::new(2.0, 1.0, 0.0),
    Vec3::new(3.0, 1.0, 0.0),
    Vec3::new(4.0, 0.0, 0.0),
  ]
  assert_true(
    spline_points_checked(
      2,
      [0.0, 0.0, 0.0, 0.5, 0.5, 1.0, 1.0, 1.0],
      points,
      [],
      0.01,
    )
    is Ok(_),
  )
  let discontinuous = points.copy()
  discontinuous.push(Vec3::new(5.0, 0.0, 0.0))
  assert_true(
    spline_points_checked(
      2,
      [0.0, 0.0, 0.0, 0.5, 0.5, 0.5, 1.0, 1.0, 1.0],
      discontinuous,
      [],
      0.01,
    )
    is Err(_),
  )
  assert_true(
    spline_points_checked(
      2,
      [0.0, 0.0, 0.0, 0.5, 0.5, 1.0, 1.0, 1.0],
      points,
      [1.0e-200, 1.0, 1.0, 1.0, 1.0],
      0.01,
    )
    is Err(_),
  )
}

///|
test "dense candidate families stop at shared budget without a complete verdict" {
  let body = StringBuilder()
  for i = 0; i < 40; i = i + 1 {
    body.write_string(
      accuracy_line(0.0, i.to_double(), 100.0, i.to_double(), "CUT"),
    )
  }
  let d = security_drawing(body.to_string())
  let r = d.check_with_budget({ tol: 0.01, min_gap: 2.0, }, {
    max_candidates: 50,
  })
  assert_true(r.has_incomplete_checks())
  assert_true(r.to_text().contains("资源上限"))
}

///|
test "nonzero thickness cannot disappear into a complete XY result" {
  let d = security_drawing("0\nLINE\n10\n0\n20\n0\n11\n1\n21\n0\n39\n1\n")
  let r = d.check({ tol: 0.01, min_gap: 0.0, })
  assert_true(r.has_incomplete_checks())
  assert_true(r.to_text().contains("厚度"))
}
