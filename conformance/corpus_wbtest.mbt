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

///|
test "circle.dxf 声明的是 CP1252 但实际是 UTF-8" {
  // 这是编码判断的活例子：它是 AC1027（R2013），按规则**强制 UTF-8**，
  // 而文件里的 $DWGCODEPAGE 还写着已失效的 ANSI_1252。
  // 照代码页解会把非 ASCII 内容解成乱码，而且不报错
  let scan = scan_corpus_file(CORPUS_DIR + "/circle_radius_le_0.dxf")
  assert_true(scan.encoding is @dxfkit.Utf8)
}
