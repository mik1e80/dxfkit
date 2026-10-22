// 对已支持的二维轮廓做几何辅助检查，不能判断完整可加工性。
//
// 检查在**展开之后**的世界坐标折线上做：块引用已经摊平、曲线已经
// 离散——检查不该关心「这条线在哪个块的哪一层引用里」。需要原始
// 实体信息的地方（句柄、半径），`Placed` 里带着源实体。
//
// 每条发现带严重程度：Info 只是说明情况、Warn 影响加工质量、
// Fatal 表示本工具要求优先修正的输入或几何问题。
//
// **这一层只报告，不修改。** 替用户改图纸（自动闭合、删重复线）
// 是另一个产品——工具把问题指出来，改不改归设计者。
//
// 整个检查是**保守**的：报出来的可以人工核对，漏报的直接切废件。
// 所以措辞宁可偏「确认一下」，不替用户下「没问题」的定论。

///|
/// 发现的严重程度。
pub(all) enum Severity {
  /// 辅助信息
  Info
  /// 需要使用者复核的问题或覆盖限制
  Warn
  /// 严重输入或几何问题
  Fatal
}

///|
/// 一条发现。
pub(all) struct Finding {
  /// 检查项名字（`退化几何` / `文字未转曲线` / …），报告按它分组
  check : String
  severity : Severity
  message : String
}

///|
/// 检查报告。
pub(all) struct Report {
  findings : Array[Finding]
}

///|
/// 统计某个严重程度的条数。
pub fn Report::count(self : Report, severity : Severity) -> Int {
  let mut n = 0
  for f in self.findings {
    let hit = match (f.severity, severity) {
      (Info, Info) | (Warn, Warn) | (Fatal, Fatal) => true
      _ => false
    }
    if hit {
      n = n + 1
    }
  }
  n
}

///|
/// 有没有致命问题。
pub fn Report::has_fatal(self : Report) -> Bool {
  self.count(Fatal) > 0
}

///|
/// 是否存在输入恢复、覆盖限制、未转轮廓文字或无效检查参数。
/// 只描述本次所选检查的完整性，不表示完整 DXF 兼容或可加工性。
/// 保留 Finding 原来的分类，避免调用方依赖解析文字来判断完整性。
pub fn Report::has_incomplete_checks(self : Report) -> Bool {
  self.findings.any(f => {
    match f.check {
      "解析" | "检查覆盖" | "文字未转曲线" | "参数" => true
      _ => false
    }
  })
}

///|
/// 一句话结论。**检查项有限，没问题不等于万事大吉**——措辞上
/// 不替用户打包票。
pub fn Report::verdict(self : Report) -> String {
  let fatal = self.count(Fatal)
  let summary = if fatal > 0 {
    "本次检查发现 \{fatal} 个严重问题，请修正并复核图纸。"
  } else {
    let warn = self.count(Warn)
    if warn > 0 {
      "本次检查发现 \{warn} 个警告，请复核图纸与加工条件。"
    } else {
      "本次已覆盖的检查项没发现问题；不构成可加工保证，请确认单位、材料、刀具和工艺。"
    }
  }
  if self.has_incomplete_checks() {
    "检查不完整：存在未解析、未转换或未能检查的内容。\{summary}"
  } else {
    summary
  }
}

///|
/// 检查参数。
pub(all) struct CheckOptions {
  /// 离散 / 重合判定的容差
  tol : Double
  /// 同图层不同实体的折线距离低于此值时提示；不测单实体窄颈。
  ///
  /// **0 表示不查这条**——净距合不合格取决于材料与工艺
  ///（1 毫米的钢和 1 毫米的纸板不是一回事，激光和铣刀也不是），
  /// 没有能通用的默认值，必须由调用方给。
  min_gap : Double
}

///|
/// 严重程度的中文标签。
pub fn severity_label(sev : Severity) -> String {
  match sev {
    Info => "提示"
    Warn => "警告"
    Fatal => "致命"
  }
}

