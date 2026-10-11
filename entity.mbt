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
//
// 角度：圆弧的起止角在文件里写的是**度数**，解析时换算成弧度——
// 内部一律用弧度（`vec.mbt` 的角度工具都是弧度）。

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
  /// 圆：圆心、半径。
  ///
  /// **半径可能是 0 或负数**——坏图纸里真实存在，部分机床遇到直接报错。
  /// 保留原值（不替换、不跳过），让加工检查去报这一条。
  Circle(center~ : Vec3, radius~ : Double)
  /// 圆弧：圆心、半径、起止角（弧度）。
  ///
  /// 起止角可能大于一圈（370 度绕回 10 度的写法真实存在），
  /// 判跨度用 `arc_sweep` 归一。
  Arc(center~ : Vec3, radius~ : Double, start_angle~ : Double, end_angle~ : Double)
  /// 椭圆（弧）：圆心、长轴向量（圆心指向长轴端点）、短长轴比、起止参数（弧度）。
  ///
  /// 参数 p 对应的点是 `圆心 + 长轴·cos p + 短轴·sin p`，整椭圆是 0 到 2π。
  Ellipse(
    center~ : Vec3,
    major~ : Vec3,
    ratio~ : Double,
    start_param~ : Double,
    end_param~ : Double
  )
  /// 多段线：一串顶点，每段可以是直线（bulge = 0）或圆弧（bulge ≠ 0）。
  ///
  /// 轻量的 LWPOLYLINE 和带 VERTEX 记录的 POLYLINE 都归到这里——
  /// 顶点从哪来不一样，形状表示是一样的。
  Polyline(vertices~ : Array[PolyVertex], closed~ : Bool)
  /// 文字（TEXT / MTEXT / ATTRIB / ATTDEF 共用）：插入点、字高、内容、旋转角。
  ///
  /// 内容**原样保留**：MTEXT 的格式化代码（`\P` 换行、`\f` 字体…）不解释，
  /// 那是渲染和离散层的事。具体哪种看 `kind`——加工检查里它们都是
  /// 「文字没转成曲线」这一条。
  Text(at~ : Vec3, height~ : Double, value~ : String, rotation~ : Double)
  /// 块引用（INSERT）：插入点、块名、缩放、旋转角（弧度）。
  ///
  /// 真正的形状要展开块内容再做嵌套变换——那是几何层的事，
  /// 这里只记录引用本身。
  Insert(at~ : Vec3, block~ : String, scale~ : Vec3, rotation~ : Double)
  /// 填充面（SOLID / TRACE / 3DFACE 共用）：角点列表，三个或四个。
  ///
  /// 三角形就是只有三个角点（DXF 里第四个和第三个重合）。
  /// 注意 SOLID 的角点是「10、11、13、12」的蝴蝶结顺序——把四点
  /// 直接连成多边形会自交，这里按文件顺序原样存。
  Face(corners~ : Array[Vec3])
  /// 标注（DIMENSION）：定义点、匿名块名、测量值。
  ///
  /// 箭头、界线、文字都画在匿名块（`*D1` 之类）里。**标注放错图层
  /// 是加工图纸的经典事故**（轮廓图层上睡着一条标注），所以它必须
  /// 是解码出来的实体，而不是 `Unknown`。老版本（R12）没有匿名块，
  /// `block` 是空串。
  Dimension(at~ : Vec3, block~ : String, measurement~ : Double)
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
/// 一个块定义。
pub(all) struct Block {
  /// 块名。`INSERT` 靠它引用（`*Model_Space` 之类带星号的是系统块）
  name : String
  /// 基点——块内容坐标相对它，引用时先减基点
  base : Vec3
  /// 块的内容（和 ENTITIES 段一样的实体流，到 `ENDBLK` 为止）
  entities : Array[Entity]
}

///|
/// BLOCKS 段里解析出来的块定义。
pub(all) struct Blocks {
  blocks : Array[Block]
  warnings : Array[String]
}

