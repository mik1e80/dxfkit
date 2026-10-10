// 批量跑语料，把每个文件的扫描结果打出来。
//
// 用途有两个：改了解析器之后**一眼看出有没有文件被跑挂**，
// 以及把每个文件的实际数字记下来当锚点（后面结构层、实体层都要拿它对）。
//
//     moon run conformance              # 跑 testdata/ezdxf 下的全部
//     moon run conformance 某文件.dxf    # 只跑一个

///|
fn main {
  let args = @env.args()
  let targets = if args.length() > 1 {
    [args[1]]
  } else {
    corpus_files() catch {
      err => {
        println("读不了语料目录 \{CORPUS_DIR}：\{err}")
        return
      }
    }
  }

  let mut total_tags = 0
  let mut total_warnings = 0
  let mut failed = 0

  println("文件                                      tag 数   警告  编码")
  println("──────────────────────────────────────────────────────────────────")
  for path in targets {
    let scan = scan_corpus_file(path) catch {
      err => {
        println("\{path}：读不了（\{err}）")
        failed = failed + 1
        continue
      }
    }
    let name = short_name(path)
    println(
      "\{pad(name, 40)} \{pad_int(scan.tags.length(), 6)} " +
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
  if total_warnings > 0 {
    println("")
    println("警告明细（前 20 条）：")
    let mut shown = 0
    for path in targets {
      let scan = scan_corpus_file(path) catch {
        _ => continue
      }
      for w in scan.warnings {
        if shown >= 20 {
          break
        }
        println("  \{short_name(path)}：\{w}")
        shown = shown + 1
      }
    }
  }
}

///|
/// 只留文件名，报告里短一点。
fn short_name(path : String) -> String {
  let mut start = 0
  for i = 0; i < path.length(); i = i + 1 {
    let c = path.code_unit_at(i)
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
