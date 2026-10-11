// 加工前检查：回答「这份图纸能不能上机床」。
//
// 检查在**展开之后**的世界坐标折线上做：块引用已经摊平、曲线已经
// 离散——检查不该关心「这条线在哪个块的哪一层引用里」。需要原始
// 实体信息的地方（句柄、半径），`Placed` 里带着源实体。
//
// 每条发现带严重程度：Info 只是说明情况、Warn 影响加工质量、
// Fatal 会导致加工失败或废件。
//
// **这一层只报告，不修改。** 替用户改图纸（自动闭合、删重复线）
// 是另一个产品——工具把问题指出来，改不改归设计者。
//
// 整个检查是**保守**的：报出来的可以人工核对，漏报的直接切废件。
// 所以措辞宁可偏「确认一下」，不替用户下「没问题」的定论。

///|
/// 发现的严重程度。
pub(all) enum Severity {
  /// 只说明情况，不影响加工
  Info
  /// 影响加工质量，建议处理
  Warn
  /// 会导致加工失败或废件
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
/// 一句话结论。**检查项有限，没问题不等于万事大吉**——措辞上
/// 不替用户打包票。
pub fn Report::verdict(self : Report) -> String {
  let fatal = self.count(Fatal)
  if fatal > 0 {
    "不能上机床：\{fatal} 个致命问题"
  } else {
    let warn = self.count(Warn)
    if warn > 0 {
      "还有 \{warn} 个警告要确认"
    } else {
      "这次检查没发现问题（检查项有限，不构成保证）"
    }
  }
}

///|
/// 加工前检查。
///
/// `tol` 既是离散容差、也是判定尺度（重合、闭合都拿它比）。
pub fn Drawing::check(self : Drawing, tol : Double) -> Report {
  let findings : Array[Finding] = []
  let exp = self.expand(tol)
  // 展开过程中的问题（缺块、循环引用）本身就是检查结论
  for w in exp.warnings {
    findings.push({ check: "解析", severity: Warn, message: w })
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
      message: "\{where_of(p)}的\{what}半径是负数（\{radius}）——部分机床直接报错",
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
/// 文字未转曲线：机床不认字符串，这些位置不会被切。
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
      message: "图层「\{c.0}」上有 \{c.1} 处文字没转成曲线——机床不认字符串，这些位置不会被切",
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
        message: "图层「\{l.name}」是\{status}的，上面有 \{n} 条实体——不会被切（确认是有意的）",
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
/// 只在会被切到的图层上查：关闭 / 冻结的图层本来就不切
///（那条在图层检查里单独提示过），再报一遍只会吓人。
///
/// 串链是朴素的贪心——每层边的数量是图纸实体级的（几百上千），
/// O(n²) 在单张图上跑得动；真遇到几万条再上空间索引。
fn check_closure(
  placed : Array[Placed],
  tables : Tables?,
  tol : Double,
  findings : Array[Finding],
) -> Unit {
  // 这层有没有「会被切到的开放折线」
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
        Outline(points~, closed~) => {
          if !closed && points.length() >= 2 {
            edges.push((points[0], points[points.length() - 1]))
          }
        }
        _ => ()
      }
    }
    let (open_count, worst_gap, at) = open_chains(edges, tol)
    if open_count > 0 {
      findings.push({
        check: "轮廓闭合",
        severity: Warn,
        message: "图层「\{layer}」上有 \{open_count} 处轮廓没闭合——最宽的缝 \{worst_gap}（(\{at.x}, \{at.y}) 附近）；如果它们是轮廓，切开后零件会散架",
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
    // 收集这个图层的全部线段
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
    if segs.length() < 2 {
      continue
    }
    // 按 min_x 排序后扫掠
    segs.sort_by(fn (s1, s2) {
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
        message: "图层「\{layer}」有 \{self_crossed.length()} 条轮廓自己和自己交叉——切出来会多切一道口子",
      })
    }
    if dup_pairs > 0 {
      findings.push({
        check: "重复切割",
        severity: Warn,
        message: "图层「\{layer}」有 \{dup_pairs} 对线段重叠（共 \{dup_len} 长度，(\{dup_at.x}, \{dup_at.y}) 附近）——同一刀会切两遍，激光会烧焦",
      })
    }
  }
}

///|
/// 同一折线里的相邻段（闭合折线首尾相接的那对也算）。
fn adjacent_segs(s : CutSeg, t : CutSeg) -> Bool {
  let d = if s.seg > t.seg {
    s.seg - t.seg
  } else {
    t.seg - s.seg
  }
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
  if (b1.sub(a1).dot(normal)).abs() > tol || (b2.sub(a1).dot(normal)).abs() > tol {
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
/// 这个图层会不会被切到。图层表里查不到时按「会切」处理——
/// 宁可多查一遍，漏查的会切出废件。
fn is_uncut_layer(tables : Tables?, name : String) -> Bool {
  match tables {
    Some(t) =>
      match t.layer(name) {
        Some(l) => l.is_off() || l.frozen
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