///|
/// 多段线的一个顶点。
pub(all) struct PolyVertex {
  at : Vec3
  /// 到下一个顶点的凸度（bulge）——圆弧段的「弯度」，
  /// `tan(圆心角 / 4)`：0 = 直线段，正 = 逆时针鼓，负 = 顺时针鼓。
  /// 最后一个顶点的 bulge 只在闭合时有意义（它管连回第一点的那条边）。
  ///
  /// 可变是因为解析顺序：`42` 在它所属顶点的 `20` **之后**才出现，
  /// 顶点先落地、凸度后补上。
  mut bulge : Double
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
    Circle(center~, radius~) => Some(circle_bounds(center, radius))
    Arc(center~, radius~, start_angle~, end_angle~) =>
      Some(arc_bounds(center, radius, start_angle, end_angle))
    // 弧段用整椭圆的盒——永远包含，只是偏大；精确的弧段盒留给离散层
    Ellipse(center~, major~, ratio~, ..) => Some(ellipse_bounds(center, major, ratio))
    Polyline(vertices~, closed~) => Some(polyline_bounds(vertices, closed))
    // 文字按插入点记——真实占用范围要字体度量。加工检查里文字本身是
    // 「未转曲线」的警告项，不是切割几何
    Text(at~, ..) => Some(Aabb2::empty().expand(at.xy()))
    // 块引用的范围要展开块内容才知道；这里先记插入点，
    // 展开（嵌套变换）是几何层的任务
    Insert(at~, ..) => Some(Aabb2::empty().expand(at.xy()))
    Face(corners~) => {
      let mut box = Aabb2::empty()
      for p in corners {
        box = box.expand(p.xy())
      }
      Some(box)
    }
    // 标注的真实范围在匿名块里；定义点先记下
    Dimension(at~, ..) => Some(Aabb2::empty().expand(at.xy()))
    Unknown => None
  }
}

///|
/// 实体的二维包围盒。`Unknown` 返回 `None`。
pub fn Entity::bounds(self : Entity) -> Aabb2? {
  self.geom.bounds()
}

// ── 角度与几何辅助 ──────────────────────────────────────────────────────

///|
/// 一整圈（弧度）。`vec.mbt` 的 `normalize_angle` 里是同一个值，
/// 这里要用在「起止角相等按整圈」的判断上。
let two_pi : Double = 6.283185307179586

///|
/// 度 → 弧度。DXF 文本里的角度一律是度数（圆弧起止角、文字旋转角），
/// 本项目的内部表示一律是弧度（`normalize_angle`、`angle_span` 都是弧度）。
fn to_radians(deg : Double) -> Double {
  deg * 0.017453292519943295
}

///|
/// 圆弧从起角到止角跨过的弧度。
///
/// 起止角相等（模一整圈）按**整圈**处理——`0 到 360 度`这种写法
/// 指的是整圆，不是零度弧（`370 度绕回 10 度`是它的亲戚，同一个问题）。
fn arc_sweep(start : Double, end : Double) -> Double {
  let span = angle_span(start, end)
  if span < 1.0e-12 {
    two_pi
  } else {
    span
  }
}

///|
/// 圆上的点（角度是弧度）。
fn point_on_circle(c : Vec2, r : Double, angle : Double) -> Vec2 {
  Vec2::new(c.x + r * @math.cos(angle), c.y + r * @math.sin(angle))
}

///|
/// 整圆的二维包围盒。半径取绝对值——负半径的圆是坏数据，
/// 但盒子的形状还是它，报不报让检查环节决定。
fn circle_bounds(center : Vec3, radius : Double) -> Aabb2 {
  let r = radius.abs()
  let c = center.xy()
  Aabb2::empty()
    .expand(Vec2::new(c.x - r, c.y - r))
    .expand(Vec2::new(c.x + r, c.y + r))
}