///|
/// 报告 → 纯文本：每条发现一行 `[严重程度] [检查项] 说明`，
/// 末尾是统计和结论。CLI 和网页版都从这里取排版——两边永远不会打架。
pub fn Report::to_text(self : Report) -> String {
  let sb = StringBuilder()
  if self.findings.length() == 0 {
    sb.write_string("（没有发现）\n")
  } else {
    for f in self.findings {
      sb.write_string(
        "[\{severity_label(f.severity)}] [\{f.check}] \{f.message}\n",
      )
    }
  }
  sb.write_string(
    "致命 \{self.count(Fatal)} · 警告 \{self.count(Warn)} · 提示 \{self.count(Info)}\n",
  )
  sb.write_string(self.verdict())
  sb.to_string()
}

///|
/// 加工前检查。
///
/// `tol` 既是离散容差、也是判定尺度（重合、闭合都拿它比）。
pub fn Drawing::check(self : Drawing, opt : CheckOptions) -> Report {
  if !positive_tolerance(opt.tol) ||
    !finite_number(opt.min_gap) ||
    opt.min_gap < 0.0 {
    return self.check_expansion(opt, { placed: [], warnings: [], })
  }
  self.check_expansion(opt, self.expand(opt.tol))
}

///|
/// 按显式图纸预算检查；预算截断原因进入检查不完整报告。
pub fn Drawing::check_with_limits(
  self : Drawing,
  opt : CheckOptions,
  limits : ExpandLimits,
) -> Report {
  if !positive_tolerance(opt.tol) ||
    !finite_number(opt.min_gap) ||
    opt.min_gap < 0.0 {
    return self.check_expansion(opt, { placed: [], warnings: [], })
  }
  self.check_expansion(opt, self.expand_with_limits(opt.tol, limits))
}

///|
fn Drawing::check_expansion(
  self : Drawing,
  opt : CheckOptions,
  exp : Expansion,
) -> Report {
  let tol = opt.tol
  let findings : Array[Finding] = []
  if !positive_tolerance(tol) ||
    !finite_number(opt.min_gap) ||
    opt.min_gap < 0.0 {
    return {
      findings: [
        {
          check: "参数",
          severity: Fatal,
          message: "容差必须是正的有限数字，最小净距必须是非负有限数字",
        },
      ],
    }
  }
  // 展开过程中的问题（缺块、循环引用）本身就是检查结论
  for w in exp.warnings {
    findings.push({ check: "解析", severity: Warn, message: w, })
  }
  // 已解码不等于已检查几何。不能让未支持实体或空图纸得到无问题结论。
  let unsupported : Array[(String, Int)] = []
  let unconverted_ocs : Array[(String, Int)] = []
  let mut outlines = 0
  for p in exp.placed {
    match p.flat {
      Outline(points~, ..) =>
        if points.length() >= 2 {
          outlines = outlines + 1
        }
      _ => ()
    }
    match p.entity.geom {
      Face(..) =>
        if !((p.entity.kind() == "SOLID" || p.entity.kind() == "TRACE") &&
          p.flat is Outline(..)) {
          bump(unsupported, p.entity.kind())
        }
      Hatch(..) | Dimension(..) | Unknown => bump(unsupported, p.entity.kind())
      _ => ()
    }
    let record = p.entity.common.record
    if record.get_double(210, 0.0) != 0.0 ||
      record.get_double(220, 0.0) != 0.0 ||
      record.get_double(230, 1.0) != 1.0 {
      bump(unconverted_ocs, p.entity.kind())
    }
  }
  for item in unconverted_ocs {
    findings.push({
      check: "检查覆盖",
      severity: Warn,
      message: "\{item.1} 个 \{item.0} 实体带非默认挤出方向；本工具未转换 OCS，几何结果需另行复核",
    })
  }
  for item in unsupported {
    findings.push({
      check: "检查覆盖",
      severity: Warn,
      message: "\{item.1} 个 \{item.0} 实体的轮廓未参与检查；保留记录不表示已验证几何",
    })
  }
  if outlines == 0 {
    findings.push({
      check: "检查覆盖",
      severity: Warn,
      message: "没有可检查的二维轮廓；空文件、文字或未支持实体不能作为检查通过的依据",
    })
  }
  // 退化几何：逐条看，每条都要能定位（图层 + 句柄）
  for p in exp.placed {
    check_degenerate(p, findings)
  }
  // 文字和图层按图层汇总——不然一份图纸几百条文字会刷屏
  check_texts(exp.placed, findings)
  let tables = match self.section("TABLES") {
    Some(t) => Some(parse_tables(t))
    None => None
  }
  check_layers(tables, exp.placed, findings)
  check_closure(exp.placed, tables, tol, findings)
  check_crossings(exp.placed, tables, tol, findings)
  check_min_gap(exp.placed, tables, opt, findings)
  { findings, }
}

