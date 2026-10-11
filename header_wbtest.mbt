// 白盒测试：HEADER 段（变量表、单位、图纸范围）。
//
// HEADER 和别处长得不一样：变量之间没有组码 0 分隔，靠 `9` 成对，
// 坐标类的变量值是三个 tag。测试围着这两点。
//
// 这里的夹具全部用 `drawing_of` 自己写完整的 HEADER 段，
// **不用 `drawing_utf8`**——它自带一个 HEADER 段，套上去文件里会出现
// 两个 HEADER 段，`section("HEADER")` 只拿得到第一个（这个坑踩过一次）。
// `drawing_of` 定义在 `structure_wbtest.mbt`，白盒测试同属一个包。

// ── HEADER 变量 ─────────────────────────────────────────────────────────

///|
test "HEADER 变量成对解析" {
  // 9 是变量名，后面跟这个变量的值；值的组码随变量而定（1 = 字符串、70 = 整数）
  let d = drawing_of(
    "0\nSECTION\n2\nHEADER\n" +
    "9\n$ACADVER\n1\nAC1027\n" +
    "9\n$INSUNITS\n70\n4\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let header = parse_header(d.section("HEADER").unwrap())
  assert_eq(header.vars.length(), 2)
  assert_true(header.get_string("$ACADVER") == "AC1027")
  assert_eq(header.insunits(), 4)
}

///|
test "坐标类的 HEADER 变量有三个值" {
  // 这是成对扫描最容易写错的地方：$EXTMIN 的值写成 10/20/30 三个 tag。
  // 按「两个两个一组」扫的话，y 和 z 会被当成下一个变量丢掉
  let d = drawing_of(
    "0\nSECTION\n2\nHEADER\n" +
    "9\n$EXTMIN\n10\n-100.0\n20\n-50.0\n30\n0.0\n" +
    "9\n$INSUNITS\n70\n4\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let header = parse_header(d.section("HEADER").unwrap())
  assert_eq(header.vars.length(), 2)
  let p = match header.extmin() {
    Some(p) => p
    None => fail("读不出 $EXTMIN")
  }
  assert_true(p.x == -100.0)
  assert_true(p.y == -50.0)
  assert_true(p.z == 0.0)
  // 后一个变量不能被坐标吃掉
  assert_eq(header.insunits(), 4)
}

///|
test "坐标变量值不够三个时不给点" {
  // $EXTMIN 只写了一半（只有 x、y）就不该当成三维点推断——
  // 宁可说「不知道」，也不要拿 x 当 z 用
  let d = drawing_of(
    "0\nSECTION\n2\nHEADER\n9\n$EXTMIN\n10\n1.0\n20\n2.0\n0\nENDSEC\n0\nEOF\n",
  )
  let header = parse_header(d.section("HEADER").unwrap())
  assert_true(header.extmin() is None)
}

///|
test "单位换算表" {
  // 认得出的换算，认不出的不猜
  assert_true(unit_to_mm(4).unwrap() == 1.0)
  assert_true(unit_to_mm(1).unwrap() == 25.4)
  assert_true(unit_to_mm(6).unwrap() == 1000.0)
  // 0 是「未指定」，最危险的值——差 25.4 倍
  assert_true(unit_to_mm(0) is None)
  assert_true(unit_to_mm(999) is None)
  assert_true(unit_name(0) == "未指定")
}
