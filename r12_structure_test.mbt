///|
fn r12_structure_document(
  section : String,
  body : String,
) -> @dxfkit.ReadDocument {
  @dxfkit.read_document(
    @utf8.encode(
      "0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n0\nENDSEC\n0\nSECTION\n2\n" +
      section +
      "\n" +
      body +
      "0\nENDSEC\n0\nEOF\n",
    ),
  )
}

///|
test "R12 orphan VERTEX is preserved and diagnosed" {
  let doc = r12_structure_document("ENTITIES", "0\nVERTEX\n10\n1\n20\n2\n")
  assert_true(doc.records.any(r => r.kind == "VERTEX"))
  assert_true(
    doc.read_warnings.any(w => w.contains("VERTEX") && w.contains("POLYLINE")),
  )
}

///|
test "R12 orphan ATTRIB is preserved and diagnosed" {
  let doc = r12_structure_document(
    "ENTITIES", "0\nATTRIB\n1\nA\n10\n1\n20\n2\n",
  )
  assert_true(doc.records.any(r => r.kind == "ATTRIB"))
  assert_true(
    doc.read_warnings.any(w => w.contains("ATTRIB") && w.contains("INSERT")),
  )
}

///|
test "R12 unfinished polyline cannot absorb an unrelated entity and late SEQEND" {
  let doc = r12_structure_document(
    "ENTITIES", "0\nPOLYLINE\n66\n1\n0\nVERTEX\n10\n0\n20\n0\n0\nLINE\n10\n0\n20\n0\n11\n1\n21\n0\n0\nSEQEND\n",
  )
  assert_true(
    doc.read_warnings.any(w => w.contains("POLYLINE") && w.contains("SEQEND")),
  )
}

///|
test "R12 TABLE and BLOCK controls must belong to their sections" {
  for body in ["0\nTABLE\n2\nLAYER\n0\nENDTAB\n", "0\nBLOCK\n2\nB\n0\nENDBLK\n"] {
    let doc = r12_structure_document("ENTITIES", body)
    assert_true(doc.read_warnings.any(w => w.contains("所在段")))
  }
}

///|
test "R12 table rows and block entities require enclosing records" {
  let table = r12_structure_document("TABLES", "0\nLAYER\n2\nCUT\n70\n0\n")
  assert_true(table.read_warnings.any(w => w.contains("TABLE")))
  let block = r12_structure_document(
    "BLOCKS", "0\nLINE\n10\n0\n20\n0\n11\n1\n21\n0\n",
  )
  assert_true(block.read_warnings.any(w => w.contains("BLOCK")))
}

///|
test "R12 valid polyline and linked attribute sequences have no structural warning" {
  let doc = r12_structure_document(
    "ENTITIES",
    "0\nPOLYLINE\n66\n1\n0\nVERTEX\n10\n0\n20\n0\n0\nVERTEX\n10\n1\n20\n1\n0\nSEQEND\n" +
    "0\nINSERT\n2\nB\n66\n1\n10\n0\n20\n0\n0\nATTRIB\n1\nA\n10\n1\n20\n2\n0\nSEQEND\n",
  )
  assert_eq(doc.read_warnings.length(), 0)
  // Missing referenced block is an expansion issue, separate from record structure.
  assert_true(
    doc.drawing.expand_world(0.01).warnings.any(w => {
      w.contains("不存在的块")
    }),
  )
}
