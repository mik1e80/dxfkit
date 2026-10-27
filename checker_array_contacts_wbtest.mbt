///|
test "array endpoint on segment remains a contact after rotation and translation" {
  // FLAG's last endpoint (0,3) lies on its first segment (0,0)-(0,5).
  // An affine transform cannot turn that contact into a proper crossing.
  let body = accuracy_polyline(
    [(0.0, 0.0), (0.0, 5.0), (4.0, 3.0), (0.0, 3.0)],
    false,
    "0",
  )
  let drawing = drawing_with_insert(
    body, "10\n0\n20\n0\n50\n15\n70\n5\n71\n5\n44\n10\n45\n10\n",
  )
  let exp = drawing.expand(0.05)
  assert_eq(exp.placed.length(), 25)
  let report = drawing.check({ tol: 0.05, min_gap: 0.0, })
  accuracy_absent(report, "自相交")
  accuracy_expected(report, "轮廓闭合", Warn, "25")
}

///|
test "array genuine bow tie crossings survive endpoint contact exclusion" {
  let body = accuracy_polyline(
    [(0.0, 0.0), (4.0, 4.0), (0.0, 4.0), (4.0, 0.0)],
    true,
    "0",
  )
  let drawing = drawing_with_insert(
    body, "10\n3\n20\n-8\n50\n15\n70\n5\n71\n5\n44\n10\n45\n10\n",
  )
  let report = drawing.check({ tol: 0.05, min_gap: 0.0, })
  accuracy_expected(report, "自相交", Warn, "25")
}

///|
test "proper crossing farther than endpoint tolerance remains detectable" {
  let report = accuracy_report(
    accuracy_polyline(
      [(-2.0, 0.0), (2.0, 0.0), (2.0, 3.0), (0.0, -3.0)],
      false,
      "CUT",
    ),
    0.001,
    0.0,
  )
  accuracy_expected(report, "自相交", Warn, "CUT")
}
