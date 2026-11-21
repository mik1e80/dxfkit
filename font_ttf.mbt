///|
/// Immutable decoder for a single TrueType sfnt face. Font paths are never opened.
pub struct R12TrueType {
  priv cmap : FontBytes
  priv glyf : FontBytes
  priv loca : FontBytes
  priv hmtx : FontBytes
  glyphs : Int
  horizontal_metrics : Int
  long_offsets : Bool
  cap : Double
  ascent : Double
  descent : Double
}

///|
/// Decode TrueType outlines with Unicode cmap 4/12 and horizontal metrics.
pub fn load_r12_truetype(data : Bytes) -> Result[R12TrueType, String] {
  Ok(ttf_load(font_input(data))) catch {
    InvalidFont(msg) => Err(msg)
  }
}

///|
fn ttf_table(font : FontBytes, name : String) -> FontBytes? raise FontError {
  let count = font.u16(4)
  guard count <= 1024 else { raise InvalidFont("TrueType 表目录过大") }
  let mut result = None
  for j in 0..<count {
    let i = 12 + j * 16
    if font.ascii_at(i, name) {
      guard result is None else { raise InvalidFont("TrueType 表重复") }
      result = Some(font.region(font.u32(i + 8), font.u32(i + 12)))
    }
  }
  result
}

///|
fn ttf_required(font : FontBytes, name : String) -> FontBytes raise FontError {
  guard ttf_table(font, name) is Some(table) else {
    raise InvalidFont("缺少 TrueType 表 \{name}")
  }
  table
}

///|
fn ttf_cmap(table : FontBytes) -> FontBytes raise FontError {
  let n = table.u16(2)
  guard n <= 1024 else { raise InvalidFont("cmap 子表过多") }
  let mut result = None
  let mut score = 0
  for j in 0..<n {
    let row = j * 8 + 4
    let platform = table.u16(row)
    let encoding = table.u16(row + 2)
    if platform != 0 && !(platform == 3 && (encoding == 1 || encoding == 10)) {
      continue
    }
    let offset = table.u32(row + 4)
    let form = table.u16(offset)
    let rank = if form == 12 { 2 } else if form == 4 { 1 } else { 0 }
    if rank > score {
      let size = if form == 12 {
        table.u32(offset + 4)
      } else {
        table.u16(offset + 2)
      }
      let sub = table.region(offset, size)
      if form == 12 {
        guard sub.size >= 16 && sub.u32(12) <= (sub.size - 16) / 12 else {
          raise InvalidFont("cmap 12 分组越界")
        }
      } else {
        let fields = sub.u16(6)
        guard fields > 0 && fields % 2 == 0 && fields <= (sub.size - 16) / 4 else {
          raise InvalidFont("cmap 4 段目录越界")
        }
      }
      score = rank
      result = Some(sub)
    }
  }
  guard result is Some(cmap) else {
    raise InvalidFont("没有 Unicode cmap 4/12")
  }
  cmap
}

///|
fn ttf_load(font : FontBytes) -> R12TrueType raise FontError {
  guard font.u16(0) == 1 && font.u16(2) == 0 else {
    raise InvalidFont("仅支持单字体 TrueType sfnt")
  }
  let head = ttf_required(font, "head")
  let hhea = ttf_required(font, "hhea")
  let units = head.u16(18)
  let offset_format = head.i16(50)
  let glyphs = ttf_required(font, "maxp").u16(4)
  let metrics = hhea.u16(34)
  let loca = ttf_required(font, "loca")
  let hmtx = ttf_required(font, "hmtx")
  let glyf = ttf_required(font, "glyf")
  let cmap = ttf_cmap(ttf_required(font, "cmap"))
  guard units >= 16 &&
    units <= 16384 &&
    (offset_format == 0 || offset_format == 1) &&
    glyphs > 0 &&
    metrics > 0 &&
    metrics <= glyphs &&
    loca.size >= (glyphs + 1) * (if offset_format == 1 { 4 } else { 2 }) &&
    hmtx.size >= 4 * metrics + 2 * (glyphs - metrics) else {
    raise InvalidFont("TrueType 头、loca 或水平度量无效")
  }
  let cap = if ttf_table(font, "OS/2") is Some(os) &&
    os.size >= 90 &&
    os.u16(0) >= 2 {
    os.i16(88)
  } else {
    0
  }
  let cap = if cap > 0 { cap.to_double() } else { units.to_double() }
  {
    cmap,
    glyf,
    loca,
    hmtx,
    glyphs,
    horizontal_metrics: metrics,
    long_offsets: offset_format == 1,
    cap,
    ascent: hhea.i16(4).max(0).to_double() / cap,
    descent: (-hhea.i16(6)).max(0).to_double() / cap,
  }
}

