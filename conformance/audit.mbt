// Observations are deliberately separate from file-specific geometry truth.

///|
struct CorpusKind {
  kind : String
  total : Int
  decoded : Int
} derive(ToJson)

///|
struct CorpusFinding {
  category : String
  severity : String
  message : String
} derive(ToJson)

///|
struct CorpusAudit {
  file : String
  read_ok : Bool
  version : String
  encoding : String
  tags : Int
  eof_ok : Bool
  codes_ok : Bool
  scan_warnings : Array[String]
  structure_warnings : Array[String]
  entity_kinds : Array[CorpusKind]
  entity_warnings : Array[String]
  expanded_kinds : Array[CorpusKind]
  expanded_outlines : Int
  expansion_warnings : Array[String]
  findings : Array[CorpusFinding]
  incomplete : Bool
  geometry_verified : Bool
} derive(ToJson)

///|
struct CorpusReadError {
  file : String
  read_ok : Bool
  error : String
} derive(ToJson)

///|
fn corpus_bump(kinds : Array[CorpusKind], entity : @dxfkit.Entity) -> Unit {
  let decoded = if entity.is_decoded() { 1 } else { 0 }
  for i = 0; i < kinds.length(); i = i + 1 {
    if kinds[i].kind == entity.kind() {
      let current = kinds[i]
      kinds[i] = {
        kind: current.kind,
        total: current.total + 1,
        decoded: current.decoded + decoded,
      }
      return
    }
  }
  kinds.push({ kind: entity.kind(), total: 1, decoded, })
}

///|
fn audit_corpus_file(path : String) -> CorpusAudit raise {
  let scan = scan_corpus_file(path)
  let drawing = @dxfkit.build_drawing(scan)
  let entities = drawing.entities()
  let expanded = drawing.expand(0.05)
  let report = drawing.check({ tol: 0.05, min_gap: 0.0, })
  let entity_kinds : Array[CorpusKind] = []
  let expanded_kinds : Array[CorpusKind] = []
  let findings : Array[CorpusFinding] = []
  for entity in entities.entities {
    corpus_bump(entity_kinds, entity)
  }
  let mut expanded_outlines = 0
  for placed in expanded.placed {
    corpus_bump(expanded_kinds, placed.entity)
    if placed.flat is @dxfkit.Outline(..) {
      expanded_outlines += 1
    }
  }
  for finding in report.findings {
    findings.push({
      category: finding.check,
      severity: @dxfkit.severity_label(finding.severity),
      message: finding.message,
    })
  }
  let eof_ok = scan.tags.length() > 0 &&
    scan.tags[scan.tags.length() - 1].code == 0 &&
    scan.tags[scan.tags.length() - 1].value.as_string() == "EOF"
  {
    file: short_name(path),
    read_ok: true,
    version: drawing.version,
    encoding: scan.encoding.to_display(),
    tags: scan.tags.length(),
    eof_ok,
    codes_ok: scan.tags.all(t => t.code >= 0 && t.code <= 1071),
    scan_warnings: scan.warnings,
    structure_warnings: drawing.warnings,
    entity_kinds,
    entity_warnings: entities.warnings,
    expanded_kinds,
    expanded_outlines,
    expansion_warnings: expanded.warnings,
    findings,
    incomplete: report.has_incomplete_checks(),
    // The corpus tests have no per-file independent coordinate/error oracle.
    // Producing points, decoding fields or reporting no warnings is insufficient.
    geometry_verified: false,
  }
}

///|
fn report_corpus_audit(targets : Array[String]) -> Unit {
  for path in targets {
    let record = audit_corpus_file(path) catch {
      err => {
        let failure : CorpusReadError = {
          file: short_name(path),
          read_ok: false,
          error: err.to_string(),
        }
        println(@json.to_json(failure).stringify())
        continue
      }
    }
    println(@json.to_json(record).stringify())
  }
}