///|
/// 退化几何：半径非正的圆 / 弧、单点或空轮廓、零长度线段。
fn check_degenerate(p : Placed, findings : Array[Finding]) -> Unit {
  // 半径只有展开前的实体看得到（离散之后就只剩点列了）
  match p.entity.geom {
    Circle(radius~, ..) => check_radius(p, "圆", radius, findings)
    Arc(radius~, ..) => check_radius(p, "圆弧", radius, findings)
    _ => ()
  }
  match p.flat {
    Outline(points~, closed~) => {
      let n = points.length()
      if n == 0 {
        findings.push({
          check: "退化几何",
          severity: Warn,
          message: "\{where_of(p)}有一条空轮廓",
        })
      } else if n == 1 {
        // 圆 / 弧的单点轮廓已经在半径检查里报过，别重复
        let kind = p.entity.kind()
        if !(kind == "CIRCLE" || kind == "ARC") {
          findings.push({
            check: "退化几何",
            severity: Warn,
            message: "\{where_of(p)}有只有一个点的轮廓（\{kind}）",
          })
        }
      } else {
        let segs = if closed { n } else { n - 1 }
        let mut zeros = 0
        let mut i = 0
        while i < segs {
          if points[i].distance(points[(i + 1) % n]) == 0.0 {
            zeros = zeros + 1
          }
          i = i + 1
        }
        if zeros > 0 {
          findings.push({
            check: "退化几何",
            severity: Warn,
            message: "\{where_of(p)}的轮廓里有 \{zeros} 段零长度线段",
          })
        }
      }
    }
    _ => ()
  }
}

///|
fn check_radius(
  p : Placed,
  what : String,
  radius : Double,
  findings : Array[Finding],
) -> Unit {
  if radius < 0.0 {
    findings.push({
      check: "退化几何",
      severity: Fatal,
      message: "\{where_of(p)}的\{what}半径是负数（\{radius}），需要修正几何定义",
    })
  } else if radius == 0.0 {
    findings.push({
      check: "退化几何",
      severity: Warn,
      message: "\{where_of(p)}的\{what}半径是 0——退化成一个点",
    })
  }
}

///|
/// 文字未转轮廓：不检查字形几何，下游软件的处理方式由使用者确认。
fn check_texts(placed : Array[Placed], findings : Array[Finding]) -> Unit {
  let counts : Array[(String, Int)] = []
  for p in placed {
    let is_text = match p.entity.kind() {
      "TEXT" | "MTEXT" | "ATTRIB" | "ATTDEF" => true
      _ => false
    }
    if is_text {
      bump(counts, p.layer)
    }
  }
  for c in counts {
    findings.push({
      check: "文字未转曲线",
      severity: Warn,
      message: "图层「\{c.0}」上有 \{c.1} 处文字：文字尚未转换为轮廓，本工具不检查字形几何，请确认下游软件的文字处理方式。",
    })
  }
}

