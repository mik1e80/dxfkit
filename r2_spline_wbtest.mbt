///|
fn r2_cubic(degree : Int?) -> Drawing {
  let tag = match degree {
    Some(value) => "71\n\{value}\n"
    None => ""
  }
  advisor_draw("0\nSPLINE\n70\n0\n" + tag + "72\n8\n73\n4\n40\n0\n40\n0\n40\n0\n40\n0\n40\n1\n40\n1\n40\n1\n40\n1\n10\n0\n20\n0\n10\n0\n20\n1\n10\n1\n20\n-1\n10\n1\n20\n0\n")
}

///|
test "r2 missing SPLINE degree is not guessed as cubic" {
  let d = r2_cubic(None)
  assert_true(d.entities().entities[0].common.record.get(71) is None)
  assert_true(d.entities().entities[0].geom is Unknown)
  let report = d.check({tol: 0.002, min_gap: 0.0})
  assert_true(report.has_incomplete_checks())
  assert_true(report.to_text().contains("缺少次数（71）"))
  assert_false(report.to_text().contains("轮廓闭合"))
  assert_false(d.to_svg(0.002).contains("<polyline"))
}

///|
test "r2 explicit cubic degree retains analytic curve" {
  let d = r2_cubic(Some(3))
  assert_false(d.check({tol: 0.002, min_gap: 0.0}).has_incomplete_checks())
  match d.entities().entities[0].flatten_checked(0.002) {
    Ok(Outline(points~, closed~)) => {
      assert_false(closed)
      accuracy_sample_error(points, false, t => Vec2::new(3.0*t*t-2.0*t*t*t,3.0*t*(1.0-t)*(1.0-2.0*t)), 0.002)
    }
    _ => fail("expected a checked cubic outline")
  }
}

///|
test "r2 explicit out of range degree fails checked geometry" {
  for degree in [0, 33] {
    let d = r2_cubic(Some(degree))
    assert_true(d.entities().entities[0].geom is Spline(..))
    assert_true(d.entities().entities[0].flatten_checked(0.002) is Err(_))
    assert_true(d.check({tol: 0.002, min_gap: 0.0}).has_incomplete_checks())
  }
}
