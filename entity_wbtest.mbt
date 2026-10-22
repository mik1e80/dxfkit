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

// ── CIRCLE / ARC / ELLIPSE ──────────────────────────────────────────────

///|
test "CIRCLE 解析与包围盒" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nCIRCLE\n8\n0\n10\n5.0\n20\n6.0\n30\n0.0\n40\n2.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let e = d.entities().entities[0]
  assert_true(e.is_decoded())
  match e.geom {
    Circle(center~, radius~) => {
      assert_true(center.x == 5.0 && center.y == 6.0)
      assert_true(radius == 2.0)
    }
    _ => fail("不是圆")
  }
  let b = e.bounds().unwrap()
  assert_true(b.min.x == 3.0 && b.min.y == 4.0)
  assert_true(b.max.x == 7.0 && b.max.y == 8.0)
}

///|
test "半径为负的圆保留原值" {
  // 坏图纸里真实存在，部分机床遇到直接报错——**保留原值**，
  // 让加工检查去报这一条，解析阶段不该把它抹平或跳过
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nCIRCLE\n10\n0.0\n20\n0.0\n30\n0.0\n40\n-2.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let e = d.entities().entities[0]
  match e.geom {
    Circle(radius~, ..) => assert_true(radius == -2.0)
    _ => fail("不是圆")
  }
  // 盒子的形状还是它——用绝对值
  let b = e.bounds().unwrap()
  assert_true(b.min.x == -2.0 && b.max.x == 2.0)
}

///|
test "缺半径的圆跳过并警告" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nCIRCLE\n10\n0.0\n20\n0.0\n0\nENDSEC\n0\nEOF\n",
  )
  let es = d.entities()
  assert_eq(es.entities.length(), 0)
  assert_eq(es.warnings.length(), 1)
}

///|
test "ARC 的角度换算成弧度" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nARC\n10\n0.0\n20\n0.0\n30\n0.0\n40\n1.0\n" +
    "50\n90\n51\n180\n0\nENDSEC\n0\nEOF\n",
  )
  match d.entities().entities[0].geom {
    Arc(start_angle~, end_angle~, ..) => {
      assert_true((start_angle - 1.5707963267948966).abs() < 1.0e-12)
      assert_true((end_angle - 3.141592653589793).abs() < 1.0e-12)
    }
    _ => fail("不是圆弧")
  }
}

///|
test "ARC 包围盒含跨过的象限点" {
  // 0° 到 270° 的弧，最右边其实在 90° 的象限点上——
  // 光取两个端点会把包围盒算漏
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nARC\n10\n0.0\n20\n0.0\n30\n0.0\n40\n1.0\n" +
    "50\n0\n51\n270\n0\nENDSEC\n0\nEOF\n",
  )
  let b = d.entities().entities[0].bounds().unwrap()
  assert_true((b.min.x + 1.0).abs() < 1.0e-9 && (b.min.y + 1.0).abs() < 1.0e-9)
  assert_true((b.max.x - 1.0).abs() < 1.0e-9 && (b.max.y - 1.0).abs() < 1.0e-9)
}

///|
test "起止角相等按整圈" {
  // 0 到 360 度指的是整圆，不是零度弧
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nARC\n10\n0.0\n20\n0.0\n30\n0.0\n40\n2.0\n" +
    "50\n0\n51\n360\n0\nENDSEC\n0\nEOF\n",
  )
  let b = d.entities().entities[0].bounds().unwrap()
  assert_true((b.min.x + 2.0).abs() < 1.0e-9 && (b.max.x - 2.0).abs() < 1.0e-9)
  assert_true((b.min.y + 2.0).abs() < 1.0e-9 && (b.max.y - 2.0).abs() < 1.0e-9)
}

///|
test "缺起止角的圆弧跳过并警告" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nARC\n10\n0.0\n20\n0.0\n30\n0.0\n40\n1.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let es = d.entities()
  assert_eq(es.entities.length(), 0)
  assert_eq(es.warnings.length(), 1)
}