///|
/// 图层相关的提醒：关闭 / 冻结的图层上有东西、引用了图层表里没有的图层。
fn check_layers(
  tables : Tables?,
  placed : Array[Placed],
  findings : Array[Finding],
) -> Unit {
  let tables = match tables {
    Some(t) => t
    None => return
  }
  for l in tables.layers {
    let mut status = ""
    if l.is_off() {
      status = "关闭"
    } else if l.frozen {
      status = "冻结"
    }
    if status == "" {
      continue
    }
    let mut n = 0
    for p in placed {
      if p.layer == l.name {
        n = n + 1
      }
    }
    if n > 0 {
      findings.push({
        check: "图层",
        severity: Info,
        message: "图层「\{l.name}」是\{status}的，上面有 \{n} 条实体：本工具在部分几何检查中跳过该关闭/冻结图层，请确认下游软件的实际处理方式。",
      })
    }
  }
  // 引用了图层表里没有的图层：引用完整性问题
  let unknown : Array[(String, Int)] = []
  for p in placed {
    if p.layer != "" && tables.layer(p.layer) is None {
      bump(unknown, p.layer)
    }
  }
  for u in unknown {
    findings.push({
      check: "图层",
      severity: Warn,
      message: "图层「\{u.0}」不在图层表里，但有 \{u.1} 条实体引用它",
    })
  }
}

///|
/// 轮廓闭合：同一个图层里的开放折线按端点容差串成链条，
/// 串不动之后头尾还对不上的，就是没闭合的轮廓。
///
/// 为什么不标致命：**判断不了意图**——轮廓件缺一段确实会散架，
/// 但刻线、折弯线和有意留的开口本来就是开口。报出来让人确认，
/// 比替用户下结论诚实。
///
/// 本工具的闭合检查跳过关闭 / 冻结图层；这不推断下游软件或机床行为。
///
/// 串链是朴素的贪心——每层边的数量是图纸实体级的（几百上千），
/// O(n²) 在单张图上跑得动；真遇到几万条再上空间索引。
fn check_closure(
  placed : Array[Placed],
  tables : Tables?,
  tol : Double,
  findings : Array[Finding],
) -> Unit {
  // 这层有没有按本工具图层筛选约定参与检查的开放折线
  let names : Array[String] = []
  for p in placed {
    let open = match p.flat {
      Outline(closed~, ..) => !closed
      _ => false
    }
    if !open || is_uncut_layer(tables, p.layer) {
      continue
    }
    let mut seen = false
    for n in names {
      if n == p.layer {
        seen = true
      }
    }
    if !seen {
      names.push(p.layer)
    }
  }
  for layer in names {
    // 这一层的开放折线，每条只留两个端点（中间的点不影响串链）
    let edges : Array[(Vec2, Vec2)] = []
    for p in placed {
      if p.layer != layer {
        continue
      }
      match p.flat {
        Outline(points~, closed~) =>
          if !closed && points.length() >= 2 {
            edges.push((points[0], points[points.length() - 1]))
          }
        _ => ()
      }
    }
    let (open_count, worst_gap, at) = open_chains(edges, tol)
    if open_count > 0 {
      findings.push({
        check: "轮廓闭合",
        severity: Warn,
        message: "图层「\{layer}」上有 \{open_count} 处轮廓没闭合——最宽的缝 \{worst_gap}（(\{at.x}, \{at.y}) 附近）；若用于封闭区域切割，请确认端点连接；开放刀路需按工艺判断",
      })
    }
  }
}

