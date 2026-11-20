///|
test "AC1009 ANSI936 decodes text layer and insert names and preserves source" {
  let chinese = b"\xD6\xD0\xCE\xC4"
  let source = legacy_header(b"ANSI_936") +
    b"0\nSECTION\n2\nBLOCKS\n0\nBLOCK\n2\n" +
    chinese +
    b"\n10\n0\n20\n0\n0\nLINE\n10\n0\n20\n0\n11\n1\n21\n0\n0\nENDBLK\n0\nENDSEC\n" +
    b"0\nSECTION\n2\nENTITIES\n0\nTEXT\n10\n0\n20\n0\n40\n2\n8\n" +
    chinese +
    b"\n1\n" +
    chinese +
    b"\n0\nINSERT\n2\n" +
    chinese +
    b"\n10\n0\n20\n0\n0\nENDSEC\n0\nEOF\n"
  let doc = @dxfkit.read_document(source)
  assert_eq(doc.source, source)
  assert_true(doc.scan.encoding is @dxfkit.Other(936))
  assert_eq(doc.read_warnings.length(), 0)
  let entities = doc.drawing.entities().entities
  assert_eq(entities[0].layer(), "中文")
  match entities[0].geom {
    @dxfkit.Text(value~, ..) => assert_eq(value, "中文")
    _ => fail("expected decoded text")
  }
  match entities[1].geom {
    @dxfkit.Insert(block~, ..) => assert_eq(block, "中文")
    _ => fail("expected decoded INSERT")
  }
  assert_eq(doc.drawing.expand_world(0.01).warnings.length(), 0)
}

///|
fn legacy_header(page : Bytes) -> Bytes {
  b"0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n9\n$DWGCODEPAGE\n3\n" +
  page +
  b"\n0\nENDSEC\n"
}

///|
test "malformed legacy code units and fallback stay visible" {
  let body = b"0\nSECTION\n2\nENTITIES\n0\nTEXT\n10\n0\n20\n0\n40\n2\n1\n\x81\x3C\n0\nENDSEC\n0\nEOF\n"
  let doc = @dxfkit.read_document(legacy_header(b"ANSI_936") + body)
  assert_true(
    doc.read_warnings.any(w => w.contains("ANSI_936 字节序列无效")),
  )
  assert_eq(@dxfkit.decode_text(b"\x81\x3C", @dxfkit.Other(936)), "�<")
  let source = legacy_header(b"ANSI_932") + body
  let fallback = @dxfkit.read_document(source)
  assert_true(fallback.read_warnings.any(w => w.contains("Latin-1")))
  let decoded = @dxfkit.read_document_with_legacy_decoder(
    source,
    @dxfkit.ReadLimits::default(),
    (page, bytes) => {
      if page != 932 {
        return None
      }
      if bytes == b"\x81\x3C" {
        Some("外部解码")
      } else {
        Some(@utf8.decode_lossy(bytes))
      }
    },
  )
  assert_eq(decoded.read_warnings.length(), 0)
  match decoded.drawing.entities().entities[0].geom {
    @dxfkit.Text(value~, ..) => assert_eq(value, "外部解码")
    _ => fail("expected callback text")
  }
}

///|
test "modern version uses UTF8 despite stale ANSI936 declaration" {
  let source = b"0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1021\n9\n$DWGCODEPAGE\n3\nANSI_936\n0\nENDSEC\n0\nEOF\n"
  let scan = @dxfkit.scan_tags(source)
  assert_true(scan.encoding is @dxfkit.Utf8)
  assert_false(scan.warnings.any(w => w.contains("Latin-1")))
}

///|
test "encoding declarations must be HEADER group pairs; UTF8 BOM is accepted" {
  let source = b"999\n$ACADVER\n1\nAC1021\n" +
    legacy_header(b"ANSI_936") +
    b"0\nEOF\n"
  assert_true(@dxfkit.decide_encoding(source) is @dxfkit.Other(936))
  let bom = @dxfkit.scan_tags(b"\xEF\xBB\xBF0\nEOF\n")
  assert_true(bom.encoding is @dxfkit.Utf8)
  assert_eq(bom.warnings.length(), 0)
  assert_eq(bom.tags.length(), 1)
}
