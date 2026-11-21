///|
/// Ordered ACAD/MVIEW v16 data from a paper-space viewport. The camera and
/// editor settings are exposed without projecting model-space geometry.
pub(all) struct R12ViewportView {
  target : Vec3
  direction : Vec3
  twist : Double
  height : Double
  center : Vec2
  lens_length : Double
  front_clip_z : Double
  back_clip_z : Double
  mode : Int
  circle_zoom : Int
  fast_zoom : Int
  ucs_icon : Int
  snap_on : Int
  grid_on : Int
  snap_style : Int
  snap_iso_pair : Int
  snap_angle : Double
  snap_base : Vec2
  snap_spacing : Vec2
  grid_spacing : Vec2
  hide_plot : Int
  frozen_layers : Array[String]
}

///|
fn r12_viewport_view(r : RawRecord) -> R12ViewportView? raise R12SemanticError {
  let mut start = -1
  for i, t in r.tags {
    if t.code == 1001 &&
      t.value is Str("ACAD") &&
      i + 1 < r.tags.length() &&
      r.tags[i + 1].code == 1000 &&
      r.tags[i + 1].value is Str("MVIEW") {
      guard start == -1 else {
        raise InvalidSemantic("VIEWPORT 含多个 ACAD/MVIEW 记录")
      }
      start = i + 2
    }
  }
  if start == -1 {
    return None
  }
  let codes = [
    1002, 1070, 1010, 1020, 1030, 1010, 1020, 1030, 1040, 1040, 1040, 1040, 1040,
    1040, 1040, 1070, 1070, 1070, 1070, 1070, 1070, 1070, 1070, 1040, 1040, 1040,
    1040, 1040, 1040, 1040, 1070, 1002,
  ]
  let numbers : Array[Double] = Array::make(codes.length(), 0.0)
  let integers : Array[Int] = Array::make(codes.length(), 0)
  guard start + codes.length() <= r.tags.length() else {
    raise InvalidSemantic("VIEWPORT 的 MVIEW 描述符被截断")
  }
  for i, code in codes {
    let t = r.tags[start + i]
    guard t.code == code else {
      raise InvalidSemantic("VIEWPORT 的 MVIEW 描述符组码顺序错误")
    }
    match t.value {
      F64(v) if code >= 1010 && code <= 1040 && finite_number(v) =>
        numbers[i] = v
      I16(v) if code == 1070 => integers[i] = v
      Str("{") if code == 1002 => ()
      _ => raise InvalidSemantic("VIEWPORT 的 MVIEW 描述符值无效")
    }
  }
  guard integers[1] == 16 else {
    raise InvalidSemantic("VIEWPORT 的 MVIEW 版本不是 16")
  }
  let mut index = start + codes.length()
  let frozen_layers : Array[String] = []
  while index < r.tags.length() && r.tags[index].code == 1003 {
    guard r.tags[index].value is Str(layer) && layer != "" else {
      raise InvalidSemantic("VIEWPORT 的 MVIEW 冻结图层名称无效")
    }
    frozen_layers.push(layer)
    index += 1
  }
  for i in index..<(index + 2) {
    guard i < r.tags.length() &&
      r.tags[i].code == 1002 &&
      r.tags[i].value is Str("}") else {
      raise InvalidSemantic("VIEWPORT 的 MVIEW 描述符缺少结束括号")
    }
  }
  let direction = Vec3::new(numbers[5], numbers[6], numbers[7])
  guard (direction.x != 0.0 || direction.y != 0.0 || direction.z != 0.0) &&
    numbers[9] > 0.0 else {
    raise InvalidSemantic("VIEWPORT 的 MVIEW 视向或视高无效")
  }
  Some({
    target: Vec3::new(numbers[2], numbers[3], numbers[4]),
    direction,
    twist: numbers[8],
    height: numbers[9],
    center: Vec2::new(numbers[10], numbers[11]),
    lens_length: numbers[12],
    front_clip_z: numbers[13],
    back_clip_z: numbers[14],
    mode: integers[15],
    circle_zoom: integers[16],
    fast_zoom: integers[17],
    ucs_icon: integers[18],
    snap_on: integers[19],
    grid_on: integers[20],
    snap_style: integers[21],
    snap_iso_pair: integers[22],
    snap_angle: numbers[23],
    snap_base: Vec2::new(numbers[24], numbers[25]),
    snap_spacing: Vec2::new(numbers[26], numbers[27]),
    grid_spacing: Vec2::new(numbers[28], numbers[29]),
    hide_plot: integers[30],
    frozen_layers,
  })
}
