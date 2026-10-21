// Paired positive/negative checks assert the finding category, severity and
// location/reason. Total warning counts cannot substitute for these assertions.

///|
fn accuracy_report(body : String, tol : Double, gap : Double) -> Report {
  drawing_utf8(
    "0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n" +
    "0\nLAYER\n2\nCUT\n70\n0\n62\n7\n0\nLAYER\n2\nOTHER\n70\n0\n62\n7\n" +
    "0\nENDTAB\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n" +
    body +
    "0\nENDSEC\n0\nEOF\n",
  ).check({ tol, min_gap: gap, })
}

///|
fn accuracy_line(
  x0 : Double,
  y0 : Double,
  x1 : Double,
  y1 : Double,
  layer : String,
) -> String {
  "0\nLINE\n8\n\{layer}\n10\n\{x0}\n20\n\{y0}\n11\n\{x1}\n21\n\{y1}\n"
}

///|
fn accuracy_polyline(
  coords : Array[(Double, Double)],
  closed : Bool,
  layer : String,
) -> String {
  let sb = StringBuilder()
  let flag = if closed { 1 } else { 0 }
  sb.write_string(
    "0\nLWPOLYLINE\n8\n\{layer}\n90\n\{coords.length()}\n70\n\{flag}\n",
  )
  for (x, y) in coords {
    sb.write_string("10\n\{x}\n20\n\{y}\n")
  }
  sb.to_string()
}

///|
fn accuracy_expected(
  report : Report,
  category : String,
  severity : Severity,
  reason : String,
) -> Unit raise {
  assert_true(
    report.findings.any(f => {
      f.check == category &&
      severity_label(f.severity) == severity_label(severity) &&
      f.message.contains(reason)
    }),
    msg="missing \{category}/\{severity_label(severity)}/\{reason}: \{report.to_text()}",
  )
}

///|
fn accuracy_absent(report : Report, category : String) -> Unit raise {
  assert_false(
    report.findings.any(f => f.check == category),
    msg="unexpected \{category}: \{report.to_text()}",
  )
}

///|
fn accuracy_clean(report : Report) -> Unit raise {
  for
    category in [
      "退化几何", "轮廓闭合", "自相交", "重复切割", "最小间隙",
      "检查覆盖", "解析",
    ] {
    accuracy_absent(report, category)
  }
  assert_false(report.has_fatal())
  assert_false(report.has_incomplete_checks())
  assert_eq(report.findings.length(), 0)
}

///|
test "checker accuracy radius has located fatal and warning, positive circle is clean" {
  let negative = accuracy_report(
    "0\nCIRCLE\n5\nNEG\n8\nCUT\n10\n10\n20\n20\n40\n-2\n", 0.01, 0.0,
  )
  accuracy_expected(negative, "退化几何", Fatal, "NEG")
  accuracy_expected(negative, "退化几何", Fatal, "CUT")
  accuracy_expected(negative, "退化几何", Fatal, "半径是负数（-2）")
  let zero = accuracy_report(
    "0\nCIRCLE\n5\nZERO\n8\nCUT\n10\n10\n20\n20\n40\n0\n", 0.01, 0.0,
  )
  accuracy_expected(zero, "退化几何", Warn, "ZERO")
  accuracy_expected(zero, "退化几何", Warn, "半径是 0")
  assert_false(zero.has_fatal())
  accuracy_clean(
    accuracy_report(
      "0\nCIRCLE\n5\nOK\n8\nCUT\n10\n10\n20\n20\n40\n2\n", 0.01, 0.0,
    ),
  )
}

///|
test "checker accuracy closure at below and above endpoint tolerance" {
  for gap in [0.009, 0.01, 0.011] {
    let body = accuracy_line(0.0, 0.0, 4.0, 0.0, "CUT") +
      accuracy_line(4.0, 0.0, 4.0, 3.0, "CUT") +
      accuracy_line(4.0, 3.0, 0.0, 3.0, "CUT") +
      accuracy_line(0.0, 3.0, 0.0, gap, "CUT")
    let report = accuracy_report(body, 0.01, 0.0)
    if gap > 0.01 {
      accuracy_expected(report, "轮廓闭合", Warn, "CUT")
      accuracy_expected(report, "轮廓闭合", Warn, "0.011")
    } else {
      accuracy_clean(report)
    }
    accuracy_absent(report, "自相交")
    accuracy_absent(report, "重复切割")
  }
}

///|
test "checker accuracy bow tie versus normal rectangle, translation preserves decision" {
  for shift in [0.0, -100.0] {
    let bow = accuracy_polyline(
      [(shift, 0.0), (shift + 4.0, 4.0), (shift, 4.0), (shift + 4.0, 0.0)],
      true,
      "CUT",
    )
    let crossed = accuracy_report(bow, 0.001, 0.0)
    accuracy_expected(crossed, "自相交", Warn, "CUT")
    accuracy_absent(crossed, "重复切割")
    accuracy_absent(crossed, "轮廓闭合")
    let rect = accuracy_polyline(
      [(shift, 0.0), (shift + 4.0, 0.0), (shift + 4.0, 4.0), (shift, 4.0)],
      true,
      "CUT",
    )
    accuracy_clean(accuracy_report(rect, 0.001, 0.0))
  }
}