///|
/// 把一组开放段按端点（容差内）串成链，数出没闭合的条数。
/// 返回（没闭合的条数、最宽的缝、缝的位置）。
fn open_chains(
  edges : Array[(Vec2, Vec2)],
  tol : Double,
) -> (Int, Double, Vec2) {
  let used : Array[Bool] = []
  for _ in edges {
    used.push(false)
  }
  let mut open = 0
  let mut worst = 0.0
  let mut at = Vec2::zero()
  let mut i = 0
  while i < edges.length() {
    if used[i] {
      i = i + 1
      continue
    }
    used[i] = true
    let mut head = edges[i].0
    let mut tail = edges[i].1
    // 两头都往外接，接到接不动为止
    let mut grew = true
    while grew {
      grew = false
      let mut j = 0
      while j < edges.length() {
        if used[j] {
          j = j + 1
          continue
        }
        let (a, b) = edges[j]
        if tail.distance(a) <= tol {
          tail = b
          used[j] = true
          grew = true
        } else if tail.distance(b) <= tol {
          tail = a
          used[j] = true
          grew = true
        } else if head.distance(a) <= tol {
          head = b
          used[j] = true
          grew = true
        } else if head.distance(b) <= tol {
          head = a
          used[j] = true
          grew = true
        }
        j = j + 1
      }
    }
    let gap = head.distance(tail)
    if gap > tol {
      open = open + 1
      if gap > worst {
        worst = gap
        at = head
      }
    }
    i = i + 1
  }
  (open, worst, at)
}

// ── 自相交与重复切割 ────────────────────────────────────────────────────
//
// 两条检查都要「线段和线段比」，朴素两两配对是 O(n²)——图纸上千条
// 线段就顶不住了。做法是按 min_x 排序后扫掠：每段只需要和 min_x
// 落在自己 x 区间内的段比（再加 y 方向的包围盒粗筛），
// 典型图纸上候选对是线性的。

///|
/// 一条待检线段：两个端点 + 包围盒 + 身份（哪条折线的第几段）。
priv struct CutSeg {
  a : Vec2
  b : Vec2
  min_x : Double
  max_x : Double
  min_y : Double
  max_y : Double
  /// 属于第几条展开几何（数组下标）
  owner : Int
  /// 折线里的第几段
  seg : Int
  /// 折线总段数（判断环绕相邻用）
  count : Int
  closed : Bool
}

///|
/// 自相交（轮廓自己和自己交叉）与重复切割（线段重叠）。
///
/// - **自相交**只算「真正穿过」：交点严格在两段内部。端点相接不算
///   （可能是合法的连接点），共线重叠也不在这里报（归重复切割）。
/// - **重复切割**算共线重叠：同一刀会切两遍，激光会烧焦、铣刀多切一刀。
/// - 相邻段不参与（正常折线的相邻段本来就首尾相接）。
/// - 只在会被切到的图层上查，和闭合检查一个口径。
fn check_crossings(
  placed : Array[Placed],
  tables : Tables?,
  tol : Double,
  findings : Array[Finding],
) -> Unit {
  let layers : Array[String] = []
  for p in placed {
    let is_outline = match p.flat {
      Outline(..) => true
      _ => false
    }
    if is_outline && !is_uncut_layer(tables, p.layer) {
      push_unique(layers, p.layer)
    }
  }
  for layer in layers {
    let segs = layer_segments(placed, layer)
    if segs.length() < 2 {
      continue
    }
    // 按 min_x 排序后扫掠
    segs.sort_by(fn(s1, s2) {
      if s1.min_x < s2.min_x {
        -1
      } else if s1.min_x > s2.min_x {
        1
      } else {
        0
      }
    })
    let self_crossed : Array[Int] = []
    let mut dup_pairs = 0
    let mut dup_len = 0.0
    let mut dup_at = Vec2::zero()
    let mut dup_has = false
    let mut i = 0
    while i < segs.length() {
      let s = segs[i]
      let mut j = i + 1
      while j < segs.length() && segs[j].min_x <= s.max_x + tol {
        let t = segs[j]
        // y 方向粗筛
        if !(t.min_y > s.max_y + tol || s.min_y > t.max_y + tol) {
          if !(s.owner == t.owner && adjacent_segs(s, t)) {
            if s.owner == t.owner && proper_cross(s.a, s.b, t.a, t.b) {
              push_unique_int(self_crossed, s.owner)
            }
            let over = overlap_length(s.a, s.b, t.a, t.b, tol)
            if over > tol {
              dup_pairs = dup_pairs + 1
              dup_len = dup_len + over
              if !dup_has {
                dup_at = s.a
                dup_has = true
              }
            }
          }
        }
        j = j + 1
      }
      i = i + 1
    }
    if self_crossed.length() > 0 {
      findings.push({
        check: "自相交",
        severity: Warn,
        message: "图层「\{layer}」有 \{self_crossed.length()} 条轮廓自相交，请确认是否符合设计",
      })
    }
    if dup_pairs > 0 {
      findings.push({
        check: "重复切割",
        severity: Warn,
        message: "图层「\{layer}」有 \{dup_pairs} 对线段重叠（共 \{dup_len} 长度，(\{dup_at.x}, \{dup_at.y}) 附近），请确认是否存在重复路径",
      })
    }
  }
}

