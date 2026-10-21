///|
test "unsupported INSERT OCS is not expanded into misleading XY geometry" {
  let d = drawing_with_insert(
    "0\nCIRCLE\n10\n0\n20\n0\n40\n5\n", "5\nAB\n8\nCUT\n10\n0\n20\n0\n210\n0\n220\n1\n230\n0\n",
  )
  let expanded = d.expand(0.05)
  assert_eq(expanded.placed.length(), 0)
  assert_true(expanded.warnings.any(w => w.contains("OCS") && w.contains("AB")))
  assert_true(d.check({ tol: 0.05, min_gap: 0.0, }).count(Warn) > 0)
}

///|
test "nested unsupported INSERT OCS is reported while supported siblings survive" {
  let d = drawing_with_insert(
    "0\nINSERT\n2\n销\n5\nCD\n10\n0\n20\n0\n210\n0\n220\n0\n230\n-1\n0\nCIRCLE\n10\n0\n20\n0\n40\n2\n",
    "10\n0\n20\n0\n",
  )
  let expanded = d.expand(0.05)
  assert_eq(expanded.placed.length(), 1)
  assert_true(expanded.warnings.any(w => w.contains("OCS") && w.contains("CD")))
}