///|
fn ttf_lookup(cmap : FontBytes, cp : Int) -> Int raise FontError {
  if cmap.u16(0) == 12 {
    let mut lo = 0
    let mut hi = cmap.u32(12)
    while lo < hi {
      let m = lo + (hi - lo) / 2
      let row = 16 + m * 12
      let end = cmap.u32(row + 4)
      if end < cp {
        lo = m + 1
      } else {
        hi = m
      }
    }
    if lo == cmap.u32(12) {
      return 0
    }
    let row = 16 + lo * 12
    let start = cmap.u32(row)
    let base = cmap.u32(row + 8)
    return if cp < start || base > 65535 || cp - start > 65535 - base {
      0
    } else {
      base + cp - start
    }
  }
  if cp > 65535 {
    return 0
  }
  let n = cmap.u16(6) / 2
  let mut lo = 0
  let mut hi = n
  while lo < hi {
    let m = lo + (hi - lo) / 2
    if cmap.u16(14 + 2 * m) < cp {
      lo = m + 1
    } else {
      hi = m
    }
  }
  if lo == n {
    return 0
  }
  let start = cmap.u16(16 + 2 * (n + lo))
  if cp < start {
    return 0
  }
  let delta = cmap.i16(16 + 2 * (2 * n + lo))
  let slot = 16 + 2 * (3 * n + lo)
  let offset = cmap.u16(slot)
  if offset == 0 {
    return (cp + delta) & 65535
  }
  let gid = cmap.u16(slot + offset + 2 * (cp - start))
  if gid == 0 {
    0
  } else {
    (gid + delta) & 65535
  }
}

///|
fn R12TrueType::offset(self : R12TrueType, gid : Int) -> Int raise FontError {
  if self.long_offsets {
    self.loca.u32(4 * gid)
  } else {
    2 * self.loca.u16(2 * gid)
  }
}

///|
priv struct TtfPoint {
  p : Vec2
  on : Bool
}

///|
fn ttf_coordinates(
  glyph : FontBytes,
  flags : Array[Int],
  pos : Int,
  x : Bool,
) -> (Array[Int], Int) raise FontError {
  let short_mask = if x { 2 } else { 4 }
  let same_mask = if x { 16 } else { 32 }
  let mut at = pos
  let mut sum = 0
  let output = []
  for flag in flags {
    let short = (flag & short_mask) != 0
    let same = (flag & same_mask) != 0
    if short {
      let delta = glyph.u8(at)
      at += 1
      sum += if same { delta } else { -delta }
    } else if !same {
      sum += glyph.i16(at)
      at += 2
    }
    guard sum >= -32768 && sum <= 32767 else {
      raise InvalidFont("字形坐标越界")
    }
    output.push(sum)
  }
  (output, at)
}

