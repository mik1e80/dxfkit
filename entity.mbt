// 实体层第一步：把 ENTITIES 段里的记录翻译成几何。
//
// 结构层把记录切成公共部分 + 子类之后，这里做「翻译」：认得出的类型
// （LINE / POINT…）变成带坐标的几何，认不出的原样留在 `Unknown` 里——
// **不是错误，也不丢**。DXF 上百种实体，加工检查必须先知道
// 「有多少实体我没看懂」，才谈得上给结论。
//
// 为什么是「公共壳 + 几何」而不是「一条实体一个结构体」：图层、句柄、
// 原记录每条实体都有，类型相关的只有几何那部分。分开之后，
// 统计、按图层筛选这些操作用公共壳就够，不用挨个 match。
//
// 坐标分组的约定（`tag.mbt` 里 `point_code_parts` 管这个）：
// `10/20/30` 是第 0 个点、`11/21/31` 是第 1 个（LINE 的起点和终点）。

// ── 数据模型 ────────────────────────────────────────────────────────────

///|
/// 实体的公共部分：每条实体都有的东西。
pub(all) struct EntityCommon {
  /// 记录类型名（`LINE` / `CIRCLE` / …）
  kind : String
  /// 图层（组码 8）。没写时是空串
  layer : String
  /// 句柄（组码 5，DIMSTYLE 用 105）。没写时是空串
  handle : String
  /// 原始记录。已解码的字段从这取，**没解码的字段也在这**——
  /// 将来写回文件时靠它原样保留
  record : Record
}

///|
/// 实体的几何。只认本项目要处理的形状，其余落在 `Unknown`。
pub(all) enum Geometry {
  /// 线段：起点、终点
  Line(start~ : Vec3, end~ : Vec3)
  /// 单点
  Point(at~ : Vec3)
  /// 认不出的实体类型。**不等于坏记录**——只是解析器还没解码它
  Unknown
}

///|
/// 一条实体。
pub(all) struct Entity {
  common : EntityCommon
  geom : Geometry
}

///|
/// 一个段里解析出来的实体。
pub(all) struct Entities {
  entities : Array[Entity]
  /// 解析中发现的毛病（缺坐标之类被跳过的记录）
  warnings : Array[String]
}

// ── 取字段 ──────────────────────────────────────────────────────────────

///|
/// 取一条记录里第 n 个点（`10/20/30` 是第 0 个，`11/21/31` 是第 1 个）。
///
/// **缺 z 按 0 处理**——平面图里点就在 z=0 平面上，缺 z 是常态。
/// **缺 x 或 y 返回 `None`**——那说明记录坏了，交给调用方决定怎么办
/// （本文件的选择是跳过并警告，而不是拿原点补）。
pub fn Record::point(self : Record, n : Int) -> Vec3? {
  let x = match self.get(10 + n) {
    Some(t) => t.value.as_double()
    None => return None
  }
  let y = match self.get(20 + n) {
    Some(t) => t.value.as_double()
    None => return None
  }
  let z = self.get_double(30 + n, 0.0)
  Some(Vec3::new(x, y, z))
}

///|
/// 取句柄（`5`，DIMSTYLE 里是 `105`——同一个含义用了两个码的历史包袱）。
fn handle_of(record : Record) -> String {
  let h = record.get_string(5)
  if h != "" {
    h
  } else {
    record.get_string(105)
  }
}

// ── 访问 ────────────────────────────────────────────────────────────────

///|
pub fn Entity::kind(self : Entity) -> String {
  self.common.kind
}

///|
pub fn Entity::layer(self : Entity) -> String {
  self.common.layer
}

///|
pub fn Entity::handle(self : Entity) -> String {
  self.common.handle
}

///|
/// 这条实体的几何认不认得出来。
///
/// `Unknown` 是「解析器不认识」，**不等于坏记录**。检查环节要单独
/// 报告有一批实体没被解码——图上那些东西也可能要切。
pub fn Entity::is_decoded(self : Entity) -> Bool {
  match self.geom {
    Unknown => false
    _ => true
  }
}

///|
/// 几何的二维包围盒（丢掉 z——加工是二维的）。
/// `Unknown` 没有几何，返回 `None`。
pub fn Geometry::bounds(self : Geometry) -> Aabb2? {
  match self {
    Line(start~, end~) => Some(Aabb2::empty().expand(start.xy()).expand(end.xy()))
    Point(at~) => Some(Aabb2::empty().expand(at.xy()))
    Unknown => None
  }
}

///|
/// 实体的二维包围盒。`Unknown` 返回 `None`。
pub fn Entity::bounds(self : Entity) -> Aabb2? {
  self.geom.bounds()
}

// ── 解析 ────────────────────────────────────────────────────────────────

///|
/// 解析一个段里的实体。
///
/// 入口是 ENTITIES 段；将来块定义（BLOCKS 段）里的实体也走这里。
pub fn parse_entities(section : Section) -> Entities {
  let entities : Array[Entity] = []
  let warnings : Array[String] = []
  for record in section.records {
    match parse_entity(record, warnings) {
      Some(e) => entities.push(e)
      None => ()
    }
  }
  { entities, warnings }
}

///|
/// 翻译一条记录。返回 `None` 表示这条被跳过了（毛病已记进 `warnings`）。
///
/// **缺必填坐标的记录跳过，不拿原点补**：补出来的假线段会混进
/// 最小间隙检查里，报一条警告、少一条实体，比一个错的位置诚实。
fn parse_entity(record : Record, warnings : Array[String]) -> Entity? {
  let kind = record.kind
  let common : EntityCommon = {
    kind,
    layer: record.get_string(8),
    handle: handle_of(record),
    record,
  }
  match kind {
    "LINE" =>
      match (record.point(0), record.point(1)) {
        (Some(start), Some(end)) => Some({ common, geom: Line(start=start, end=end) })
        _ => {
          warnings.push("\{kind} 缺端点坐标（10/20 起，11/21 止），已跳过")
          None
        }
      }
    "POINT" =>
      match record.point(0) {
        Some(at) => Some({ common, geom: Point(at=at) })
        None => {
          warnings.push("\{kind} 缺坐标（10/20），已跳过")
          None
        }
      }
    _ => Some({ common, geom: Unknown })
  }
}

///|
/// 图纸的 ENTITIES 段解析成实体。没有 ENTITIES 段时是空表。
pub fn Drawing::entities(self : Drawing) -> Entities {
  match self.section("ENTITIES") {
    Some(s) => parse_entities(s)
    None => {
      let entities : Array[Entity] = []
      let warnings : Array[String] = []
      { entities, warnings }
    }
  }
}
