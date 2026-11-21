///|
fn r12_custom_arrow(
  doc : ReadDocument,
  name : String,
  tip : (Vec3, Vec3),
  normal : Vec3,
  size : Double,
) -> Array[WorldPlaced] raise R12SemanticError {
  let (blocks, _) = r12_block_index(doc.records)
  guard r12_named_link(blocks, name) is Resolved(index) &&
    (r12_integer(doc.records[index], 70, Some(0)) & 28) == 0 &&
    doc.drawing.section("BLOCKS") is Some(block_section) else {
    raise InvalidSemantic("标注箭头需要唯一的本地图块")
  }
  let _ = r12_block_end(doc.records, index)
  let insert : Record = {
    kind: "INSERT",
    subclasses: [],
    common: [
      { code: 0, value: Str("INSERT"), },
      { code: 2, value: Str(name), },
      { code: 10, value: F64(0.0), },
      { code: 20, value: F64(0.0), },
      { code: 41, value: F64(size), },
      { code: 42, value: F64(size), },
      { code: 43, value: F64(size), },
    ],
  }
  let drawing : Drawing = {
    version: doc.drawing.version,
    sections: [{ name: "ENTITIES", records: [insert], }, block_section],
    warnings: [],
  }
  let tol = size * 0.001
  let world = drawing.expand_world_with_limits(tol, {
    max_placed: 256,
    max_points: 8192,
    max_visits: 1024,
  })
  guard world.warnings.is_empty() && !world.placed.is_empty() else {
    raise InvalidSemantic(
      "标注箭头图块为空、展开不完整或超过预算",
    )
  }
  let x_axis = scale3(tip.1, -1.0)
  let ocs = { x_axis, y_axis: normal.cross(x_axis).normalize(), normal, }
  let result = []
  let verified : Map[String, Bool] = Map([(name.to_upper(), true)])
  for item in world.placed {
    for instance in item.instances {
      let key = instance.block.to_upper()
      if !verified.contains(key) {
        guard r12_named_link(blocks, key) is Resolved(block) &&
          (r12_integer(doc.records[block], 70, Some(0)) & 28) == 0 else {
          raise InvalidSemantic("标注箭头嵌套块必须是本地图块")
        }
        let _ = r12_block_end(doc.records, block)
        verified[key] = true
      }
    }
    // Arrow output is geometric; nested text needs its own typography layout.
    guard !(item.flat is Label3(..)) else {
      raise InvalidSemantic("标注箭头图块含文字")
    }
    match r12_position_picture(item.flat, ocs, true, 0.0, tip.0, tol) {
      Ok(flat) => result.push({ ..item, flat, })
      Err(msg) => raise InvalidSemantic(msg)
    }
  }
  result
}
