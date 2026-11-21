///|
/// A named local reference. Indices address ReadDocument::records.
pub(all) enum R12Link {
  Resolved(Int)
  Missing
  Ambiguous
}

///|
pub(all) struct R12Attribute {
  tag : String
  value : String
  prompt : String?
  flags : Int
  style : String
  /// OCS converted into the containing space. A block definition still uses its local space.
  anchor : Vec3
  alignment : Vec3?
  normal : Vec3
  thickness : Double
  height : Double
  rotation : Double
  width_scale : Double
  oblique : Double
  generation_flags : Int
  horizontal : Int
  vertical : Int
}

///|
pub(all) struct R12Dimension {
  block_name : String
  block : R12Link
  style : String
  flags : Int
  definition : Vec3
  text_midpoint : Vec3
  block_offset : Vec3?
  extension_start : Vec3?
  extension_end : Vec3?
  pick_or_vertex : Vec3?
  arc_point : Vec3?
  leader_length : Double?
  rotation : Double?
  horizontal_direction : Double?
  oblique : Double?
  text_rotation : Double?
  text : String?
}

///|
pub(all) enum R12EntitySemantics {
  SpatialLine(start~ : Vec3, end~ : Vec3)
  SpatialPolyline(points~ : Array[Vec3], closed~ : Bool)
  PolygonMesh(
    points~ : Array[Vec3],
    m~ : Int,
    n~ : Int,
    closed_m~ : Bool,
    closed_n~ : Bool
  )
  /// Each face stores signed, one-based indices; a negative index hides its outgoing edge.
  Polyface(points~ : Array[Vec3], faces~ : Array[Array[Int]])
  Symbol(
    name~ : String,
    insertion~ : Vec3,
    size~ : Double,
    rotation~ : Double,
    x_scale~ : Double,
    oblique~ : Double,
    thickness~ : Double,
    extrusion~ : Vec3
  )
  Viewport(
    center~ : Vec3,
    width~ : Double,
    height~ : Double,
    status~ : Int,
    id~ : Int,
    view~ : R12ViewportView?
  )
  Dimension(R12Dimension)
  FaceEdges(corners~ : Array[Vec3], invisible_mask~ : Int)
  AttributeDefinition(data~ : R12Attribute, block_record~ : Int?)
  Attribute(data~ : R12Attribute, insert_record~ : Int?, definition~ : R12Link)
}

///|
pub(all) struct R12SemanticEntry {
  record_index : Int
  entity : R12EntitySemantics
}

///|
pub(all) struct R12SemanticFinding {
  record_index : Int
  message : String
}

///|
pub(all) struct R12SemanticReport {
  entries : Array[R12SemanticEntry]
  findings : Array[R12SemanticFinding]
  /// Whether the pass reached the end of an R12 input without read diagnostics.
  /// Inspect findings separately for semantic problems.
  complete : Bool
}

///|
priv suberror R12SemanticError {
  InvalidSemantic(String)
}

///|
fn r12_single(r : RawRecord, code : Int) -> TagValue? raise R12SemanticError {
  let mut value = None
  for tag in r.tags {
    if tag.code == code {
      guard value is None else { raise InvalidSemantic("重复组码 \{code}") }
      value = Some(tag.value)
    }
  }
  value
}

///|
fn r12_number(
  r : RawRecord,
  code : Int,
  fallback : Double?,
) -> Double raise R12SemanticError {
  match r12_single(r, code) {
    Some(F64(v)) if finite_number(v) => v
    None if fallback is Some(v) => v
    _ => raise InvalidSemantic("缺少或无效数值组码 \{code}")
  }
}

///|
fn r12_integer(
  r : RawRecord,
  code : Int,
  fallback : Int?,
) -> Int raise R12SemanticError {
  match r12_single(r, code) {
    Some(I16(v)) | Some(I32(v)) => v
    None if fallback is Some(v) => v
    _ => raise InvalidSemantic("缺少或无效整数组码 \{code}")
  }
}

///|
fn r12_string(r : RawRecord, code : Int) -> String? raise R12SemanticError {
  match r12_single(r, code) {
    Some(Str(v)) => Some(v)
    None => None
    _ => raise InvalidSemantic("无效字符串组码 \{code}")
  }
}

