// 白盒测试：子类名合成（老格式对齐新格式）。
//
// 老版本（R10/R12）一个 `100` 标记都没有，字段全糊在公共部分里。
// 合成的目的是让上层看到的记录形状在新旧版本之间一致——
// 不用为老格式分两套代码写。
//
// `drawing_of` / `drawing_utf8` 定义在 `structure_wbtest.mbt`，
// 白盒测试同属一个包，跨文件可见。

// ── 老格式（没有 100 标记）──────────────────────────────────────────────

///|
test "老格式的记录没有子类" {
  // R10/R12 一个 100 都没有，字段全在公共部分
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nLINE\n8\n0\n10\n0.0\n20\n0.0\n30\n0.0\n" +
    "11\n1.0\n21\n1.0\n31\n0.0\n0\nENDSEC\n0\nEOF\n",
  )
  let line = d.section("ENTITIES").unwrap().records[0]
  assert_true(line.is_legacy())
  assert_eq(line.subclasses.length(), 0)
  // 但字段照样取得出来——取字段只看组码
  assert_true(line.get_double(10, -1.0) == 0.0)
  assert_true(line.get_double(11, -1.0) == 1.0)
}

///|
test "老格式按记录类型合成子类名" {
  // 合成之后，新旧两种格式对上层是同一个形状——实体层不用分两套写
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nCIRCLE\n8\n0\n10\n0.0\n20\n0.0\n30\n0.0\n" +
    "40\n5.0\n0\nENDSEC\n0\nEOF\n",
  )
  let circle = d.section("ENTITIES").unwrap().records[0]
  let names = circle.subclass_names()
  assert_eq(names.length(), 1)
  assert_true(names[0] == "AcDbCircle")
  // 实体还要补上 AcDbEntity，和新格式对齐
  let classes = circle.effective_classes()
  assert_eq(classes.length(), 2)
  assert_true(classes[0] == "AcDbEntity")
  assert_true(classes[1] == "AcDbCircle")
}

///|
test "新格式的子类列表原样返回" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nCIRCLE\n100\nAcDbEntity\n8\n0\n" +
    "100\nAcDbCircle\n40\n5.0\n0\nENDSEC\n0\nEOF\n",
  )
  let circle = d.section("ENTITIES").unwrap().records[0]
  assert_false(circle.is_legacy())
  let names = circle.subclass_names()
  assert_eq(names.length(), 2)
  assert_true(names[0] == "AcDbEntity")
  // 已经是 AcDbEntity 开头了，不该重复补
  assert_eq(circle.effective_classes().length(), 2)
}

///|
test "结构性的记录不补 AcDbEntity" {
  // LAYER 是表记录不是实体，补上 AcDbEntity 会误导上层
  let d = drawing_utf8(
    "0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n" +
    "0\nLAYER\n2\n轮廓\n70\n0\n62\n7\n" +
    "0\nENDTAB\n0\nENDSEC\n0\nEOF\n",
  )
  let layer = d.section("TABLES").unwrap().records[1]
  assert_true(layer.kind == "LAYER")
  let classes = layer.effective_classes()
  assert_eq(classes.length(), 1)
  assert_true(classes[0] == "AcDbLayerTableRecord")
}