///|
/// 收集一个图层里所有可切轮廓的线段。
fn layer_segments(placed : Array[Placed], layer : String) -> Array[CutSeg] {
  let segs : Array[CutSeg] = []
  let mut pi = 0
  while pi < placed.length() {
    let p = placed[pi]
    if p.layer == layer {
      match p.flat {
        Outline(points~, closed~) => {
          let n = points.length()
          if n >= 2 {
            let count = if closed { n } else { n - 1 }
            let mut i = 0
            while i < count {
              let a = points[i]
              let b = points[(i + 1) % n]
              segs.push({
                a,
                b,
                min_x: a.x.min(b.x),
                max_x: a.x.max(b.x),
                min_y: a.y.min(b.y),
                max_y: a.y.max(b.y),
                owner: pi,
                seg: i,
                count,
                closed,
              })
              i = i + 1
            }
          }
        }
        _ => ()
      }
    }
    pi = pi + 1
  }
  segs
}

///|
/// 同一折线里的相邻段（闭合折线首尾相接的那对也算）。
fn adjacent_segs(s : CutSeg, t : CutSeg) -> Bool {
  let d = if s.seg > t.seg { s.seg - t.seg } else { t.seg - s.seg }
  if d == 1 {
    return true
  }
  s.closed && d == s.count - 1
}

///|
/// 两段**真正穿过**（交点严格在两段的内部）才算交叉。
/// 端点相接、共线重叠都不算——前者可能是合法的连接，
/// 后者归「重复切割」。
fn proper_cross(a1 : Vec2, a2 : Vec2, b1 : Vec2, b2 : Vec2) -> Bool {
  let d1 = orient(a1, a2, b1)
  let d2 = orient(a1, a2, b2)
  let d3 = orient(b1, b2, a1)
  let d4 = orient(b1, b2, a2)
  ((d1 > 0.0 && d2 < 0.0) || (d1 < 0.0 && d2 > 0.0)) &&
  ((d3 > 0.0 && d4 < 0.0) || (d3 < 0.0 && d4 > 0.0))
}

///|
/// 叉积的符号判断点在直线的哪一侧。
fn orient(a : Vec2, b : Vec2, c : Vec2) -> Double {
  b.sub(a).cross(c.sub(a))
}