///|
fn r12_required_string(
  r : RawRecord,
  code : Int,
  allow_empty? : Bool = false,
) -> String raise R12SemanticError {
  guard r12_string(r, code) is Some(v) && (allow_empty || v != "") else {
    raise InvalidSemantic("缺少或为空的字符串组码 \{code}")
  }
  v
}

///|
fn r12_point(
  r : RawRecord,
  base : Int,
  require_z? : Bool = false,
) -> Vec3 raise R12SemanticError {
  Vec3::new(
    r12_number(r, base, None),
    r12_number(r, base + 10, None),
    r12_number(r, base + 20, if require_z { None } else { Some(0.0) }),
  )
}

///|
fn r12_optional_point(
  r : RawRecord,
  base : Int,
) -> Vec3? raise R12SemanticError {
  if r.tags.any(t => {
      t.code == base || t.code == base + 10 || t.code == base + 20
    }) {
    Some(r12_point(r, base))
  } else {
    None
  }
}

///|
fn r12_optional_number(
  r : RawRecord,
  code : Int,
) -> Double? raise R12SemanticError {
  match r12_single(r, code) {
    None => None
    Some(F64(v)) if finite_number(v) => Some(v)
    _ => raise InvalidSemantic("无效数值组码 \{code}")
  }
}

///|
fn r12_convert(ocs : Ocs, p : Vec3) -> Vec3 raise R12SemanticError {
  let result = ocs.to_wcs(p)
  guard finite3(result) else {
    raise InvalidSemantic("OCS 转换后坐标非有限")
  }
  result
}

///|
fn r12_extrusion(r : RawRecord) -> Ocs raise R12SemanticError {
  let dir = Vec3::new(
    r12_number(r, 210, Some(0.0)),
    r12_number(r, 220, Some(0.0)),
    r12_number(r, 230, Some(1.0)),
  )
  match Ocs::from_extrusion(dir) {
    Ok(ocs) => ocs
    Err(message) => raise InvalidSemantic(message)
  }
}

///|
fn r12_attribute(r : RawRecord) -> R12Attribute raise R12SemanticError {
  let ocs = r12_extrusion(r)
  let tag = r12_required_string(r, 2)
  let height = r12_number(r, 40, None)
  let width_scale = r12_number(r, 41, Some(1.0))
  let horizontal = r12_integer(r, 72, Some(0))
  let vertical = r12_integer(r, 74, Some(0))
  guard height > 0.0 &&
    width_scale > 0.0 &&
    horizontal >= 0 &&
    horizontal <= 5 &&
    vertical >= 0 &&
    vertical <= 3 &&
    !tag.contains(" ") else {
    raise InvalidSemantic("属性标记、大小或对齐方式无效")
  }
  let anchor = r12_convert(ocs, r12_point(r, 10))
  let alignment = if horizontal != 0 || vertical != 0 {
    Some(r12_convert(ocs, r12_point(r, 11)))
  } else {
    match r12_optional_point(r, 11) {
      Some(p) => Some(r12_convert(ocs, p))
      None => None
    }
  }
  {
    tag,
    value: r12_required_string(r, 1, allow_empty=true),
    prompt: if r.kind == "ATTDEF" {
      r12_string(r, 3)
    } else {
      None
    },
    flags: r12_integer(r, 70, Some(0)),
    style: r12_string(r, 7).unwrap_or("STANDARD"),
    anchor,
    alignment,
    normal: ocs.normal,
    thickness: r12_number(r, 39, Some(0.0)),
    height,
    rotation: r12_number(r, 50, Some(0.0)),
    width_scale,
    oblique: r12_number(r, 51, Some(0.0)),
    generation_flags: r12_integer(r, 71, Some(0)),
    horizontal,
    vertical,
  }
}

///|
fn r12_named_link(names : Map[String, Int], name : String) -> R12Link {
  match names.get(name.to_upper()) {
    None => Missing
    Some(i) if i < 0 => Ambiguous
    Some(i) => Resolved(i)
  }
}

///|
fn r12_add_named_index(
  names : Map[String, Int],
  name : String,
  index : Int,
) -> Unit {
  let key = name.to_upper()
  names[key] = if names.contains(key) { -1 } else { index }
}

