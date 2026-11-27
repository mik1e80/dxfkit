///|
/// One per-entity DIMSTYLE override and its original XDATA value.
pub(all) struct R12DimStyleOverride {
  group : Int32
  value : Tag
}

///|
/// Saved annotation primitives and references for one DIMENSION in its
/// containing space. Primitive coordinates include the group 12 translation.
pub(all) struct R12DimensionPicture {
  block_record : Int32
  style_record : R12Link
  overrides : Array[R12DimStyleOverride]
  world : WorldExpansion
}

///|
/// Read the local DIMSTYLE and expand the saved picture block separately
/// from manufacturing contours. Expansion honors the normal geometry limits.
/// Nested INSERTs in the picture, such as arrow blocks, follow the same limits.
pub fn ReadDocument::r12_dimension_picture(
  self : ReadDocument,
  record_index : Int32,
  tol : Double,
  limits~ : ExpandLimits = expansion_limits(),
) -> Result[R12DimensionPicture, String] {
  Ok(r12_dimension_picture_impl(self, record_index, tol, limits)) catch {
    InvalidSemantic(message) => Err(message)
  }
}

///|
fn r12_dimension_picture_impl(
  doc : ReadDocument,
  index : Int32,
  tol : Double,
  limits : ExpandLimits,
) -> R12DimensionPicture raise R12SemanticError {
  guard doc.profile == R12 &&
    index >= 0 &&
    index < doc.records.length() &&
    positive_tolerance(tol) else {
    raise InvalidSemantic(
      "标注图块需要 AC1009、有效记录下标和正的有限容差",
    )
  }
  let r = doc.records[index]
  guard r.kind == "DIMENSION" &&
    (r.section == "ENTITIES" || r.section == "BLOCKS") else {
    raise InvalidSemantic("记录不是 DIMENSION")
  }
  let (blocks, _) = r12_block_index(doc.records)
  guard r12_standalone(r, blocks) is Some(Dimension(dim)) &&
    dim.block is Resolved(block) else {
    raise InvalidSemantic("DIMENSION 缺少唯一的本地标注块")
  }
  guard (r12_integer(doc.records[block], 70, Some(0)) & 20) == 0 else {
    raise InvalidSemantic("不展开外部参照中的标注块")
  }
  let overrides = r12_dimension_overrides(r)
  let end = r12_block_end(doc.records, block)
  let tags : Array[Tag] = []
  for i in (block + 1)..<end {
    tags.append(doc.records[i].tags)
  }
  let picture : Section = { name: "ENTITIES", records: split_records(tags), }
  let sections = [picture]
  if doc.drawing.section("BLOCKS") is Some(section) {
    sections.push(section)
  }
  let drawing : Drawing = {
    version: doc.drawing.version,
    sections,
    warnings: [],
  }
  let expanded = drawing.expand_world_with_limits(tol, limits)
  let ocs = r12_extrusion(r)
  let offset = dim.block_offset.unwrap_or(Vec3::zero())
  let tilted = ocs.normal.x != 0.0 || ocs.normal.y != 0.0 || ocs.normal.z != 1.0
  let elevation = if tilted { r12_number(r, 31, Some(0.0)) } else { 0.0 }
  let world : WorldExpansion = { placed: [], warnings: expanded.warnings, }
  for item in expanded.placed {
    let converted = r12_position_picture(
      item.flat,
      ocs,
      tilted,
      elevation,
      offset,
      tol,
    )
    match converted {
      Ok(flat) => world.placed.push({ ..item, flat, })
      Err(message) => {
        if world.warnings.length() >= 1000 {
          world.warnings.push("标注图块诊断达到资源上限")
          break
        }
        world.warnings.push(message)
      }
    }
  }
  {
    block_record: block,
    style_record: r12_table_link(doc.records, "DIMSTYLE", dim.style),
    overrides,
    world,
  }
}

