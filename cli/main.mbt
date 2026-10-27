// 命令行入口：把库的能力包成一个人能直接用的工具。
//
//     dxfkit check 图纸.dxf                 # 加工前检查
//     dxfkit check 图纸.dxf --min-gap 0.5   # 带最小净距阈值
//     dxfkit svg 图纸.dxf > 预览.svg         # 画成 SVG
//     dxfkit stats 大图纸.dxf                # 流式统计（整份不进内存）
//
// 退出码是给脚本用的：**0 没致命问题、1 有致命问题、2 用不了**
//（参数不对 / 文件读不了）。普通模式0仍可能有警告；--strict将警告也作为1。
//
// 这一层只做「读文件 → 调库 → 排版输出」——判定逻辑全在库里，
// CLI 只是门面，改门面碰不坏引擎。

///|
async fn main {
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
    "stats" => run_stats(args[2:])
    "read" => run_read(args[2:])
    cmd => {
      println("不认识的命令「\{cmd}」")
      usage()
      @sys.exit(2)
    }
  }
}

///|
/// Report record-preservation/structure separately from geometry checking.
fn run_read(args : ArrayView[String]) -> Unit {
  if args.length() != 1 {
    println("用法：dxfkit read 图纸.dxf")
    @sys.exit(2)
    return
  }
  let data = @fs.read_file_to_bytes(args[0]) catch {
    _ => {
      println("读取文件失败：\{args[0]}")
      @sys.exit(2)
      return
    }
  }
  let doc = @dxfkit.read_document(data)
  let profile = match doc.profile {
    R12 => "R12/AC1009"
    BestEffort => "best-effort"
  }
  println(
    "读取配置 \{profile} · \{doc.records.length()} 条原始记录 · \{doc.scan.tags.length()} 个 tag · 保留 \{data.length()} 字节",
  )
  println(
    "结构检查不等于完整标准符合性或几何检查；原始字节包含扫描器忽略的 EOF 后数据。",
  )
  for w in doc.read_warnings {
    println("读取警告：\{w}")
  }
  @sys.exit(if doc.read_warnings.length() == 0 { 0 } else { 1 })
}

