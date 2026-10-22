///|
fn advisor_draw(body : String) -> Drawing {
  build_drawing(scan_tags(@utf8.encode("0\nSECTION\n2\nENTITIES\n" + body + "0\nENDSEC\n0\nEOF\n")))
}

///|
fn advisor_spline(flags : Int, weights : String) -> String {
  "0\nSPLINE\n70\n\{flags}\n71\n2\n72\n6\n73\n3\n40\n0\n40\n0\n40\n0\n40\n1\n40\n1\n40\n1\n" + weights + "10\n0\n20\n0\n10\n1\n20\n2\n10\n2\n20\n0\n"
}

///|
test "advisor closed and periodic splines do not produce false open outlines" {
  for flags in [1, 2, 3] {
    let d = advisor_draw(advisor_spline(flags, ""))
    assert_eq(d.entities().entities[0].kind(), "SPLINE")
    assert_true(d.entities().entities[0].geom is Unknown)
    let report = d.check({ tol: 0.01, min_gap: 0.0 })
    assert_true(report.has_incomplete_checks())
    assert_true(report.to_text().contains("闭合或周期"))
    assert_false(report.to_text().contains("轮廓闭合"))
  }
}

///|
test "advisor spline weight cardinality rejects partial and extra weights" {
  for w in ["41\n2\n", "41\n1\n41\n2\n41\n1\n41\n1\n"] {
    let d = advisor_draw(advisor_spline(4, w))
    assert_true(d.entities().entities[0].geom is Unknown)
    assert_true(d.check({tol: 0.01, min_gap: 0.0}).to_text().contains("权重数量"))
    assert_true(d.check({tol: 0.01, min_gap: 0.0}).has_incomplete_checks())
  }
  for w in ["", "41\n1\n41\n2\n41\n1\n"] {
    let d = advisor_draw(advisor_spline(0, w))
    assert_true(d.entities().entities[0].geom is Spline(..))
    assert_false(d.check({tol: 0.01, min_gap: 0.0}).has_incomplete_checks())
  }
}

///|
test "advisor missing ENDBLK recovery retains next block boundary" {
  let text = "0\nSECTION\n2\nBLOCKS\n0\nBLOCK\n2\nA\n10\n0\n20\n0\n0\nCIRCLE\n10\n0\n20\n0\n40\n1\n0\nBLOCK\n2\nB\n10\n0\n20\n0\n0\nCIRCLE\n10\n5\n20\n0\n40\n1\n0\nENDBLK\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n0\nINSERT\n2\nA\n10\n0\n20\n0\n0\nINSERT\n2\nB\n10\n0\n20\n0\n0\nENDSEC\n0\nEOF\n"
  let d = build_drawing(scan_tags(@utf8.encode(text)))
  assert_eq(d.blocks().blocks.length(), 2)
  assert_eq(d.expand(0.01).placed.length(), 2)
  let r = d.check({tol: 0.01, min_gap: 0.0})
  assert_true(r.has_incomplete_checks())
  assert_true(r.to_text().contains("ENDBLK"))
}

///|
test "advisor ellipse ratio upper boundary and valid unit ratio" {
  for ratio in [0.0, -1.0, 1.2] {
    let d = advisor_draw("0\nELLIPSE\n10\n0\n20\n0\n11\n3\n21\n0\n40\n\{ratio}\n")
    assert_true(d.entities().entities[0].flatten_checked(0.01) is Err(_))
    assert_true(d.check({tol: 0.01, min_gap: 0.0}).has_incomplete_checks())
  }
  let d = advisor_draw("0\nELLIPSE\n10\n0\n20\n0\n11\n3\n21\n0\n40\n1\n")
  assert_false(d.check({tol: 0.01, min_gap: 0.0}).has_incomplete_checks())
}

///|
test "advisor nonzero polyline width and thickness remain partial checks" {
  let base = "0\nLWPOLYLINE\n90\n4\n70\n1\n"
  let points = "10\n0\n20\n0\n10\n2\n20\n0\n10\n2\n20\n1\n10\n0\n20\n1\n"
  for extra in ["43\n5\n", "40\n2\n", "41\n3\n", "39\n1\n"] {
    let d = advisor_draw(base + extra + points)
    assert_true(d.entities().entities[0].geom is Polyline(..))
    let r = d.check({tol: 0.01, min_gap: 0.0})
    assert_true(r.has_incomplete_checks())
    assert_true(r.to_text().contains("仅检查中心线"))
  }
  let d = advisor_draw(base + "43\n0\n40\n0\n41\n0\n39\n0\n" + points)
  assert_false(d.check({tol: 0.01, min_gap: 0.0}).has_incomplete_checks())
}

