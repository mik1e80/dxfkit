// 结构层：把 tag 流切成段 → 记录 → 子类。
//
// DXF 的正文分层：
//
//     SECTION（段）      HEADER / CLASSES / TABLES / BLOCKS / ENTITIES / OBJECTS
//       记录（组码 0）    CIRCLE / LAYER / BLOCK / …
//         子类（组码 100）AcDbEntity / AcDbCircle / …
//
// 第三层是 DXF 的特点：**组码的含义随子类变**。同一个组码 70，在
// `AcDbSymbolTable` 里是「最大条目数」，在图层表记录里是「标志位」。
// 所以「70 是什么意思」只有先知道当前在哪个子类里才答得上来：
//
//    0    CIRCLE
//    5    2D          ← 第一个 100 之前的公共字段（句柄）
//    330  17          ← 所有者引用
//    100  AcDbEntity  ← 子类从这里开始
//    8    0           ← 图层（AcDbEntity 的字段）
//    100  AcDbCircle  ← 换到下一个子类
//    10/20/30  圆心    ← AcDbCircle 的字段
//    40   半径
//
// 这一层只负责把结构切出来，**不解释任何字段的含义**——那是实体层的事。

// ── 数据模型 ────────────────────────────────────────────────────────────

///|
/// 记录里的一段：由一个 `100` 子类标记开头的那些 tag。
///
/// 老版本（R10/R12）没有 `100` 标记，整条记录算作一个子类，
/// 名字用记录类型名（见 `subclass.mbt` 的合成逻辑）。
pub(all) struct Subclass {
  name : String
  tags : Array[Tag]
}

///|
/// 一条记录：组码 0 开头的一串 tag。
pub(all) struct Record {
  /// 记录类型名，就是组码 0 的值（`CIRCLE` / `LAYER` / `SECTION`…）
  kind : String
  /// 第一个 `100` 之前的公共 tag（组码 0 那条也在里面）
  common : Array[Tag]
  /// 各子类的 tag，按在文件里出现的顺序
  subclasses : Array[Subclass]
}

///|
/// 一个段。
pub(all) struct Section {
  /// 段名：`HEADER` / `CLASSES` / `TABLES` / `BLOCKS` / `ENTITIES` / `OBJECTS`
  name : String
  /// 段里的记录。
  ///
  /// **HEADER 段是特例**：它的变量之间没有组码 0 分隔，所以整段就是一条
  /// `SECTION` 记录，变量成对挂在它的 tag 里（`9` 是变量名，下一个 tag 是值）。
  /// 见 `header.mbt`。
  records : Array[Record]
}

///|
/// 解析出来的图纸骨架：只有结构，没有语义。
pub(all) struct Drawing {
  /// `$ACADVER` 的值（`AC1027` 之类）。没有 HEADER 段时是空串
  version : String
  sections : Array[Section]
  warnings : Array[String]
}

// ── 取字段 ──────────────────────────────────────────────────────────────

///|
/// 在记录里找一个组码（公共部分 + 所有子类，按顺序）。
///
/// **只看组码、不看子类**——需要区分同名组码时用 `get_in`。
/// 这个函数适合那些含义到处都一样的组码（图层 8、线型 6 之类）。
pub fn Record::get(self : Record, code : Int) -> Tag? {
  for t in self.common {
    if t.code == code {
      return Some(t)
    }
  }
  for sc in self.subclasses {
    for t in sc.tags {
      if t.code == code {
        return Some(t)
      }
    }
  }
  None
}

///|
/// 在指定的子类里找组码。
///
/// 这是「组码含义随子类变」的正面用法：明确说出我要的是哪个类的字段。
pub fn Record::get_in(self : Record, subclass : String, code : Int) -> Tag? {
  for sc in self.subclasses {
    if sc.name == subclass {
      for t in sc.tags {
        if t.code == code {
          return Some(t)
        }
      }
    }
  }
  None
}

///|
/// 取一个组码的字符串值。没有就是空串。
pub fn Record::get_string(self : Record, code : Int) -> String {
  match self.get(code) {
    Some(t) => t.value.as_string()
    None => ""
  }
}

///|
/// 取一个组码的浮点值。没有就用给的默认值。
///
/// 默认值由调用方给而不是固定 0.0：坐标缺省成 0 是合理的，
/// 但半径缺省成 0 就变成了「一个退化的圆」，性质完全不同。
pub fn Record::get_double(self : Record, code : Int, default : Double) -> Double {
  match self.get(code) {
    Some(t) => t.value.as_double()
    None => default
  }
}

///|
/// 取一个组码的整数值。
pub fn Record::get_int(self : Record, code : Int, default : Int) -> Int {
  match self.get(code) {
    Some(t) => t.value.as_int()
    None => default
  }
}

///|
/// 一个组码在记录里出现了几次。
///
/// LWPOLYLINE 的顶点就是同一组码重复出现（每个顶点一对 10/20），
/// 靠这个数出有几个顶点。
pub fn Record::count_code(self : Record, code : Int) -> Int {
  let mut n = 0
  for t in self.common {
    if t.code == code {
      n = n + 1
    }
  }
  for sc in self.subclasses {
    for t in sc.tags {
      if t.code == code {
        n = n + 1
      }
    }
  }
  n
}