///|
/// 圆弧的二维包围盒：两个端点，加上跨过的象限点。
///
/// 光取端点是错的——0° 到 270° 的弧，最右边其实在 90° 的象限点上。
fn arc_bounds(
  center : Vec3,
  radius : Double,
  start_angle : Double,
  end_angle : Double,
) -> Aabb2 {
  let sweep = arc_sweep(start_angle, end_angle)
  if sweep >= two_pi - 1.0e-12 {
    // 整圈，直接给整圆的盒
    return circle_bounds(center, radius)
  }
  let r = radius.abs()
  let c = center.xy()
  let mut box = Aabb2::empty()
  box = box.expand(point_on_circle(c, r, start_angle))
  box = box.expand(point_on_circle(c, r, end_angle))
  // 跨过的象限点（0° / 90° / 180° / 270°）
  let mut k = 0
  while k < 4 {
    let q = k.to_double() * 1.5707963267948966
    if angle_span(start_angle, q) <= sweep {
      box = box.expand(point_on_circle(c, r, q))
    }
    k = k + 1
  }
  box
}

///|
/// 椭圆的二维包围盒。
///
/// 长轴向量 M 和短轴向量 N（M 逆时针转 90 度、乘短长轴比）：
/// 椭圆上的点写成 `center + M·cos p + N·sin p`，两个方向的最大偏移
/// 分别是 `√(Mx² + Nx²)` 和 `√(My² + Ny²)`——对整椭圆是精确的。
fn ellipse_bounds(center : Vec3, major : Vec3, ratio : Double) -> Aabb2 {
  let m = major.xy()
  let n = Vec2::new(-m.y * ratio, m.x * ratio)
  let half_x = (m.x * m.x + n.x * n.x).sqrt()
  let half_y = (m.y * m.y + n.y * n.y).sqrt()
  let c = center.xy()
  Aabb2::empty()
    .expand(Vec2::new(c.x - half_x, c.y - half_y))
    .expand(Vec2::new(c.x + half_x, c.y + half_y))
}

///|
/// 多段线的二维包围盒：顶点盒，加上圆弧段的鼓出部分。
///
/// 圆弧段的处理是**保守**的：矢高（弧离弦的最大距离）是 `|b|·弦长/2`，
/// 把这段的盒子四边各撑开矢高——永远包含，但偏大。半圆以上的段
/// （|b| > 1）弦短弧长，矢高会低估，改用「整圆在半径 2r 的圆里」兜底。
/// 精确到象限点的弧段盒留给离散层——那里会真正把弧变成点。
fn polyline_bounds(vertices : Array[PolyVertex], closed : Bool) -> Aabb2 {
  let mut box = Aabb2::empty()
  for v in vertices {
    box = box.expand(v.at.xy())
  }
  let n = vertices.length()
  if n < 2 {
    return box
  }
  let segments = if closed { n } else { n - 1 }
  let mut i = 0
  while i < segments {
    let a = vertices[i]
    let b = vertices[(i + 1) % n]
    if a.bulge != 0.0 {
      let ax = a.at.xy()
      let bx = b.at.xy()
      let chord = ax.distance(bx)
      let abs_b = a.bulge.abs()
      let pad = if abs_b <= 1.0 {
        abs_b * chord / 2.0
      } else {
        2.0 * (chord * (1.0 + abs_b * abs_b) / (4.0 * abs_b))
      }
      box = box
        .expand(Vec2::new(ax.x.min(bx.x) - pad, ax.y.min(bx.y) - pad))
        .expand(Vec2::new(ax.x.max(bx.x) + pad, ax.y.max(bx.y) + pad))
    }
    i = i + 1
  }
  box
}

// ── 解析 ────────────────────────────────────────────────────────────────

///|
/// 解析一个段里的实体。
///
/// 入口是 ENTITIES 段；将来块定义（BLOCKS 段）里的实体也走这里。
pub fn parse_entities(section : Section) -> Entities {
  let warnings : Array[String] = []
  let entities = parse_records(section.records[:], warnings)
  { entities, warnings }
}

