// 白盒测试：块展开（INSERT 的平移 / 旋转 / 缩放、嵌套复合、图层继承）。
//
// `drawing_of` / `drawing_utf8` 定义在 `structure_wbtest.mbt`。

///|
/// 一个块 + 一条引用它的 INSERT，拼成一份小图纸。
fn drawing_with_insert(block_body : String, insert_tags : String) -> Drawing {
  drawing_utf8(
    "0\nSECTION\n2\nBLOCKS\n" +
    "0\nBLOCK\n8\n0\n2\n销\n70\n0\n10\n0.0\n20\n0.0\n30\n0.0\n" +
    block_body +
    "0\nENDBLK\n8\n0\n" +
    "0\nENDSEC\n" +
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nINSERT\n" +
    insert_tags +
    "2\n销\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
}

///|
test "平移：块内容搬到插入点，图层 0 继承引用的图层" {
  // 块内一条线画在 0 层；引用放在「轮廓」层——
  // 展开后线的生效图层是「轮廓」（DXF 的图层继承规则）
  let d = drawing_with_insert(
    "0\nLINE\n8\n0\n10\n0.0\n20\n0.0\n30\n0.0\n11\n1.0\n21\n0.0\n31\n0.0\n", "8\n轮廓\n10\n10.0\n20\n20.0\n30\n0.0\n",
  )
  let exp = d.expand(0.01)
  assert_eq(exp.warnings.length(), 0)
  assert_eq(exp.placed.length(), 1)
  assert_true(exp.placed[0].entity.kind() == "LINE")
  assert_true(exp.placed[0].layer == "轮廓")
  match exp.placed[0].flat {
    Outline(points~, ..) => {
      assert_true((points[0].x - 10.0).abs() < 1.0e-9)
      assert_true((points[0].y - 20.0).abs() < 1.0e-9)
      assert_true((points[1].x - 11.0).abs() < 1.0e-9)
      assert_true((points[1].y - 20.0).abs() < 1.0e-9)
    }
    _ => fail("展开结果不是轮廓")
  }
}

///|
test "基点偏移被扣掉" {
  // 块基点 (1,1)，线画在 (1,1)→(2,1)：插入到原点后应该落到 (0,0)→(1,0)
  let d = drawing_utf8(
    "0\nSECTION\n2\nBLOCKS\n" +
    "0\nBLOCK\n2\n销\n70\n0\n10\n1.0\n20\n1.0\n30\n0.0\n" +
    "0\nLINE\n8\n0\n10\n1.0\n20\n1.0\n30\n0.0\n11\n2.0\n21\n1.0\n31\n0.0\n" +
    "0\nENDBLK\n" +
    "0\nENDSEC\n0\nSECTION\n2\nENTITIES\n" +
    "0\nINSERT\n10\n0.0\n20\n0.0\n2\n销\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let exp = d.expand(0.01)
  assert_eq(exp.placed.length(), 1)
  match exp.placed[0].flat {
    Outline(points~, ..) => {
      assert_true(points[0].x.abs() < 1.0e-9 && points[0].y.abs() < 1.0e-9)
      assert_true((points[1].x - 1.0).abs() < 1.0e-9)
    }
    _ => fail("展开结果不是轮廓")
  }
}

///|
test "旋转 90°" {
  let d = drawing_with_insert(
    "0\nLINE\n10\n1.0\n20\n0.0\n30\n0.0\n11\n2.0\n21\n0.0\n31\n0.0\n", "10\n0.0\n20\n0.0\n30\n0.0\n50\n90\n",
  )
  let exp = d.expand(0.01)
  match exp.placed[0].flat {
    Outline(points~, ..) => {
      // (1,0)→(0,1)、(2,0)→(0,2)
      assert_true(
        points[0].x.abs() < 1.0e-9 && (points[0].y - 1.0).abs() < 1.0e-9,
      )
      assert_true(
        points[1].x.abs() < 1.0e-9 && (points[1].y - 2.0).abs() < 1.0e-9,
      )
    }
    _ => fail("展开结果不是轮廓")
  }
}

///|
test "非均匀缩放把圆摊成椭圆（先离散再变换的好处）" {
  let d = drawing_with_insert(
    "0\nCIRCLE\n10\n0.0\n20\n0.0\n30\n0.0\n40\n1.0\n", "10\n0.0\n20\n0.0\n30\n0.0\n41\n2.0\n42\n1.0\n",
  )
  let exp = d.expand(0.001)
  match exp.placed[0].flat {
    Outline(points~, ..) => {
      let mut hi_x = -9.0
      let mut hi_y = -9.0
      for p in points {
        hi_x = hi_x.max(p.x)
        hi_y = hi_y.max(p.y)
      }
      assert_true((hi_x - 2.0).abs() < 0.005)
      assert_true((hi_y - 1.0).abs() < 0.005)
    }
    _ => fail("展开结果不是轮廓")
  }
}

///|
test "嵌套引用：变换一层层复合" {
  // 块 B 里一条线 (0,0)→(1,0)；块 A 在 (5,0) 处引用 B；
  // 顶层在 (0,10) 处引用 A → 世界坐标 (5,10)→(6,10)
  let d = drawing_utf8(
    "0\nSECTION\n2\nBLOCKS\n" +
    "0\nBLOCK\n2\n内\n70\n0\n10\n0.0\n20\n0.0\n30\n0.0\n" +
    "0\nLINE\n10\n0.0\n20\n0.0\n30\n0.0\n11\n1.0\n21\n0.0\n31\n0.0\n" +
    "0\nENDBLK\n" +
    "0\nBLOCK\n2\n外\n70\n0\n10\n0.0\n20\n0.0\n30\n0.0\n" +
    "0\nINSERT\n10\n5.0\n20\n0.0\n2\n内\n" +
    "0\nENDBLK\n" +
    "0\nENDSEC\n0\nSECTION\n2\nENTITIES\n" +
    "0\nINSERT\n10\n0.0\n20\n10.0\n2\n外\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let exp = d.expand(0.01)
  assert_eq(exp.warnings.length(), 0)
  assert_eq(exp.placed.length(), 1)
  match exp.placed[0].flat {
    Outline(points~, ..) => {
      assert_true((points[0].x - 5.0).abs() < 1.0e-9)
      assert_true((points[0].y - 10.0).abs() < 1.0e-9)
      assert_true((points[1].x - 6.0).abs() < 1.0e-9)
    }
    _ => fail("展开结果不是轮廓")
  }
}

///|
test "块内自己的图层不继承" {
  // 0 层继承引用的图层，其它图层原样保留
  let d = drawing_with_insert(
    "0\nLINE\n8\n0\n10\n0.0\n20\n0.0\n11\n1.0\n21\n0.0\n" +
    "0\nLINE\n8\n标注\n10\n0.0\n20\n1.0\n11\n1.0\n21\n1.0\n",
    "8\n轮廓\n10\n0.0\n20\n0.0\n",
  )
  let exp = d.expand(0.01)
  assert_eq(exp.placed.length(), 2)
  assert_true(exp.placed[0].layer == "轮廓")
  assert_true(exp.placed[1].layer == "标注")
}

///|
test "循环引用被截断" {
  // 块 A 里插自己——展开不能无限递归
  let d = drawing_utf8(
    "0\nSECTION\n2\nBLOCKS\n" +
    "0\nBLOCK\n2\n自恋\n70\n0\n10\n0.0\n20\n0.0\n30\n0.0\n" +
    "0\nINSERT\n10\n1.0\n20\n0.0\n2\n自恋\n" +
    "0\nENDBLK\n" +
    "0\nENDSEC\n0\nSECTION\n2\nENTITIES\n" +
    "0\nINSERT\n10\n0.0\n20\n0.0\n2\n自恋\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let exp = d.expand(0.01)
  assert_eq(exp.placed.length(), 0)
  assert_true(exp.warnings.length() > 0)
}

///|
test "引用不存在的块：跳过并警告" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nINSERT\n10\n0.0\n20\n0.0\n2\n没有这个\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let exp = d.expand(0.01)
  assert_eq(exp.placed.length(), 0)
  assert_eq(exp.warnings.length(), 1)
}
