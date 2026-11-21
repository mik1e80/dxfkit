///|
/// Fields of a dimension that can track an edited drawing feature.
pub(all) enum R12DimensionSlot {
  DefinitionPoint
  ExtensionStart
  ExtensionEnd
  PickOrVertex
  ArcPoint
}

///|
/// Stable entity-handle target chosen by the editor. R12 DXF itself does
/// not preserve a reference from each DIMENSION point to its edited entity.
pub(all) enum R12FeaturePoint {
  FeatureStart
  FeatureEnd
  FeatureMidpoint
  FeatureCenter
  FeatureLocation
  FeatureAngle(Double)
}

///|
pub(all) struct R12DimensionAnchor {
  slot : R12DimensionSlot
  handle : String
  point : R12FeaturePoint
}

///|
/// Save this binding in the application and reuse it after each edit.
pub(all) struct R12DimensionBinding {
  dimension_handle : String
  anchors : Array[R12DimensionAnchor]
}

///|
/// Resolve the latest entity positions by handle, then recompute. Missing,
/// ambiguous, or incompatible records fail without a stale-coordinate fallback.
pub fn ReadDocument::r12_refresh_bound_dimension(
  self : ReadDocument,
  binding : R12DimensionBinding,
  tol : Double,
  precision? : Int = 2,
) -> Result[R12DimensionUpdate, String] {
  r12_bound_dimension(self, binding, tol, precision) catch {
    InvalidSemantic(msg) => Err(msg)
  }
}

///|
fn r12_bound_dimension(
  doc : ReadDocument,
  binding : R12DimensionBinding,
  tol : Double,
  precision : Int,
) -> Result[R12DimensionUpdate, String] raise R12SemanticError {
  guard doc.profile == R12 &&
    !binding.anchors.is_empty() &&
    binding.anchors.length() <= 5 else {
    raise InvalidSemantic("绑定需要 AC1009 与 1–5 个定义点")
  }
  let handles : Map[String, Int] = Map([])
  for i, r in doc.records {
    if r.section == "ENTITIES" &&
      r12_string(r, 5) is Some(raw) &&
      r12_handle_key(raw) is Some(key) &&
      key != "0" {
      handles[key] = if handles.contains(key) { -1 } else { i }
    }
  }
  let index = r12_bound_handle(handles, binding.dimension_handle)
  let r = doc.records[index]
  guard r.kind == "DIMENSION" &&
    r12_standalone(r, Map([])) is Some(Dimension(initial)) else {
    raise InvalidSemantic("绑定的标注句柄不是 DIMENSION")
  }
  let mut dim = initial
  let mut seen = 0
  for anchor in binding.anchors {
    let bit = match anchor.slot {
      DefinitionPoint => 1
      ExtensionStart => 2
      ExtensionEnd => 4
      PickOrVertex => 8
      ArcPoint => 16
    }
    guard (seen & bit) == 0 else {
      raise InvalidSemantic("同一定义点有重复绑定")
    }
    seen = seen | bit
    let source = r12_bound_handle(handles, anchor.handle)
    let entity = doc.records[source]
    guard r12_integer(entity, 67, Some(0)) == r12_integer(r, 67, Some(0)) else {
      raise InvalidSemantic("标注和关联实体不在同一空间")
    }
    let p = r12_bound_point(entity, anchor.point)
    dim = match anchor.slot {
      DefinitionPoint => { ..dim, definition: p, }
      ExtensionStart => { ..dim, extension_start: Some(p), }
      ExtensionEnd => { ..dim, extension_end: Some(p), }
      PickOrVertex => { ..dim, pick_or_vertex: Some(p), }
      ArcPoint => { ..dim, arc_point: Some(p), }
    }
  }
  doc.r12_recompute_dimension(index, tol, definition=dim, precision~)
}

///|
fn r12_bound_handle(
  handles : Map[String, Int],
  raw : String,
) -> Int raise R12SemanticError {
  guard r12_handle_key(raw) is Some(key) &&
    handles.get(key) is Some(index) &&
    index >= 0 else {
    raise InvalidSemantic("关联句柄缺失或含歧义 \{raw}")
  }
  index
}

///|
fn r12_bound_point(
  r : RawRecord,
  point : R12FeaturePoint,
) -> Vec3 raise R12SemanticError {
  match (r.kind, point) {
    ("LINE", FeatureStart) | ("POINT", FeatureLocation) => r12_point(r, 10)
    ("LINE", FeatureEnd) => r12_point(r, 11)
    ("LINE", FeatureMidpoint) =>
      add3(scale3(r12_point(r, 10), 0.5), scale3(r12_point(r, 11), 0.5))
    ("CIRCLE", FeatureCenter) | ("ARC", FeatureCenter) =>
      r12_convert(r12_extrusion(r), r12_point(r, 10))
    ("ARC", FeatureStart) => r12_bound_radial(r, r12_number(r, 50, None))
    ("ARC", FeatureEnd) => r12_bound_radial(r, r12_number(r, 51, None))
    ("CIRCLE", FeatureAngle(angle)) => r12_bound_radial(r, angle)
    _ => raise InvalidSemantic("关联实体类型与所选特征点不相容")
  }
}

///|
fn r12_bound_radial(
  r : RawRecord,
  degrees : Double,
) -> Vec3 raise R12SemanticError {
  let radius = r12_number(r, 40, None)
  guard radius > 0.0 && finite_number(degrees) else {
    raise InvalidSemantic("关联圆弧半径或角度无效")
  }
  let angle = to_radians(degrees)
  let p = add3(
    r12_point(r, 10),
    Vec3::new(radius * @math.cos(angle), radius * @math.sin(angle), 0.0),
  )
  r12_convert(r12_extrusion(r), p)
}
