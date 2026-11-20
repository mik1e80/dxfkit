///|
test "SVG byte cap returns an explicit error without partial output" {
  let doc = @dxfkit.read_document(
    @utf8.encode(
      "0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1021\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n0\nTEXT\n10\n0\n20\n0\n40\n2\n1\n中文<&\n0\nENDSEC\n0\nEOF\n",
    ),
  )
  let svg = doc.drawing.to_svg(0.01)
  assert_true(svg.contains("中文&lt;&amp;"))
  let bytes = @utf8.encode(svg).length()
  assert_true(
    doc.drawing.svg_with_limit(0.01, bytes - 1) is Err(@dxfkit.SvgByteLimit),
  )
  match doc.drawing.svg_with_limit(0.01, bytes) {
    Ok(actual) => assert_eq(actual, svg)
    Err(_) => fail("exact UTF-8 byte cap must succeed")
  }
}

///|
test "R12 audit locates missing and repeated fields and unresolved blocks" {
  let header = b"0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n0\nENDSEC\n"
  let doc = @dxfkit.read_document(
    header +
    b"0\nSECTION\n2\nENTITIES\n0\nARC\n10\n0\n20\n0\n40\n2\n50\n0\n50\n1\n0\nINSERT\n2\nMissing\n10\n1\n20\n2\n0\nENDSEC\n0\nEOF\n",
  )
  let audit = doc.audit_r12_fields()
  assert_true(audit.complete)
  assert_eq(audit.findings.length(), 3)
  assert_true(audit.findings[0].issue is @dxfkit.RepeatedField)
  assert_eq(audit.findings[0].group, 50)
  assert_true(audit.findings[1].issue is @dxfkit.MissingField)
  assert_eq(audit.findings[1].group, 51)
  assert_true(audit.findings[2].issue is @dxfkit.MissingBlock)
  let valid = @dxfkit.read_document(
    header +
    b"0\nSECTION\n2\nENTITIES\n0\nARC\n10\n0\n20\n0\n40\n2\n50\n0\n51\n90\n0\nENDSEC\n0\nEOF\n",
  )
  assert_true(valid.audit_r12_fields().complete)
  assert_eq(valid.audit_r12_fields().findings.length(), 0)
}

///|
test "R12 audit checks explicit references in declared symbol tables" {
  let doc = @dxfkit.read_document(
    b"0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n0\nENDSEC\n" +
    b"0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n0\nLAYER\n2\nCUT\n0\nENDTAB\n0\nENDSEC\n" +
    b"0\nSECTION\n2\nENTITIES\n" +
    b"0\nLINE\n8\ncut\n10\n0\n20\n0\n11\n1\n21\n0\n" +
    b"0\nLINE\n8\nMISSING\n10\n0\n20\n1\n11\n1\n21\n1\n0\nENDSEC\n0\nEOF\n",
  )
  let result = doc.audit_r12_fields()
  assert_true(result.complete)
  assert_eq(result.findings.length(), 1)
  assert_true(result.findings[0].issue is @dxfkit.MissingTableEntry)
  assert_eq(result.findings[0].group, 8)
}

///|
test "independent plane tolerance does not weaken comparison tolerance" {
  let d = @dxfkit.read_document(
      b"0\nSECTION\n2\nENTITIES\n0\nLINE\n10\n0\n20\n0\n30\n0.1\n11\n1\n21\n0\n31\n0.1\n0\nENDSEC\n0\nEOF\n",
    ).drawing
  let tolerances : @dxfkit.CheckTolerances = {
    curve: 0.01,
    plane: 0.001,
    comparison: 0.01,
  }
  let rejected = d.check_with_tolerances(tolerances, 0.0)
  assert_true(rejected.status() is @dxfkit.Incomplete)
  let accepted = d.check_with_tolerances({ ..tolerances, plane: 0.2, }, 0.0)
  assert_true(accepted.status() is @dxfkit.CompleteWithFindings)
  assert_true(
    accepted.findings.any(f => f.diagnostic().code is @dxfkit.OpenContour),
  )
}

///|
test "seeded numeric mutations cannot turn damaged fields into normal geometry" {
  let mut seed = 101
  for _ in 0..<40 {
    seed = (seed * 31 + 17) % 65521
    let invalid = [b"1\xFF2", b"1\x002", b"NaN", b"Inf", b"1e999"][seed % 5]
    let doc = @dxfkit.read_document(
      b"0\nSECTION\n2\nENTITIES\n0\nCIRCLE\n10\n0\n20\n0\n40\n" +
      invalid +
      b"\n0\nENDSEC\n0\nEOF\n",
    )
    assert_eq(doc.scan.warnings.length(), 1)
    assert_true(doc.read_status() is @dxfkit.ReadWithWarnings)
    assert_true(doc.diagnostics().any(w => w.code is @dxfkit.ScanWarning))
    assert_false(doc.drawing.entities().entities[0].is_decoded())
    assert_true(
      doc.drawing.check({ tol: 0.01, min_gap: 0.0, }).status()
      is @dxfkit.Incomplete,
    )
  }
}

///|
test "vertical endpoint sweep skips pairs outside tolerance" {
  let body = StringBuilder()
  body.write_string("0\nSECTION\n2\nENTITIES\n")
  for i in 0..<30 {
    body.write_string("0\nLINE\n10\n0\n20\n\{i}\n11\n0\n21\n\{i + 1}\n")
  }
  body.write_string("0\nENDSEC\n0\nEOF\n")
  let d = @dxfkit.read_document(@utf8.encode(body.to_string())).drawing
  // Use a small budget just for topology in the white-box case below; the
  // public integration should still report the two ends as one open chain.
  let report = d.check({ tol: 0.001, min_gap: 0.0, })
  assert_true(report.status() is @dxfkit.CompleteWithFindings)
  assert_true(
    report.findings.any(f => f.diagnostic().code is @dxfkit.OpenContour),
  )
}