///|
test "ELLIPSE 全椭圆的包围盒" {
  // 长轴 (2, 0)、短长轴比 0.5 → 短轴 1——盒子 (-2,-1) 到 (2,1)
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nELLIPSE\n10\n0.0\n20\n0.0\n30\n0.0\n" +
    "11\n2.0\n21\n0.0\n31\n0.0\n40\n0.5\n41\n0.0\n42\n6.283185307179586\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let e = d.entities().entities[0]
  assert_true(e.is_decoded())
  let b = e.bounds().unwrap()
  assert_true((b.min.x + 2.0).abs() < 1.0e-9 && (b.min.y + 1.0).abs() < 1.0e-9)
  assert_true((b.max.x - 2.0).abs() < 1.0e-9 && (b.max.y - 1.0).abs() < 1.0e-9)
}

///|
fn entity_ellipse_at(x : Double, y : Double) -> Drawing {
  drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nELLIPSE\n" +
    "10\n\{x}\n20\n\{y}\n30\n0\n11\n10\n21\n0\n31\n0\n40\n0.5\n" +
    "41\n0\n42\n6.283185307179586\n0\nENDSEC\n0\nEOF\n",
  )
}

///|
test "ELLIPSE non-origin equal center and major vector retains exact bounds" {
  let d = entity_ellipse_at(10.0, 0.0)
  assert_eq(d.warnings.length(), 0)
  let decoded = d.entities()
  assert_eq(decoded.warnings.length(), 0)
  assert_eq(decoded.entities.length(), 1)
  let e = decoded.entities[0]
  match e.geom {
    Ellipse(center~, major~, ratio~, start_param~, end_param~) => {
      assert_eq(center.x, 10.0)
      assert_eq(center.y, 0.0)
      assert_eq(center.z, 0.0)
      assert_eq(major.x, 10.0)
      assert_eq(major.y, 0.0)
      assert_eq(major.z, 0.0)
      assert_eq(ratio, 0.5)
      assert_eq(start_param, 0.0)
      assert_eq(end_param, 6.283185307179586)
    }
    _ => fail("expected ELLIPSE")
  }
  let box = e.bounds().unwrap()
  assert_eq(box.min.x, 0.0)
  assert_eq(box.max.x, 20.0)
  assert_eq(box.min.y, -5.0)
  assert_eq(box.max.y, 5.0)
  assert_eq(box.size().x, 20.0)
  assert_eq(box.size().y, 10.0)
  match e.geom.flatten_checked(0.01) {
    Ok(Outline(points~, closed~)) => {
      assert_true(closed)
      assert_true(points.length() > 2)
      assert_eq(points[0].x, 20.0)
      assert_eq(points[0].y, 0.0)
      for p in points {
        let u = (p.x - 10.0) / 10.0
        let v = p.y / 5.0
        assert_true((u * u + v * v - 1.0).abs() < 1.0e-10)
      }
    }
    _ => fail("expected complete ellipse outline")
  }
}

///|
test "ELLIPSE translating center preserves major vector dimensions and every outline point" {
  let origin = entity_ellipse_at(0.0, 0.0).entities().entities[0]
  let (reference, reference_closed) = match origin.geom.flatten_checked(0.01) {
    Ok(Outline(points~, closed~)) => (points, closed)
    _ => fail("expected reference ellipse outline")
  }
  assert_true(reference_closed)
  for
    offset in [
      Vec2::new(10.0, 0.0),
      Vec2::new(-35.0, 17.0),
      Vec2::new(1000.0, -2000.0),
    ] {
    let d = entity_ellipse_at(offset.x, offset.y)
    assert_eq(d.warnings.length(), 0)
    let decoded = d.entities()
    assert_eq(decoded.warnings.length(), 0)
    assert_eq(decoded.entities.length(), 1)
    let e = decoded.entities[0]
    match e.geom {
      Ellipse(major~, ratio~, ..) => {
        assert_eq(major.x, 10.0)
        assert_eq(major.y, 0.0)
        assert_eq(major.z, 0.0)
        assert_eq(ratio, 0.5)
      }
      _ => fail("expected translated ELLIPSE")
    }
    let box = e.bounds().unwrap()
    assert_eq(box.min.x, offset.x - 10.0)
    assert_eq(box.max.x, offset.x + 10.0)
    assert_eq(box.min.y, offset.y - 5.0)
    assert_eq(box.max.y, offset.y + 5.0)
    assert_eq(box.size().x, 20.0)
    assert_eq(box.size().y, 10.0)
    match e.geom.flatten_checked(0.01) {
      Ok(Outline(points~, closed~)) => {
        assert_eq(closed, reference_closed)
        assert_eq(points.length(), reference.length())
        for i = 0; i < points.length(); i = i + 1 {
          assert_true((points[i].x - offset.x - reference[i].x).abs() < 1.0e-9)
          assert_true((points[i].y - offset.y - reference[i].y).abs() < 1.0e-9)
          let u = (points[i].x - offset.x) / 10.0
          let v = (points[i].y - offset.y) / 5.0
          assert_true((u * u + v * v - 1.0).abs() < 1.0e-10)
        }
      }
      _ => fail("expected translated ellipse outline")
    }
  }
}

