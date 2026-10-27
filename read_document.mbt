///|
/// AC1009 selects the R12 record-preservation profile; other versions are best effort.
/// This is not certification of every mandatory field in the Autodesk standard.
pub(all) enum ConformanceProfile {
  R12
  BestEffort
} derive(Eq)

///|
pub extend ConformanceProfile with Eq::{equal, not_equal}

///|
/// Ordered original tags for one group-0 record, including control records and XDATA.
pub(all) struct RawRecord {
  section : String
  kind : String
  tags : Array[Tag]
}

///|
/// Lossless source bytes plus parsed records. Reading and geometry have separate diagnostics.
pub(all) struct ReadDocument {
  source : Bytes
  scan : TagScan
  records : Array[RawRecord]
  drawing : Drawing
  profile : ConformanceProfile
  read_warnings : Array[String]
}

///|
/// Read an ASCII DXF without discarding unrecognized fields or record types.
/// `source` also retains comments, formatting and bytes after EOF that the scanner ignores.
pub fn read_document(source : Bytes) -> ReadDocument {
  let scan = scan_tags(source)
  let drawing = build_drawing(scan)
  let profile = if drawing.version == "AC1009" { R12 } else { BestEffort }
  let warnings = drawing.warnings.copy()
  let records : Array[RawRecord] = []
  let mut section = ""
  let mut pending : Array[Tag] = []
  let mut kind = ""
  for tag in scan.tags {
    if tag.code == 0 && pending.length() > 0 {
      if kind == "SECTION" {
        section = raw_section_name(pending)
      }
      records.push({ section, kind, tags: pending, })
      if kind == "ENDSEC" {
        section = ""
      }
      pending = []
    }
    if tag.code == 0 {
      kind = tag.value.as_string()
    }
    pending.push(tag)
  }
  if pending.length() > 0 {
    if kind == "SECTION" {
      section = raw_section_name(pending)
    }
    records.push({ section, kind, tags: pending, })
  }
  validate_record_structure(records, warnings)
  if profile == BestEffort {
    warnings.push(
      "未选择 R12/AC1009：其他版本仅按已实现能力尽力读取",
    )
  } else {
    for r in records {
      if r.kind == "SECTION" &&
        !["HEADER", "TABLES", "BLOCKS", "ENTITIES"].contains(r.section) {
        warnings.push(
          "R12 范围外的段 \{r.section}；原始记录已保留",
        )
      }
      if r.section == "ENTITIES" || r.section == "BLOCKS" {
        if !r12_record_kind(r.kind) {
          warnings.push(
            "R12 范围外或未知记录 \{r.kind}；原始字段已保留",
          )
        }
      }
    }
  }
  { source, scan, records, drawing, profile, read_warnings: warnings, }
}

///|
fn raw_section_name(tags : Array[Tag]) -> String {
  for t in tags {
    if t.code == 2 {
      return t.value.as_string()
    }
  }
  ""
}

///|
fn r12_record_kind(kind : String) -> Bool {
  [
    "SECTION", "ENDSEC", "BLOCK", "ENDBLK", "3DFACE", "3DLINE", "ARC", "ATTDEF",
    "ATTRIB", "CIRCLE", "DIMENSION", "INSERT", "LINE", "POINT", "POLYLINE", "SEQEND",
    "SHAPE", "SOLID", "TEXT", "TRACE", "VERTEX", "VIEWPORT",
  ].contains(kind)
}

///|
/// Structural validation only: no claim that retaining a tag validates its meaning.
fn validate_record_structure(
  records : Array[RawRecord],
  warnings : Array[String],
) -> Unit {
  let mut section = ""
  let mut table = false
  let mut block = false
  let mut sequence = ""
  let mut eof = false
  for r in records {
    if r.kind == "SECTION" {
      if section != "" {
        warnings.push("SECTION 嵌套，读取结构不完整")
      }
      section = r.section
      if section == "" {
        warnings.push("SECTION 缺少段名")
      }
    } else if r.kind == "ENDSEC" || r.kind == "EOF" {
      if table {
        warnings.push("TABLE 缺少 ENDTAB")
        table = false
      }
      if block {
        warnings.push("BLOCK 缺少 ENDBLK")
        block = false
      }
      if sequence != "" {
        warnings.push("\{sequence} 缺少 SEQEND")
        sequence = ""
      }
      if r.kind == "ENDSEC" {
        if section == "" {
          warnings.push("ENDSEC 没有对应 SECTION")
        }
        section = ""
      } else {
        if section != "" {
          warnings.push("EOF 前缺少 ENDSEC")
        }
        eof = true
      }
    } else if section == "" {
      if !(r.kind == "" && r.tags.all(t => t.code == 999)) {
        warnings.push("段外记录 \{r.kind} 已保留，结构无效")
      }
    } else {
      let child = (sequence == "POLYLINE" && r.kind == "VERTEX") ||
        (sequence == "INSERT/ATTRIB" && r.kind == "ATTRIB") ||
        r.kind == "SEQEND"
      if sequence != "" && !child {
        warnings.push(
          "\{sequence} 缺少 SEQEND，遇到 \{r.kind} 时结束恢复；读取结构不完整",
        )
        sequence = ""
      }
      if r.kind == "VERTEX" && sequence != "POLYLINE" {
        warnings.push("VERTEX 没有所属 POLYLINE 序列；记录已保留")
      }
      if r.kind == "ATTRIB" && sequence != "INSERT/ATTRIB" {
        warnings.push(
          "ATTRIB 没有所属 INSERT 属性序列；记录已保留",
        )
      }
      if (r.kind == "TABLE" || r.kind == "ENDTAB") && section != "TABLES" {
        warnings.push("\{r.kind} 所在段必须是 TABLES；记录已保留")
      }
      if (r.kind == "BLOCK" || r.kind == "ENDBLK") && section != "BLOCKS" {
        warnings.push("\{r.kind} 所在段必须是 BLOCKS；记录已保留")
      }
      if section == "TABLES" &&
        !table &&
        r.kind != "TABLE" &&
        r.kind != "ENDTAB" {
        warnings.push("表项 \{r.kind} 没有所属 TABLE；记录已保留")
      }
      if section == "BLOCKS" &&
        !block &&
        r.kind != "BLOCK" &&
        r.kind != "ENDBLK" {
        warnings.push("实体 \{r.kind} 没有所属 BLOCK；记录已保留")
      }
      match r.kind {
        "TABLE" => {
          if table {
            warnings.push("TABLE 嵌套或缺少 ENDTAB")
          }
          table = true
        }
        "ENDTAB" => {
          if !table {
            warnings.push("ENDTAB 没有对应 TABLE")
          }
          table = false
        }
        "BLOCK" => {
          if block {
            warnings.push("BLOCK 嵌套或缺少 ENDBLK")
          }
          block = true
        }
        "ENDBLK" => {
          if !block {
            warnings.push("ENDBLK 没有对应 BLOCK")
          }
          block = false
        }
        "POLYLINE" => {
          if sequence != "" {
            warnings.push("\{sequence} 缺少 SEQEND")
          }
          sequence = "POLYLINE"
        }
        "INSERT" =>
          for t in r.tags {
            if t.code == 66 && t.value.as_int() == 1 {
              sequence = "INSERT/ATTRIB"
            }
          }
        "SEQEND" => {
          if sequence == "" {
            warnings.push("SEQEND 没有对应序列")
          }
          sequence = ""
        }
        _ => ()
      }
    }
  }
  if !eof {
    warnings.push("缺少 EOF；读取结构不完整")
  }
}
