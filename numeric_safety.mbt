///|
fn scaled_hypot(x : Double, y : Double) -> Double {
  let m = x.abs().max(y.abs())
  if m == 0.0 || !finite_number(m) {
    return m
  }
  let a = x / m
  let b = y / m
  m * (a * a + b * b).sqrt()
}

///|
/// Conservative domain for current products/projections. Outside this domain
/// XYZ may be retained but no complete XY-check or SVG claim is made.
fn safe_xy(p : Vec2) -> Bool {
  finite_number(p.x) &&
  finite_number(p.y) &&
  safe_scalar(p.x) &&
  safe_scalar(p.y)
}

///|
fn safe_scalar(x : Double) -> Bool {
  x == 0.0 || (x.abs() >= 1.0e-100 && x.abs() <= 1.0e100)
}

///|
fn preview_range_ok(exp : Expansion) -> Bool {
  let mut count = 0
  let mut text = 0
  for placed in exp.placed {
    match placed.flat {
      Outline(points~, ..) => {
        count += points.length()
        if !points.all(safe_xy) {
          return false
        }
      }
      Dot(at~) => if !safe_xy(at) { return false }
      Label(at~, height~, value~) => {
        text += value.length()
        if !safe_xy(at) || !finite_number(height) || !safe_scalar(height) {
          return false
        }
      }
      Empty => ()
    }
    if count > 200000 || text > 65536 {
      return false
    }
  }
  true
}
