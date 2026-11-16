///|
test "one malformed vertex sequence cannot flood decode diagnostics" {
  for kind in ["LWPOLYLINE", "SPLINE", "POLYLINE"] {
    let body = StringBuilder()
    body.write_string("0\n\{kind}\n")
    if kind == "SPLINE" {
      body.write_string("71\n3\n")
    }
    for _ in 0..<1500 {
      if kind == "POLYLINE" {
        body.write_string("0\nVERTEX\n")
      }
      body.write_string("20\n1\n")
    }
    if kind == "POLYLINE" {
      body.write_string("0\nSEQEND\n")
    }
    let source = @utf8.encode(
      "0\nSECTION\n2\nENTITIES\n" + body.to_string() + "0\nENDSEC\n0\nEOF\n",
    )
    let doc = @dxfkit.read_document(source)
    let decoded = doc.drawing.entities()
    assert_eq(decoded.entities.length(), 1)
    assert_false(decoded.entities[0].is_decoded())
    assert_true(decoded.warnings.length() <= 1000)
    assert_true(
      decoded.warnings.any(w => w.contains("诊断达到资源上限")),
    )
    assert_eq(doc.source, source)
    let report = doc.drawing.check({ tol: 0.01, min_gap: 0.0, })
    assert_true(report.has_incomplete_checks())
    assert_true(report.to_text().contains("资源上限"))
  }
}

///|
test "unmatched section endings cannot flood structure diagnostics" {
  let body = StringBuilder()
  for _ in 0..<1500 {
    body.write_string("0\nENDSEC\n")
  }
  body.write_string("0\nEOF\n")
  let source = @utf8.encode(body.to_string())
  let doc = @dxfkit.read_document(source)
  assert_eq(doc.source, source)
  assert_eq(doc.records.length(), 1501)
  assert_true(doc.drawing.warnings.length() <= 1003)
  assert_true(doc.drawing.warnings.any(w => w.contains("资源上限")))
  assert_true(
    doc.drawing.check({ tol: 0.01, min_gap: 0.0, }).has_incomplete_checks(),
  )
}
