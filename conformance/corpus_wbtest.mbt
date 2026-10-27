// 真实文件回归：拿 ezdxf 的语料跑。
//
// 这一层测的不是「算法对不对」，而是「**真实文件读不读得动**」。
// 单元测试里的输入都是我们自己造的，干净、规整；真实文件里有前导空白、
// 有 CRLF、有 EOF 后的垃圾、有第三方导出器的怪写法。
//
// 语料来源 `mozman/ezdxf`（MIT 许可），见 `testdata/ezdxf/README.md`。
// 测试是**遍历式**的——新增文件自动进测试，不用改代码。

///|
/// 把问题列表拼成多行。
///
/// 不能直接往字符串里插数组（那会走 `Show`，而它已经废弃了），
/// 而且失败信息里要能一眼看出是哪个文件出的问题。
///
/// 放测试文件里而不是源文件里：它只被测试用，放源文件会被报成 unused。
fn join_problems(problems : Array[String]) -> String {
  let sb = StringBuilder()
  for p in problems {
    sb.write_string("\n    ")
    sb.write_string(p)
  }
  sb.to_string()
}

// ── 不变量：每个文件都要成立 ────────────────────────────────────────────

///|
test "语料里每个文件都能扫出 tag" {
  let files = corpus_files()
  if files.length() == 0 {
    fail("语料目录是空的——文件没拉下来？")
  }
  let problems : Array[String] = []
  for path in files {
    let scan = scan_corpus_file(path)
    if scan.tags.length() == 0 {
      problems.push("\{path}：一个 tag 都没扫出来")
    }
  }
  if problems.length() > 0 {
    fail("有文件扫不出内容：" + join_problems(problems))
  }
}

///|
test "每个文件都以 EOF 结尾" {
  // DXF 的结束标志是 `0 / EOF`。扫出来的最后一个 tag 应该是它——
  // 不是的话说明解析提前停了或者文件结构不对
  let problems : Array[String] = []
  for path in corpus_files() {
    let scan = scan_corpus_file(path)
    let tags = scan.tags
    if tags.length() == 0 {
      continue // 上面那条测试已经报了
    }
    let last = tags[tags.length() - 1]
    if !(last.code == 0 && last.value.as_string() == "EOF") {
      problems.push(
        "\{path}：最后一个是 \{last.to_display()}，不是 EOF",
      )
    }
  }
  if problems.length() > 0 {
    fail("有文件没以 EOF 结尾：" + join_problems(problems))
  }
}

///|
test "扫出来的组码都是合理的非负数" {
  // 组码是 0-1071 之间的整数。出现负数或者超出范围说明字节被错位读了。
  // 这一条能把「值被当成组码」这类错位抓出来
  let problems : Array[String] = []
  for path in corpus_files() {
    let scan = scan_corpus_file(path)
    for t in scan.tags {
      if t.code < 0 || t.code > 1071 {
        problems.push("\{path}：出现了组码 \{t.code}")
        break
      }
    }
  }
  if problems.length() > 0 {
    fail("有文件的组码越界：" + join_problems(problems))
  }
}

// ── 几个具体文件的期望值 ────────────────────────────────────────────────
//
// 遍历式的不变量只能保证「不崩」，保证不了「读对了」。
// 下面这几个数字是从文件正文手工数出来的，当锚点用。

///|
test "circle_radius_le_0：3016 行 → 1508 个 tag" {
  // 这个文件的价值在于**它是缩进的**（首行是 `  0` 而不是 `0`）。
  // 不 trim 的话一个 tag 都扫不出来
  let scan = scan_corpus_file(CORPUS_DIR + "/circle_radius_le_0.dxf")
  assert_eq(scan.tags.length(), 1508)
  // 缩进的文件不该产生警告——缩进是合法的，不是坏数据
  assert_eq(scan.warnings.length(), 0)
}