///|
test "ELLIPSE 省略起止参数时是整椭圆" {
  // 41/42 缺省的语义明确（整个椭圆），不报警
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nELLIPSE\n10\n0.0\n20\n0.0\n11\n2.0\n21\n0.0\n40\n0.5\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let es = d.entities()
  assert_eq(es.warnings.length(), 0)
  match es.entities[0].geom {
    Ellipse(start_param~, end_param~, ..) => {
      assert_true(start_param == 0.0)
      assert_true(end_param == 6.283185307179586)
    }
    _ => fail("不是椭圆")
  }
}

///|
test "缺短长轴比的椭圆跳过并警告" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nELLIPSE\n10\n0.0\n20\n0.0\n11\n2.0\n21\n0.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let es = d.entities()
  assert_eq(es.entities.length(), 0)
  assert_eq(es.warnings.length(), 1)
}

// ── 多段线 ──────────────────────────────────────────────────────────────

///|
test "LWPOLYLINE 顶点与闭合标志" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nLWPOLYLINE\n100\nAcDbEntity\n8\n0\n100\nAcDbPolyline\n90\n3\n70\n1\n" +
    "10\n0.0\n20\n0.0\n10\n10.0\n20\n0.0\n10\n10.0\n20\n5.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let es = d.entities()
  assert_eq(es.warnings.length(), 0)
  match es.entities[0].geom {
    Polyline(vertices~, closed~) => {
      assert_true(closed)
      assert_eq(vertices.length(), 3)
      assert_true(vertices[1].at.x == 10.0 && vertices[1].at.y == 0.0)
      assert_true(vertices[2].at.y == 5.0)
    }
    _ => fail("不是多段线")
  }
}

///|
test "LWPOLYLINE 的凸度挂在顶点上" {
  // 42 跟在对应顶点的 20 后面——按顺序扫才对得上，get 只会拿第一对
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nLWPOLYLINE\n100\nAcDbPolyline\n90\n2\n70\n0\n" +
    "10\n0.0\n20\n0.0\n42\n0.5\n10\n10.0\n20\n0.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  match d.entities().entities[0].geom {
    Polyline(vertices~, ..) => {
      assert_true(vertices[0].bulge == 0.5)
      assert_true(vertices[1].bulge == 0.0)
    }
    _ => fail("不是多段线")
  }
}

///|
test "LWPOLYLINE 解析不出顶点时跳过" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nLWPOLYLINE\n100\nAcDbPolyline\n90\n3\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let es = d.entities()
  assert_eq(es.entities.length(), 0)
  assert_eq(es.warnings.length(), 1)
}

