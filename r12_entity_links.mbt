///|
fn r12_block_index(
  records : Array[RawRecord],
) -> (Map[String, Int32], Map[Int32, Map[String, Int32]]) {
  let blocks : Map[String, Int32] = Map([])
  let definitions : Map[Int32, Map[String, Int32]] = Map([])
  let mut active = None
  for i, r in records {
    if r.section != "BLOCKS" || r.kind == "ENDBLK" || r.kind == "ENDSEC" {
      active = None
    } else if r.kind == "BLOCK" {
      let name = r12_raw_name(r)
      active = if name != "" { Some(i) } else { None }
      if name != "" {
        r12_add_named_index(blocks, name, i)
      }
    } else if r.kind == "ATTDEF" && active is Some(block) {
      // A malformed definition may still be found by tag, but is independently
      // diagnosed and omitted from the typed entries.
      let name = r12_raw_name(r)
      if name != "" {
        let names = definitions.get(block).unwrap_or(Map([]))
        r12_add_named_index(names, name, i)
        definitions[block] = names
      }
    }
  }
  (blocks, definitions)
}

///|
/// Read additional R12 entity data and local associations. This pass never
/// expands INSERTs or changes which entities the XY checker accepts.
pub fn ReadDocument::r12_semantics(self : ReadDocument) -> R12SemanticReport {
  let entries : Array[R12SemanticEntry] = []
  let findings : Array[R12SemanticFinding] = []
  if self.profile != R12 {
    return { entries, findings, complete: false, }
  }
  let (blocks, definitions) = r12_block_index(self.records)
  let mut block_record = None
  let mut insert_record = None
  let mut insert_names : Map[String, Int32]? = None
  let mut seen : Map[String, Bool] = Map([])
  for i, r in self.records {
    if findings.length() >= 1000 {
      return { entries, findings, complete: false, }
    }
    if r.section != "BLOCKS" {
      block_record = None
    }
    if r.kind != "ATTRIB" || (r.section != "ENTITIES" && r.section != "BLOCKS") {
      insert_record = None
      insert_names = None
    }
    if r.section != "ENTITIES" && r.section != "BLOCKS" {
      continue
    }
    let entity : R12EntitySemantics? = try {
      match r.kind {
        "BLOCK" if r.section == "BLOCKS" => {
          block_record = Some(i)
          None
        }
        "ENDBLK" | "ENDSEC" => {
          block_record = None
          None
        }
        "INSERT" => {
          if r12_integer(r, 66, Some(0)) == 1 {
            insert_record = Some(i)
            seen = Map([])
            if r12_named_link(blocks, r12_required_string(r, 2))
              is Resolved(block) {
              insert_names = definitions.get(block)
            }
          }
          None
        }
        "ATTDEF" =>
          Some(AttributeDefinition(data=r12_attribute(r), block_record~))
        "ATTRIB" => {
          let data = r12_attribute(r)
          let name = data.tag.to_upper()
          let definition = match insert_names {
            Some(names) => r12_named_link(names, name)
            None => Missing
          }
          if insert_record is None {
            findings.push({
              record_index: i,
              message: "ATTRIB 不属于声明属性序列的 INSERT",
            })
          } else if seen.contains(name) {
            findings.push({
              record_index: i,
              message: "INSERT 属性序列包含重复标记 \{data.tag}",
            })
          } else if !(definition is Resolved(_)) {
            findings.push({
              record_index: i,
              message: "ATTRIB 无唯一的本地 ATTDEF \{data.tag}",
            })
          }
          seen[name] = true
          Some(Attribute(data~, insert_record~, definition~))
        }
        "POLYLINE" => {
          let flags = r12_integer(r, 70, Some(0))
          if (flags & 88) != 0 {
            Some(r12_spatial(self.records, i, flags))
          } else {
            None
          }
        }
        _ => r12_standalone(r, blocks)
      }
    } catch {
      InvalidSemantic(message) => {
        findings.push({ record_index: i, message, })
        None
      }
    }
    if entity is Some(value) {
      if value is Dimension(dim) && !(dim.block is Resolved(_)) {
        findings.push({
          record_index: i,
          message: "DIMENSION 无唯一的本地标注块 \{dim.block_name}",
        })
      }
      entries.push({ record_index: i, entity: value, })
    }
  }
  { entries, findings, complete: self.read_warnings.is_empty(), }
}
