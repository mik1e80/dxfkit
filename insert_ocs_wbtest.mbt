///|
test "tilted INSERT OCS retains XYZ and cannot produce misleading XY geometry" {
  let d = drawing_with_insert(
    "0\nCIRCLE\n10\n0\n20\n0\n40\n5\n", "5\nAB\n8\nCUT\n10\n0\n20\n0\n210\n0\n220\n1\n230\n0\n",
  )
  let expanded = d.expand(0.05)
  assert_eq(expanded.placed.length(), 1)
  assert_true(expanded.placed[0].flat is Empty)
  assert_true(
    expanded.warnings.any(w => w.contains("已转换 WCS") && w.contains("AB")),
  )
  let world = d.expand_world(0.05)
  assert_eq(world.warnings.length(), 0)
  match world.placed[0].flat {
    Outline3(points~, ..) =>
      for p in points {
        assert_true(p.y.abs() < 1.0e-9)
      }
    _ => fail("XYZ circle expected")
  }
  assert_true(d.check({ tol: 0.05, min_gap: 0.0, }).count(Warn) > 0)
}

///|
test "nested cyclic INSERT remains diagnosed after OCS conversion" {
  let d = drawing_with_insert(
    "0\nINSERT\n2\n销\n5\nCD\n10\n0\n20\n0\n210\n0\n220\n0\n230\n-1\n0\nCIRCLE\n10\n0\n20\n0\n40\n2\n",
    "10\n0\n20\n0\n",
  )
  let expanded = d.expand(0.05)
  assert_eq(expanded.placed.length(), 1)
  assert_true(
    expanded.warnings.any(w => w.contains("循环引用") && w.contains("CD")),
  )
}
