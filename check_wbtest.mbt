// 白盒测试：加工前检查（退化几何、文字未转曲线、图层提醒）。
//
// `drawing_of` / `drawing_utf8` 定义在 `structure_wbtest.mbt`。

///|
/// 找某个检查项的第一条发现。
fn first_of(report : Report, check : String) -> Finding? {
  for f in report.findings {
    if f.check == check {
      return Some(f)
    }
  }
  None
}

///|
test "文字未转曲线：按图层汇总" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n" +
    "0\nLAYER\n100\nAcDbLayerTableRecord\n2\n标注\n70\n0\n62\n7\n" +
    "0\nLAYER\n100\nAcDbLayerTableRecord\n2\n轮廓\n70\n0\n62\n7\n" +
    "0\nENDTAB\n0\nENDSEC\n" +
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nTEXT\n8\n标注\n10\n0.0\n20\n0.0\n40\n1.0\n1\nA\n" +
    "0\nTEXT\n8\n标注\n10\n1.0\n20\n0.0\n40\n1.0\n1\nB\n" +
    "0\nLWPOLYLINE\n8\n轮廓\n100\nAcDbPolyline\n70\n1\n" +
    "10\n0.0\n20\n0.0\n10\n1.0\n20\n0.0\n10\n1.0\n20\n1.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let r = d.check(0.01)
  assert_eq(r.count(Warn), 1)
  let f = match first_of(r, "文字未转曲线") {
    Some(f) => f
    None => fail("没报文字")
  }
  assert_true(f.message.contains("标注"))
  assert_true(f.message.contains("2"))
}

///|
test "半径非正的圆：负的致命、零的警告" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nCIRCLE\n5\n1A\n10\n0.0\n20\n0.0\n40\n-2.0\n" +
    "0\nCIRCLE\n5\n1B\n10\n5.0\n20\n0.0\n40\n0.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let r = d.check(0.01)
  assert_eq(r.count(Fatal), 1)
  // 零半径的报「退化成一个点」；单点轮廓不重复报
  assert_eq(r.count(Warn), 1)
  assert_true(r.has_fatal())
  assert_true(r.verdict().contains("不能上机床"))
}

///|
test "零长度线段被报出" {
  // 两个重合的顶点接一条线
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nLWPOLYLINE\n100\nAcDbPolyline\n70\n0\n" +
    "10\n0.0\n20\n0.0\n10\n0.0\n20\n0.0\n10\n1.0\n20\n0.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let r = d.check(0.01)
  let f = match first_of(r, "退化几何") {
    Some(f) => f
    None => fail("没报退化几何")
  }
  assert_true(f.message.contains("零长度"))
}

///|
test "冻结图层上的实体给提示" {
  // 实体画在冻结图层上不一定有问题（可能是辅助线），所以是 Info
  let d = drawing_utf8(
    "0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n" +
    "0\nLAYER\n100\nAcDbLayerTableRecord\n2\n辅助\n70\n1\n62\n7\n" +
    "0\nENDTAB\n0\nENDSEC\n" +
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nLINE\n8\n辅助\n10\n0.0\n20\n0.0\n11\n1.0\n21\n0.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let r = d.check(0.01)
  assert_eq(r.count(Info), 1)
  assert_eq(r.count(Warn), 0)
  assert_true(first_of(r, "图层").unwrap().message.contains("冻结"))
}

///|
test "展开失败进检查报告" {
  // 引用不存在的块是解析级的问题，也必须出现在结论里
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nINSERT\n10\n0.0\n20\n0.0\n2\n没有\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let r = d.check(0.01)
  assert_eq(r.count(Warn), 1)
  assert_true(first_of(r, "解析").unwrap().message.contains("没有"))
}

///|
test "干净图纸零发现" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nLWPOLYLINE\n100\nAcDbPolyline\n70\n1\n" +
    "10\n0.0\n20\n0.0\n10\n10.0\n20\n0.0\n10\n10.0\n20\n5.0\n" +
    "10\n0.0\n20\n5.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let r = d.check(0.01)
  assert_eq(r.findings.length(), 0)
  assert_true(r.verdict().contains("没发现问题"))
}

