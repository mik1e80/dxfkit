///|
fn main raise {
  println(
    "entities,input_bytes,read_ms,expand_ms,check_ms,svg_ms,placed,svg_bytes,incomplete",
  )
  for count in [1000, 10000, 100000] {
    let input = StringBuilder()
    input.write_string("0\nSECTION\n2\nENTITIES\n")
    for n in 0..<count {
      let x = n * 2
      input.write_string("0\nLINE\n10\n\{x}\n20\n0\n11\n\{x + 1}\n21\n0\n")
    }
    input.write_string("0\nENDSEC\n0\nEOF\n")
    let bytes = @utf8.encode(input.to_string())
    let start = @async.now()
    let d = @dxfkit.read_document(bytes).drawing
    let read_done = @async.now()
    let exp = d.expand(0.01)
    let expand_done = @async.now()
    let report = d.check({ tol: 0.01, min_gap: 0.0, })
    let check_done = @async.now()
    let svg = d.to_svg(0.01)
    let svg_done = @async.now()
    assert_eq(exp.placed.length(), count.min(10000))
    assert_eq(report.has_incomplete_checks(), count > 10000)
    println(
      "\{count},\{bytes.length()},\{read_done - start},\{expand_done - read_done},\{check_done - expand_done},\{svg_done - check_done},\{exp.placed.length()},\{@utf8.encode(svg).length()},\{report.has_incomplete_checks()}",
    )
  }
}
