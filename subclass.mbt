// 子类：DXF 里「同一个组码在不同类里含义不同」的那套机制。
//
// 新版本（R13 及以后）用 `100` 标记显式分段：
//
//     100  AcDbEntity       ← 从这里开始，下面是实体通用字段
//     8    图层
//     100  AcDbCircle       ← 换类，下面是圆特有字段
//     10/20/30  圆心
//
// 老版本（R10/R12）**一个 `100` 都没有**，字段全糊在一起。
// 但语义是一样的：图层属于实体通用部分、圆心半径属于圆特有部分，
// 只是文件里没写出来而已。
//
// 所以这里做一件事：**给老记录合成子类名**，让上层不用分两套代码写。
//
// 一个需要说清楚的地方：**取字段其实不靠子类**。
// `Record::get(10)` 会扫遍公共部分和所有子类，新旧两种格式都能拿到圆心。
// 真正需要子类名的是那些**同名组码含义不同**的场景——最典型的是组码 70：
//
//     100  AcDbSymbolTable       ← 在这条子类里，70 是「表里有多少项」
//     100  AcDbLayerTableRecord  ← 在这条子类里，70 是「图层标志位」
//
// 碰到这种就得用 `get_in(记录, "AcDbLayerTableRecord", 70)` 明说。
// `tables.mbt` 里就是这么取的。

///|
/// 表里的组码 70 在 `AcDbSymbolTable` 子类里是「表里有多少项」，
/// 在具体记录的子类里另有含义。取字段时要指定子类。
pub fn Record::has_subclass(self : Record, name : String) -> Bool {
  for sc in self.subclasses {
    if sc.name == name {
      return true
    }
  }
  false
}

///|
/// 这条记录是不是老格式（一个 `100` 标记都没有）。
///
/// 老格式的字段全在公共部分里，取字段照样用 `get`，不影响。
pub fn Record::is_legacy(self : Record) -> Bool {
  self.subclasses.length() == 0
}

///|
/// 记录的子类名列表。
///
/// 老记录没有 `100`，这里**按记录类型合成一个**——`CIRCLE` 记录的字段
/// 在语义上就属于 `AcDbCircle`。合成之后，报告和检查逻辑看到的记录形状
/// 在新旧版本之间是一致的。
///
/// 合成表只列我们要解码的实体。认不出的记录类型返回空数组，
/// 上层按「老格式实体」处理即可——它们的字段全在公共部分，本来就取得出来。
pub fn Record::subclass_names(self : Record) -> Array[String] {
  if self.subclasses.length() > 0 {
    let out : Array[String] = []
    for sc in self.subclasses {
      out.push(sc.name)
    }
    return out
  }
  match synthesized_subclass(self.kind) {
    Some(name) => [name]
    None => []
  }
}

///|
/// 记录类型名 → 新版本里对应的子类名。
///
/// 这张表只覆盖本项目要解码的实体，以及几个结构性的记录。
/// 不做全量映射：DXF 上百种实体，没解码的那些本来就走 `Unknown` 分支，
/// 给它们编个子类名没有意义。
fn synthesized_subclass(kind : String) -> String? {
  match kind {
    "LINE" => Some("AcDbLine")
    "CIRCLE" => Some("AcDbCircle")
    "ARC" => Some("AcDbArc")
    "ELLIPSE" => Some("AcDbEllipse")
    "POINT" => Some("AcDbPoint")
    "SPLINE" => Some("AcDbSpline")
    "TEXT" => Some("AcDbText")
    "MTEXT" => Some("AcDbMText")
    "INSERT" => Some("AcDbBlockReference")
    "ATTRIB" => Some("AcDbAttribute")
    "ATTDEF" => Some("AcDbAttributeDefinition")
    "LWPOLYLINE" => Some("AcDbPolyline")
    "POLYLINE" => Some("AcDb2dPolyline")
    "VERTEX" => Some("AcDbVertex")
    "SEQEND" => Some("AcDbEntity")
    "HATCH" => Some("AcDbHatch")
    "SOLID" => Some("AcDbTrace")
    "TRACE" => Some("AcDbTrace")
    "3DFACE" => Some("AcDbFace")
    "DIMENSION" => Some("AcDbDimension")
    "LAYER" => Some("AcDbLayerTableRecord")
    "LTYPE" => Some("AcDbLinetypeTableRecord")
    "STYLE" => Some("AcDbTextStyleTableRecord")
    "DIMSTYLE" => Some("AcDbDimStyleTableRecord")
    "BLOCK_RECORD" => Some("AcDbBlockTableRecord")
    _ => None
  }
}

///|
/// 这条记录在语义上有哪些类。
///
/// 新版本总是从 `AcDbEntity` 起头（实体通用字段），后面跟着自己那个类；
/// 老版本只合成出「自己那个类」，补上 `AcDbEntity` 让两边形状一致。
pub fn Record::effective_classes(self : Record) -> Array[String] {
  let names = self.subclass_names()
  if names.length() == 0 {
    return names
  }
  // 新格式的记录本来就从 AcDbEntity 开始，不用补
  if names[0] == "AcDbEntity" {
    return names
  }
  // 结构性记录（LAYER、LTYPE 之类）不是实体，不该补 AcDbEntity
  if !is_entity_kind(self.kind) {
    return names
  }
  let out : Array[String] = ["AcDbEntity"]
  for n in names {
    out.push(n)
  }
  out
}

///|
/// 这个记录类型是不是「实体」（会画出来的东西），而不是表记录之类的结构。
fn is_entity_kind(kind : String) -> Bool {
  match kind {
    "LINE" | "CIRCLE" | "ARC" | "ELLIPSE" | "POINT" | "SPLINE" | "TEXT" | "MTEXT" |
    "INSERT" | "ATTRIB" | "ATTDEF" | "LWPOLYLINE" | "POLYLINE" | "VERTEX" |
    "SEQEND" | "HATCH" | "SOLID" | "TRACE" | "3DFACE" | "DIMENSION" => true
    _ => false
  }
}
