///|
fn r12_semantics_input(
  body : String,
  blocks~ : String = "",
  tables~ : String = "",
) -> @dxfkit.ReadDocument {
  @dxfkit.read_document(
    @utf8.encode(
      "0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n0\nENDSEC\n" +
      "0\nSECTION\n2\nTABLES\n" +
      tables +
      "0\nENDSEC\n" +
      "0\nSECTION\n2\nBLOCKS\n" +
      blocks +
      "0\nENDSEC\n" +
      "0\nSECTION\n2\nENTITIES\n" +
      body +
      "0\nENDSEC\n0\nEOF\n",
    ),
  )
}

///|
fn r12_vertex(flags : Int32, x : Int32, y : Int32, z : Int32) -> String {
  "0\nVERTEX\n70\n\{flags}\n10\n\{x}\n20\n\{y}\n30\n\{z}\n"
}

///|
test "R12 typed spatial polyline and M-major grid preserve WCS and topology" {
  let spatial = "0\nPOLYLINE\n70\n9\n" +
    r12_vertex(32, 1, 2, 3) +
    r12_vertex(32, -1, 0, 4) +
    "0\nSEQEND\n"
  let grid = "0\nPOLYLINE\n70\n48\n71\n2\n72\n3\n" +
    r12_vertex(64, 0, 0, 1) +
    r12_vertex(64, 0, 1, 2) +
    r12_vertex(64, 0, 2, 3) +
    r12_vertex(64, 1, 0, 4) +
    r12_vertex(64, 1, 1, 5) +
    r12_vertex(64, 1, 2, 6) +
    "0\nSEQEND\n"
  let report = r12_semantics_input(spatial + grid).r12_semantics()
  assert_true(report.complete)
  assert_true(report.findings.is_empty())
  assert_eq(report.entries.length(), 2)
  guard report.entries[0].entity is @dxfkit.SpatialPolyline(points~, closed~) else {
    fail("expected spatial polyline")
  }
  assert_true(closed)
  assert_eq(points.length(), 2)
  assert_eq(points[0].z, 3.0)
  assert_eq(points[1].x, -1.0)
  guard report.entries[1].entity
    is @dxfkit.PolygonMesh(points~, m~, n~, closed_m~, closed_n~) else {
    fail("expected polygon mesh")
  }
  assert_eq((m, n), (2, 3))
  assert_false(closed_m)
  assert_true(closed_n)
  assert_eq((points[n].x, points[n].y, points[n].z), (1.0, 0.0, 4.0))
}

///|
test "R12 polyface keeps edge signs and rejects broken face references and sequences" {
  let header = "0\nPOLYLINE\n70\n64\n71\n0\n72\n0\n"
  let good = "0\nVERTEX\n70\n128\n71\n1\n72\n-2\n73\n3\n"
  let point_records = r12_vertex(192, 1, 0, 0) +
    r12_vertex(192, 0, 1, 0) +
    r12_vertex(192, 0, 0, 1)
  let doc = r12_semantics_input(header + good + point_records + "0\nSEQEND\n")
  let report = doc.r12_semantics()
  assert_true(report.complete)
  assert_true(report.findings.is_empty())
  guard report.entries[0].entity is @dxfkit.Polyface(points~, faces~) else {
    fail("expected polyface")
  }
  assert_eq(points[2].z, 1.0)
  assert_eq(faces, [[1, -2, 3]])
  assert_true(
    doc.drawing.check({ tol: 0.01, min_gap: 0.0, }).has_incomplete_checks(),
  )
  for
    face in [
      "0\nVERTEX\n70\n128\n71\n1\n72\n-2\n73\n4\n", "0\nVERTEX\n70\n128\n71\n1\n72\n0\n73\n2\n74\n3\n",
    ] {
    let bad = r12_semantics_input(header + face + point_records + "0\nSEQEND\n").r12_semantics()
    assert_true(bad.entries.is_empty())
    assert_eq(bad.findings.length(), 1)
  }
  let unterminated = r12_semantics_input(header + good + point_records).r12_semantics()
  assert_false(unterminated.complete)
  assert_true(unterminated.entries.is_empty())
  assert_true(unterminated.findings[0].message.contains("SEQEND"))
}

