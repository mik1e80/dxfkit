// 命令行入口：把库的能力包成一个人能直接用的工具。
//
//     dxfkit check 图纸.dxf                 # 加工前检查
//     dxfkit check 图纸.dxf --min-gap 0.5   # 带最小净距阈值
//     dxfkit svg 图纸.dxf > 预览.svg         # 画成 SVG
//
// 退出码是给脚本用的：**0 没致命问题、1 有致命问题、2 用不了**
//（参数不对 / 文件读不了）。注意 0 的含义是「这次检查没发现问题」——
// 检查项有限，不构成保证（`verdict()` 里就是这么措辞的）。
//
// 这一层只做「读文件 → 调库 → 排版输出」——判定逻辑全在库里，
// CLI 只是门面，改门面碰不坏引擎。

///|
fn main {
  let args = @env.args()
  if args.length() < 2 {
    usage()
    @sys.exit(2)
    return
  }
  match args[1] {
    "help" | "--help" | "-h" => usage()
    "check" => run_check(args[2:])
    "svg" => run_svg(args[2:])
    cmd => {
      println("不认识的命令「\{cmd}」")
      usage()
      @sys.exit(2)
    }
  }
}

///|
fn run_check(args : ArrayView[String]) -> Unit {
  let mut path = ""
  let mut tol = 0.05
  let mut min_gap = 0.0
  let mut i = 0
  while i < args.length() {
    if args[i] == "--tol" && i + 1 < args.length() {
      tol = parse_num(args[i + 1], tol)
      i = i + 2
    } else if args[i] == "--min-gap" && i + 1 < args.length() {
      min_gap = parse_num(args[i + 1], min_gap)
      i = i + 2
    } else if path == "" {
      path = args[i]
      i = i + 1
    } else {
      println("多余的参数「\{args[i]}」")
      @sys.exit(2)
      return
    }
  }
  if path == "" {
    println("要给一个 DXF 文件：dxfkit check 图纸.dxf")
    @sys.exit(2)
    return
  }
  let scan = match scan_file(path) {
    Some(s) => s
    None => {
      @sys.exit(2)
      return
    }
  }
  let drawing = @dxfkit.build_drawing(scan)
  let gap_note = if min_gap > 0.0 {
    "最小净距 \{min_gap}"
  } else {
    "最小净距 不查（用 --min-gap 指定）"
  }
  println("图纸 \{path} · 容差 \{tol} · \{gap_note}")
  println("────────────────────────────────────────")
  let report = drawing.check({ tol, min_gap })
  println(report.to_text())
  if report.has_fatal() {
    @sys.exit(1)
  } else {
    @sys.exit(0)
  }
}

///|
fn run_svg(args : ArrayView[String]) -> Unit {
  let mut path = ""
  let mut tol = 0.05
  let mut i = 0
  while i < args.length() {
    if args[i] == "--tol" && i + 1 < args.length() {
      tol = parse_num(args[i + 1], tol)
      i = i + 2
    } else if path == "" {
      path = args[i]
      i = i + 1
    } else {
      println("多余的参数「\{args[i]}」")
      @sys.exit(2)
      return
    }
  }
  if path == "" {
    println("要给一个 DXF 文件：dxfkit svg 图纸.dxf > 预览.svg")
    @sys.exit(2)
    return
  }
  let scan = match scan_file(path) {
    Some(s) => s
    None => {
      @sys.exit(2)
      return
    }
  }
  println(@dxfkit.build_drawing(scan).to_svg(tol))
  @sys.exit(0)
}

///|
/// 读文件并扫描。读不了返回 `None`（问题已经打在屏幕上了）。
fn scan_file(path : String) -> @dxfkit.TagScan? {
  let data = @fs.read_file_to_bytes(path) catch {
    @fs.IOError(msg) => {
      println("读不了 \{path}：\{msg}")
      return None
    }
  }
  Some(@dxfkit.scan_tags(data))
}

///|
/// 命令行里的数字。解析不了就提示并退回默认值——
/// 不为一个笔误把整个检查停掉。
fn parse_num(s : String, fallback : Double) -> Double {
  @string.parse_double(s) catch {
    _ => {
      println("看不懂的数字「\{s}」，按 \{fallback} 处理")
      fallback
    }
  }
}

///|
fn usage() -> Unit {
  println("dxfkit —— DXF 图纸的加工前检查")
  println("")
  println("用法：")
  println("  dxfkit check <图纸.dxf> [--tol 0.05] [--min-gap 0.5]")
  println("        加工前检查：轮廓闭合、自相交、重复切割、最小间隙、")
  println("        退化几何、文字未转曲线。有致命问题退出码 1，读不了 2，其余 0")
  println("  dxfkit svg <图纸.dxf> [--tol 0.05]")
  println("        把图纸画成 SVG 打到 stdout（重定向存成文件）")
  println("  dxfkit help")
  println("")
  println("容差和净距都用图纸自己的单位；--min-gap 不给就不查净距")
}
