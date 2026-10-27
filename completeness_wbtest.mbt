///|
fn completeness_drawing(body : String) -> Drawing {
  delivery_drawing("0\nCIRCLE\n10\n100\n20\n100\n40\n1\n" + body)
}

///|
test "normal contour cannot mask unsupported entities in the final verdict" {
  let d = completeness_drawing("0\nRAY\n10\n0\n20\n0\n11\n1\n21\n0\n")
  assert_true(d.expand(0.05).placed.any(p => p.flat is Outline(..)))
  let report = d.check({ tol: 0.05, min_gap: 0.0, })
  assert_true(report.to_text().contains("RAY"))
  assert_true(report.to_text().contains("检查不完整"))
  assert_true(report.has_incomplete_checks())
}

///|
test "normal contour cannot mask a WCS contour outside the XY inspection plane" {
  let d = completeness_drawing(
    "0\nCIRCLE\n10\n0\n20\n0\n40\n2\n210\n1\n230\n0\n",
  )
  let report = d.check({ tol: 0.05, min_gap: 0.0, })
  assert_true(report.to_text().contains("已转换 WCS"))
  assert_true(report.verdict().contains("检查不完整"))
  assert_true(report.has_incomplete_checks())
}

///|
test "normal contour cannot mask lost polyline vertices in the final verdict" {
  let d = completeness_drawing(
    "0\nLWPOLYLINE\n10\n0\n20\n0\n10\n1\n10\n2\n20\n0\n",
  )
  let report = d.check({ tol: 0.05, min_gap: 0.0, })
  assert_true(report.to_text().contains("顶点"))
  assert_true(report.verdict().contains("检查不完整"))
  assert_true(report.has_incomplete_checks())
}

///|
test "normal contour cannot mask failed curve discretization" {
  let d = completeness_drawing("0\nSPLINE\n71\n3\n10\n0\n20\n0\n")
  let report = d.check({ tol: 0.05, min_gap: 0.0, })
  assert_true(report.to_text().contains("未能离散"))
  assert_true(report.verdict().contains("检查不完整"))
  assert_true(report.has_incomplete_checks())
}

///|
test "SPLINE cannot silently discard a control point then accept the shorter curve" {
  // After silently dropping (1, missing Y), the four knots happen to be valid
  // for the two surviving controls. A generic knot-count error will not catch it.
  let d = completeness_drawing(
    "0\nSPLINE\n71\n1\n40\n0\n40\n0\n40\n1\n40\n1\n" +
    "10\n0\n20\n0\n10\n1\n10\n2\n20\n0\n",
  )
  let es = d.entities()
  assert_true(
    es.warnings.any(w => w.contains("SPLINE") && w.contains("控制点")),
  )
  assert_false(es.entities[1].is_decoded())
  let report = d.check({ tol: 0.05, min_gap: 0.0, })
  assert_true(report.verdict().contains("检查不完整"))
  assert_true(report.has_incomplete_checks())
}

///|
test "incomplete checks remain visible when a fatal geometry finding also exists" {
  let d = completeness_drawing("0\nCIRCLE\n10\n0\n20\n0\n40\n-1\n0\nRAY\n")
  let report = d.check({ tol: 0.05, min_gap: 0.0, })
  assert_true(report.has_fatal())
  assert_true(report.verdict().contains("严重问题"))
  assert_true(report.verdict().contains("检查不完整"))
  assert_true(report.has_incomplete_checks())
}

///|
test "invalid check parameters cannot produce a completed-check verdict" {
  let report = completeness_drawing("").check({ tol: 0.0, min_gap: 0.0, })
  assert_true(report.has_fatal())
  assert_true(report.verdict().contains("检查不完整"))
  assert_true(report.has_incomplete_checks())
}

///|
test "a supported open contour warning is not itself a coverage failure" {
  let report = completeness_drawing("0\nLINE\n10\n0\n20\n0\n11\n2\n21\n0\n").check({
      tol: 0.05,
      min_gap: 0.0,
    },
  )
  assert_true(report.count(Warn) > 0)
  assert_false(report.verdict().contains("检查不完整"))
  assert_false(report.has_incomplete_checks())
}

///|
test "normal supported geometry keeps its covered-check verdict" {
  let report = completeness_drawing("").check({ tol: 0.05, min_gap: 0.0, })
  assert_eq(report.count(Warn), 0)
  assert_false(report.verdict().contains("检查不完整"))
  assert_false(report.has_incomplete_checks())
  assert_true(report.verdict().contains("已覆盖"))
}

///|
test "SPLINE count mismatches enter the same incomplete-input report" {
  let d = completeness_drawing(
    "0\nSPLINE\n71\n1\n72\n5\n73\n3\n40\n0\n40\n0\n40\n1\n40\n1\n" +
    "10\n0\n20\n0\n10\n2\n20\n0\n",
  )
  let warnings = d.entities().warnings
  assert_true(warnings.any(w => w.contains("声明控制点数")))
  assert_true(warnings.any(w => w.contains("声明节点数")))
  assert_true(d.check({ tol: 0.05, min_gap: 0.0, }).has_incomplete_checks())
}

///|
test "SPLINE orphan Y and unfinished final control cannot be silently dropped" {
  for bad_control in ["20\n7\n", "10\n7\n", "30\n7\n"] {
    let d = completeness_drawing(
      "0\nSPLINE\n71\n1\n40\n0\n40\n0\n40\n1\n40\n1\n" +
      "10\n0\n20\n0\n30\n0\n10\n2\n20\n0\n30\n0\n" +
      bad_control,
    )
    assert_false(d.entities().entities[1].is_decoded())
    assert_true(d.check({ tol: 0.05, min_gap: 0.0, }).has_incomplete_checks())
  }
}

///|
test "discretization resource limit does not erase supported sibling geometry" {
  let d = completeness_drawing("0\nCIRCLE\n10\n0\n20\n0\n40\n1e10\n")
  let placed = d.expand(0.05).placed
  assert_true(placed[0].flat is Outline(..))
  assert_true(placed[1].flat is Empty)
  let report = d.check({ tol: 0.05, min_gap: 0.0, })
  assert_true(report.has_incomplete_checks())
  assert_true(report.to_text().contains("4096"))
}