///|
/// 扫一段记录流，翻译成实体（ENTITIES 段和 BLOCKS 段里块的内容共用）。
///
/// 「多记录实体」在这里消化：POLYLINE 吃掉后面的 VERTEX 直到 `SEQEND`；
/// INSERT 后面跟着的 ATTRIB（块引用的属性值）**不吞**——它们作为独立
/// 实体留在列表里（属性文字也可能没转曲线），只跳过收尾的 `SEQEND`。
fn parse_records(records : ArrayView[Record], warnings : Array[String]) -> Array[Entity] {
  let entities : Array[Entity] = []
  let mut i = 0
  while i < records.length() {
    let record = records[i]
    if record.kind == "POLYLINE" {
      // 顶点不在这一条记录里——跟在后面的 VERTEX 记录中，`SEQEND` 收尾
      let mut j = i + 1
      while j < records.length() && records[j].kind == "VERTEX" {
        j = j + 1
      }
      match parse_polyline_entity(record, records[i + 1 : j], warnings) {
        Some(e) => entities.push(e)
        None => ()
      }
      if j < records.length() && records[j].kind == "SEQEND" {
        j = j + 1
      }
      i = j
    } else if record.kind == "VERTEX" || record.kind == "SEQEND" {
      // 没有主人的结构性记录——不是实体，跳过
      i = i + 1
    } else {
      match parse_entity(record, warnings) {
        Some(e) => entities.push(e)
        None => ()
      }
      i = i + 1
    }
  }
  entities
}

///|
/// 取一个子类里的 tag；没有这个子类（老格式）时退回公共部分。
///
/// **顺序敏感的场景要用它**：多段线的顶点是同一组码重复出现，
/// 成组顺序本身携带信息，`get` / `all_of` 都给不了。
fn subclass_tags(record : Record, name : String) -> Array[Tag] {
  for sc in record.subclasses {
    if sc.name == name {
      return sc.tags
    }
  }
  record.common
}

///|
/// 解析 LWPOLYLINE（轻量多段线，R13 起）。
///
/// 顶点在 `AcDbPolyline` 子类里**成组重复出现**：每个顶点一对 `10/20`，
/// 可选的 `42`（凸度）跟在它的 `20` 后面。所以按顺序扫，不能用 `get`
/// 取——`get` 只会拿到第一对。组码 90（顶点数）不可信，以扫描结果为准。
fn parse_lwpolyline(record : Record, warnings : Array[String]) -> Geometry? {
  let elevation = record.get_double(38, 0.0)
  let vertices : Array[PolyVertex] = []
  let mut pending_x : Double? = None
  for t in subclass_tags(record, "AcDbPolyline") {
    match t.code {
      10 => pending_x = Some(t.value.as_double())
      20 =>
        match pending_x {
          Some(x) => {
            vertices.push({
              at: Vec3::new(x, t.value.as_double(), elevation),
              bulge: 0.0,
            })
            pending_x = None
          }
          None => ()
        }
      42 =>
        if vertices.length() > 0 {
          vertices[vertices.length() - 1].bulge = t.value.as_double()
        }
      _ => ()
    }
  }
  if vertices.length() == 0 {
    warnings.push("LWPOLYLINE 解析不出顶点，已跳过")
    return None
  }
  let closed = (record.get_int(70, 0) & 1) != 0
  Some(Polyline(vertices=vertices, closed=closed))
}

///|
/// MTEXT 的内容：正文超过 250 字符会被切成多个 `3`，最后一段在 `1` 里。
/// **按出现顺序拼起来**；格式化代码（`\P` 换行、`\f` 字体…）原样保留——
/// 解释它们是渲染 / 离散层的事。
fn mtext_value(record : Record) -> String {
  let sb = StringBuilder()
  for t in subclass_tags(record, "AcDbMText") {
    if t.code == 3 || t.code == 1 {
      sb.write_string(t.value.as_string())
    }
  }
  sb.to_string()
}

///|
/// 实体的公共外壳。单记录实体和 POLYLINE 这种多记录实体共用。
fn common_of(record : Record) -> EntityCommon {
  {
    kind: record.kind,
    layer: record.get_string(8),
    handle: handle_of(record),
    record,
  }
}

