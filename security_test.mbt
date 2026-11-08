///|
test "public read budget cannot produce a complete Drawing report" {
  let limits = { ..@dxfkit.ReadLimits::default(), max_tags: 2, }
  let doc = @dxfkit.read_document_with_limits(
    b"0\nSECTION\n2\nENTITIES\n0\nENDSEC\n0\nEOF\n", limits,
  )
  assert_true(doc.read_warnings.any(w => w.contains("资源上限")))
  assert_true(
    doc.drawing.check({ tol: 0.01, min_gap: 0.0, }).has_incomplete_checks(),
  )
  let stream = @dxfkit.TagStream::with_limits(limits)
  stream.feed(b"0\nSECTION\n2\nENTITIES\n0\nENDSEC\n0\nEOF\n") |> ignore
  stream.finish() |> ignore
  assert_true(stream.is_limited())
}

///|
test "public strict numeric readers preserve missing versus malformed" {
  let r : @dxfkit.Record = {
    kind: "CIRCLE",
    common: [@dxfkit.Tag::new(40, @dxfkit.Str("bad"))],
    subclasses: [],
  }
  assert_true(r.try_double(10) is Ok(None))
  assert_true(r.require_double(10) is Err(_))
  assert_true(r.require_double(40) is Err(_))
  assert_true(r.try_int(70) is Ok(None))
}