///|
test "老式 POLYLINE 的顶点在后续记录里" {
  // POLYLINE → VERTEX… → SEQEND：一条实体横跨多条记录
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nPOLYLINE\n8\n轮廓\n66\n1\n70\n0\n" +
    "0\nVERTEX\n8\n轮廓\n10\n0.0\n20\n0.0\n30\n0.0\n" +
    "0\nVERTEX\n8\n轮廓\n10\n5.0\n20\n0.0\n30\n0.0\n42\n1.0\n" +
    "0\nVERTEX\n8\n轮廓\n10\n5.0\n20\n5.0\n30\n0.0\n" +
    "0\nSEQEND\n8\n轮廓\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let es = d.entities()
  // 三个 VERTEX 和 SEQEND 都不该成为独立实体
  assert_eq(es.entities.length(), 1)
  assert_eq(es.warnings.length(), 0)
  assert_true(es.entities[0].kind() == "POLYLINE")
  match es.entities[0].geom {
    Polyline(vertices~, closed~) => {
      assert_eq(vertices.length(), 3)
      assert_false(closed)
      assert_true(vertices[1].bulge == 1.0)
    }
    _ => fail("不是多段线")
  }
}

///|
test "多边形网格的 POLYLINE 进 Unknown" {
  // 70 = 16 是多边形网格：顶点记录另有含义，按多段线解析会得到假线
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nPOLYLINE\n66\n1\n70\n16\n" +
    "0\nVERTEX\n10\n0.0\n20\n0.0\n30\n0.0\n" +
    "0\nSEQEND\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let es = d.entities()
  assert_eq(es.entities.length(), 1)
  assert_false(es.entities[0].is_decoded())
}

///|
test "缺 SEQEND 的 POLYLINE 尽力而为" {
  // 文件被截断时不该整条丢掉——读到哪算哪
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nPOLYLINE\n70\n0\n" +
    "0\nVERTEX\n10\n0.0\n20\n0.0\n30\n0.0\n" +
    "0\nVERTEX\n10\n1.0\n20\n1.0\n30\n0.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let es = d.entities()
  assert_eq(es.entities.length(), 1)
  match es.entities[0].geom {
    Polyline(vertices~, ..) => assert_eq(vertices.length(), 2)
    _ => fail("不是多段线")
  }
}

///|
test "多段线的包围盒" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nLWPOLYLINE\n100\nAcDbPolyline\n70\n1\n" +
    "10\n0.0\n20\n0.0\n10\n4.0\n20\n0.0\n10\n0.0\n20\n3.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let b = d.entities().entities[0].bounds().unwrap()
  assert_true(b.min.x == 0.0 && b.min.y == 0.0)
  assert_true(b.max.x == 4.0 && b.max.y == 3.0)
}

///|
test "圆弧段的包围盒是精确的" {
  // 两点 + bulge 1（半圆）：b > 0 是逆时针，弧从弦下方过——
  // 精确盒是 (0, -0.5) 到 (1, 0)，不是把弦盒四边各撑开的保守盒
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nLWPOLYLINE\n100\nAcDbPolyline\n70\n0\n" +
    "10\n0.0\n20\n0.0\n42\n1.0\n10\n1.0\n20\n0.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let b = d.entities().entities[0].bounds().unwrap()
  assert_true(b.min.x.abs() < 1.0e-9 && (b.min.y + 0.5).abs() < 1.0e-9)
  assert_true((b.max.x - 1.0).abs() < 1.0e-9 && b.max.y.abs() < 1.0e-9)
}

///|
test "闭合多段线的收尾边也算凸度" {
  // 最后一个顶点的 bulge 管的是连回第一点的那条边——只在闭合时有意义
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nLWPOLYLINE\n100\nAcDbPolyline\n70\n1\n" +
    "10\n0.0\n20\n0.0\n10\n1.0\n20\n0.0\n10\n1.0\n20\n1.0\n42\n1.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  // 收尾边 (1,1)→(0,0) 的半圆：圆心 (0.5, 0.5)、半径 √2/2。
  // 逆时针从 45° 到 -135°，跨过的象限点是 90° 和 180°——
  // 精确盒的左边和上边由这两个象限点定
  let b = d.entities().entities[0].bounds().unwrap()
  assert_true((b.min.x + 0.2071067811865476).abs() < 1.0e-9)
  assert_true((b.max.y - 1.2071067811865475).abs() < 1.0e-9)
}

// ── 文字 ────────────────────────────────────────────────────────────────

