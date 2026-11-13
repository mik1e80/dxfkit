///|
test "AC1009 ANSI936 fallback remains visible with original bytes preserved" {
  // GBK D6 D0 CE C4 is Chinese text. This core-only build deliberately does
  // not claim GBK decoding; fallback must never imply a complete text result.
  let source = b"0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n9\n$DWGCODEPAGE\n3\nANSI_936\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n0\nTEXT\n10\n0\n20\n0\n40\n2\n1\n" +
    b"\xD6\xD0\xCE\xC4" +
    b"\n0\nENDSEC\n0\nEOF\n"
  let doc = @dxfkit.read_document(source)
  assert_eq(doc.source, source)
  assert_true(doc.scan.encoding is @dxfkit.Other(936))
  assert_true(doc.read_warnings.any(w => w.contains("Latin-1")))
  assert_true(
    doc.drawing.check({ tol: 0.01, min_gap: 0.0, }).has_incomplete_checks(),
  )
  let entities = doc.drawing.entities().entities
  match entities[0].geom {
    @dxfkit.Text(value~, ..) => assert_eq(value, "ÖÐÎÄ")
    _ => fail("text fields must remain accessible with a fallback warning")
  }
}

///|
test "modern version uses UTF8 despite stale ANSI936 declaration" {
  let source = b"0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1021\n9\n$DWGCODEPAGE\n3\nANSI_936\n0\nENDSEC\n0\nEOF\n"
  let scan = @dxfkit.scan_tags(source)
  assert_true(scan.encoding is @dxfkit.Utf8)
  assert_false(scan.warnings.any(w => w.contains("Latin-1")))
}