///|
test "R12 ATTRIB links by tag and keeps its own OCS anchor" {
  let defn = "0\nBLOCK\n2\nLABEL\n10\n0\n20\n0\n0\nATTDEF\n2\nID\n1\nUnset\n3\nSerial\n10\n0\n20\n0\n40\n2\n0\nENDBLK\n"
  let insert = "0\nINSERT\n2\nLABEL\n66\n1\n10\n100\n20\n200\n"
  let attr = "0\nATTRIB\n2\nid\n1\nK-08\n10\n3\n20\n4\n30\n5\n40\n2\n72\n1\n11\n7\n21\n8\n31\n9\n210\n0\n220\n0\n230\n-1\n"
  let doc = r12_semantics_input(insert + attr + "0\nSEQEND\n", blocks=defn)
  let report = doc.r12_semantics()
  assert_true(report.complete)
  assert_true(report.findings.is_empty())
  guard report.entries[0].entity
    is @dxfkit.AttributeDefinition(data=def_data, block_record=Some(block)) else {
    fail("expected named attribute definition")
  }
  assert_eq(def_data.prompt, Some("Serial"))
  assert_eq(doc.records[block].kind, "BLOCK")
  guard report.entries[1].entity
    is @dxfkit.Attribute(
      data~,
      insert_record=Some(owner),
      definition=@dxfkit.Resolved(i),
    ) else {
    fail("expected linked attribute")
  }
  assert_eq(i, report.entries[0].record_index)
  assert_eq(doc.records[owner].kind, "INSERT")
  assert_eq(data.value, "K-08")
  assert_eq((data.anchor.x, data.anchor.y, data.anchor.z), (-3.0, 4.0, -5.0))
  guard data.alignment is Some(p) else { fail("expected alignment point") }
  assert_eq((p.x, p.y, p.z), (-7.0, 8.0, -9.0))
  let repeated = r12_semantics_input(
    insert + attr + attr + "0\nSEQEND\n",
    blocks=defn,
  ).r12_semantics()
  assert_eq(repeated.findings.length(), 1)
  assert_true(repeated.findings[0].message.contains("重复"))
  let orphan = r12_semantics_input(attr).r12_semantics()
  assert_false(orphan.complete)
  assert_true(
    orphan.entries[0].entity is @dxfkit.Attribute(insert_record=None, ..),
  )
}

///|
test "R12 DIMENSION links the picture block and validates definition points and styles" {
  let picture = "0\nBLOCK\n2\n*D7\n0\nENDBLK\n"
  let styles = "0\nTABLE\n2\nDIMSTYLE\n70\n1\n0\nDIMSTYLE\n2\nDRAFT\n0\nENDTAB\n"
  let dim = "0\nDIMENSION\n2\n*d7\n3\ndraft\n70\n1\n10\n9\n20\n8\n30\n7\n11\n2\n21\n3\n31\n4\n13\n0\n23\n1\n14\n5\n24\n1\n210\n0\n220\n0\n230\n-1\n"
  let doc = r12_semantics_input(dim, blocks=picture, tables=styles)
  let report = doc.r12_semantics()
  assert_true(report.findings.is_empty())
  assert_true(doc.audit_r12_fields().findings.is_empty())
  guard report.entries[0].entity is @dxfkit.Dimension(data) else {
    fail("expected dimension")
  }
  guard data.block is @dxfkit.Resolved(i) else {
    fail("expected picture block")
  }
  assert_eq(doc.records[i].kind, "BLOCK")
  assert_eq(data.style, "draft")
  assert_eq(
    (data.definition.x, data.definition.y, data.definition.z),
    (9.0, 8.0, 7.0),
  )
  assert_eq(
    (data.text_midpoint.x, data.text_midpoint.y, data.text_midpoint.z),
    (-2.0, 3.0, -4.0),
  )
  let bad = r12_semantics_input(
    dim,
    tables=styles.replace(old="DRAFT", new="OTHER"),
  )
  assert_true(
    bad.r12_semantics().entries[0].entity
    is @dxfkit.Dimension({ block: @dxfkit.Missing, .. }),
  )
  assert_true(
    bad.audit_r12_fields().findings[0].issue is @dxfkit.MissingTableEntry,
  )
  let ambiguous = r12_semantics_input(dim, blocks=picture + picture).r12_semantics()
  assert_true(
    ambiguous.entries[0].entity
    is @dxfkit.Dimension({ block: @dxfkit.Ambiguous, .. }),
  )
  let partial = r12_semantics_input(
    dim.replace(old="14\n5\n", new=""),
    blocks=picture,
  ).r12_semantics()
  assert_true(partial.entries.is_empty())
  assert_eq(partial.findings.length(), 1)
}