///|
test "TEXT 解析：插入点、字高、旋转角" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nTEXT\n8\n标注\n" +
    "10\n1.0\n20\n2.0\n30\n0.0\n40\n2.5\n50\n90\n1\n轮廓外圈\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let e = d.entities().entities[0]
  assert_true(e.kind() == "TEXT")
  assert_true(e.is_decoded())
  match e.geom {
    Text(at~, height~, value~, rotation~) => {
      assert_true(at.x == 1.0 && at.y == 2.0)
      assert_true(height == 2.5)
      assert_true(value == "轮廓外圈")
      assert_true((rotation - 1.5707963267948966).abs() < 1.0e-12)
    }
    _ => fail("不是文字")
  }
}

///|
test "MTEXT 的内容按出现顺序拼接" {
  // 正文超过 250 字符会被切成多个 3，最后一段在 1 里。
  // 格式化代码原样保留——`\P` 是 MTEXT 的换行
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nMTEXT\n8\n0\n10\n0.0\n20\n0.0\n40\n1.0\n" +
    "3\n前半\\P\n3\n中段\n1\n后半\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  match d.entities().entities[0].geom {
    Text(value~, ..) => assert_true(value == "前半\\P中段后半")
    _ => fail("不是文字")
  }
}

///|
test "没有内容的 TEXT 保留空串" {
  // 内容为空是合法的（ATTDEF 常被清空），不算坏记录
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nTEXT\n10\n0.0\n20\n0.0\n40\n1.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let es = d.entities()
  assert_eq(es.warnings.length(), 0)
  match es.entities[0].geom {
    Text(value~, ..) => assert_true(value == "")
    _ => fail("不是文字")
  }
}

///|
test "缺字高的文字跳过并警告" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nTEXT\n10\n0.0\n20\n0.0\n1\n内容\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let es = d.entities()
  assert_eq(es.entities.length(), 0)
  assert_eq(es.warnings.length(), 1)
}

///|
test "ATTRIB 与 TEXT 走同一条路" {
  // 属性（块引用上的填写值）和定义（块里的占位）形状一致，
  // 都用 Text 表示，具体类型看 kind
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nATTRIB\n8\n0\n10\n3.0\n20\n4.0\n40\n1.5\n" +
    "2\n标高\n70\n0\n1\n基准A\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let e = d.entities().entities[0]
  assert_true(e.kind() == "ATTRIB")
  match e.geom {
    Text(at~, value~, ..) => {
      assert_true(at.x == 3.0 && at.y == 4.0)
      assert_true(value == "基准A")
    }
    _ => fail("不是文字")
  }
}

///|
test "文字的包围盒是插入点" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nTEXT\n10\n7.0\n20\n8.0\n40\n1.0\n1\n基准\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let b = d.entities().entities[0].bounds().unwrap()
  assert_true(b.min.x == 7.0 && b.max.x == 7.0)
  assert_true(b.min.y == 8.0 && b.max.y == 8.0)
}

// ── 块定义与引用 ────────────────────────────────────────────────────────

///|
test "BLOCKS 段解析出块名、基点和内容" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nBLOCKS\n" +
    "0\nBLOCK\n8\n0\n2\n孔位\n70\n0\n10\n0.0\n20\n0.0\n30\n0.0\n" +
    "0\nCIRCLE\n8\n0\n10\n1.0\n20\n1.0\n30\n0.0\n40\n0.5\n" +
    "0\nENDBLK\n8\n0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let bs = d.blocks()
  assert_eq(bs.warnings.length(), 0)
  assert_eq(bs.blocks.length(), 1)
  assert_true(bs.blocks[0].name == "孔位")
  assert_eq(bs.blocks[0].entities.length(), 1)
  match bs.blocks[0].entities[0].geom {
    Circle(radius~, ..) => assert_true(radius == 0.5)
    _ => fail("块里不是圆")
  }
}

