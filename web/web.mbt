// 给网页用的导出层。
//
// 和 stlkit 的网页版同一套骨架：文件字节走 **base64** 过 JS 边界
//（MoonBit 的 `Bytes` 是编译器的内部表示，过不了边界；字符串两边都认），
// 结果排成文本或 SVG 字符串回去。
//
// dxfkit 的管线是**不抛异常**的（「解析器永不 panic」是项目约定），
// 所以唯一会失败的只有 base64 解码本身。`svg` 的返回值会被页面塞进
// innerHTML，解码失败的文案走独立的 `svg_error`——不把错误信息
// 往 HTML 里拼。

///|
/// 加工前检查。返回完整文字报告（页面用 textContent 显示）。
///
/// `min_gap` 是允许的最小净距，0 表示不查。
pub fn check(file_base64 : String, min_gap : Double) -> String {
  let data = match decode(file_base64) {
    Ok(data) => data
    Err(msg) => return "读不了：\{msg}"
  }
  let drawing = @dxfkit.build_drawing(@dxfkit.scan_tags(data))
  drawing.check({ tol: 0.05, min_gap }).to_text()
}

///|
/// 把图纸画成 SVG。失败返回空串（原因问一次 `svg_error`）。
pub fn svg(file_base64 : String, tol : Double) -> String {
  match decode(file_base64) {
    Ok(data) => @dxfkit.build_drawing(@dxfkit.scan_tags(data)).to_svg(tol)
    Err(_) => ""
  }
}

///|
/// `svg` 失败的原因；成功时是空串。
pub fn svg_error(file_base64 : String) -> String {
  match decode(file_base64) {
    Ok(_) => ""
    Err(msg) => msg
  }
}

///|
/// 把 base64 解成字节，失败时给中文错误。
fn decode(file_base64 : String) -> Result[Bytes, String] {
  if file_base64.length() == 0 {
    return Err("没有收到文件内容")
  }
  Ok(@base64.decode(file_base64)) catch {
    _ => Err("文件内容解码失败，可能上传时出错了")
  }
}
