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
  check_layers(self, exp.placed, findings)
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
  d : Drawing,
  placed : Array[Placed],
  findings : Array[Finding],
) -> Unit {
  let tables = match d.section("TABLES") {
    Some(t) => parse_tables(t)
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