///|
test "块内容走到多记录实体也一样" {
  // 块里的 POLYLINE 同样有 VERTEX / SEQEND——翻译走的是同一条路
  let d = drawing_utf8(
    "0\nSECTION\n2\nBLOCKS\n" +
    "0\nBLOCK\n2\n槽\n70\n0\n10\n0.0\n20\n0.0\n30\n0.0\n" +
    "0\nPOLYLINE\n70\n1\n" +
    "0\nVERTEX\n10\n0.0\n20\n0.0\n30\n0.0\n" +
    "0\nVERTEX\n10\n1.0\n20\n0.0\n30\n0.0\n" +
    "0\nSEQEND\n" +
    "0\nENDBLK\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let bs = d.blocks()
  assert_eq(bs.blocks[0].entities.length(), 1)
  assert_true(bs.blocks[0].entities[0].kind() == "POLYLINE")
}

///|
test "缺 ENDBLK 时尽力而为" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nBLOCKS\n0\nBLOCK\n2\n半截\n10\n0.0\n20\n0.0\n30\n0.0\n" +
    "0\nLINE\n10\n0.0\n20\n0.0\n11\n1.0\n21\n1.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let bs = d.blocks()
  assert_eq(bs.blocks.length(), 1)
  assert_eq(bs.blocks[0].entities.length(), 1)
}

///|
test "INSERT 解析：块名、插入点、缩放、旋转" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nINSERT\n8\n0\n10\n10.0\n20\n20.0\n30\n0.0\n" +
    "41\n2.0\n42\n3.0\n43\n1.0\n50\n90\n2\n孔位\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let e = d.entities().entities[0]
  assert_true(e.kind() == "INSERT")
  match e.geom {
    Insert(at~, block~, scale~, rotation~) => {
      assert_true(at.x == 10.0 && at.y == 20.0)
      assert_true(block == "孔位")
      assert_true(scale.x == 2.0 && scale.y == 3.0 && scale.z == 1.0)
      assert_true((rotation - 1.5707963267948966).abs() < 1.0e-12)
    }
    _ => fail("不是块引用")
  }
}

///|
test "缩放和旋转缺省是 1 / 0" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nINSERT\n10\n0.0\n20\n0.0\n2\n孔位\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  match d.entities().entities[0].geom {
    Insert(scale~, rotation~, ..) => {
      assert_true(scale.x == 1.0 && scale.y == 1.0 && scale.z == 1.0)
      assert_true(rotation == 0.0)
    }
    _ => fail("不是块引用")
  }
}

///|
test "INSERT 缺块名跳过并警告" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nINSERT\n10\n0.0\n20\n0.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let es = d.entities()
  assert_eq(es.entities.length(), 0)
  assert_eq(es.warnings.length(), 1)
}

///|
test "INSERT 后面的 ATTRIB 是独立实体" {
  // 66=1 时后面跟着属性值、SEQEND 收尾——ATTRIB **不吞**：
  // 属性文字同样可能没转曲线，检查环节要看得见
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n" +
    "0\nINSERT\n10\n0.0\n20\n0.0\n2\n孔位\n66\n1\n" +
    "0\nATTRIB\n10\n1.0\n20\n1.0\n40\n1.0\n1\nM6\n" +
    "0\nSEQEND\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let es = d.entities()
  assert_eq(es.entities.length(), 2)
  assert_true(es.entities[0].kind() == "INSERT")
  assert_true(es.entities[1].kind() == "ATTRIB")
}

///|
test "没有 BLOCKS 段时是空表" {
  let d = drawing_of("0\nSECTION\n2\nENTITIES\n0\nENDSEC\n0\nEOF\n")
  let bs = d.blocks()
  assert_eq(bs.blocks.length(), 0)
  assert_eq(bs.warnings.length(), 0)
}

// ── 填充面与标注 ────────────────────────────────────────────────────────

///|
test "SOLID 解析出四个角点" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nSOLID\n8\n0\n" +
    "10\n0.0\n20\n0.0\n30\n0.0\n11\n2.0\n21\n0.0\n31\n0.0\n" +
    "12\n0.0\n22\n1.0\n32\n0.0\n13\n2.0\n23\n1.0\n33\n0.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let e = d.entities().entities[0]
  assert_true(e.kind() == "SOLID")
  match e.geom {
    Face(corners~) => assert_eq(corners.length(), 4)
    _ => fail("不是填充面")
  }
  let b = e.bounds().unwrap()
  assert_true(b.min.x == 0.0 && b.min.y == 0.0)
  assert_true(b.max.x == 2.0 && b.max.y == 1.0)
}

