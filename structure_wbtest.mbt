// 白盒测试：结构层（段 / 记录 / 子类切分）。
//
// 这一层的活儿是「切」——把 tag 流切成有层次的骨架。所以测试也围着
// 「切得对不对」：子类有没有正确分段、段有没有正确收尾。
//
// 相关的测试在兄弟文件里：老格式的子类名合成在 `subclass_wbtest.mbt`，
// HEADER 变量在 `header_wbtest.mbt`，TABLES 在 `tables_wbtest.mbt`。

///|
/// 从一段文本造出图纸骨架。
///
/// 定义在这里，**兄弟 wbtest 文件共用**——白盒测试同属一个包，
/// 跨文件可见（`bytes_of` 也一样，定义在 `reader_ascii_wbtest.mbt`）。
fn drawing_of(text : String) -> Drawing {
  build_drawing(scan_tags(bytes_of(text)))
}

///|
/// 同上，但前面垫一个声明 AC1027 的 HEADER。
///
/// **测试里凡是有中文的都得走这个**：没有 HEADER 时编码会退回 CP1252，
/// UTF-8 的中文会被解成乱码。那不是 bug，是 `decide_encoding` 的正确行为
/// （文件里没有任何版本信息时不该猜），单独在 `reader_ascii_wbtest.mbt` 里测过。
///
/// **注意它已经自带一个 HEADER 段**：要测 HEADER 段本身时别再用它，
/// 否则文件里会有两个 HEADER 段，`section("HEADER")` 只拿得到第一个。
/// 那种情况用 `drawing_of` 写完整的一段。
fn drawing_utf8(text : String) -> Drawing {
  drawing_of(
    "0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1027\n0\nENDSEC\n" + text,
  )
}

// ── 记录与子类 ──────────────────────────────────────────────────────────

///|
test "一条记录按 100 切成子类" {
  // 这是 DXF 最有特点的地方：100 一出现，后面组码的含义就换了类
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nCIRCLE\n5\n2D\n330\n17\n100\nAcDbEntity\n8\n0\n100\nAcDbCircle\n" +
    "10\n1.0\n20\n2.0\n30\n0.0\n40\n5.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let entities = match d.section("ENTITIES") {
    Some(s) => s
    None => fail("没有 ENTITIES 段")
  }
  assert_eq(entities.records.length(), 1)
  let circle = entities.records[0]
  assert_true(circle.kind == "CIRCLE")
  // 第一个 100 之前的字段进公共部分（句柄、所有者）
  assert_true(circle.get_string(5) == "2D")
  assert_true(circle.get_string(330) == "17")
  // 两个子类
  assert_eq(circle.subclasses.length(), 2)
  assert_true(circle.subclasses[0].name == "AcDbEntity")
  assert_true(circle.subclasses[1].name == "AcDbCircle")
  // 字段落到了正确的子类里
  assert_true(circle.get_in("AcDbEntity", 8).unwrap().value.as_string() == "0")
  let radius = circle.get_in("AcDbCircle", 40).unwrap()
  assert_true(radius.value.as_double() == 5.0)
}

///|
test "按组码取字段会扫遍公共部分和所有子类" {
  // 取字段不该要求调用方知道字段在哪个子类里——常用组码不会撞车
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nCIRCLE\n5\n2D\n100\nAcDbEntity\n8\n轮廓\n100\nAcDbCircle\n40\n3.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let circle = d.section("ENTITIES").unwrap().records[0]
  // 句柄在公共部分
  assert_true(circle.get_string(5) == "2D")
  // 图层在第一个子类里
  assert_true(circle.get_string(8) == "轮廓")
  // 半径在第二个子类里
  assert_true(circle.get_double(40, 0.0) == 3.0)
}

// ── 段 ──────────────────────────────────────────────────────────────────

///|
test "段按 SECTION 和 ENDSEC 分组" {
  let d = drawing_of(
    "0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n0\nENDSEC\n" +
    "0\nSECTION\n2\nENTITIES\n0\nENDSEC\n0\nEOF\n",
  )
  assert_eq(d.sections.length(), 2)
  assert_true(d.sections[0].name == "HEADER")
  assert_true(d.sections[1].name == "ENTITIES")
  assert_true(d.version == "AC1009")
}

///|
test "没有 ENDSEC 收尾时尽力而为" {
  // 坏文件不该让整份读不出来——把已经读到的收进段里，报一条警告
  let d = drawing_of("0\nSECTION\n2\nENTITIES\n0\nCIRCLE\n0\nEOF\n")
  assert_eq(d.sections.length(), 1)
  assert_true(d.sections[0].name == "ENTITIES")
  assert_true(d.warnings.length() > 0)
}

///|
test "没有 HEADER 段时版本是空串" {
  // 最小 DXF（35 字节）就是这样，连 HEADER 都没有。
  // **不要猜一个版本出来**——猜错了后面按错误的规则解析
  let d = drawing_of("0\nSECTION\n2\nENTITIES\n0\nENDSEC\n0\nEOF\n")
  assert_true(d.version == "")
}

// ── 取字段的边界 ────────────────────────────────────────────────────────

///|
test "缺字段时用调用方给的默认值" {
  // 默认值由调用方定，不是固定 0.0：坐标缺省成 0 合理，
  // 半径缺省成 0 就变成「一个退化的圆」，性质完全不同
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nCIRCLE\n8\n0\n0\nENDSEC\n0\nEOF\n",
  )
  let circle = d.section("ENTITIES").unwrap().records[0]
  assert_true(circle.get_double(40, -1.0) == -1.0)
  assert_eq(circle.get_int(70, 99), 99)
  assert_true(circle.get_string(2) == "")
}

///|
test "同一个组码出现多次时能全部取出来" {
  // LWPOLYLINE 的顶点就是同一组码重复（每个顶点一对 10/20）
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nLWPOLYLINE\n100\nAcDbPolyline\n90\n3\n" +
    "10\n0.0\n20\n0.0\n10\n1.0\n20\n0.0\n10\n1.0\n20\n1.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let pl = d.section("ENTITIES").unwrap().records[0]
  assert_eq(pl.count_code(10), 3)
  assert_eq(pl.all_of(20).length(), 3)
  assert_true(pl.all_of(10)[1].value.as_double() == 1.0)
}
