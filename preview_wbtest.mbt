// 白盒测试：SVG 预览。结构级测试——不断言整串输出（改一点格式
// 就会全挂），断言的是关键构件：标签、翻转、颜色、转义、定点格式。
//
// `drawing_of` / `drawing_utf8` 定义在 `structure_wbtest.mbt`。

///|
test "直线上图：骨架、Y 翻转、polyline" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nLINE\n8\n轮廓\n10\n0.0\n20\n0.0\n11\n10.0\n21\n0.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let svg = d.to_svg(0.01)
  assert_true(svg.contains("<svg"))
  assert_true(svg.contains("viewBox"))
  // 内容整体翻转（CAD 的 y 向上、SVG 的 y 向下）
  assert_true(svg.contains("scale(1,-1)"))
  assert_true(svg.contains("<polyline"))
  // 坐标走定点 4 位
  assert_true(svg.contains("0.0000,0.0000"))
  assert_true(svg.contains("10.0000,0.0000"))
}

///|
test "闭合轮廓用 polygon" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nLWPOLYLINE\n100\nAcDbPolyline\n70\n1\n" +
    "10\n0.0\n20\n0.0\n10\n1.0\n20\n0.0\n10\n1.0\n20\n1.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let svg = d.to_svg(0.01)
  assert_true(svg.contains("<polygon"))
  assert_true(!svg.contains("<polyline"))
}

///|
test "文字出 text 元素且内容被转义" {
  // 图纸里的 A<B&C 不转义就输出，整张图都成了坏 XML
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nTEXT\n10\n1.0\n20\n2.0\n40\n1.0\n1\nA<B&C\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let svg = d.to_svg(0.01)
  assert_true(svg.contains("<text"))
  assert_true(svg.contains("A&lt;B&amp;C"))
  assert_true(!svg.contains("A<B&C"))
}

///|
test "关闭图层淡画" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n" +
    "0\nLAYER\n100\nAcDbLayerTableRecord\n2\n废\n70\n0\n62\n-3\n" +
    "0\nENDTAB\n0\nENDSEC\n" +
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nLINE\n8\n废\n10\n0.0\n20\n0.0\n11\n1.0\n21\n0.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let svg = d.to_svg(0.01)
  assert_true(svg.contains("opacity=\"0.25\""))
}

///|
test "空图纸出空图不炸" {
  let d = drawing_of("0\nSECTION\n2\nENTITIES\n0\nENDSEC\n0\nEOF\n")
  let svg = d.to_svg(0.01)
  assert_true(svg.contains("<svg"))
  assert_true(svg.contains("800"))
}