///|
fn run_check(args : ArrayView[String]) -> Unit {
  let mut path = ""
  let mut tol = 0.05
  let mut min_gap = 0.0
  let mut strict = false
  let mut i = 0
  while i < args.length() {
    if args[i] == "--tol" && i + 1 < args.length() {
      tol = match parse_num(args[i + 1]) {
        Some(value) => value
        None => {
          println("--tol 必须是正的有限数字")
          @sys.exit(2)
          return
        }
      }
      i = i + 2
    } else if args[i] == "--min-gap" && i + 1 < args.length() {
      min_gap = match parse_num(args[i + 1]) {
        Some(value) => value
        None => {
          println("--min-gap 必须是非负有限数字")
          @sys.exit(2)
          return
        }
      }
      i = i + 2
    } else if args[i] == "--strict" {
      strict = true
      i = i + 1
    } else if args[i].has_prefix("--") {
      println("未知选项或缺少参数值「\{args[i]}」")
      @sys.exit(2)
      return
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
  if tol <= 0.0 || min_gap < 0.0 {
    println("--tol 必须大于0，--min-gap 必须非负")
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
  println(
    "图纸 \{path} · 单位声明 \{drawing.declared_unit_label()} · 容差 \{tol} · \{gap_note}",
  )
  println(
    "坐标及阈值按图纸原始单位解释；单位声明需由使用者确认。",
  )
  println(
    "────────────────────────────────────────",
  )
  let report = drawing.check({ tol, min_gap, })
  println(report.to_text())
  if report.has_fatal() ||
    (
      strict &&
      (report.has_incomplete_checks() || report.count(@dxfkit.Warn) > 0)
    ) {
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
      tol = match parse_num(args[i + 1]) {
        Some(value) => value
        None => {
          println("--tol 必须是正的有限数字")
          @sys.exit(2)
          return
        }
      }
      i = i + 2
    } else if args[i].has_prefix("--") {
      println("未知选项或缺少参数值「\{args[i]}」")
      @sys.exit(2)
      return
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
  if tol <= 0.0 {
    println("--tol 必须大于0")
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
/// 流式统计：一块一块地读，边读边数——**整个文件不进内存**，
/// 警告、未完成行和统计表仍可能增长。走 `moonbitlang/async/fs`：`moonbitlang/x/fs`
/// 只有「一次读完」，没有带偏移量的读取。
///
/// 只报能流出来算的东西（tag 数、段、版本、编码、警告数）；
/// 要看几何走 `check` / `svg`——那两个需要整份图纸，是另一条路。
async fn run_stats(args : ArrayView[String]) -> Unit {
  let mut path = ""
  for a in args {
    if path == "" {
      path = a
    } else {
      println("多余的参数「\{a}」")
      @sys.exit(2)
      return
    }
  }
  if path == "" {
    println("要给一个 DXF 文件：dxfkit stats 图纸.dxf")
    @sys.exit(2)
    return
  }
  let file = @asyncfs.open(path, mode=@asyncfs.Mode::ReadOnly) catch {
    err => {
      println("打不开 \{path}：\{err}")
      @sys.exit(2)
      return
    }
  }
  let size = file.size() catch {
    err => {
      let _ = file.close()
      println("读不了文件大小：\{err}")
      @sys.exit(2)
      return
    }
  }
  let stream = @dxfkit.TagStream::new()
  let tracker = StatsTracker::new()
  // 256 KB 一块：太小系统调用多，太大缓冲区本身占内存——关键是**固定**，
  // 文件再大也不涨
  let chunk = 262144
  let buf : FixedArray[Byte] = FixedArray::make(chunk, b'\x00')
  let mut pos = 0L
  let mut failure : String? = None
  while pos < size && failure is None {
    let remain = size - pos
    let want = if remain < chunk.to_int64() { remain.to_int() } else { chunk }
    let n = file.read_at(buf, position=pos, offset=0, len=want) catch {
      err => {
        failure = Some("读文件失败：\{err}")
        0
      }
    }
    if n <= 0 {
      break
    }
    let part : Array[Byte] = []
    for i = 0; i < n; i = i + 1 {
      part.push(buf[i])
    }
    let tags = stream.feed(Bytes::from_array(part))
    tracker.feed(tags)
    pos = pos + n.to_int64()
  }
  let tail = stream.finish()
  tracker.feed(tail)
  let _ = file.close()
  match failure {
    Some(msg) => {
      println(msg)
      @sys.exit(2)
      return
    }
    None => ()
  }
  let warnings = stream.warnings()
  println("图纸 \{path}")
  println(
    "文件 \{size} 字节，一块 \{chunk} 字节地读（整份不进内存）",
  )
  let ver = tracker.version()
  let ver_note = if ver == "" { "（没有 HEADER）" } else { ver }
  println(
    "编码 \{stream.encoding().unwrap().to_display()} · 版本 \{ver_note}",
  )
  println("tag \{tracker.tag_count()} 个 · 警告 \{warnings.length()} 条")
  // 段里数的是组码 0 记录：HEADER 的变量不是记录，所以它显示 0
  let sb = StringBuilder()
  for s in tracker.sections() {
    if sb.to_string().length() > 0 {
      sb.write_string("  ")
    }
    sb.write_string("\{s.0}(\{s.1})")
  }
  println("段        \{sb}")
  @sys.exit(0)
}

///|
/// `stats` 的流式统计：从连续喂进来的 tag 里摘版本号、段和记录数、总数。
///
/// 只认 tag 序列、不碰文件，所以天然是流式的——喂进来多少统计多少。
struct StatsTracker {
  mut count : Int
  mut ver : String
  /// 当前段名（`ENDSEC` 之后清空）
  mut section : String?
  /// 刚看到 `0 / SECTION`，下一对 `2 / 名字` 是段名
  mut want_section_name : Bool
  sections : Array[(String, Int)]
  /// 刚看到 `9 / $XXX`，下一条是它的值——盯 `$ACADVER`
  mut want_var : String?
}

///|
fn StatsTracker::new() -> StatsTracker {
  {
    count: 0,
    ver: "",
    section: None,
    want_section_name: false,
    sections: [],
    want_var: None,
  }
}

///|
fn StatsTracker::feed(self : StatsTracker, tags : Array[@dxfkit.Tag]) -> Unit {
  for t in tags {
    self.count = self.count + 1
    // $ACADVER：9 是变量名，紧跟的那条是值
    match self.want_var {
      Some(name) => {
        if t.code == 1 && name == "$ACADVER" {
          self.ver = t.value.as_string()
        }
        self.want_var = None
      }
      None => ()
    }
    if t.code == 9 {
      self.want_var = Some(t.value.as_string())
    }
    if t.code == 0 {
      let kind = t.value.as_string()
      if kind == "SECTION" {
        self.section = None
        self.want_section_name = true
      } else if kind == "ENDSEC" {
        self.section = None
      } else {
        // 段里的记录（SECTION / ENDSEC 自己不算）
        self.bump_current()
      }
    } else if t.code == 2 && self.want_section_name {
      self.section = Some(t.value.as_string())
      self.want_section_name = false
      self.sections.push((t.value.as_string(), 0))
    }
  }
}

///|
fn StatsTracker::bump_current(self : StatsTracker) -> Unit {
  match self.section {
    Some(name) => {
      let mut i = 0
      while i < self.sections.length() {
        if self.sections[i].0 == name {
          self.sections[i] = (name, self.sections[i].1 + 1)
        }
        i = i + 1
      }
    }
    None => ()
  }
}

///|
fn StatsTracker::tag_count(self : StatsTracker) -> Int {
  self.count
}

///|
fn StatsTracker::version(self : StatsTracker) -> String {
  self.ver
}

///|
fn StatsTracker::sections(self : StatsTracker) -> Array[(String, Int)] {
  self.sections.copy()
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
/// 命令行数字必须有限，非法值由调用方以参数错误报告。
fn parse_num(s : String) -> Double? {
  let n = @string.parse_double(s) catch { _ => return None }
  if n.is_nan() || n.is_inf() {
    None
  } else {
    Some(n)
  }
}

///|
fn usage() -> Unit {
  println("dxfkit —— ASCII DXF R12 记录读取与二维轮廓辅助检查")
  println("")
  println("用法：")
  println(
    "  dxfkit read <图纸.dxf>  # 读取配置、原始记录数和结构诊断",
  )
  println("  dxfkit check <图纸.dxf> [--tol 0.05] [--min-gap 0.5] [--strict]")
  println(
    "        加工前检查：轮廓闭合、自相交、重复切割、最小间隙、",
  )
  println(
    "        退化几何、文字未转曲线。有致命问题退出码 1，读不了 2，其余 0",
  )
  println(
    "        --strict 将警告也视为退出码1；0只表示当前检查范围内未触发退出条件",
  )
  println("  dxfkit svg <图纸.dxf> [--tol 0.05]")
  println(
    "        把图纸画成 SVG 打到 stdout（重定向存成文件）",
  )
  println("  dxfkit stats <图纸.dxf>")
  println(
    "        流式统计：tag 数、段、版本、编码；不保存完整文件，警告和未完成行仍占内存",
  )
  println("  dxfkit help")
  println("")
  println(
    "容差和净距都用图纸自己的单位；--min-gap 不给就不查净距",
  )
}
