// 白盒测试：实体层第一步（LINE / POINT / Unknown 兜底）。
//
// 三条要盯住的约定：
// - 缺 z 按 0（平面图常态），缺 x/y 跳过并警告（不拿原点补）
// - 认不出的实体进 `Unknown`，类型名和原记录都不丢
// - 包围盒是二维投影（加工是二维的）
//
// `drawing_of` / `drawing_utf8` 定义在 `structure_wbtest.mbt`。

// ── LINE ────────────────────────────────────────────────────────────────

///|
test "LINE 解析出起点终点（新格式）" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nLINE\n5\n2D\n100\nAcDbEntity\n8\n轮廓\n100\nAcDbLine\n" +
    "10\n1.0\n20\n2.0\n30\n0.0\n11\n4.0\n21\n6.0\n31\n0.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let es = d.entities()
  assert_eq(es.entities.length(), 1)
  assert_eq(es.warnings.length(), 0)
  let e = es.entities[0]
  assert_true(e.kind() == "LINE")
  assert_true(e.layer() == "轮廓")
  assert_true(e.handle() == "2D")
  assert_true(e.is_decoded())
  match e.geom {
    Line(start~, end~) => {
      // 坐标在第二个子类（AcDbLine）里，照样取得出来
      assert_true(start.x == 1.0 && start.y == 2.0 && start.z == 0.0)
      assert_true(end.x == 4.0 && end.y == 6.0 && end.z == 0.0)
    }
    _ => fail("不是线段")
  }
}

///|
test "老格式的 LINE 照样解析" {
  // R10/R12 没有 100 标记，字段全在公共部分——取点只看组码
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nLINE\n8\n0\n" +
    "10\n0.0\n20\n0.0\n30\n0.0\n11\n1.0\n21\n1.0\n31\n0.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let e = d.entities().entities[0]
  assert_true(e.is_decoded())
  // 老格式的图层在公共部分，取出来一样是 "0"
  assert_true(e.layer() == "0")
}

///|
test "缺 z 的点按 z=0 处理" {
  // 平面图里只写 10/20 是常态——点就在 z=0 平面上，不是坏记录
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nLINE\n10\n1.0\n20\n2.0\n11\n3.0\n21\n4.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let es = d.entities()
  assert_eq(es.warnings.length(), 0)
  match es.entities[0].geom {
    Line(start~, end~) => {
      assert_true(start.z == 0.0)
      assert_true(end.z == 0.0)
    }
    _ => fail("不是线段")
  }
}

///|
test "缺端点的 LINE 跳过并警告" {
  // 只有起点没有终点——**不要拿原点补**：补出来的假线段会混进
  // 最小间隙检查里，报一条警告、少一条实体，比一个错的位置诚实
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nLINE\n10\n1.0\n20\n2.0\n0\nENDSEC\n0\nEOF\n",
  )
  let es = d.entities()
  assert_eq(es.entities.length(), 0)
  assert_eq(es.warnings.length(), 1)
}

// ── POINT 与包围盒 ──────────────────────────────────────────────────────

///|
test "POINT 解析成单点" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nPOINT\n8\n基准\n10\n7.0\n20\n8.0\n30\n0.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let e = d.entities().entities[0]
  assert_true(e.kind() == "POINT")
  match e.geom {
    Point(at~) => assert_true(at.x == 7.0 && at.y == 8.0)
    _ => fail("不是点")
  }
}

///|
test "包围盒取二维投影" {
  // z 差得再远也不进包围盒——加工检查是二维的
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nLINE\n" +
    "10\n1.0\n20\n2.0\n30\n5.0\n11\n4.0\n21\n6.0\n31\n-3.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let b = d.entities().entities[0].bounds().unwrap()
  assert_true(b.min.x == 1.0 && b.min.y == 2.0)
  assert_true(b.max.x == 4.0 && b.max.y == 6.0)
}

///|
test "单点的包围盒是零尺寸" {
  // 空盒并进一个点就得到「只包含那一个点」的盒子——min == max
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nPOINT\n10\n7.0\n20\n8.0\n30\n0.0\n0\nENDSEC\n0\nEOF\n",
  )
  let b = d.entities().entities[0].bounds().unwrap()
  assert_true(b.min.x == 7.0 && b.max.x == 7.0)
  assert_true(b.min.y == 8.0 && b.max.y == 8.0)
}

// ── Unknown 兜底 ────────────────────────────────────────────────────────

///|
test "认不出的实体保留类型和原记录" {
  // HATCH 还没解码，但它必须出现在列表里——加工检查要先知道
  // 「有多少实体我看不懂」，才谈得上给结论
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nHATCH\n5\n3A\n8\n填充\n100\nAcDbHatch\n2\nSOLID\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let e = d.entities().entities[0]
  assert_true(e.kind() == "HATCH")
  assert_false(e.is_decoded())
  assert_true(e.bounds() is None)
  // 字段还在原记录里，将来解码不用重新读文件
  assert_true(e.common.record.get_string(8) == "填充")
}

///|
test "没有 ENTITIES 段时是空表" {
  let d = drawing_of("0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nEOF\n")
  let es = d.entities()
  assert_eq(es.entities.length(), 0)
  assert_eq(es.warnings.length(), 0)
}