///|
/// 某个组码出现的所有 tag，按顺序。
pub fn Record::all_of(self : Record, code : Int) -> Array[Tag] {
  let out : Array[Tag] = []
  for t in self.common {
    if t.code == code {
      out.push(t)
    }
  }
  for sc in self.subclasses {
    for t in sc.tags {
      if t.code == code {
        out.push(t)
      }
    }
  }
  out
}

// ── 切分 ────────────────────────────────────────────────────────────────

///|
/// 把 tag 流切成图纸骨架。
///
/// **绝不 panic**：坏结构变成警告。「读了 90% 然后告诉你哪里坏了」
/// 比「抛异常什么都没读出来」有用得多——真实世界的 DXF 大量来自第三方
/// 导出器，损坏的文件比想象中多。
pub fn build_drawing(scan : TagScan) -> Drawing {
  let records = split_records(scan.tags)
  let warnings = scan.warnings.copy()
  let sections = group_sections(records, warnings)
  let version = match find_header_var(sections, "$ACADVER") {
    Some(v) => v
    None => ""
  }
  { version, sections, warnings }
}

///|
/// 把 tag 流切成记录。
///
/// 收尾的逻辑在循环里出现了两次（每次遇到新的 `0`，以及循环结束），
/// 所以抽成 `finish_record` 那种函数——但 MoonBit 的闭包捕获不了可变变量，
/// 硬抽反而更绕。这里选择**显式重复一遍**，两处加起来十来行，
/// 比绕一圈的写法好读。
fn split_records(tags : Array[Tag]) -> Array[Record] {
  let out : Array[Record] = []
  let mut kind : String? = None
  let mut common : Array[Tag] = []
  let mut subs : Array[Subclass] = []
  let mut sub_name : String? = None
  let mut sub_tags : Array[Tag] = []

  for tag in tags {
    if tag.is_record_start() {
      // ── 收尾上一条记录 ──
      match kind {
        Some(k) => {
          let finished = subs.copy()
          match sub_name {
            Some(n) => finished.push({ name: n, tags: sub_tags })
            None => ()
          }
          out.push({ kind: k, common, subclasses: finished })
        }
        None => ()
      }
      // ── 开一条新的 ──
      kind = Some(tag.value.as_string())
      common = [tag]
      subs = []
      sub_name = None
      sub_tags = []
    } else if tag.is_subclass_marker() {
      // 换子类：先把当前这个收掉
      match sub_name {
        Some(n) => subs.push({ name: n, tags: sub_tags })
        None => ()
      }
      sub_name = Some(tag.value.as_string())
      sub_tags = []
    } else if sub_name is Some(_) {
      sub_tags.push(tag)
    } else {
      common.push(tag)
    }
  }

  // ── 最后一条 ──
  match kind {
    Some(k) => {
      let finished = subs.copy()
      match sub_name {
        Some(n) => finished.push({ name: n, tags: sub_tags })
        None => ()
      }
      out.push({ kind: k, common, subclasses: finished })
    }
    None => ()
  }
  out
}

///|
/// 把记录按 `SECTION` / `ENDSEC` 分成段。
///
/// `SECTION` 那一条记录里带着段名（组码 2），但它本身不算段的内容——
/// 除了 HEADER 段，那里的变量就挂在它身上。
fn group_sections(
  records : Array[Record],
  warnings : Array[String],
) -> Array[Section] {
  let sections : Array[Section] = []
  let mut current : String? = None
  let mut current_records : Array[Record] = []

  for record in records {
    if record.kind == "SECTION" {
      // 上一个段没关就又开了新的——尽力而为：把上一个收掉
      match current {
        Some(name) => {
          warnings.push("段「\{name}」没有 ENDSEC 就结束了（后面又开了新段）")
          sections.push({ name, records: current_records })
        }
        None => ()
      }
      current = Some(record.get_string(2))
      current_records = []
      // HEADER 段的变量挂在 SECTION 这条记录上，得留着
      if current == Some("HEADER") {
        current_records.push(record)
      }
    } else if record.kind == "ENDSEC" {
      match current {
        Some(name) => {
          sections.push({ name, records: current_records })
          current = None
          current_records = []
        }
        None => warnings.push("出现了没有对应 SECTION 的 ENDSEC，已忽略")
      }
    } else {
      current_records.push(record)
    }
  }
  match current {
    Some(name) => {
      warnings.push("文件在段「\{name}」中间就结束了，没有 ENDSEC")
      sections.push({ name, records: current_records })
    }
    None => ()
  }
  sections
}

///|
/// 从 HEADER 段读一个变量。
///
/// HEADER 变量没有 `0` 分隔，是成对挂在 SECTION 记录里的：
/// `9 / $ACADVER` 后面紧跟一个 tag 就是它的值。
pub fn find_header_var(sections : Array[Section], name : String) -> String? {
  for s in sections {
    if s.name != "HEADER" {
      continue
    }
    for record in s.records {
      let tags = record.common
      let mut i = 0
      while i + 1 < tags.length() {
        if tags[i].code == 9 && tags[i].value.as_string() == name {
          return Some(tags[i + 1].value.as_string())
        }
        i = i + 1
      }
    }
  }
  None
}

///|
/// 取一个段。
pub fn Drawing::section(self : Drawing, name : String) -> Section? {
  for s in self.sections {
    if s.name == name {
      return Some(s)
    }
  }
  None
}