///|
test "advisor ordinary POLYLINE vertex width preserves centerline with warning" {
  let d = advisor_draw("0\nPOLYLINE\n70\n1\n0\nVERTEX\n10\n0\n20\n0\n40\n2\n0\nVERTEX\n10\n2\n20\n0\n0\nVERTEX\n10\n0\n20\n1\n0\nSEQEND\n")
  assert_true(d.entities().entities[0].geom is Polyline(..))
  assert_true(d.check({tol: 0.01, min_gap: 0.0}).has_incomplete_checks())
  assert_true(d.check({tol: 0.01, min_gap: 0.0}).to_text().contains("顶点含非零宽度"))
}

///|
test "advisor missing ENDBLK at section end is explicit recovery" {
  let d = build_drawing(scan_tags(@utf8.encode("0\nSECTION\n2\nBLOCKS\n0\nBLOCK\n2\nA\n10\n0\n20\n0\n0\nCIRCLE\n10\n0\n20\n0\n40\n1\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n0\nINSERT\n2\nA\n10\n0\n20\n0\n0\nENDSEC\n0\nEOF\n")))
  assert_eq(d.expand(0.01).placed.length(), 1)
  assert_true(d.check({tol: 0.01, min_gap: 0.0}).has_incomplete_checks())
  assert_true(d.blocks().warnings[0].contains("ENDBLK"))
}

///|
test "advisor layer check selection API and compatibility alias agree" {
  for (color, frozen, locked, enabled) in [(7, false, false, true), (-7, false, false, false), (7, true, false, false), (7, false, true, true)] {
    let layer : Layer = {name: "CUT", color, linetype: "CONTINUOUS", frozen, locked, lineweight: -3}
    assert_eq(layer.is_enabled_for_checks(), enabled)
    assert_eq(layer.is_machinable(), enabled)
  }
}

///|
test "advisor global placed and point budgets stop with incomplete report" {
  let body = StringBuilder()
  for i = 0; i < 60; i = i + 1 {
    body.write_string("0\nCIRCLE\n10\n\{i * 10}\n20\n0\n40\n1\n")
  }
  let d = advisor_draw(body.to_string())
  let limits : ExpandLimits = {max_placed: 50, max_points: 10000, max_visits: 1000}
  let exp = d.expand_with_limits(0.01, limits)
  assert_eq(exp.placed.length(), 50)
  assert_true(exp.warnings.any(w => w.contains("输出实体数")))
  assert_true(d.check_with_limits({tol: 0.01, min_gap: 0.0}, limits).has_incomplete_checks())
  let small = d.expand_with_limits(0.01, {max_placed: 50, max_points: 2, max_visits: 1000})
  assert_eq(small.placed.length(), 0)
  assert_true(small.warnings.any(w => w.contains("离散点总数")))
}

///|
test "advisor visits budget also bounds empty block fanout" {
  let text = StringBuilder()
  text.write_string("0\nSECTION\n2\nBLOCKS\n0\nBLOCK\n2\nA\n10\n0\n20\n0\n")
  for _i = 0; _i < 100; _i = _i + 1 {
    text.write_string("0\nINSERT\n2\nB\n10\n0\n20\n0\n")
  }
  text.write_string("0\nENDBLK\n0\nBLOCK\n2\nB\n10\n0\n20\n0\n0\nENDBLK\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n0\nINSERT\n2\nA\n10\n0\n20\n0\n0\nENDSEC\n0\nEOF\n")
  let d = build_drawing(scan_tags(@utf8.encode(text.to_string())))
  let exp = d.expand_with_limits(0.01, {max_placed: 50, max_points: 1000, max_visits: 25})
  assert_eq(exp.placed.length(), 0)
  assert_true(exp.warnings.any(w => w.contains("实体访问次数")))
}

///|
test "advisor shared analysis matches separate report and SVG APIs" {
  let d = advisor_draw("0\nCIRCLE\n10\n0\n20\n0\n40\n2\n")
  let opt : CheckOptions = {tol: 0.01, min_gap: 0.0}
  let result = d.analyze(opt)
  assert_eq(result.report.to_text(), d.check(opt).to_text())
  assert_eq(result.svg, d.to_svg(0.01))
  assert_eq(result.unit, d.declared_unit_label())
}
