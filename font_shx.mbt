///|
/// Decoder for legacy AutoCAD-86 shapes 1.0/1.1 stroke fonts.
pub struct R12ShxFont {
  priv symbols : Map[Int, FontBytes]
  priv above : Double
  priv below : Double
  priv unicode : Bool
}

///|
pub fn load_r12_shx(data : Bytes) -> Result[R12ShxFont, String] {
  Ok(shx_load(font_input(data))) catch {
    InvalidFont(msg) => Err(msg)
  }
}

///|
fn shx_after_name(record : FontBytes) -> Int raise FontError {
  for i in 0..<record.size {
    if record.u8(i) == 0 {
      return i + 1
    }
  }
  raise InvalidFont("SHX 记录缺少名称终止字节")
}

///|
fn shx_load(file : FontBytes) -> R12ShxFont raise FontError {
  if file.ascii_at(0, "AutoCAD-86 unifont 1.0") {
    return shx_unicode(file)
  }
  guard (
      file.ascii_at(0, "AutoCAD-86 shapes 1.0") ||
      file.ascii_at(0, "AutoCAD-86 shapes 1.1")
    ) &&
    file.u8(23) == 26 else {
    raise InvalidFont("仅支持 SHX shapes 1.0/1.1")
  }
  let first = file.le16(24)
  let last = file.le16(26)
  let count = file.le16(28)
  guard count > 0 && count <= 8192 else {
    raise InvalidFont("SHX 索引数量无效")
  }
  let mut offset = 30 + 4 * count
  let symbols : Map[Int, FontBytes] = Map([])
  for i in 0..<count {
    let code = file.le16(30 + 4 * i)
    let size = file.le16(32 + 4 * i)
    guard !symbols.contains(code) &&
      (i != 0 || code == first) &&
      (i != count - 1 || code == last) else {
      raise InvalidFont("SHX 索引重复或范围不符")
    }
    let record = file.region(offset, size)
    let begin = shx_after_name(record)
    symbols[code] = record.region(begin, size - begin)
    offset += size
  }
  guard file.ascii_at(offset, "EOF") && symbols.get(0) is Some(info) else {
    raise InvalidFont("SHX 缺少字体度量或 EOF")
  }
  let above = info.u8(0).to_double()
  guard above > 0.0 else { raise InvalidFont("SHX 基准字高为零") }
  { symbols, above, below: info.u8(1).to_double(), unicode: false, }
}

///|
priv struct ShxPen {
  paths : Array[Array[Vec2]]
  marks : Array[Vec2]
  mut path : Array[Vec2]?
  mut at : Vec2
  mut scale : Double
  mut drawing : Bool
  budget : FontBudget
}

///|
fn ShxPen::plot(self : ShxPen, point : Vec2) -> Unit raise FontError {
  guard finite_number(point.x) &&
    finite_number(point.y) &&
    point.x.abs() < 1.0e12 &&
    point.y.abs() < 1.0e12 else {
    raise InvalidFont("SHX 笔画坐标超出有限范围")
  }
  if self.drawing {
    self.budget.take(1)
    if self.path is Some(path) {
      path.push(point)
    } else {
      self.budget.take(1)
      let path = [self.at, point]
      self.paths.push(path)
      self.path = Some(path)
    }
  } else {
    self.path = None
  }
  self.at = point
}

///|
/// Read horizontal strokes. The optional encoding map translates Unicode scalar
/// values to legacy shape numbers, leaving code-page selection to the caller.
pub fn R12ShxFont::glyph_run(
  self : R12ShxFont,
  text : String,
  map? : (Char) -> Int = ch => ch.to_int(),
  max_work? : Int = 100_000,
) -> Result[R12GlyphRun, String] {
  Ok(shx_run(self, text, map, max_work)) catch {
    InvalidFont(msg) => Err(msg)
  }
}

///|
fn shx_run(
  font : R12ShxFont,
  text : String,
  map : (Char) -> Int,
  max_work : Int,
) -> R12GlyphRun raise FontError {
  guard max_work > 0 && max_work <= 2_000_000 else {
    raise InvalidFont("SHX 工作预算无效")
  }
  let budget = { remaining: max_work, }
  let paths = []
  let mut advance = 0.0
  for ch in text {
    let state : ShxPen = {
      paths,
      marks: [],
      path: None,
      at: Vec2::new(advance, 0.0),
      scale: 1.0 / font.above,
      drawing: true,
      budget,
    }
    shx_execute(font, map(ch), state, 0)
    guard state.at.x >= advance && state.marks.is_empty() else {
      raise InvalidFont("SHX 前进宽度或坐标栈无效")
    }
    advance = state.at.x
  }
  { paths, advance, ascent: 1.0, descent: font.below / font.above, }
}