///|
test "Minimal_DXF_AC1009：35 字节的最小文件" {
  // 整个文件就四对 tag：SECTION / ENTITIES / ENDSEC / EOF
  let scan = scan_corpus_file(CORPUS_DIR + "/Minimal_DXF_AC1009.dxf")
  assert_eq(scan.tags.length(), 4)
  assert_true(scan.tags[0].value.as_string() == "SECTION")
  assert_true(scan.tags[1].value.as_string() == "ENTITIES")
  assert_true(scan.tags[2].value.as_string() == "ENDSEC")
  assert_true(scan.tags[3].value.as_string() == "EOF")
}

///|
/// 从 tag 流里读出 `$ACADVER` 的值。
fn read_acadver(scan : @dxfkit.TagScan) -> String? {
  // HEADER 变量的写法是：9 / $ACADVER / 1 / AC1021——
  // 名字和值各是一个 tag，值**紧跟在名字后面**
  let mut i = 0
  while i + 1 < scan.tags.length() {
    if scan.tags[i].value.as_string() == "$ACADVER" {
      return Some(scan.tags[i + 1].value.as_string())
    }
    i = i + 1
  }
  None
}

///|
test "带 HEADER 的 Minimal 文件能读出正确的版本号" {
  // AC1006=R10、AC1021=R2007——两个不同年代的格式，
  // 后面结构层要按版本分派行为
  let cases : Array[(String, String)] = [
    ("Minimal_DXF_AC1006.dxf", "AC1006"),
    ("Minimal_DXF_AC1021.dxf", "AC1021"),
  ]
  for c in cases {
    let (name, want) = c
    let scan = scan_corpus_file(CORPUS_DIR + "/" + name)
    match read_acadver(scan) {
      Some(v) =>
        if v != want {
          fail("\{name}：版本读出来是 \{v}，应该是 \{want}")
        }
      None => fail("\{name}：没找到 $ACADVER")
    }
  }
}

///|
test "没有 HEADER 段的最小文件：不该崩，也不能假装知道版本" {
  // Minimal_DXF_AC1009.dxf 只有 35 字节，整个文件就是
  // SECTION / ENTITIES / ENDSEC / EOF——**连 HEADER 段都没有**。
  //
  // 这种情况不该猜一个版本出来，而要让上层知道「不知道」。
  // 顺带：它没有 $DWGCODEPAGE 也没有 $ACADVER，编码判断会退回 CP1252
  let scan = scan_corpus_file(CORPUS_DIR + "/Minimal_DXF_AC1009.dxf")
  assert_true(read_acadver(scan) is None)
  assert_true(scan.encoding is @dxfkit.Cp1252)
}

// ── 几何离散 ────────────────────────────────────────────────────────────

///|
test "语料 Geometry 离散：曲线有点列，无实体身份的 Face 不猜轮廓" {
  // 容差 0.01（图纸单位）。文件单位不统一，这里只钉总数当锚点，
  // 以及「离散结果不空、点数至少 2」这个基本不变量
  let tol = 0.01
  let mut total_points = 0
  let mut curves = 0
  let mut metadata_faces = 0
  let problems : Array[String] = []
  for path in corpus_files() {
    let es = @dxfkit.build_drawing(scan_corpus_file(path)).entities()
    for e in es.entities {
      let flat = e.geom.flatten(tol)
      if e.geom is @dxfkit.Face(..) {
        metadata_faces = metadata_faces + 1
        assert_true(flat is @dxfkit.Empty)
      }
      let pts = match flat {
        @dxfkit.Outline(points~, ..) => points
        _ => []
      }
      if pts.length() > 0 {
        curves = curves + 1
        total_points = total_points + pts.length()
        // 半径为 0 的退化圆/弧只出一个点——数据本来就坏（语料里
        // circle_radius_le_0.dxf 就是干这个的），检查环节会报它，
        // 这里只保证不炸
        let degenerate = match e.geom {
          @dxfkit.Circle(radius~, ..) => radius.abs() == 0.0
          @dxfkit.Arc(radius~, ..) => radius.abs() == 0.0
          _ => false
        }
        if pts.length() < 2 && !degenerate {
          problems.push("\{path}：\{e.kind()} 离散成了单点")
        }
      }
    }
  }
  // 2026-10-21：47 个面实体退出轮廓范围（3559 - 47 = 3512）。
  // 点数随正确的椭圆长轴和细分结果变化，不把总点数当作误差证明。
  // 算法精度由解析几何及独立 de Boor 对照另行验证。
  assert_eq(metadata_faces, 47)
  assert_eq(curves, 3512)
  assert_true(total_points > curves)
  if problems.length() > 0 {
    fail("有曲线离散异常：" + join_problems(problems))
  }
}

