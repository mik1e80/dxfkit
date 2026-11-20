///|
test "vertical endpoint topology finishes within its candidate budget" {
  let edges = Array::makei(100, i => {
    (Vec2::new(0.0, i.to_double()), Vec2::new(0.0, (i + 1).to_double()))
  })
  let work : CheckWork = { remaining: 100, stopped: false, }
  let (chains, gap, _, branched) = endpoint_topology(edges, 0.001, work)
  assert_false(work.stopped)
  assert_eq(work.remaining, 1)
  assert_eq(chains, 1)
  assert_eq(gap, 100.0)
  assert_false(branched)
}
