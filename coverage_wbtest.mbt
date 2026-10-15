///|
test "空图纸不能得到检查无问题的结论" {
  let report = drawing_utf8("0\nSECTION\n2\nENTITIES\n0\nENDSEC\n0\nEOF\n").check({
      tol: 0.05,
      min_gap: 0.0,
    },
  )
  assert_true(first_of(report, "检查覆盖") is Some(_))
}

///|
test "块放大后仍按世界坐标容差离散" {
  let d = drawing_with_insert(
    "0\nCIRCLE\n10\n0\n20\n0\n40\n1\n", "10\n0\n20\n0\n41\n100\n42\n1\n",
  )
  let exp = d.expand(0.01)
  assert_eq(exp.warnings.length(), 0)
  let points = match exp.placed[0].flat {
    Outline(points~, ..) => points
    _ => fail("不是轮廓")
  }
  for i = 0; i < 512; i = i + 1 {
    let angle = 6.283185307179586 * i.to_double() / 512.0
    let expected = Vec2::new(100.0 * @math.cos(angle), @math.sin(angle))
    let mut distance = 1.0e300
    for j = 0; j < points.length(); j = j + 1 {
      distance = distance.min(
        dist_to_segment(expected, points[j], points[(j + 1) % points.length()]),
      )
    }
    assert_true(distance <= 0.010000001)
  }
}

///|
test "已解码但没有轮廓的HATCH明确提示未检查" {
  let report = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nHATCH\n10\n0\n20\n0\n70\n1\n2\nSOLID\n91\n1\n0\nENDSEC\n0\nEOF\n",
  ).check({ tol: 0.05, min_gap: 0.0, })
  assert_true(
    first_of(report, "检查覆盖").unwrap().message.contains("HATCH"),
  )
}

///|
test "不支持的实体保留且提示未检查" {
  let report = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nRAY\n10\n0\n20\n0\n11\n1\n21\n0\n0\nENDSEC\n0\nEOF\n",
  ).check({ tol: 0.05, min_gap: 0.0, })
  assert_true(first_of(report, "检查覆盖").unwrap().message.contains("RAY"))
}

///|
test "检查参数错误明确失败" {
  let d = drawing_utf8("0\nSECTION\n2\nENTITIES\n0\nENDSEC\n0\nEOF\n")
  assert_true(d.check({ tol: 0.0, min_gap: 0.0, }).has_fatal())
  assert_true(d.check({ tol: 0.05, min_gap: -1.0, }).has_fatal())
}

///|
test "变换后溢出的几何不会被当作有效轮廓" {
  let d = drawing_with_insert(
    "0\nLINE\n10\n1e308\n20\n0\n11\n1e308\n21\n1\n", "10\n0\n20\n0\n41\n2\n42\n2\n",
  )
  let exp = d.expand(0.05)
  assert_true(exp.warnings.length() > 0)
  assert_true(exp.placed[0].flat is Empty)
}

///|
test "解析警告进入最终报告" {
  let d = drawing_utf8(
    "不是组码\n0\nSECTION\n2\nENTITIES\n0\nENDSEC\n0\nEOF\n",
  )
  assert_true(
    first_of(d.check({ tol: 0.05, min_gap: 0.0, }), "解析") is Some(_),
  )
}

///|
test "坏数值保留原文并报警告，不静默置零" {
  let scan = scan_tags(bytes_of("10\nnot-a-number\n20\nNaN\n70\n1.5\n0\nEOF\n"))
  assert_eq(scan.warnings.length(), 3)
  assert_true(scan.tags[0].value is Str("not-a-number"))
  assert_true(scan.tags[1].value is Str("NaN"))
  assert_true(scan.tags[2].value is Str("1.5"))
}

///|
test "64位整数不经Double舍入" {
  let scan = scan_tags(bytes_of("160\n9007199254740993\n0\nEOF\n"))
  assert_eq(scan.warnings.length(), 0)
  assert_true(scan.tags[0].value is I64(9007199254740993L))
}

///|
test "CP1251不能被当成CP1252静默解码" {
  let scan = scan_tags(
    bytes_of(
      "0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n9\n$DWGCODEPAGE\n3\nANSI_1251\n0\nENDSEC\n0\nEOF\n",
    ),
  )
  assert_true(scan.encoding is Other(1251))
  assert_eq(scan.warnings.length(), 1)
}