// ── 轮廓闭合 ────────────────────────────────────────────────────────────

///|
test "首尾相接的线段串成闭合轮廓" {
  // 三条线拼一个三角形，端点在容差内对上——不该报
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nLINE\n10\n0.0\n20\n0.0\n11\n1.0\n21\n0.0\n" +
    "0\nLINE\n10\n1.0\n20\n0.0\n11\n1.0\n21\n1.0\n" +
    "0\nLINE\n10\n1.0\n20\n1.0\n11\n0.0\n21\n0.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let r = d.check(0.001)
  assert_eq(r.count(Fatal), 0)
  assert_eq(r.count(Warn), 0)
}

///|
test "缺一边的轮廓被报出，缝宽对得上" {
  // 三角形缺一条斜边：两个松散端点是 (0,0) 和 (1,1)，缝 = √2
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nLINE\n10\n0.0\n20\n0.0\n11\n1.0\n21\n0.0\n" +
    "0\nLINE\n10\n1.0\n20\n0.0\n11\n1.0\n21\n1.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let r = d.check(0.001)
  assert_eq(r.count(Warn), 1)
  let f = first_of(r, "轮廓闭合").unwrap()
  assert_true(f.message.contains("1 处"))
  assert_true(f.message.contains("1.41"))
}

///|
test "不同图层不串链" {
  // 两条线端点重合但在不同图层——串链只在图层内部做，
  // 两边各自是一条没闭合的轮廓
  let d = drawing_utf8(
    "0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n" +
    "0\nLAYER\n100\nAcDbLayerTableRecord\n2\n甲\n70\n0\n62\n7\n" +
    "0\nLAYER\n100\nAcDbLayerTableRecord\n2\n乙\n70\n0\n62\n7\n" +
    "0\nENDTAB\n0\nENDSEC\n" +
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nLINE\n8\n甲\n10\n0.0\n20\n0.0\n11\n1.0\n21\n0.0\n" +
    "0\nLINE\n8\n乙\n10\n1.0\n20\n0.0\n11\n2.0\n21\n0.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let r = d.check(0.001)
  assert_eq(r.count(Warn), 2)
}

///|
test "关闭图层上的缺口不报" {
  // 不切的图层不查闭合（图层检查里会提示它是关闭的）
  let d = drawing_utf8(
    "0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n" +
    "0\nLAYER\n100\nAcDbLayerTableRecord\n2\n废\n70\n0\n62\n-7\n" +
    "0\nENDTAB\n0\nENDSEC\n" +
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nLINE\n8\n废\n10\n0.0\n20\n0.0\n11\n1.0\n21\n0.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let r = d.check(0.001)
  assert_eq(r.count(Warn), 0)
  assert_eq(r.count(Info), 1)
}

///|
test "闭合的多段线不参与串链" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nLWPOLYLINE\n100\nAcDbPolyline\n70\n1\n" +
    "10\n0.0\n20\n0.0\n10\n1.0\n20\n0.0\n10\n1.0\n20\n1.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let r = d.check(0.001)
  assert_eq(r.findings.length(), 0)
}

///|
test "引用图层表里没有的图层" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n" +
    "0\nLAYER\n100\nAcDbLayerTableRecord\n2\n0\n70\n0\n62\n7\n" +
    "0\nENDTAB\n0\nENDSEC\n" +
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nLWPOLYLINE\n8\n幽灵\n100\nAcDbPolyline\n70\n1\n" +
    "10\n0.0\n20\n0.0\n10\n1.0\n20\n0.0\n10\n1.0\n20\n1.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let r = d.check(0.01)
  assert_eq(r.count(Warn), 1)
  assert_true(first_of(r, "图层").unwrap().message.contains("幽灵"))
}
