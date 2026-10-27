///|
test "R12 public read API retains HEADER TABLES BLOCKS ENTITIES and unknown fields" {
  let source = @utf8.encode(
    "999\ncomment\n0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n9\n$LTSCALE\n40\n2\n0\nENDSEC\n0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n70\n0\n0\nENDTAB\n0\nENDSEC\n0\nSECTION\n2\nBLOCKS\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n0\nSHAPE\n5\nS1\n2\ncustom\n1001\nAPP\n1040\n12.5\n0\nENDSEC\n0\nEOF\nTRAILING BYTES",
  )
  let doc = @dxfkit.read_document(source)
  assert_true(doc.profile is @dxfkit.R12)
  assert_eq(doc.source, source)
  assert_true(
    doc.records.any(r => r.kind == "SHAPE" && r.tags.any(t => t.code == 1040)),
  )
  assert_true(doc.records.any(r => r.kind == "EOF"))
  // DXF comments before SECTION are legal and remain in the ordered raw stream.
  assert_eq(doc.read_warnings.length(), 0)
  assert_true(
    doc.drawing.check({ tol: 0.01, min_gap: 0.0, }).has_incomplete_checks(),
  )
}

///|
test "R12 read status and geometry coverage are independent" {
  let doc = @dxfkit.read_document(
    @utf8.encode(
      "0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n0\nSHAPE\n2\nfoo\n0\nENDSEC\n0\nEOF\n",
    ),
  )
  assert_true(doc.profile is @dxfkit.R12)
  assert_eq(doc.read_warnings.length(), 0)
  assert_true(
    doc.drawing.check({ tol: 0.01, min_gap: 0.0, }).has_incomplete_checks(),
  )
}

///|
test "R12 missing ENDBLK ENDTAB SEQEND EOF are read warnings" {
  for
    body in ["0\nTABLE\n2\nLAYER\n", "0\nBLOCK\n2\nB\n", "0\nPOLYLINE\n66\n1\n"] {
    let doc = @dxfkit.read_document(
      @utf8.encode("0\nSECTION\n2\nENTITIES\n" + body + "0\nENDSEC\n"),
    )
    assert_true(doc.read_warnings.length() >= 2)
  }
}

///|
test "non R12 versions select best effort without claiming conformance" {
  let doc = @dxfkit.read_document(
    @utf8.encode(
      "0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1032\n0\nENDSEC\n0\nEOF\n",
    ),
  )
  assert_true(doc.profile is @dxfkit.BestEffort)
  assert_true(doc.read_warnings.any(w => w.contains("尽力读取")))
}

///|
test "R12 public OCS and world expansion are callable by consumers" {
  match @dxfkit.Ocs::from_extrusion(@dxfkit.Vec3::new(0.0, 0.0, -1.0)) {
    Ok(o) => assert_eq(o.to_wcs(@dxfkit.Vec3::new(2.0, 3.0, 4.0)).x, -2.0)
    Err(msg) => fail(msg)
  }
  let doc = @dxfkit.read_document(
    @utf8.encode(
      "0\nSECTION\n2\nENTITIES\n0\nPOINT\n10\n2\n20\n3\n30\n4\n0\nENDSEC\n0\nEOF\n",
    ),
  )
  let world = doc.drawing.expand_world(0.01)
  match world.placed[0].flat {
    @dxfkit.Dot3(at~) => assert_eq(at.z, 4.0)
    _ => fail("XYZ was not retained")
  }
}