///|
test "R12 shape uses ECS and viewport parses ordered MVIEW XDATA" {
  let symbol = "0\nSHAPE\n2\nS1\n10\n2\n20\n3\n30\n4\n40\n5\n50\n45\n210\n0\n220\n0\n230\n-1\n"
  let viewport = "0\nVIEWPORT\n10\n3\n20\n5\n40\n80\n41\n30\n68\n2\n69\n3\n"
  let xdata = "1001\nOTHER\n1000\nMVIEW\n1001\nACAD\n1000\nMVIEW\n1002\n{\n1070\n16\n" +
    "1010\n1\n1020\n2\n1030\n3\n1010\n0\n1020\n0\n1030\n1\n" +
    "1040\n5\n1040\n100\n1040\n21\n1040\n22\n1040\n42\n1040\n2\n1040\n3\n" +
    "1070\n0\n1070\n1\n1070\n0\n1070\n2\n1070\n0\n1070\n1\n1070\n0\n1070\n0\n" +
    "1040\n0\n1040\n1\n1040\n2\n1040\n3\n1040\n4\n1040\n5\n1040\n6\n1070\n0\n" +
    "1002\n{\n1003\nHIDDEN\n1003\nOTHER\n1002\n}\n1002\n}\n"
  let report = r12_semantics_input(symbol + viewport + xdata).r12_semantics()
  assert_true(report.complete)
  assert_true(report.findings.is_empty())
  guard report.entries[0].entity is @dxfkit.Symbol(insertion~, rotation~, ..) else {
    fail("expected symbol")
  }
  assert_eq(
    (insertion.x, insertion.y, insertion.z, rotation),
    (-2.0, 3.0, -4.0, 45.0),
  )
  guard report.entries[1].entity
    is @dxfkit.Viewport(width~, id~, view=Some(view), ..) else {
    fail("expected viewport camera")
  }
  assert_eq(width, 80.0)
  assert_eq(id, 3)
  assert_eq((view.target.x, view.target.y, view.target.z), (1.0, 2.0, 3.0))
  assert_eq(
    (view.twist, view.height, view.center.x, view.center.y),
    (5.0, 100.0, 21.0, 22.0),
  )
  assert_eq((view.grid_spacing.x, view.grid_spacing.y), (5.0, 6.0))
  assert_eq(view.frozen_layers, ["HIDDEN", "OTHER"])
  let bad = r12_semantics_input(
    viewport + xdata.replace(old="1070\n16\n", new="1070\n17\n"),
  ).r12_semantics()
  assert_true(bad.entries.is_empty())
  assert_true(bad.findings[0].message.contains("版本"))
}

///|
test "R12 3DFACE keeps WCS and non-R12 semantics are not inferred" {
  let face = "0\n3DFACE\n10\n1\n20\n2\n30\n3\n11\n4\n21\n5\n31\n6\n12\n7\n22\n8\n32\n9\n70\n9\n"
  let doc = r12_semantics_input(face)
  guard doc.r12_semantics().entries[0].entity
    is @dxfkit.FaceEdges(corners~, invisible_mask~) else {
    fail("expected face edge metadata")
  }
  assert_eq(corners.length(), 4)
  assert_eq(corners[2].z, 9.0)
  assert_eq(corners[3].z, 9.0)
  assert_eq(invisible_mask, 9)
  let best_effort = @dxfkit.read_document(
    @utf8.encode("0\nSECTION\n2\nENTITIES\n" + face + "0\nENDSEC\n0\nEOF\n"),
  ).r12_semantics()
  assert_false(best_effort.complete)
  assert_true(best_effort.entries.is_empty())
}

///|
test "R12 XDATA audit resolves local hexadecimal handles and detects missing references" {
  let apps = "0\nTABLE\n2\nAPPID\n70\n1\n0\nAPPID\n2\nMYAPP\n0\nENDTAB\n"
  let line = "0\nLINE\n5\n00Af\n10\n0\n20\n0\n11\n1\n21\n0\n"
  let point = "0\nPOINT\n10\n1\n20\n2\n1001\nmyapp\n1005\nAF\n1005\n0\n1005\nB0\n"
  let findings = r12_semantics_input(line + point, tables=apps).audit_r12_fields().findings
  assert_eq(findings.length(), 1)
  assert_true(findings[0].issue is @dxfkit.MissingLocalHandle)
  let duplicate = r12_semantics_input(line + line + point, tables=apps).audit_r12_fields()
  assert_true(
    duplicate.findings.any(f => f.issue is @dxfkit.AmbiguousLocalHandle),
  )
  let unknown_app = r12_semantics_input(
    line + point,
    tables=apps.replace(old="MYAPP", new="OTHER"),
  )
  assert_true(
    unknown_app.audit_r12_fields().findings.any(f => {
      f.group == 1001 && f.issue is @dxfkit.MissingTableEntry
    }),
  )
}

///|
test "R12 block lookup ignores case but preserves the authored instance name" {
  let block = "0\nBLOCK\n2\nPlate\n10\n0\n20\n0\n0\nLINE\n10\n0\n20\n0\n11\n2\n21\n0\n0\nENDBLK\n"
  let insert = "0\nINSERT\n2\nPLATE\n10\n10\n20\n20\n"
  let doc = r12_semantics_input(insert, blocks=block)
  assert_true(doc.audit_r12_fields().findings.is_empty())
  let world = doc.drawing.expand_world(0.01)
  assert_eq(world.placed.length(), 1)
  assert_eq(world.placed[0].instances[0].block, "PLATE")
  guard world.placed[0].flat is @dxfkit.Outline3(points~, ..) else {
    fail("expected one transformed line")
  }
  assert_eq((points[1].x, points[1].y), (12.0, 20.0))
  let ambiguous = r12_semantics_input(
    insert,
    blocks=block + block.replace(old="Plate", new="plate"),
  )
  assert_true(
    ambiguous.audit_r12_fields().findings.any(f => {
      f.issue is @dxfkit.AmbiguousBlock
    }),
  )
  assert_true(ambiguous.drawing.expand_world(0.01).placed.is_empty())
}
