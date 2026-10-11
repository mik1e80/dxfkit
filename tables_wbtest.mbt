// 白盒测试：TABLES 段（图层、线型、文字样式、块记录）。
//
// 这一段最典型的坑是**组码 70 含义随子类变**——表头的 70 是
// 「表里有多少项」，图层记录的 70 是「标志位」。第一条测试拿同一份
// 文件里的两个 70 对质，证明取字段必须指定子类。
//
// `drawing_of` / `drawing_utf8` 定义在 `structure_wbtest.mbt`。

// ── 子类撞车 ────────────────────────────────────────────────────────────

///|
test "同一个组码在不同子类里含义不同" {
  // 这是子类机制存在的**唯一理由**，也是最容易写错的地方。
  // 组码 70 在 AcDbSymbolTable 里是「表里有多少项」，
  // 在 AcDbLayerTableRecord 里是「图层标志位」——同一份文件里两个都有
  let d = drawing_utf8(
    "0\nSECTION\n2\nTABLES\n" +
    "0\nTABLE\n2\nLAYER\n100\nAcDbSymbolTable\n70\n1\n" +
    "0\nLAYER\n100\nAcDbSymbolTableRecord\n100\nAcDbLayerTableRecord\n" +
    "2\n轮廓\n70\n4\n" +
    "0\nENDTAB\n0\nENDSEC\n0\nEOF\n",
  )
  let tables = parse_tables(d.section("TABLES").unwrap())
  assert_eq(tables.layers.length(), 1)
  // 取到了图层那条记录的 70（4 = 锁定），不是表头那条的 70（1 = 一项）
  assert_true(tables.layers[0].locked)
  assert_false(tables.layers[0].frozen)
}

// ── 图层 ────────────────────────────────────────────────────────────────

///|
test "图层的开关用颜色的符号表示" {
  // DXF 不单独给一个「开关」标志位——**负的颜色值表示图层关闭**。
  // 不看规范很难猜到这一条
  let d = drawing_utf8(
    "0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n" +
    "0\nLAYER\n100\nAcDbLayerTableRecord\n2\n开着的\n70\n0\n62\n3\n" +
    "0\nLAYER\n100\nAcDbLayerTableRecord\n2\n关着的\n70\n0\n62\n-3\n" +
    "0\nENDTAB\n0\nENDSEC\n0\nEOF\n",
  )
  let tables = parse_tables(d.section("TABLES").unwrap())
  assert_eq(tables.layers.length(), 2)
  let on = tables.layer("开着的").unwrap()
  let off = tables.layer("关着的").unwrap()
  assert_false(on.is_off())
  assert_true(off.is_off())
  // 取绝对值才是真正的颜色索引
  assert_eq(off.color_index(), 3)
}

///|
test "冻结和锁定是标志位的不同位" {
  // 1 = 冻结、4 = 锁定。两者的加工含义完全不同：
  // 冻结的图层不切，锁定的图层**照样切**（锁定只是防误编辑）
  let d = drawing_utf8(
    "0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n" +
    "0\nLAYER\n100\nAcDbLayerTableRecord\n2\n冻的\n70\n1\n62\n7\n" +
    "0\nLAYER\n100\nAcDbLayerTableRecord\n2\n锁的\n70\n4\n62\n7\n" +
    "0\nLAYER\n100\nAcDbLayerTableRecord\n2\n冻加锁\n70\n5\n62\n7\n" +
    "0\nENDTAB\n0\nENDSEC\n0\nEOF\n",
  )
  let t = parse_tables(d.section("TABLES").unwrap())
  assert_true(t.layer("冻的").unwrap().frozen)
  assert_false(t.layer("冻的").unwrap().locked)
  assert_false(t.layer("锁的").unwrap().frozen)
  assert_true(t.layer("锁的").unwrap().locked)
  // 位可以叠加
  assert_true(t.layer("冻加锁").unwrap().frozen)
  assert_true(t.layer("冻加锁").unwrap().locked)
  // 冻的不能切，锁的能切
  assert_false(t.layer("冻的").unwrap().is_machinable())
  assert_true(t.layer("锁的").unwrap().is_machinable())
}

// ── 表的层次 ────────────────────────────────────────────────────────────

///|
test "四张表分门别类，不认识的表整个跳过" {
  // VPORT 本项目不关心，跳过；其余四张各归各的
  let d = drawing_utf8(
    "0\nSECTION\n2\nTABLES\n" +
    "0\nTABLE\n2\nVPORT\n0\nVPORT\n2\n*Active\n70\n0\n0\nENDTAB\n" +
    "0\nTABLE\n2\nLTYPE\n0\nLTYPE\n2\nCONTINUOUS\n70\n0\n" +
    "0\nLTYPE\n2\nDASHED\n70\n0\n0\nENDTAB\n" +
    "0\nTABLE\n2\nSTYLE\n0\nSTYLE\n2\nStandard\n70\n0\n0\nENDTAB\n" +
    "0\nTABLE\n2\nBLOCK_RECORD\n0\nBLOCK_RECORD\n2\n*Model_Space\n70\n0\n0\nENDTAB\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let t = parse_tables(d.section("TABLES").unwrap())
  assert_eq(t.layers.length(), 0)
  assert_eq(t.linetypes.length(), 2)
  assert_true(t.linetypes[0] == "CONTINUOUS")
  assert_true(t.linetypes[1] == "DASHED")
  assert_eq(t.text_styles.length(), 1)
  assert_true(t.text_styles[0] == "Standard")
  assert_eq(t.block_records.length(), 1)
  assert_true(t.block_records[0] == "*Model_Space")
}

///|
test "表里的记录要有 TABLE 包着才算数" {
  // 不属于任何 TABLE 的散记录是坏文件——跳过要按 TABLE/ENDTAB 的
  // 层次跳，不能见着 LAYER 就当图层收
  let d = drawing_utf8(
    "0\nSECTION\n2\nTABLES\n0\nLAYER\n2\n散落的\n70\n0\n62\n7\n0\nENDSEC\n0\nEOF\n",
  )
  let t = parse_tables(d.section("TABLES").unwrap())
  assert_eq(t.layers.length(), 0)
}