///|
test "语料块展开：WCS 阵列位置与覆盖诊断" {
  // R12 upgrade adds 24 FLAG instances (5 records each); all source DXF bytes
  // remain unchanged. Verify positions/provenance, not only aggregate counts.
  let mut total = 0
  let mut warns = 0
  for path in corpus_files() {
    let drawing = @dxfkit.build_drawing(scan_corpus_file(path))
    let exp = drawing.expand(0.05)
    total = total + exp.placed.length()
    warns = warns + exp.warnings.length()
    for warning in exp.warnings {
      if warning.contains("关联 ATTRIB") {
        assert_true(
          path.has_suffix("multi_insert_with_attribs.dxf") ||
          path.has_suffix("text.dxf") ||
          path.has_suffix("text_negative_extrusion.dxf") ||
          path.has_suffix("uncommon.dxf"),
        )
        assert_true(warning.contains("检查不完整"))
      } else if warning.contains("已转换 WCS") {
        assert_true(path.has_suffix("Minimal_DXF_AC1006.dxf"))
        assert_true(warning.contains("检查平面"))
      } else if warning.contains("仅检查中心线") {
        assert_true(
          path.has_suffix("text.dxf") ||
          path.has_suffix("text_negative_extrusion.dxf") ||
          path.has_suffix("viewports.dxf") ||
          path.has_suffix("VP4.dxf"),
        )
      } else {
        assert_true(warning.contains("POLYLINE 标志"))
        assert_true(warning.contains("普通二维折线"))
      }
    }
    if path.has_suffix("multi_insert_with_attribs.dxf") {
      let world = drawing.expand_world(0.05)
      let flags = world.placed.filter(p => p.entity.handle() == "31")
      let circles = world.placed.filter(p => p.entity.handle() == "37")
      assert_eq(flags.length(), 25)
      assert_eq(circles.length(), 25)
      let cs = (6.0.sqrt() + 2.0.sqrt()) / 4.0
      let sn = (6.0.sqrt() - 2.0.sqrt()) / 4.0
      let vertices = [(0.0, 0.0), (0.0, 5.0), (4.0, 3.0), (0.0, 3.0)]
      for i, p in flags {
        assert_eq(p.instances.length(), 1)
        assert_eq(p.instances[0].handle, "3B")
        assert_eq(p.instances[0].row, i / 5)
        assert_eq(p.instances[0].column, i % 5)
        match p.flat {
          @dxfkit.Outline3(points~, closed~) => {
            assert_false(closed)
            assert_eq(points.length(), 4)
            for j, point in points {
              let x = vertices[j].0 + (i % 5).to_double() * 10.0
              let y = vertices[j].1 + (i / 5).to_double() * 10.0
              assert_true((point.x - (cs * x - sn * y)).abs() < 1.0e-10)
              assert_true((point.y - (sn * x + cs * y)).abs() < 1.0e-10)
              assert_eq(point.z, 0.0)
            }
          }
          _ => fail("FLAG polyline must retain its four WCS vertices")
        }
      }
      assert_false(exp.warnings.any(w => w.contains("阵列暂只展开")))
      assert_true(exp.warnings.any(w => w.contains("ATTRIB")))
    }
    if path.has_suffix("Minimal_DXF_AC1006.dxf") {
      let world = drawing.expand_world(0.05)
      let lines = world.placed.filter(p => p.entity.kind() == "LINE")
      assert_eq(lines.length(), 1)
      match lines[0].flat {
        @dxfkit.Outline3(points~, ..) => {
          assert_eq(points[0].z, 0.5)
          assert_eq(points[1].z, -0.5)
        }
        _ => fail("spatial LINE endpoints must remain available")
      }
      assert_false(exp.placed.any(p => p.flat is @dxfkit.Outline(..)))
    }
  }
  assert_eq(total, 6330)
  assert_eq(warns, 12)
}

