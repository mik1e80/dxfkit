// 批量跑语料，把结果打出来。
//
//     moon run conformance                  # 每个文件的 tag 数、警告数、编码
//     moon run conformance --info           # 结构报告：版本、段、图层、块
//     moon run conformance 某文件.dxf        # 只跑一个（默认是 tag 报告）
//     moon run conformance --info 某文件.dxf
//
// 用途有两个：改了解析器之后**一眼看出有没有文件被跑挂**，
// 以及把每个文件的实际数字记下来当锚点。

///|
fn main {
  let args = @env.args()
  let mut info_mode = false
  let mut targets : Array[String] = []
  for i = 1; i < args.length(); i = i + 1 {
    if args[i] == "--info" {
      info_mode = true
    } else {
      targets.push(args[i])
    }
  }
  if targets.length() == 0 {
    targets = corpus_files() catch {
      err => {
        println("读不了语料目录 \{CORPUS_DIR}：\{err}")
        return
      }
    }
  }
  if info_mode {
    report_info(targets)
  } else {
    report_tags(targets)
  }
}

///|
/// tag 报告：每个文件扫出多少 tag、多少警告、判定成什么编码。
fn report_tags(targets : Array[String]) -> Unit {
  let mut total_tags = 0
  let mut total_warnings = 0
  let mut failed = 0

  println("文件                                      tag 数   警告  编码")
  println("──────────────────────────────────────────────────────────────────")
  for path in targets {
    let scan = scan_corpus_file(path) catch {
      err => {
        println("\{short_name(path)}：读不了（\{err}）")
        failed = failed + 1
        continue
      }
    }
    println(
      "\{pad(short_name(path), 40)} \{pad_int(scan.tags.length(), 6)} " +
      "\{pad_int(scan.warnings.length(), 6)}  \{scan.encoding.to_display()}",
    )
    total_tags = total_tags + scan.tags.length()
    total_warnings = total_warnings + scan.warnings.length()
  }
  println("──────────────────────────────────────────────────────────────────")
  println(
    "\{targets.length()} 个文件，共 \{total_tags} 个 tag，" +
    "\{total_warnings} 条警告，\{failed} 个读不了",
  )
}

///|
/// 结构报告：版本、每个段有多少条记录、图层和块。
fn report_info(targets : Array[String]) -> Unit {
  let mut failed = 0
  for path in targets {
    let scan = scan_corpus_file(path) catch {
      err => {
        println("\{short_name(path)}：读不了（\{err}）")
        failed = failed + 1
        continue
      }
    }
    let drawing = @dxfkit.build_drawing(scan)
    println("═══ \{short_name(path)} ═══")
    println("  版本      \{if drawing.version == "" { "（没有 HEADER 段）" } else { drawing.version }}")

    // 段的记录数
    let sb = StringBuilder()
    let mut first = true
    for s in drawing.sections {
      if !first {
        sb.write_string("  ")
      }
      first = false
      sb.write_string("\{s.name}(\{s.records.length()})")
    }
    println("  段        \{sb}")

    // 图层
    match drawing.section("TABLES") {
      Some(t) => {
        let tables = @dxfkit.parse_tables(t)
        println("  图层      \{tables.layers.length()} 个")
        for l in tables.layers {
          let marks = StringBuilder()
          if l.is_off() {
            marks.write_string(" 关闭")
          }
          if l.frozen {
            marks.write_string(" 冻结")
          }
          if l.locked {
            marks.write_string(" 锁定")
          }
          println("    \{pad(l.name, 24)} 颜色 \{pad_int(l.color_index(), 3)}\{marks}")
        }
        println("  线型      \{tables.linetypes.length()} 个")
        println("  块记录    \{tables.block_records.length()} 个")
      }
      None => println("  没有 TABLES 段")
    }

    // HEADER 的常用变量
    match drawing.section("HEADER") {
      Some(h) => {
        let header = @dxfkit.parse_header(h)
        let units = header.insunits()
        println(
          "  单位      \{units}（\{@dxfkit.unit_name(units)}）",
        )
        match (header.extmin(), header.extmax()) {
          (Some(lo), Some(hi)) =>
            println("  范围      (\{lo.x}, \{lo.y}) 到 (\{hi.x}, \{hi.y})")
          (Some(lo), None) => println("  范围      左下 (\{lo.x}, \{lo.y})，没有 $EXTMAX")
          (None, Some(hi)) => println("  范围      右上 (\{hi.x}, \{hi.y})，没有 $EXTMIN")
          (None, None) => ()
        }
      }
      None => ()
    }
    if drawing.warnings.length() > 0 {
      println("  警告      \{drawing.warnings.length()} 条")
      for w in drawing.warnings {
        println("    \{w}")
      }
    }
    println("")
  }
  if failed > 0 {
    println("\{failed} 个文件读不了")
  }
}

///|
/// 只留文件名，报告里短一点。
fn short_name(path : String) -> String {
  let mut start = 0
  for i = 0; i < path.length(); i = i + 1 {
    let c = path.code_unit_at(i).to_int()
    if c == 0x2F || c == 0x5C {
      start = i + 1
    }
  }
  path[start:].to_owned()
}

///|
/// 左侧对齐补空格。
fn pad(s : String, width : Int) -> String {
  let sb = StringBuilder()
  sb.write_string(s)
  let mut i = s.length()
  while i < width {
    sb.write_string(" ")
    i = i + 1
  }
  sb.to_string()
}

///|
/// 右侧对齐补空格。
fn pad_int(n : Int, width : Int) -> String {
  let s = n.to_string()
  let sb = StringBuilder()
  let mut i = s.length()
  while i < width {
    sb.write_string(" ")
    i = i + 1
  }
  sb.write_string(s)
  sb.to_string()
}