///|
fn shx_execute(
  font : R12ShxFont,
  id : Int,
  state : ShxPen,
  depth : Int,
) -> Unit raise FontError {
  guard depth < 16 && id != 0 && font.symbols.get(id) is Some(data) else {
    raise InvalidFont("SHX 字形缺失或递归超限")
  }
  let direction_x = [
    1.0, 1.0, 1.0, 0.5, 0.0, -0.5, -1.0, -1.0, -1.0, -1.0, -1.0, -0.5, 0.0, 0.5,
    1.0, 1.0,
  ]
  let direction_y = [
    0.0, 0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 0.0, -0.5, -1.0, -1.0, -1.0, -1.0, -1.0,
    -0.5,
  ]
  let mut i = 0
  let mut skip = false
  while true {
    state.budget.take(1)
    let command = data.u8(i)
    i += 1
    if command == 0 {
      break
    }
    let active = !skip
    skip = false
    match command {
      1 | 2 =>
        if active {
          state.drawing = command == 1
          if !state.drawing {
            state.path = None
          }
        }
      3 | 4 => {
        let factor = data.u8(i).to_double()
        i += 1
        if active {
          guard factor > 0.0 else {
            raise InvalidFont("SHX 缩放因子为零")
          }
          state.scale = if command == 3 {
            state.scale / factor
          } else {
            state.scale * factor
          }
        }
      }
      5 =>
        if active {
          guard state.marks.length() < 32 else {
            raise InvalidFont("SHX 坐标栈超限")
          }
          state.marks.push(state.at)
        }
      6 =>
        if active {
          guard state.marks.pop() is Some(p) else {
            raise InvalidFont("SHX 坐标栈为空")
          }
          state.at = p
          state.path = None
        }
      7 => {
        let sub = if font.unicode { data.le16(i) } else { data.u8(i) }
        i += if font.unicode { 2 } else { 1 }
        if active {
          shx_execute(font, sub, state, depth + 1)
        }
      }
      8 | 9 | 12 | 13 => {
        let many = command == 9 || command == 13
        let curved = command == 12 || command == 13
        while true {
          state.budget.take(1)
          let x = data.i8(i)
          let y = data.i8(i + 1)
          i += 2
          if many && x == 0 && y == 0 {
            break
          }
          let b = if curved {
            let b = data.i8(i)
            i += 1
            b
          } else {
            0
          }
          if active {
            let end = state.at.add(
              Vec2::new(x.to_double(), y.to_double()).scale(state.scale),
            )
            if b == 0 || !state.drawing {
              state.plot(end)
            } else {
              shx_bulge(state, end, b.to_double() / 127.0)
            }
          }
          if !many {
            break
          }
        }
      }
      10 | 11 => {
        let start = if command == 11 {
          data.u8(i).to_double() / 256.0
        } else {
          0.0
        }
        let end = if command == 11 {
          data.u8(i + 1).to_double() / 256.0
        } else {
          0.0
        }
        let radius = if command == 11 { data.u16(i + 2) } else { data.u8(i) }
        let spec = data.u8(i + (if command == 11 { 4 } else { 1 }))
        i += if command == 11 { 5 } else { 2 }
        if active {
          let sign = if (spec & 128) != 0 { -1.0 } else { 1.0 }
          let octant = ((spec >> 4) & 7).to_double()
          let span = spec & 15
          let span = (if span == 0 { 8 } else { span }).to_double()
          guard radius > 0 && span <= 8.0 else {
            raise InvalidFont("SHX 圆弧半径或八分角无效")
          }
          let step = to_radians(45.0)
          let angle = (octant + sign * start) * step
          let sweep = (
              span - start - (if end == 0.0 { 0.0 } else { 1.0 - end })
            ) *
            step *
            sign
          let radial = Vec2::new(radius.to_double() * state.scale, 0.0).rotate(
            angle,
          )
          shx_arc(state, state.at.sub(radial), radial, sweep, None)
        }
      }
      14 => skip = active
      _ if command >= 16 =>
        if active {
          let d = command & 15
          let length = (command >> 4).to_double() * state.scale
          state.plot(
            state.at.add(
              Vec2::new(direction_x[d], direction_y[d]).scale(length),
            ),
          )
        }
      _ => raise InvalidFont("SHX 笔画操作码无效")
    }
  }
}

///|
fn shx_bulge(state : ShxPen, end : Vec2, b : Double) -> Unit raise FontError {
  let chord = end.sub(state.at)
  if chord.length() == 0.0 {
    return
  }
  let center = state.at
    .add(chord.scale(0.5))
    .add(chord.perp().scale((1.0 - b * b) / (4.0 * b)))
  shx_arc(state, center, state.at.sub(center), 4.0 * @math.atan(b), Some(end))
}

///|
fn shx_arc(
  state : ShxPen,
  center : Vec2,
  radial : Vec2,
  sweep : Double,
  exact_end : Vec2?,
) -> Unit raise FontError {
  let count = (sweep.abs() / to_radians(5.0)).ceil().to_int().max(1)
  for j in 1..<=count {
    let end = exact_end.unwrap_or(center.add(radial.rotate(sweep)))
    let point = if j == count {
      end
    } else {
      center.add(radial.rotate(sweep * j.to_double() / count.to_double()))
    }
    state.plot(point)
  }
}

///|
fn shx_unicode(file : FontBytes) -> R12ShxFont raise FontError {
  guard file.u8(24) == 26 && file.le16(27) == 0 else {
    raise InvalidFont("SHX Unicode 文件头无效")
  }
  let count = file.le16(25)
  guard count >= 1 && count <= 8192 else {
    raise InvalidFont("SHX Unicode 索引数量无效")
  }
  let len = file.le16(29)
  let info = file.region(31, len)
  let fields = shx_after_name(info)
  let above = info.u8(fields).to_double()
  let below = info.u8(fields + 1).to_double()
  guard above > 0.0 && info.u8(fields + 3) == 0 else {
    raise InvalidFont("SHX Unicode 字高或编码不支持")
  }
  let symbols : Map[Int, FontBytes] = Map([])
  let mut pos = 31 + len
  for _ in 1..<count {
    let id = file.le16(pos)
    let size = file.le16(pos + 2)
    let record = file.region(pos + 4, size)
    let start = shx_after_name(record)
    guard id > 0 && !symbols.contains(id) else {
      raise InvalidFont("SHX Unicode 字形编号重复")
    }
    symbols[id] = record.region(start, size - start)
    pos += 4 + size
  }
  guard pos == file.size || (file.size - pos == 3 && file.ascii_at(pos, "EOF")) else {
    raise InvalidFont("SHX Unicode 字形数或尾部数据无效")
  }
  { symbols, above, below, unicode: true, }
}