///|
test "checker accuracy overlap measures full reverse and partial lengths, endpoint touch is clean" {
  let first = accuracy_line(0.0, 0.0, 4.0, 0.0, "CUT")
  let reverse = accuracy_report(
    first + accuracy_line(4.0, 0.0, 0.0, 0.0, "CUT"),
    0.01,
    0.0,
  )
  accuracy_expected(reverse, "重复切割", Warn, "共 4 长度")
  accuracy_expected(reverse, "重复切割", Warn, "CUT")
  let partial = accuracy_report(
    first + accuracy_line(2.0, 0.0, 6.0, 0.0, "CUT"),
    0.01,
    0.0,
  )
  accuracy_expected(partial, "重复切割", Warn, "共 2 长度")
  for y in [0.0, 0.011] {
    let clear = accuracy_report(
      first + accuracy_line(4.0, y, 8.0, y, "CUT"),
      0.01,
      0.0,
    )
    accuracy_absent(clear, "重复切割")
    accuracy_absent(clear, "自相交")
  }
  let offset = accuracy_report(
    first + accuracy_line(0.0, 0.011, 4.0, 0.011, "CUT"),
    0.01,
    0.0,
  )
  accuracy_absent(offset, "重复切割")
}

///|
test "checker accuracy clearance below equal above threshold and disabled mode" {
  let outer = accuracy_polyline(
    [(-5.0, -5.0), (5.0, -5.0), (5.0, 5.0), (-5.0, 5.0)],
    true,
    "CUT",
  )
  for gap in [0.5, 1.0, 1.5] {
    let a = 5.0 - gap
    let inner = accuracy_polyline(
      [(-a, -a), (a, -a), (a, a), (-a, a)],
      true,
      "CUT",
    )
    let report = accuracy_report(outer + inner, 0.001, 1.0)
    if gap < 1.0 {
      accuracy_expected(report, "最小间隙", Warn, "0.5")
      accuracy_expected(report, "最小间隙", Warn, "CUT")
    } else {
      accuracy_clean(report)
    }
    accuracy_absent(report, "自相交")
    accuracy_absent(report, "重复切割")
    accuracy_absent(report, "轮廓闭合")
    accuracy_clean(accuracy_report(outer + inner, 0.001, 0.0))
  }
}

///|
test "checker accuracy clearance ignores connected endpoints but catches interior crossing" {
  let horizontal = accuracy_line(-2.0, 0.0, 2.0, 0.0, "CUT")
  let connected = accuracy_report(
    horizontal + accuracy_line(2.0, 0.0, 2.0, 2.0, "CUT"),
    0.001,
    0.5,
  )
  accuracy_absent(connected, "最小间隙")
  let crossing = accuracy_report(
    horizontal + accuracy_line(0.0, -2.0, 0.0, 2.0, "CUT"),
    0.001,
    0.5,
  )
  accuracy_expected(crossing, "最小间隙", Warn, "最小距离 0")
  // Cross-entity intersections are outside this checker's self-intersection item.
  accuracy_absent(crossing, "自相交")
  accuracy_absent(crossing, "重复切割")
}

///|
test "checker accuracy overlap stays within layer boundary" {
  let same = accuracy_line(0.0, 0.0, 4.0, 0.0, "CUT")
  accuracy_expected(
    accuracy_report(same + same, 0.01, 0.0),
    "重复切割",
    Warn,
    "CUT",
  )
  let separate = accuracy_report(
    same + accuracy_line(0.0, 0.0, 4.0, 0.0, "OTHER"),
    0.01,
    0.5,
  )
  accuracy_absent(separate, "重复切割")
  accuracy_absent(separate, "最小间隙")
  accuracy_absent(separate, "图层")
}

///|
test "checker accuracy zero length segment located by handle, normal corners not degenerate" {
  let damaged = "0\nLWPOLYLINE\n5\nDUP-VERTEX\n8\nCUT\n70\n1\n" +
    "10\n0\n20\n0\n10\n4\n20\n0\n10\n4\n20\n0\n10\n4\n20\n3\n10\n0\n20\n3\n"
  let report = accuracy_report(damaged, 0.001, 0.0)
  accuracy_expected(report, "退化几何", Warn, "DUP-VERTEX")
  accuracy_expected(report, "退化几何", Warn, "1 段零长度")
  let rect = accuracy_polyline(
    [(0.0, 0.0), (4.0, 0.0), (4.0, 3.0), (0.0, 3.0)],
    true,
    "CUT",
  )
  accuracy_clean(accuracy_report(rect, 0.001, 0.0))
}