// ── 流式扫描 ────────────────────────────────────────────────────────────

///|
test "流式扫描与整份扫描逐 tag 等价" {
  // 块大小取 4096 和 8191（8191 是奇数，和 CRLF 错位，迟早劈到
  // `\r\n` 中间）——两个入口对同一份文件必须给出逐 tag 相同的结果
  let mut checked = 0
  for path in corpus_files() {
    let data = @fs.read_file_to_bytes(path) catch {
      @fs.IOError(msg) => fail("读不了 \{path}：\{msg}")
    }
    let batch = @dxfkit.scan_tags(data)
    for chunk in [4096, 8191] {
      let stream = @dxfkit.TagStream::new()
      let tags : Array[@dxfkit.Tag] = []
      let mut i = 0
      while i < data.length() {
        let stop = if i + chunk > data.length() {
          data.length()
        } else {
          i + chunk
        }
        let part : Array[Byte] = []
        let mut j = i
        while j < stop {
          part.push(data[j])
          j = j + 1
        }
        tags.append(stream.feed(Bytes::from_array(part)))
        i = stop
      }
      tags.append(stream.finish())
      if tags.length() != batch.tags.length() {
        fail(
          "\{path}（块大小 \{chunk}）：流式 \{tags.length()} 个 tag，整份 \{batch.tags.length()} 个",
        )
      }
      let mut k = 0
      while k < tags.length() {
        if tags[k].code != batch.tags[k].code ||
          tags[k].to_display() != batch.tags[k].to_display() {
          fail("\{path}（块大小 \{chunk}）第 \{k} 条 tag 不一致")
        }
        k = k + 1
      }
      if stream.warnings().length() != batch.warnings.length() {
        fail("\{path}（块大小 \{chunk}）：警告数不一致")
      }
      if stream.encoding().unwrap().to_display() != batch.encoding.to_display() {
        fail("\{path}（块大小 \{chunk}）：编码判断不一致")
      }
      checked = checked + 1
    }
  }
  // 47 个文件 × 2 种块大小
  assert_eq(checked, 94)
}

// ── 加工检查 ────────────────────────────────────────────────────────────

///|
test "语料加工检查：锚点" {
  // 2026-10-22：uncommon.dxf 的 59B SOLID 三角形新增正确轮廓，
  // 仅移除该文件一条 SOLID 未覆盖警告。下面核对具体来源实体，不只改汇总数。
  let mut fatal = 0
  let mut warn = 0
  let mut info = 0
  // 净距不查（min_gap = 0）：语料单位不统一（米制、毫米制混着），
  // 净距阈值没有跨文件通用的值
  for path in corpus_files() {
    let drawing = @dxfkit.build_drawing(scan_corpus_file(path))
    let r = drawing.check({ tol: 0.05, min_gap: 0.0, })
    fatal = fatal + r.count(@dxfkit.Fatal)
    warn = warn + r.count(@dxfkit.Warn)
    info = info + r.count(@dxfkit.Info)
    if path.has_suffix("multi_insert_with_attribs.dxf") {
      assert_false(r.findings.any(f => f.check == "自相交"))
      assert_true(r.to_text().contains("25 处轮廓没闭合"))
      assert_true(r.to_text().contains("关联 ATTRIB"))
      assert_true(r.has_incomplete_checks())
    }
    if path.contains("uncommon.dxf") {
      let solids = drawing.expand(0.05).placed.filter(p => {
        p.entity.kind() == "SOLID"
      })
      assert_eq(solids.length(), 1)
      assert_eq(solids[0].entity.handle(), "59B")
      match solids[0].flat {
        @dxfkit.Outline(points~, closed~) => {
          assert_true(closed)
          assert_eq(points.length(), 3)
          let expected = [
            @dxfkit.Vec2::new(64.02674521194035, 41.85743437238119),
            @dxfkit.Vec2::new(66.6601195237086, 47.31384445061086),
            @dxfkit.Vec2::new(69.46476993085394, 41.85743437238119),
          ]
          for i = 0; i < 3; i = i + 1 {
            assert_true(points[i].distance(expected[i]) < 1.0e-10)
            assert_true(points[i].distance(points[(i + 1) % 3]) > 0.0)
          }
        }
        _ => fail("59B SOLID must produce the documented triangle")
      }
      assert_false(
        r.to_text().contains("个 SOLID 实体的轮廓未参与检查"),
      )
    }
  }
  assert_eq(fatal, 1)
  assert_eq(warn, 153)
  assert_eq(info, 1)
}