///|
/// 翻译一条 POLYLINE（连同它后面的 VERTEX 记录）。
///
/// 老的 POLYLINE 顶点在**独立记录**里——DXF 里少数「一条实体横跨
/// 多条记录」的地方。顶点上的 42 和 LWPOLYLINE 是一个意思。
fn parse_polyline_entity(
  record : Record,
  vertex_records : ArrayView[Record],
  warnings : Array[String],
) -> Entity? {
  let common = common_of(record)
  let flags = record.get_int(70, 0)
  // 16 = 多边形网格、64 = 多面网格：它们的顶点记录另有含义（面还要
  // 引用顶点编号），按普通多段线解析会得到一堆假线——**按 Unknown 保留**，
  // 让检查环节知道有东西没被理解，而不是报一堆错的几何
  if (flags & 16) != 0 || (flags & 64) != 0 {
    return Some({ common, geom: Unknown })
  }
  let vertices : Array[PolyVertex] = []
  for vr in vertex_records {
    match vr.point(0) {
      Some(at) => vertices.push({ at, bulge: vr.get_double(42, 0.0) })
      None => ()
    }
  }
  if vertices.length() == 0 {
    warnings.push("POLYLINE 解析不出顶点，已跳过")
    return None
  }
  Some({ common, geom: Polyline(vertices=vertices, closed=(flags & 1) != 0) })
}

///|
/// 取一个组码的数值。**没写返回 `None`**——和 `get_double` 的默认值
/// 是两回事：这里要区分「写了 0」和「根本没写」，缺必填字段是要报警的。
fn number_of(record : Record, code : Int) -> Double? {
  match record.get(code) {
    Some(t) => Some(t.value.as_double())
    None => None
  }
}