///|
test "SOLID 少第四个角点保留三点恢复并报告检查不完整" {
  // 标准三角形重复第四角点；这里对省略字段的旧输入保留有诊断的恢复。
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nSOLID\n" +
    "10\n0.0\n20\n0.0\n11\n2.0\n21\n0.0\n12\n1.0\n22\n1.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  match d.entities().entities[0].geom {
    Face(corners~) => assert_eq(corners.length(), 3)
    _ => fail("不是填充面")
  }
  assert_true(d.entities().warnings.any(w => w.contains("缺第四角点")))
  assert_true(d.check({ tol: 0.01, min_gap: 0.0, }).has_incomplete_checks())
}

///|
test "缺角点的填充面跳过并警告" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\n3DFACE\n10\n0.0\n20\n0.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let es = d.entities()
  assert_eq(es.entities.length(), 0)
  assert_eq(es.warnings.length(), 1)
}

///|
test "DIMENSION 解析：定义点、匿名块、测量值" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nDIMENSION\n8\n标注\n" +
    "10\n5.0\n20\n6.0\n30\n0.0\n11\n5.0\n21\n8.0\n31\n0.0\n" +
    "70\n0\n1\n<>\n42\n120.5\n2\n*D1\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let e = d.entities().entities[0]
  assert_true(e.kind() == "DIMENSION")
  assert_true(e.is_decoded())
  match e.geom {
    Dimension(at~, block~, measurement~) => {
      assert_true(at.x == 5.0 && at.y == 6.0)
      assert_true(block == "*D1")
      assert_true(measurement == 120.5)
    }
    _ => fail("不是标注")
  }
}

///|
test "R12 的标注没有匿名块" {
  // 老版本标注直接画在图形里，没有 *D 开头的匿名块——保留空串
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nDIMENSION\n10\n1.0\n20\n2.0\n30\n0.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let es = d.entities()
  assert_eq(es.warnings.length(), 0)
  match es.entities[0].geom {
    Dimension(block~, measurement~, ..) => {
      assert_true(block == "")
      assert_true(measurement == 0.0)
    }
    _ => fail("不是标注")
  }
}

// ── 样条与填充 ──────────────────────────────────────────────────────────

///|
test "SPLINE 解析出次数、节点、控制点" {
  // 三次样条（degree 3）、4 个控制点 → 节点数 = 4 + 3 + 1 = 8
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nSPLINE\n8\n0\n100\nAcDbSpline\n" +
    "71\n3\n72\n8\n73\n4\n" +
    "40\n0.0\n40\n0.0\n40\n0.0\n40\n0.0\n40\n1.0\n40\n1.0\n40\n1.0\n40\n1.0\n" +
    "10\n0.0\n20\n0.0\n30\n0.0\n10\n1.0\n20\n2.0\n30\n0.0\n" +
    "10\n3.0\n20\n2.0\n30\n0.0\n10\n4.0\n20\n0.0\n30\n0.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let e = d.entities().entities[0]
  assert_true(e.kind() == "SPLINE")
  assert_true(e.is_decoded())
  match e.geom {
    Spline(degree~, knots~, control_points~, weights~) => {
      assert_eq(degree, 3)
      assert_eq(knots.length(), 8)
      assert_eq(control_points.length(), 4)
      assert_true(control_points[1].x == 1.0 && control_points[1].y == 2.0)
      // 没写 41：权重补 1，和普通 B 样条等价
      assert_eq(weights.length(), 4)
      assert_true(weights[0] == 1.0 && weights[3] == 1.0)
    }
    _ => fail("不是样条")
  }
}