///|
/// 两段共线时重叠部分的长度；不共线（或离得太远）返回 0。
///
/// 判定：b 的两个端点到 a 所在直线的垂直距离都在容差内
///（直线段是线性的，端点贴线整段就贴线），
/// 再把两段投影到 a 的方向上取区间交。
fn overlap_length(
  a1 : Vec2,
  a2 : Vec2,
  b1 : Vec2,
  b2 : Vec2,
  tol : Double,
) -> Double {
  let dir = a2.sub(a1)
  let len = dir.length()
  if len <= tol {
    // a 自身就是零长度段——退化几何那条会报它
    return 0.0
  }
  let unit = dir.scale(1.0 / len)
  let normal = unit.perp()
  if b1.sub(a1).dot(normal).abs() > tol || b2.sub(a1).dot(normal).abs() > tol {
    return 0.0
  }
  let t1 = b1.sub(a1).dot(unit)
  let t2 = b2.sub(a1).dot(unit)
  let over = t1.max(t2).min(len) - t1.min(t2).max(0.0)
  if over < 0.0 {
    0.0
  } else {
    over
  }
}

// ── 最小间隙 ────────────────────────────────────────────────────────────
//
// 两条轮廓之间留的料太窄：激光会烧糊、铣刀会崩。对应 stlkit 里的
// 「壁厚」——那边是三维里量的，这边是在平面里量的净距。
//
// 判定上有两个分寸：
//
// - **只比不同实体之间**。一条折线自己相邻的段永远贴在一起
//  （离散之后更是如此），比它们没有意义；同一个实体的远亲段
//  （折回来自已贴近自己）这版不查——那是单条折线自身的形状问题，
//   报出来噪音大过价值。
// - **端点相接的不算**。一条轮廓常常由多条线首尾串成，
//   邻居之间「净距 0」是串接，不是缺陷。

///|
/// 最小间隙检查。`min_gap` 为 0 时不查（见 `CheckOptions`）。
fn check_min_gap(
  placed : Array[Placed],
  tables : Tables?,
  opt : CheckOptions,
  findings : Array[Finding],
) -> Unit {
  if opt.min_gap <= 0.0 {
    return
  }
  let tol = opt.tol
  let layers : Array[String] = []
  for p in placed {
    let is_outline = match p.flat {
      Outline(..) => true
      _ => false
    }
    if is_outline && !is_uncut_layer(tables, p.layer) {
      push_unique(layers, p.layer)
    }
  }
  for layer in layers {
    let segs = layer_segments(placed, layer)
    if segs.length() < 2 {
      continue
    }
    segs.sort_by(fn(s1, s2) {
      if s1.min_x < s2.min_x {
        -1
      } else if s1.min_x > s2.min_x {
        1
      } else {
        0
      }
    })
    let near : Array[(Int, Int)] = []
    let mut worst = opt.min_gap
    let mut at = Vec2::zero()
    let mut i = 0
    while i < segs.length() {
      let s = segs[i]
      let mut j = i + 1
      while j < segs.length() && segs[j].min_x <= s.max_x + opt.min_gap {
        let t = segs[j]
        if s.owner != t.owner &&
          !(t.min_y > s.max_y + opt.min_gap || s.min_y > t.max_y + opt.min_gap) {
          // 端点相接的（串成一条轮廓的邻居）不算净距问题
          let touching = s.a.distance(t.a) <= tol ||
            s.a.distance(t.b) <= tol ||
            s.b.distance(t.a) <= tol ||
            s.b.distance(t.b) <= tol
          if !touching {
            let gap = segment_gap(s.a, s.b, t.a, t.b)
            if gap < opt.min_gap {
              push_unique_pair(near, s.owner, t.owner)
              if gap < worst {
                worst = gap
                at = s.a
              }
            }
          }
        }
        j = j + 1
      }
      i = i + 1
    }
    if near.length() > 0 {
      findings.push({
        check: "最小间隙",
        severity: Warn,
        message: "图层「\{layer}」有 \{near.length()} 对实体轮廓距离低于阈值——折线最小距离 \{worst}（(\{at.x}, \{at.y}) 附近）；请结合单位、离散容差与工艺复核",
      })
    }
  }
}