///|
/// 翻译一条记录。返回 `None` 表示这条被跳过了（毛病已记进 `warnings`）。
///
/// **缺必填坐标的记录跳过，不拿原点补**：补出来的假线段会混进
/// 最小间隙检查里，报一条警告、少一条实体，比一个错的位置诚实。
fn parse_entity(record : Record, warnings : Array[String]) -> Entity? {
  let kind = record.kind
  let common = common_of(record)
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
    "CIRCLE" =>
      match (record.point(0), number_of(record, 40)) {
        (Some(center), Some(radius)) =>
          Some({ common, geom: Circle(center=center, radius=radius) })
        (None, _) => {
          warnings.push("\{kind} 缺圆心坐标（10/20），已跳过")
          None
        }
        (_, None) => {
          warnings.push("\{kind} 缺半径（40），已跳过")
          None
        }
      }
    "ARC" =>
      match (
        record.point(0),
        number_of(record, 40),
        number_of(record, 50),
        number_of(record, 51),
      ) {
        (Some(center), Some(radius), Some(a0), Some(a1)) =>
          Some({
            common,
            geom: Arc(
              center=center,
              radius=radius,
              start_angle=to_radians(a0),
              end_angle=to_radians(a1),
            ),
          })
        (None, _, _, _) => {
          warnings.push("\{kind} 缺圆心坐标（10/20），已跳过")
          None
        }
        (_, None, _, _) => {
          warnings.push("\{kind} 缺半径（40），已跳过")
          None
        }
        (_, _, _, _) => {
          warnings.push("\{kind} 缺起止角（50/51），已跳过")
          None
        }
      }
    "ELLIPSE" =>
      match (record.point(0), record.point(1)) {
        (Some(center), Some(major_end)) =>
          match number_of(record, 40) {
            Some(ratio) => {
              // 41/42 省略时是整椭圆——语义明确，不报警
              let start_param = match number_of(record, 41) {
                Some(v) => v
                None => 0.0
              }
              let end_param = match number_of(record, 42) {
                Some(v) => v
                None => two_pi
              }
              Some({
                common,
                geom: Ellipse(
                  center=center,
                  major=major_end.sub(center),
                  ratio=ratio,
                  start_param=start_param,
                  end_param=end_param,
                ),
              })
            }
            None => {
              warnings.push("\{kind} 缺短长轴比（40），推不出形状，已跳过")
              None
            }
          }
        _ => {
          warnings.push("\{kind} 缺圆心或长轴端点（10/20、11/21），已跳过")
          None
        }
      }
    "TEXT" | "MTEXT" | "ATTRIB" | "ATTDEF" =>
      match record.point(0) {
        Some(at) =>
          match number_of(record, 40) {
            Some(height) => {
              let value = if kind == "MTEXT" {
                mtext_value(record)
              } else {
                record.get_string(1)
              }
              Some({
                common,
                geom: Text(
                  at=at,
                  height=height,
                  value=value,
                  rotation=to_radians(record.get_double(50, 0.0)),
                ),
              })
            }
            None => {
              warnings.push("\{kind} 缺字高（40），已跳过")
              None
            }
          }
        None => {
          warnings.push("\{kind} 缺插入点坐标（10/20），已跳过")
          None
        }
      }
    "LWPOLYLINE" =>
      match parse_lwpolyline(record, warnings) {
        Some(geom) => Some({ common, geom })
        None => None
      }
    "INSERT" =>
      match record.point(0) {
        Some(at) => {
          let block = record.get_string(2)
          if block == "" {
            warnings.push("INSERT 缺块名（2），已跳过")
            None
          } else {
            Some({
              common,
              geom: Insert(
                at=at,
                block=block,
                scale=Vec3::new(
                  record.get_double(41, 1.0),
                  record.get_double(42, 1.0),
                  record.get_double(43, 1.0),
                ),
                rotation=to_radians(record.get_double(50, 0.0)),
              ),
            })
          }
        }
        None => {
          warnings.push("INSERT 缺插入点坐标（10/20），已跳过")
          None
        }
      }
    "SOLID" | "TRACE" | "3DFACE" =>
      match (record.point(0), record.point(1), record.point(2)) {
        (Some(a), Some(b), Some(c)) => {
          let corners : Array[Vec3] = [a, b, c]
          match record.point(3) {
            Some(d) => corners.push(d)
            None => ()
          }
          Some({ common, geom: Face(corners=corners) })
        }
        _ => {
          warnings.push("\{kind} 缺角点坐标（10/11/12），已跳过")
          None
        }
      }
    "DIMENSION" =>
      match record.point(0) {
        Some(at) =>
          Some({
            common,
            geom: Dimension(
              at=at,
              // R12 的标注没有匿名块，缺块名不算坏记录
              block=record.get_string(2),
              measurement=record.get_double(42, 0.0),
            ),
          })
        None => {
          warnings.push("\{kind} 缺定义点坐标（10/20），已跳过")
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

///|
/// 解析 BLOCKS 段：每个 `BLOCK` 到 `ENDBLK` 之间的记录就是块的内容，
/// 走和 ENTITIES 段同一套翻译（`parse_records`）。
pub fn parse_blocks(section : Section) -> Blocks {
  let blocks : Array[Block] = []
  let warnings : Array[String] = []
  let records = section.records
  let mut i = 0
  while i < records.length() {
    if records[i].kind != "BLOCK" {
      i = i + 1
      continue
    }
    let head = records[i]
    let mut j = i + 1
    while j < records.length() && records[j].kind != "ENDBLK" {
      j = j + 1
    }
    let name = head.get_string(2)
    if name == "" {
      warnings.push("BLOCK 没有名字，已跳过")
    } else {
      let base = match head.point(0) {
        Some(p) => p
        // 基点缺失按原点处理并记一条——块的内容至少要看得见
        None => {
          warnings.push("块「\{name}」缺基点（10/20），按原点处理")
          Vec3::zero()
        }
      }
      let entities = parse_records(records[i + 1 : j], warnings)
      blocks.push({ name, base, entities })
    }
    if j < records.length() {
      j = j + 1
    }
    i = j
  }
  { blocks, warnings }
}

///|
/// 图纸的 BLOCKS 段。没有 BLOCKS 段时是空表。
pub fn Drawing::blocks(self : Drawing) -> Blocks {
  match self.section("BLOCKS") {
    Some(s) => parse_blocks(s)
    None => {
      let blocks : Array[Block] = []
      let warnings : Array[String] = []
      { blocks, warnings }
    }
  }
}