///|
test "有理样条的权重（组码 41）解析" {
  // 权重是组码 41（ezdxf 的 load_spline_data 里核过）——不是 42，
  // 42 在 SPLINE 里是节点容差那个标量
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nSPLINE\n100\nAcDbSpline\n71\n2\n" +
    "40\n0.0\n40\n0.0\n40\n0.0\n40\n1.0\n40\n1.0\n40\n1.0\n" +
    "41\n1.0\n41\n2.0\n41\n1.0\n" +
    "10\n0.0\n20\n0.0\n30\n0.0\n10\n1.0\n20\n1.0\n30\n0.0\n" +
    "10\n2.0\n20\n0.0\n30\n0.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  match d.entities().entities[0].geom {
    Spline(weights~, ..) => {
      assert_eq(weights.length(), 3)
      assert_true(weights[1] == 2.0)
    }
    _ => fail("不是样条")
  }
}

///|
test "SPLINE 控制点缺 30 按 z=0" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nSPLINE\n100\nAcDbSpline\n71\n1\n" +
    "40\n0.0\n40\n1.0\n10\n0.0\n20\n0.0\n10\n1.0\n20\n1.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  match d.entities().entities[0].geom {
    Spline(control_points~, ..) => {
      assert_eq(control_points.length(), 2)
      assert_true(control_points[0].z == 0.0)
      assert_true(control_points[1].z == 0.0)
    }
    _ => fail("不是样条")
  }
}

///|
test "SPLINE 的包围盒用控制点（保守）" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nSPLINE\n100\nAcDbSpline\n71\n1\n" +
    "40\n0.0\n40\n1.0\n10\n0.0\n20\n0.0\n30\n0.0\n10\n4.0\n20\n3.0\n30\n0.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let b = d.entities().entities[0].bounds().unwrap()
  assert_true(b.min.x == 0.0 && b.min.y == 0.0)
  assert_true(b.max.x == 4.0 && b.max.y == 3.0)
}

///|
test "HATCH 实体填充解析" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nHATCH\n8\n0\n100\nAcDbHatch\n" +
    "10\n0.0\n20\n0.0\n30\n0.0\n2\nSOLID\n70\n1\n71\n0\n91\n2\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let e = d.entities().entities[0]
  assert_true(e.kind() == "HATCH")
  assert_true(e.is_decoded())
  match e.geom {
    Hatch(solid~, pattern~, paths~, ..) => {
      assert_true(solid)
      assert_true(pattern == "SOLID")
      assert_eq(paths, 2)
    }
    _ => fail("不是填充")
  }
}

///|
test "HATCH 图案填充" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nHATCH\n10\n0.0\n20\n0.0\n30\n0.0\n" +
    "2\nANSI31\n70\n0\n91\n1\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  match d.entities().entities[0].geom {
    Hatch(solid~, pattern~, ..) => {
      assert_false(solid)
      assert_true(pattern == "ANSI31")
    }
    _ => fail("不是填充")
  }
}

///|
test "缺标高点的 HATCH 跳过并警告" {
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nHATCH\n2\nSOLID\n70\n1\n91\n1\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let es = d.entities()
  assert_eq(es.entities.length(), 0)
  assert_eq(es.warnings.length(), 1)
}

///|
test "扩展标注类型走同一条路" {
  // R2007 给弧长标注、大半径标注起了独立实体名，记录形状和 DIMENSION 一样
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nARC_DIMENSION\n8\n标注\n" +
    "10\n1.0\n20\n2.0\n30\n0.0\n2\n*D2\n42\n30.0\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let e = d.entities().entities[0]
  assert_true(e.kind() == "ARC_DIMENSION")
  match e.geom {
    Dimension(block~, ..) => assert_true(block == "*D2")
    _ => fail("不是标注")
  }
}

// ── Unknown 兜底 ────────────────────────────────────────────────────────

///|
test "认不出的实体保留类型和原记录" {
  // MLINE（多线）不在解码清单里，但它必须出现在列表里——加工检查
  // 要先知道「有多少实体我看不懂」，才谈得上给结论
  let d = drawing_utf8(
    "0\nSECTION\n2\nENTITIES\n0\nMLINE\n5\n3A\n8\n填充\n100\nAcDbMline\n2\nSTANDARD\n" +
    "0\nENDSEC\n0\nEOF\n",
  )
  let e = d.entities().entities[0]
  assert_true(e.kind() == "MLINE")
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