///|
fn r12_position_picture(
  flat : WorldFlat,
  ocs : Ocs,
  tilted : Bool,
  elevation : Double,
  offset : Vec3,
  tol : Double,
) -> Result[WorldFlat, String] {
  let place = fn(p : Vec3) raise R12SemanticError {
    guard !tilted || p.z.abs() <= tol else {
      raise InvalidSemantic(
        "倾斜 DIMENSION 图块包含离面几何，未放置",
      )
    }
    let point = if tilted { Vec3::new(p.x, p.y, elevation) } else { p }
    let result = add3(ocs.to_wcs(point), offset)
    guard finite3(result) else {
      raise InvalidSemantic("标注图块坐标变换后非有限")
    }
    result
  }
  Ok(
    match flat {
      Outline3(points~, closed~) => {
        let placed : Array[Vec3] = []
        for p in points {
          placed.push(place(p))
        }
        Outline3(points=placed, closed~)
      }
      Dot3(at~) => Dot3(at=place(at))
      Label3(at~, height~, value~) => Label3(at=place(at), height~, value~)
      Face3(corners~) => {
        let placed : Array[Vec3] = []
        for p in corners {
          placed.push(place(p))
        }
        Face3(corners=placed)
      }
      Empty3 => raise InvalidSemantic("标注图块含未重建的实体")
    },
  ) catch {
    InvalidSemantic(message) => Err(message)
  }
}

///|
fn r12_table_link(
  records : Array[RawRecord],
  table : String,
  name : String,
) -> R12Link {
  let mut in_styles = false
  let mut result : R12Link = Missing
  let key = name.to_upper()
  for i, r in records {
    if r.section != "TABLES" || r.kind == "ENDTAB" {
      in_styles = false
    } else if r.kind == "TABLE" {
      in_styles = r12_raw_name(r).to_upper() == table
    } else if in_styles && r.kind == table && r12_raw_name(r).to_upper() == key {
      if result is Resolved(_) {
        return Ambiguous
      }
      result = Resolved(i)
    }
  }
  result
}

///|
fn r12_dimension_overrides(
  r : RawRecord,
) -> Array[R12DimStyleOverride] raise R12SemanticError {
  let mut acad = false
  let mut found = false
  let out : Array[R12DimStyleOverride] = []
  let keys : Map[Int32, Bool] = Map([])
  let mut i = 0
  while i < r.tags.length() {
    let t = r.tags[i]
    i += 1
    if t.code == 1001 {
      acad = t.value is Str("ACAD")
    }
    if !acad || !(t.code == 1000 && t.value is Str("DSTYLE")) {
      continue
    }
    guard !found &&
      i < r.tags.length() &&
      r.tags[i].code == 1002 &&
      r.tags[i].value is Str("{") else {
      raise InvalidSemantic(
        "DIMENSION 的 ACAD/DSTYLE 重复或缺少起始括号",
      )
    }
    found = true
    i += 1
    while i < r.tags.length() &&
          !(r.tags[i].code == 1002 && r.tags[i].value is Str("}")) {
      guard i + 1 < r.tags.length() &&
        r.tags[i].code == 1070 &&
        r.tags[i].value is I16(group) &&
        group > 0 &&
        !keys.contains(group) else {
        raise InvalidSemantic(
          "DIMENSION 的 DSTYLE 变量组码缺失或重复",
        )
      }
      let value = r.tags[i + 1]
      let valid = match (value.code, value.value) {
        (1000, Str(_)) | (1005, Str(_)) | (1070, I16(_)) | (1071, I32(_)) =>
          true
        (1040, F64(v)) => finite_number(v)
        _ => false
      }
      guard valid else {
        raise InvalidSemantic("DIMENSION 的 DSTYLE 变量值类型不合法")
      }
      keys[group] = true
      out.push({ group, value, })
      i += 2
    }
    guard i < r.tags.length() else {
      raise InvalidSemantic("DIMENSION 的 DSTYLE 缺少结束括号")
    }
    i += 1
  }
  out
}
