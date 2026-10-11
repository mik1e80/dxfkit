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
      problems.push("\{path}：最后一个是 \{last.to_display()}，不是 EOF")
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
test "语料几何离散：曲线都能摊平" {
  // 容差 0.01（图纸单位）。文件单位不统一，这里只钉总数当锚点，
  // 以及「离散结果不空、点数至少 2」这个基本不变量
  let tol = 0.01
  let mut total_points = 0
  let mut curves = 0
  let problems : Array[String] = []
  for path in corpus_files() {
    let es = @dxfkit.build_drawing(scan_corpus_file(path)).entities()
    for e in es.entities {
      let pts = match e.geom.flatten(tol) {
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
  // 2026-10-11 实测的锚点（tol=0.01）：椭圆与样条接进离散之后的数字
  assert_eq(curves, 3559)
  assert_eq(total_points, 21430)
  if problems.length() > 0 {
    fail("有曲线离散异常：" + join_problems(problems))
  }
}

///|
test "语料块展开：全部解开，零警告" {
  // 2026-10-11 实测：47 个文件的 INSERT 全部展开成 6210 条世界坐标
  // 几何，**一条警告都没有**——语料里没有一个解不开的块引用
  //（缺块、循环都没有）。以后这条挂了，多半是展开逻辑动了
  let mut total = 0
  let mut warns = 0
  for path in corpus_files() {
    let exp = @dxfkit.build_drawing(scan_corpus_file(path)).expand(0.05)
    total = total + exp.placed.length()
    warns = warns + exp.warnings.length()
  }
  assert_eq(total, 6210)
  assert_eq(warns, 0)
}

// ── 加工检查 ────────────────────────────────────────────────────────────

///|
test "语料加工检查：锚点" {
  // 2026-10-11 实测。唯一一条致命是 circle_radius_le_0.dxf 里句柄 2E
  // 的圆（半径 -1）——**那个文件就是为这个场景造的**，被精确逮到。
  // 警告构成：退化几何 25、文字未转曲线 47、图层引用 8、轮廓闭合 24
  //（各文件里散落的开口折线——语料是功能测试文件，不是加工图纸）；
  // 提示 1（有实体画在冻结图层上）
  let mut fatal = 0
  let mut warn = 0
  let mut info = 0
  for path in corpus_files() {
    let r = @dxfkit.build_drawing(scan_corpus_file(path)).check(0.05)
    fatal = fatal + r.count(@dxfkit.Fatal)
    warn = warn + r.count(@dxfkit.Warn)
    info = info + r.count(@dxfkit.Info)
  }
  assert_eq(fatal, 1)
  assert_eq(warn, 104)
  assert_eq(info, 1)
}

// ── 实体层 ──────────────────────────────────────────────────────────────

///|
test "语料整体：实体解析的锚点" {
  // 47 个文件：5524 个实体、5404 个解码、**0 条警告**（2026-10-11 实测）。
  // 警告是 0 不是巧合——ezdxf 的语料都用标准写法，缺必填字段的记录
  // 一条都没有；以后这条挂了，要么语料变了，要么解析器动错了
  let mut total = 0
  let mut decoded = 0
  let mut warns = 0
  for path in corpus_files() {
    let es = @dxfkit.build_drawing(scan_corpus_file(path)).entities()
    total = total + es.entities.length()
    warns = warns + es.warnings.length()
    for e in es.entities {
      if e.is_decoded() {
        decoded = decoded + 1
      }
    }
  }
  assert_eq(total, 5524)
  assert_eq(decoded, 5404)
  assert_eq(warns, 0)
}

///|
test "语料里未解码的实体类型都在预期清单里" {
  // 未解码不是错误——是「解析器还没覆盖的类型」。真冒出清单外的新类型，
  // 这条会挂，提醒来对一遍（清单只比类型，不比个数；个数见注释）。
  // 实测分布：IMAGE 64（图片）、VIEWPORT 41（布局视口）、RAY 3、
  // XLINE 2、MULTILEADER 2、ACAD_TABLE 2、WIPEOUT 2、
  // POLYLINE 2（网格类，有意挡在 Unknown 外）、MESH 1、3DSOLID 1
  let expected : Array[String] = [
    "3DSOLID",
    "ACAD_TABLE",
    "IMAGE",
    "MESH",
    "MULTILEADER",
    "POLYLINE",
    "RAY",
    "VIEWPORT",
    "WIPEOUT",
    "XLINE",
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
      problems.push("清单里的 \{e} 不再未解码了——解码了？更新清单")
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