// ── 实体层 ──────────────────────────────────────────────────────────────

///|
test "语料整体：实体解析的锚点" {
  // 实体身份与元数据保留不变。两条网格 POLYLINE 仍为 Unknown，
  // 现在额外报告超出普通二维范围；没有警告不再被当作读取完成标准。
  let mut total = 0
  let mut decoded = 0
  let mut warns = 0
  for path in corpus_files() {
    let es = @dxfkit.build_drawing(scan_corpus_file(path)).entities()
    total = total + es.entities.length()
    warns = warns + es.warnings.length()
    for warning in es.warnings {
      if warning.contains("仅检查中心线") {
        assert_true(path.has_suffix("VP4.dxf"))
      } else {
        assert_true(warning.contains("POLYLINE 标志"))
        assert_true(warning.contains("普通二维折线"))
      }
    }
    for e in es.entities {
      if e.is_decoded() {
        decoded = decoded + 1
      }
    }
  }
  assert_eq(total, 5524)
  assert_eq(decoded, 5404)
  assert_eq(warns, 4)
}

///|
test "语料里未解码的实体类型都在预期清单里" {
  // 未解码不是错误——是「解析器还没覆盖的类型」。真冒出清单外的新类型，
  // 这条会挂，提醒来对一遍（清单只比类型，不比个数；个数见注释）。
  // 实测分布：IMAGE 64（图片）、VIEWPORT 41（布局视口）、RAY 3、
  // XLINE 2、MULTILEADER 2、ACAD_TABLE 2、WIPEOUT 2、
  // POLYLINE 2（网格类，有意挡在 Unknown 外）、MESH 1、3DSOLID 1
  let expected : Array[String] = [
    "3DSOLID", "ACAD_TABLE", "IMAGE", "MESH", "MULTILEADER", "POLYLINE", "RAY", "VIEWPORT",
    "WIPEOUT", "XLINE",
  ]
  let seen : Array[String] = []
  for path in corpus_files() {
    let es = @dxfkit.build_drawing(scan_corpus_file(path)).entities()
    for e in es.entities {
      if !e.is_decoded() {
        let k = e.kind()
        let mut found = false
        for s in seen {
          if s == k {
            found = true
          }
        }
        if !found {
          seen.push(k)
        }
      }
    }
  }
  let problems : Array[String] = []
  for k in seen {
    let mut known = false
    for e in expected {
      if e == k {
        known = true
      }
    }
    if !known {
      problems.push("出现了没预期的未解码类型：\{k}")
    }
  }
  for e in expected {
    let mut present = false
    for s in seen {
      if s == e {
        present = true
      }
    }
    if !present {
      problems.push(
        "清单里的 \{e} 不再未解码了——解码了？更新清单",
      )
    }
  }
  if problems.length() > 0 {
    fail("未解码清单对不上：" + join_problems(problems))
  }
}

///|
test "circle.dxf 声明的是 CP1252 但实际是 UTF-8" {
  // 这是编码判断的活例子：它是 AC1027（R2013），按规则**强制 UTF-8**，
  // 而文件里的 $DWGCODEPAGE 还写着已失效的 ANSI_1252。
  // 照代码页解会把非 ASCII 内容解成乱码，而且不报错
  let scan = scan_corpus_file(CORPUS_DIR + "/circle_radius_le_0.dxf")
  assert_true(scan.encoding is @dxfkit.Utf8)
}
