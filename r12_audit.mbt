///|
pub(all) enum R12FieldIssue {
  MissingField
  RepeatedField
  InvalidField
  MissingBlock
  AmbiguousBlock
  MissingTableEntry
  AmbiguousTableEntry
  MissingLocalHandle
  AmbiguousLocalHandle
}

///|
pub(all) struct R12FieldFinding {
  record_index : Int
  kind : String
  group : Int
  issue : R12FieldIssue
}

///|
pub(all) struct R12FieldAudit {
  findings : Array[R12FieldFinding]
  /// False when the input has read diagnostics or the finding cap stops the audit.
  complete : Bool
}

///|
/// Check selected R12 geometry fields, declared table names, and local XDATA
/// handle references. MissingLocalHandle describes this file only; external
/// Xref databases are never opened.
pub fn ReadDocument::audit_r12_fields(self : ReadDocument) -> R12FieldAudit {
  let findings : Array[R12FieldFinding] = []
  if self.profile != R12 {
    return { findings, complete: false, }
  }
  let blocks : Map[String, Int] = Map([])
  let handles : Map[String, Int] = Map([])
  let tables : Map[String, Map[String, Int]] = Map([])
  let mut current_table = ""
  for r in self.records {
    if r.section == "TABLES" && r.kind == "TABLE" {
      current_table = r12_raw_name(r)
      if ["LAYER", "LTYPE", "STYLE", "DIMSTYLE", "APPID"].contains(
          current_table,
        ) &&
        !tables.contains(current_table) {
        tables[current_table] = Map([])
      }
    } else if r.section != "TABLES" || r.kind == "ENDTAB" {
      current_table = ""
    } else if r.kind == current_table &&
      tables.get(current_table) is Some(names) {
      let name = r12_raw_name(r).to_upper()
      if name != "" {
        names[name] = names.get(name).unwrap_or(0) + 1
      }
    }
    if ["TABLES", "ENTITIES", "BLOCKS"].contains(r.section) {
      let code = if r.kind == "DIMSTYLE" { 105 } else { 5 }
      for t in r.tags {
        if t.code == code &&
          t.value is Str(raw) &&
          r12_handle_key(raw) is Some(key) &&
          key != "0" {
          handles[key] = handles.get(key).unwrap_or(0) + 1
          break
        }
      }
    }
    if r.section == "BLOCKS" && r.kind == "BLOCK" {
      for tag in r.tags {
        if tag.code == 2 && tag.value is Str(name) && name != "" {
          let key = name.to_upper()
          blocks[key] = blocks.get(key).unwrap_or(0) + 1
          break
        }
      }
    }
  }
  let cap = 1000
  for index, r in self.records {
    if r.section != "ENTITIES" && r.section != "BLOCKS" {
      continue
    }
    let codes = match r.kind {
      "LINE" => [10, 20, 11, 21]
      "POINT" | "VERTEX" => [10, 20]
      "CIRCLE" => [10, 20, 40]
      "ARC" => [10, 20, 40, 50, 51]
      "BLOCK" => [2]
      "INSERT" => [2, 10, 20]
      _ => []
    }
    for code in codes {
      let mut hits = 0
      let mut invalid = false
      let mut name = ""
      for tag in r.tags {
        if tag.code != code {
          continue
        }
        hits += 1
        if code == 2 {
          if tag.value is Str(value) && value != "" {
            name = value
          } else {
            invalid = true
          }
        } else if tag.value is F64(value) && finite_number(value) {
          if code == 40 && value <= 0.0 {
            invalid = true
          }
        } else {
          invalid = true
        }
      }
      let issue : R12FieldIssue? = if hits == 0 {
        Some(MissingField)
      } else if hits > 1 {
        Some(RepeatedField)
      } else if invalid {
        Some(InvalidField)
      } else if code == 2 && r.kind == "INSERT" {
        match blocks.get(name.to_upper()) {
          None => Some(MissingBlock)
          Some(count) => if count > 1 { Some(AmbiguousBlock) } else { None }
        }
      } else {
        None
      }
      if issue is Some(issue) {
        if findings.length() == cap {
          return { findings, complete: false, }
        }
        findings.push({ record_index: index, kind: r.kind, group: code, issue, })
      }
    }
    for tag in r.tags {
      if tag.code == 1005 {
        let issue = match tag.value {
          Str(value) =>
            match r12_handle_key(value) {
              Some("0") => continue
              Some(key) =>
                match handles.get(key) {
                  None => MissingLocalHandle
                  Some(count) if count > 1 => AmbiguousLocalHandle
                  _ => continue
                }
              None => InvalidField
            }
          _ => InvalidField
        }
        if findings.length() == cap {
          return { findings, complete: false, }
        }
        findings.push({ record_index: index, kind: r.kind, group: 1005, issue, })
        continue
      }
      let table = match tag.code {
        3 if r.kind == "DIMENSION" => "DIMSTYLE"
        6 => "LTYPE"
        8 | 1003 => "LAYER"
        1001 => "APPID"
        7 if ["TEXT", "ATTDEF", "ATTRIB"].contains(r.kind) => "STYLE"
        _ => continue
      }
      guard tables.get(table) is Some(entries) else { continue }
      guard tag.value is Str(raw_name) else { continue }
      let name = raw_name.to_upper()
      if name == "" ||
        (
          table == "LTYPE" &&
          ["BYLAYER", "BYBLOCK", "CONTINUOUS"].contains(name)
        ) ||
        (table == "LAYER" && name == "0") ||
        (table == "APPID" && name == "ACAD") ||
        ((table == "STYLE" || table == "DIMSTYLE") && name == "STANDARD") {
        continue
      }
      let issue = match entries.get(name) {
        None => MissingTableEntry
        Some(count) => if count > 1 { AmbiguousTableEntry } else { continue }
      }
      if findings.length() == cap {
        return { findings, complete: false, }
      }
      findings.push({
        record_index: index,
        kind: r.kind,
        group: tag.code,
        issue,
      })
    }
  }
  { findings, complete: self.read_warnings.length() == 0, }
}

///|
fn r12_raw_name(r : RawRecord) -> String {
  for tag in r.tags {
    if tag.code == 2 && tag.value is Str(name) {
      return name
    }
  }
  ""
}

///|
fn r12_handle_key(raw : String) -> String? {
  if raw.length() == 0 || raw.length() > 16 {
    return None
  }
  let hex = raw.to_upper()
  let mut start = 0
  for c in hex {
    if !(('0' <= c && c <= '9') || ('A' <= c && c <= 'F')) {
      return None
    }
  }
  while start + 1 < hex.length() && hex[start] == '0' {
    start += 1
  }
  Some(hex[start:].to_owned())
}