///|
fn ttf_simple(
  glyph : FontBytes,
  n : Int,
  budget : FontBudget,
) -> Array[Array[TtfPoint]] raise FontError {
  if n == 0 {
    return []
  }
  let ends = []
  let mut previous = -1
  for j in 0..<n {
    let end = glyph.u16(10 + 2 * j)
    guard end > previous else {
      raise InvalidFont("轮廓末点序号未递增")
    }
    ends.push(end)
    previous = end
  }
  let count = previous + 1
  budget.take(count)
  let instructions = 10 + 2 * n
  let mut at = instructions + 2 + glyph.u16(instructions)
  let flags = []
  while flags.length() < count {
    let flag = glyph.u8(at)
    at += 1
    let repeat = if (flag & 8) != 0 {
      let repeat = glyph.u8(at)
      at += 1
      repeat + 1
    } else {
      1
    }
    guard repeat <= count - flags.length() else {
      raise InvalidFont("字形重复标志越界")
    }
    for _ in 0..<repeat {
      flags.push(flag)
    }
  }
  let (xs, y_at) = ttf_coordinates(glyph, flags, at, true)
  let (ys, _) = ttf_coordinates(glyph, flags, y_at, false)
  let contours = []
  let mut first = 0
  for end in ends {
    let contour = []
    for j in first..<=end {
      contour.push({
        p: Vec2::new(xs[j].to_double(), ys[j].to_double()),
        on: (flags[j] & 1) != 0,
      })
    }
    first = end + 1
    contours.push(contour)
  }
  contours
}

///|
fn R12TrueType::contours(
  self : R12TrueType,
  gid : Int,
  depth : Int,
  budget : FontBudget,
) -> Array[Array[TtfPoint]] raise FontError {
  budget.take(1)
  guard gid >= 0 && gid < self.glyphs && depth < 16 else {
    raise InvalidFont("TrueType 字形编号或复合递归越界")
  }
  let offset = self.offset(gid)
  let end = self.offset(gid + 1)
  let glyph = self.glyf.region(offset, end - offset)
  if glyph.size == 0 {
    return []
  }
  let n = glyph.i16(0)
  if n >= 0 {
    return ttf_simple(glyph, n, budget)
  }
  guard n == -1 else { raise InvalidFont("无效复合字形轮廓计数") }
  let mut pos = 10
  let output = []
  while true {
    let flags = glyph.u16(pos)
    let component = glyph.u16(pos + 2)
    pos += 4
    let xy = (flags & 2) != 0
    let words = (flags & 1) != 0
    let arg = fn(at : Int) raise FontError {
      if words {
        if xy {
          glyph.i16(at)
        } else {
          glyph.u16(at)
        }
      } else if xy {
        glyph.i8(at)
      } else {
        glyph.u8(at)
      }
    }
    let x = arg(pos)
    let y = arg(pos + (if words { 2 } else { 1 }))
    pos += if words { 4 } else { 2 }
    let transforms = flags & 200
    guard transforms == 0 ||
      transforms == 8 ||
      transforms == 64 ||
      transforms == 128 else {
      raise InvalidFont("复合字形同时设置了互斥的变换标志")
    }
    let mut a = 1.0
    let mut b = 0.0
    let mut c = 0.0
    let mut d = 1.0
    if (flags & 128) != 0 {
      a = glyph.i16(pos).to_double() / 16384.0
      b = glyph.i16(pos + 2).to_double() / 16384.0
      c = glyph.i16(pos + 4).to_double() / 16384.0
      d = glyph.i16(pos + 6).to_double() / 16384.0
      pos += 8
    } else if (flags & 64) != 0 {
      a = glyph.i16(pos).to_double() / 16384.0
      d = glyph.i16(pos + 2).to_double() / 16384.0
      pos += 4
    } else if (flags & 8) != 0 {
      a = glyph.i16(pos).to_double() / 16384.0
      d = a
      pos += 2
    }
    let components = self.contours(component, depth + 1, budget)
    let transform = fn(p : Vec2) {
      Vec2::new(a * p.x + c * p.y, b * p.x + d * p.y)
    }
    let offset = if xy {
      guard (flags & 6144) != 6144 else {
        raise InvalidFont("复合字形同时设置了互斥的偏移标志")
      }
      let raw = Vec2::new(x.to_double(), y.to_double())
      // The output uses unhinted design coordinates, without a pixel grid.
      if (flags & 2048) != 0 {
        transform(raw)
      } else {
        raw
      }
    } else {
      let parent = ttf_outline_point(output, x, budget)
      let child = ttf_outline_point(components, y, budget)
      parent.sub(transform(child))
    }
    for contour in components {
      budget.take(contour.length())
      output.push(
        contour.map(p => { on: p.on, p: transform(p.p).add(offset), }),
      )
    }
    if (flags & 32) == 0 {
      if (flags & 256) != 0 {
        ignore(glyph.region(pos + 2, glyph.u16(pos)))
      }
      break
    }
  }
  output
}

