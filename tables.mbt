// TABLES 段：图纸用到的那几张「字典」——图层、线型、文字样式、标注样式、块记录。
//
// 文件里的长相是这样：
//
//     0   TABLE
//     2   LAYER          ← 表的种类
//     70  3              ← 这条表里有多少项（**不可信**，见下）
//     0   LAYER          ← 一项
//     2   轮廓            ← 图层名
//     70  0              ← 标志位（冻结/锁定…）
//     62  1              ← 颜色
//     0   LAYER
//     ...
//     0   ENDTAB
//
// 两层 `0` 记录：`TABLE` 包着一堆同类型的记录，`ENDTAB` 收尾。
//
// 这里也是「**组码 70 含义随子类变**」最典型的例子：
//
//     100 AcDbSymbolTable       ← 在这条子类里，70 是「表里有多少项」
//     70  3
//     100 AcDbLayerTableRecord  ← 在这条子类里，70 是「图层标志位」
//     70  4
//
// 同一个组码、同一份文件、意思完全不同。所以取标志位必须用
// `get_in(record, "AcDbLayerTableRecord", 70)`，不能用笼统的 `get`。

// ── 图层 ────────────────────────────────────────────────────────────────

///|
/// 一个图层。
pub(all) struct Layer {
  name : String
  /// ACI 索引色（1-255）。**负值表示图层被关闭**，绝对值才是颜色
  color : Int
  /// 线型名
  linetype : String
  /// 冻结标志；本工具默认检查跳过，不推断下游加工行为。
  frozen : Bool
  /// 锁定标志；本工具不将锁定状态作为检查筛选条件。
  locked : Bool
  /// 线宽，单位是百分之一毫米（-3 表示「用默认值」）
  lineweight : Int
}

///|
/// 图层是不是关着的。
///
/// DXF 用**颜色的符号**表示开关，不是单独一个标志位——
/// 这一点不看规范很难猜到。
pub fn Layer::is_off(self : Layer) -> Bool {
  self.color < 0
}

///|
/// 图层实际的颜色索引（取绝对值）。
pub fn Layer::color_index(self : Layer) -> Int {
  if self.color < 0 {
    -self.color
  } else {
    self.color
  }
}

///|
/// 是否按本工具默认规则参与部分几何检查，不表示 CAM 或机床行为。
pub fn Layer::is_enabled_for_checks(self : Layer) -> Bool {
  !self.is_off() && !self.frozen
}

///|
/// 兼容旧接口；仅表示本工具检查筛选规则，不表示能否加工。
/// 文档弃用：新代码使用 `Layer::is_enabled_for_checks()`；本版保留同义行为。
/// 未添加编译器 deprecated 属性，以免兼容调用在 --deny-warn 下成为错误。
pub fn Layer::is_machinable(self : Layer) -> Bool {
  self.is_enabled_for_checks()
}

// ── 表 ──────────────────────────────────────────────────────────────────

///|
/// TABLES 段。
pub(all) struct Tables {
  layers : Array[Layer]
  /// 线型名（`CONTINUOUS` / `DASHED` / …）
  linetypes : Array[String]
  /// 文字样式名
  text_styles : Array[String]
  /// 块记录名。和 BLOCKS 段里的块定义一一对应
  block_records : Array[String]
}

///|
/// 解析 TABLES 段。
///
/// 只认这四张表——别的一律跳过，但**跳过是按结构跳的**（认 `TABLE`/`ENDTAB`
/// 的层次），不是按关键字。否则遇到没见过的表名会把它的内容当成外层记录。
pub fn parse_tables(section : Section) -> Tables {
  let layers : Array[Layer] = []
  let linetypes : Array[String] = []
  let text_styles : Array[String] = []
  let block_records : Array[String] = []

  // 当前在哪张表里
  let mut table_kind : String? = None

  for record in section.records {
    if record.kind == "TABLE" {
      table_kind = Some(record.get_string(2))
    } else if record.kind == "ENDTAB" {
      table_kind = None
    } else {
      match table_kind {
        Some(kind) =>
          if kind == "LAYER" && record.kind == "LAYER" {
            layers.push(parse_layer(record))
          } else if kind == "LTYPE" && record.kind == "LTYPE" {
            linetypes.push(record.get_string(2))
          } else if kind == "STYLE" && record.kind == "STYLE" {
            text_styles.push(record.get_string(2))
          } else if kind == "BLOCK_RECORD" && record.kind == "BLOCK_RECORD" {
            block_records.push(record.get_string(2))
          }
        None => ()
      }
    }
  }
  { layers, linetypes, text_styles, block_records, }
}

///|
/// 解析一个图层记录。
fn parse_layer(record : Record) -> Layer {
  let sub = "AcDbLayerTableRecord"
  // 标志位必须**指定子类**去取——直接 get(70) 拿到的可能是
  // AcDbSymbolTable 里的「表里有多少项」
  let flags = match record.get_in(sub, 70) {
    Some(t) => t.value.as_int()
    None => 0
  }
  Layer::{
    name: record.get_string(2),
    color: match record.get_in(sub, 62) {
      Some(t) => t.value.as_int()
      None => 7 // 没写颜色时 DXF 的默认色是 7（白/黑）
    },
    linetype: match record.get_in(sub, 6) {
      Some(t) => t.value.as_string()
      None => "CONTINUOUS"
    },
    // 标志位的位含义：1 = 冻结、4 = 锁定
    frozen: (flags & 1) != 0,
    locked: (flags & 4) != 0,
    lineweight: record.get_int(370, -3),
  }
}

///|
/// 按名字找图层。
pub fn Tables::layer(self : Tables, name : String) -> Layer? {
  for l in self.layers {
    if l.name == name {
      return Some(l)
    }
  }
  None
}
