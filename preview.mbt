// SVG 预览：把图纸画成一张 SVG。
//
// 用途：检查报告说「图层『轮廓』上有 3 处没闭合」的时候，人得先看得见
// 图。渲染用的是展开之后的**世界坐标折线**——块引用已经摊平、曲线已经
// 离散（容差由调用方给），预览和加工检查看的是同一份几何，
// 不会出现「检查说有问题、预览里找不到」的错位。
//
// 几个渲染约定：
//
// - **y 轴翻转**：CAD 的 y 向上、SVG 的 y 向下，内容整体套
//   `scale(1,-1)`；文字元素再单独翻一次（翻两次才是正的）。
// - **关闭 / 冻结的图层淡画**：它们不会被切，画得和要切的一样会误导。
// - 文字按原文画——MTEXT 的格式化代码（`\P` 之类）原样出现，
//   解释它们要写一个格式化解析器，留给以后。
// - 线宽 / 点半径 / 字号都相对图形大小算：图纸单位是米还是微米，
//   观感都一样。

///|
/// 图纸 → SVG 字符串（一条 XML 文本）。
///
/// `tol` 是离散容差，和检查用的一个口径。
pub fn Drawing::to_svg(self : Drawing, tol : Double) -> String {
  let exp = self.expand(tol)
  // 世界坐标的范围（只看画得出来的几何；纯文字的图纸会落到空盒）
  let mut box = Aabb2::empty()
  for p in exp.placed {
    match p.flat {
      Outline(points~, ..) =>
        for pt in points {
          box = box.expand(pt)
        }
      Dot(at~) => box = box.expand(at)
      Label(at~, ..) => box = box.expand(at)
      Empty => ()
    }
  }
  if box.is_empty() {
    return "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"800\" height=\"600\" viewBox=\"0 0 800 600\"></svg>"
  }
  let size = box.size()
  let margin = size.x.max(size.y).max(1.0) * 0.02
  let vx = box.min.x - margin
  let vy = -(box.max.y + margin)
  let vw = size.x + margin * 2.0
  let vh = size.y + margin * 2.0
  let height = 800.0 * vh / vw
  let diag = (vw * vw + vh * vh).sqrt()
  let stroke = diag / 400.0
  let tables = match self.section("TABLES") {
    Some(t) => Some(parse_tables(t))
    None => None
  }
  let sb = StringBuilder()
  sb.write_string(
    "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"800\" height=\"\{fmt(height)}\" viewBox=\"\{fmt(vx)} \{fmt(vy)} \{fmt(vw)} \{fmt(vh)}\">\n",
  )
  sb.write_string(
    "<rect x=\"\{fmt(vx)}\" y=\"\{fmt(vy)}\" width=\"\{fmt(vw)}\" height=\"\{fmt(vh)}\" fill=\"#ffffff\"/>\n",
  )
  sb.write_string("<g transform=\"scale(1,-1)\">\n")
  for p in exp.placed {
    let (color, dim) = layer_state(tables, p.layer)
    match p.flat {
      Outline(points~, closed~) =>
        if points.length() >= 2 {
          let pts = fmt_points(points)
          let tag = if closed { "polygon" } else { "polyline" }
          sb.write_string(
            "<\{tag} points=\"\{pts}\" fill=\"none\" stroke=\"\{color}\" stroke-width=\"\{fmt(stroke)}\"\{dim}/>\n",
          )
        }
      Dot(at~) =>
        sb.write_string(
          "<circle cx=\"\{fmt(at.x)}\" cy=\"\{fmt(at.y)}\" r=\"\{fmt(stroke * 2.0)}\" fill=\"\{color}\"\{dim}/>\n",
        )
      Label(at~, height~, value~) =>
        if value != "" && height > 0.0 {
          sb.write_string(
            "<text x=\"0\" y=\"0\" transform=\"translate(\{fmt(at.x)} \{fmt(at.y)}) scale(1 -1)\" font-size=\"\{fmt(height)}\" fill=\"\{color}\"\{dim}>\{xml_escape(value)}</text>\n",
          )
        }
      Empty => ()
    }
  }
  sb.write_string("</g>\n</svg>\n")
  sb.to_string()
}

///|
/// 图层 → （颜色, 淡画属性）。关闭 / 冻结的图层淡画——它们不会被切，
/// 画得和要切的一样会误导。图层表里查不到时用灰色。
fn layer_state(tables : Tables?, layer : String) -> (String, String) {
  match tables {
    Some(t) =>
      match t.layer(layer) {
        Some(l) => {
          let color = aci_color(l.color_index())
          if l.is_off() || l.frozen {
            (color, " opacity=\"0.25\"")
          } else {
            (color, "")
          }
        }
        None => ("#808080", "")
      }
    None => ("#808080", "")
  }
}

///|
/// ACI 颜色索引 → 十六进制色值。头几个是标准色盘（1-7）；
/// 更靠后的索引是渐变色表，先按灰处理——预览不追求色准，
/// 能分辨图层就行。
fn aci_color(index : Int) -> String {
  match index {
    1 => "#ff0000"
    2 => "#ffff00"
    3 => "#00ff00"
    4 => "#00ffff"
    5 => "#0000ff"
    6 => "#ff00ff"
    7 => "#000000"
    8 => "#808080"
    9 => "#c0c0c0"
    _ => "#808080"
  }
}

///|
/// XML 转义。文字的原文会直接进 SVG——图纸里的 `A<B&C` 不转义
/// 就输出，整张图都成了坏 XML。
fn xml_escape(s : String) -> String {
  let sb = StringBuilder()
  for c in s {
    match c {
      '&' => sb.write_string("&amp;")
      '<' => sb.write_string("&lt;")
      '>' => sb.write_string("&gt;")
      '"' => sb.write_string("&quot;")
      _ => sb.write_string("\{c}")
    }
  }
  sb.to_string()
}

///|
/// 使用有限 Double 的往返数字表示。先乘 10000 再转 Int 会在较大坐标
/// 上溢出；固定四位小数也会把微小轮廓压成一点。SVG 接受科学计数法。
fn fmt(v : Double) -> String {
  v.to_string()
}

///|
/// 点列 → `points` 属性值。
fn fmt_points(points : Array[Vec2]) -> String {
  let sb = StringBuilder()
  let mut i = 0
  while i < points.length() {
    if i > 0 {
      sb.write_string(" ")
    }
    sb.write_string(fmt(points[i].x))
    sb.write_string(",")
    sb.write_string(fmt(points[i].y))
    i = i + 1
  }
  sb.to_string()
}