///|
/// Decode Unicode glyph outlines in cap-height units. Hinting, kerning and
/// shaping of complex scripts are outside the horizontal cmap decoder.
pub fn R12TrueType::glyph_run(
  self : R12TrueType,
  text : String,
  tol? : Double = 0.001,
  max_work? : Int = 100_000,
) -> Result[R12GlyphRun, String] {
  Ok(ttf_run(self, text, tol, max_work)) catch {
    InvalidFont(msg) => Err(msg)
  }
}

///|
fn ttf_run(
  font : R12TrueType,
  text : String,
  tol : Double,
  max_work : Int,
) -> R12GlyphRun raise FontError {
  guard positive_tolerance(tol) && max_work > 0 && max_work <= 2_000_000 else {
    raise InvalidFont("字形容差或预算无效")
  }
  let budget = { remaining: max_work, }
  let paths = []
  let mut advance = 0.0
  for ch in text {
    budget.take(1)
    let gid = ttf_lookup(font.cmap, ch.to_int())
    guard gid > 0 && gid < font.glyphs else {
      raise InvalidFont("字体缺少字符 \{ch}")
    }
    for contour in font.contours(gid, 0, budget) {
      let scaled = contour.map(p => {
        on: p.on,
        p: Vec2::new(p.p.x / font.cap + advance, p.p.y / font.cap),
      })
      let path = ttf_flatten(scaled, tol, budget)
      if path.length() >= 2 {
        paths.push(path)
      }
    }
    advance += font.hmtx
      .u16(4 * gid.min(font.horizontal_metrics - 1))
      .to_double() /
      font.cap
  }
  { paths, advance, ascent: font.ascent, descent: font.descent, }
}

///|
fn ttf_flatten(
  points : Array[TtfPoint],
  tol : Double,
  budget : FontBudget,
) -> Array[Vec2] raise FontError {
  let last = points.length() - 1
  let a = points[0]
  let b = points[last]
  let (start, lo, hi) = if a.on {
    (a.p, 1, last + 1)
  } else if b.on {
    (b.p, 0, last)
  } else {
    (a.p.add(b.p).scale(0.5), 0, last + 1)
  }
  budget.take(1)
  let path = [start]
  let mut pending : Vec2? = None
  for i in lo..<=hi {
    let current = if i == hi { { on: true, p: start, } } else { points[i] }
    if pending is Some(control) {
      let end = if current.on {
        current.p
      } else {
        control.add(current.p).scale(0.5)
      }
      ttf_quadratic(path[path.length() - 1], control, end, tol, 0, path, budget)
    } else if current.on {
      budget.take(1)
      path.push(current.p)
    }
    pending = if current.on { None } else { Some(current.p) }
  }
  path
}

///|
fn ttf_quadratic(
  a : Vec2,
  b : Vec2,
  c : Vec2,
  tol : Double,
  depth : Int,
  out : Array[Vec2],
  budget : FontBudget,
) -> Unit raise FontError {
  let ab = a.add(b).scale(0.5)
  let bc = b.add(c).scale(0.5)
  let curve = ab.add(bc).scale(0.5)
  if curve.distance(a.add(c).scale(0.5)) <= tol {
    budget.take(1)
    out.push(c)
    return
  }
  guard depth < 20 else {
    raise InvalidFont("TrueType 曲线细分超过深度预算")
  }
  ttf_quadratic(a, ab, curve, tol, depth + 1, out, budget)
  ttf_quadratic(curve, bc, c, tol, depth + 1, out, budget)
}