///|
/// 两段之间的最小距离。相交（含端点接触）算 0——
/// 四个「端点到对方段」的距离对相交的段是给不出 0 的，得先判相交。
fn segment_gap(a1 : Vec2, a2 : Vec2, b1 : Vec2, b2 : Vec2) -> Double {
  if segments_intersect(a1, a2, b1, b2) {
    return 0.0
  }
  let d1 = dist_to_segment(a1, b1, b2)
  let d2 = dist_to_segment(a2, b1, b2)
  let d3 = dist_to_segment(b1, a1, a2)
  let d4 = dist_to_segment(b2, a1, a2)
  d1.min(d2).min(d3).min(d4)
}

///|
/// 两条线段是否相交（含端点接触、含共线重叠）——标准的方向判定。
fn segments_intersect(a1 : Vec2, a2 : Vec2, b1 : Vec2, b2 : Vec2) -> Bool {
  let d1 = orient(b1, b2, a1)
  let d2 = orient(b1, b2, a2)
  let d3 = orient(a1, a2, b1)
  let d4 = orient(a1, a2, b2)
  if ((d1 > 0.0 && d2 < 0.0) || (d1 < 0.0 && d2 > 0.0)) &&
    ((d3 > 0.0 && d4 < 0.0) || (d3 < 0.0 && d4 > 0.0)) {
    return true
  }
  // 共线情形：某个端点在另一条段上
  if d1 == 0.0 && on_segment(b1, b2, a1) {
    return true
  }
  if d2 == 0.0 && on_segment(b1, b2, a2) {
    return true
  }
  if d3 == 0.0 && on_segment(a1, a2, b1) {
    return true
  }
  if d4 == 0.0 && on_segment(a1, a2, b2) {
    return true
  }
  false
}

///|
/// 已知 p 在直线 ab 上，判断它在不在**线段** ab 的范围内（包围盒判定）。
fn on_segment(a : Vec2, b : Vec2, p : Vec2) -> Bool {
  p.x >= a.x.min(b.x) &&
  p.x <= a.x.max(b.x) &&
  p.y >= a.y.min(b.y) &&
  p.y <= a.y.max(b.y)
}

///|
/// 往「实体对」表里加一对（小下标记在前），去重。
fn push_unique_pair(pairs : Array[(Int, Int)], a : Int, b : Int) -> Unit {
  let x = if a < b { a } else { b }
  let y = if a < b { b } else { a }
  for p in pairs {
    if p.0 == x && p.1 == y {
      return
    }
  }
  pairs.push((x, y))
}

///|
fn push_unique(names : Array[String], v : String) -> Unit {
  for n in names {
    if n == v {
      return
    }
  }
  names.push(v)
}

///|
fn push_unique_int(ids : Array[Int], v : Int) -> Unit {
  for n in ids {
    if n == v {
      return
    }
  }
  ids.push(v)
}

///|
/// 是否按本工具约定跳过该图层。图层表中没有的图层继续参与检查。
/// 不据此判断下游软件或机床是否处理该图层。
fn is_uncut_layer(tables : Tables?, name : String) -> Bool {
  match tables {
    Some(t) =>
      match t.layer(name) {
        Some(l) => !l.is_enabled_for_checks()
        None => false
      }
    None => false
  }
}

///|
/// 往 (名字, 计数) 表里加一。
fn bump(counts : Array[(String, Int)], key : String) -> Unit {
  let mut i = 0
  while i < counts.length() {
    if counts[i].0 == key {
      counts[i] = (key, counts[i].1 + 1)
      return
    }
    i = i + 1
  }
  counts.push((key, 1))
}

///|
/// 发现的位置前缀：「图层「轮廓」句柄 2D 」（带尾空格，后面接「的…」）。
/// 没句柄就不提句柄。
fn where_of(p : Placed) -> String {
  let h = p.entity.handle()
  if h == "" {
    "图层「\{p.layer}」"
  } else {
    "图层「\{p.layer}」句柄 \{h} "
  }
}
