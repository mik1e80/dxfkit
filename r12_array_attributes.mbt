///|
/// One stored or constant attribute positioned at a requested INSERT cell.
/// The basis vectors include the applicable parent scale and text rotation,
/// leaving glyph generation and justification to the caller.
pub(all) struct R12CellAttribute {
  source_record : Int32
  definition_record : Int32
  from_constant_definition : Bool
  data : R12Attribute
  anchor : Vec3
  alignment : Vec3?
  baseline : Vec3
  up : Vec3
}

///|
fn r12_block_end(
  records : Array[RawRecord],
  start : Int32,
) -> Int32 raise R12SemanticError {
  for i in (start + 1)..<records.length() {
    let r = records[i]
    if r.section != "BLOCKS" || r.kind == "BLOCK" || r.kind == "ENDSEC" {
      break
    }
    if r.kind == "ENDBLK" {
      return i
    }
  }
  raise InvalidSemantic("本地 BLOCK 缺少 ENDBLK")
}

///|
/// Resolve a single zero-based INSERT cell without materializing the entire
/// array. Coordinates are in the INSERT's containing space. Attached ATTRIB
/// points already describe the first cell and only receive the grid offset.
/// Constant ATTDEF points are transformed from the block definition.
pub fn ReadDocument::r12_cell_attributes(
  self : ReadDocument,
  insert_record : Int32,
  row : Int32,
  column : Int32,
) -> Result[Array[R12CellAttribute], String] {
  Ok(r12_cell_attributes_impl(self, insert_record, row, column)) catch {
    InvalidSemantic(message) => Err(message)
  }
}

///|
fn r12_cell_attributes_impl(
  doc : ReadDocument,
  index : Int32,
  row : Int32,
  column : Int32,
) -> Array[R12CellAttribute] raise R12SemanticError {
  guard doc.profile == R12 && index >= 0 && index < doc.records.length() else {
    raise InvalidSemantic(
      "属性展开需要 AC1009 和有效的 INSERT 记录下标",
    )
  }
  let records = doc.records
  let r = records[index]
  guard r.kind == "INSERT" && (r.section == "ENTITIES" || r.section == "BLOCKS") else {
    raise InvalidSemantic("记录不是 INSERT")
  }
  let rows = r12_integer(r, 71, Some(1))
  let columns = r12_integer(r, 70, Some(1))
  guard row >= 0 && row < rows && column >= 0 && column < columns else {
    raise InvalidSemantic("INSERT 阵列单元超出行列范围")
  }
  let name = r12_required_string(r, 2)
  let (blocks, definitions) = r12_block_index(records)
  guard r12_named_link(blocks, name) is Resolved(block) else {
    raise InvalidSemantic("INSERT 本地块缺失或含歧义")
  }
  guard (r12_integer(records[block], 70, Some(0)) & 20) == 0 else {
    raise InvalidSemantic("不展开外部参照中的属性")
  }
  let end = r12_block_end(records, block)
  let names = definitions.get(block).unwrap_or(Map([]))
  let ocs = r12_extrusion(r)
  let theta = to_radians(r12_number(r, 50, Some(0.0)))
  let grid = Vec3::new(
    column.to_double() * r12_number(r, 44, Some(0.0)),
    row.to_double() * r12_number(r, 45, Some(0.0)),
    0.0,
  )
  let offset = r12_convert(ocs, insert_grid_vector(theta, grid))
  let scale = Vec3::new(
    r12_number(r, 41, Some(1.0)),
    r12_number(r, 42, Some(1.0)),
    r12_number(r, 43, Some(1.0)),
  )
  guard scale.x != 0.0 && scale.y != 0.0 && scale.z != 0.0 else {
    raise InvalidSemantic("INSERT 的缩放不能为零")
  }
  let base = r12_optional_point(records[block], 10).unwrap_or(Vec3::zero())
  let cell = insert_transform3(r12_point(r, 10), base, scale, theta, grid, ocs)
  let seen : Map[String, Bool] = Map([])
  let out : Array[R12CellAttribute] = []
  let follow = r12_integer(r, 66, Some(0))
  guard follow == 0 || follow == 1 else {
    raise InvalidSemantic("INSERT 的 66 属性序列标志无效")
  }
  if follow == 0 &&
    index + 1 < records.length() &&
    records[index + 1].section == r.section &&
    records[index + 1].kind == "ATTRIB" {
    raise InvalidSemantic("INSERT 缺少声明后续 ATTRIB 的 66 标志")
  }
  if follow == 1 {
    let mut i = index + 1
    let translation = { ..Transform3::identity(), origin: offset, }
    while i < records.length() &&
          records[i].section == r.section &&
          records[i].kind == "ATTRIB" {
      let attr = r12_attribute(records[i])
      let tag = attr.tag.to_upper()
      guard !seen.contains(tag) &&
        r12_named_link(names, tag) is Resolved(definition) else {
        raise InvalidSemantic(
          "属性标记 \{attr.tag} 重复或没有唯一 ATTDEF",
        )
      }
      ignore(r12_attribute(records[definition]))
      seen[tag] = true
      out.push(r12_place_attribute(attr, i, definition, false, translation))
      i += 1
    }
    guard i < records.length() &&
      records[i].section == r.section &&
      records[i].kind == "SEQEND" else {
      raise InvalidSemantic("INSERT 属性序列缺少 SEQEND")
    }
  }
  for i in (block + 1)..<end {
    if records[i].kind != "ATTDEF" ||
      (r12_integer(records[i], 70, Some(0)) & 2) == 0 {
      continue
    }
    let attr = r12_attribute(records[i])
    let tag = attr.tag.to_upper()
    guard r12_named_link(names, tag) is Resolved(_) else {
      raise InvalidSemantic("常量属性 \{attr.tag} 的 ATTDEF 含歧义")
    }
    if !seen.contains(tag) {
      out.push(r12_place_attribute(attr, i, i, true, cell))
    }
  }
  out
}

///|
fn r12_place_attribute(
  attr : R12Attribute,
  source_record : Int32,
  definition_record : Int32,
  from_constant_definition : Bool,
  transform : Transform3,
) -> R12CellAttribute raise R12SemanticError {
  let ocs = match Ocs::from_extrusion(attr.normal) {
    Ok(ocs) => ocs
    Err(message) => raise InvalidSemantic(message)
  }
  let angle = to_radians(attr.rotation)
  let baseline = transform.vector(
    ocs.to_wcs(Vec3::new(@math.cos(angle), @math.sin(angle), 0.0)),
  )
  let up = transform.vector(
    ocs.to_wcs(Vec3::new(-@math.sin(angle), @math.cos(angle), 0.0)),
  )
  let anchor = transform.apply(attr.anchor)
  let alignment = attr.alignment.map(p => transform.apply(p))
  guard finite3(anchor) &&
    finite3(baseline) &&
    finite3(up) &&
    (alignment is None || (alignment is Some(p) && finite3(p))) else {
    raise InvalidSemantic("阵列属性变换后超出有限坐标")
  }
  {
    source_record,
    definition_record,
    from_constant_definition,
    data: attr,
    anchor,
    alignment,
    baseline,
    up,
  }
}