///|
fn r12_standalone(
  r : RawRecord,
  blocks : Map[String, Int],
) -> R12EntitySemantics? raise R12SemanticError {
  match r.kind {
    "3DLINE" =>
      Some(
        SpatialLine(
          start=r12_point(r, 10, require_z=true),
          end=r12_point(r, 11, require_z=true),
        ),
      )
    "SHAPE" => {
      let size = r12_number(r, 40, None)
      let x_scale = r12_number(r, 41, Some(1.0))
      guard size > 0.0 && x_scale != 0.0 else {
        raise InvalidSemantic("SHAPE 尺寸或 X 比例无效")
      }
      let ocs = r12_extrusion(r)
      Some(
        Symbol(
          name=r12_required_string(r, 2),
          insertion=r12_convert(ocs, r12_point(r, 10)),
          size~,
          rotation=r12_number(r, 50, Some(0.0)),
          x_scale~,
          oblique=r12_number(r, 51, Some(0.0)),
          thickness=r12_number(r, 39, Some(0.0)),
          extrusion=ocs.normal,
        ),
      )
    }
    "VIEWPORT" => {
      let width = r12_number(r, 40, None)
      let height = r12_number(r, 41, None)
      let id = r12_integer(r, 69, None)
      let status = r12_integer(r, 68, None)
      guard width > 0.0 && height > 0.0 && id > 0 && status >= -1 else {
        raise InvalidSemantic("VIEWPORT 尺寸、编号或状态无效")
      }
      Some(
        Viewport(
          center=r12_point(r, 10),
          width~,
          height~,
          status~,
          id~,
          view=r12_viewport_view(r),
        ),
      )
    }
    "3DFACE" => {
      let corners = [r12_point(r, 10), r12_point(r, 11), r12_point(r, 12)]
      let fourth = r12_optional_point(r, 13).unwrap_or(corners[2])
      corners.push(fourth)
      Some(FaceEdges(corners~, invisible_mask=r12_integer(r, 70, Some(0)) & 15))
    }
    "DIMENSION" => {
      let block_name = r12_required_string(r, 2)
      let flags = r12_integer(r, 70, None)
      let kind = flags & 15
      guard kind <= 6 && ((flags & 64) == 0 || kind == 6) else {
        raise InvalidSemantic("DIMENSION 类型或坐标标注标志无效")
      }
      let ocs = r12_extrusion(r)
      let extension_start = r12_optional_point(r, 13)
      let extension_end = r12_optional_point(r, 14)
      let pick_or_vertex = r12_optional_point(r, 15)
      let arc_point = r12_optional_point(r, 16)
      guard !(kind == 0 || kind == 1 || kind == 2 || kind == 5 || kind == 6) ||
        (extension_start is Some(_) && extension_end is Some(_)) else {
        raise InvalidSemantic("DIMENSION 缺少定义点 13/14")
      }
      guard !(kind >= 2 && kind <= 5) || pick_or_vertex is Some(_) else {
        raise InvalidSemantic("DIMENSION 缺少定义点 15")
      }
      guard kind != 2 || arc_point is Some(_) else {
        raise InvalidSemantic("DIMENSION 缺少定义点 16")
      }
      let block_offset = match r12_optional_point(r, 12) {
        Some(p) => Some(r12_convert(ocs, p))
        None => None
      }
      let arc_wcs = match arc_point {
        Some(p) => Some(r12_convert(ocs, p))
        None => None
      }
      Some(
        Dimension({
          block_name,
          block: r12_named_link(blocks, block_name),
          style: r12_string(r, 3).unwrap_or("STANDARD"),
          flags,
          definition: r12_point(r, 10),
          text_midpoint: r12_convert(ocs, r12_point(r, 11)),
          block_offset,
          extension_start,
          extension_end,
          pick_or_vertex,
          arc_point: arc_wcs,
          leader_length: r12_optional_number(r, 40),
          rotation: r12_optional_number(r, 50),
          horizontal_direction: r12_optional_number(r, 51),
          oblique: r12_optional_number(r, 52),
          text_rotation: r12_optional_number(r, 53),
          text: r12_string(r, 1),
        }),
      )
    }
    _ => None
  }
}
