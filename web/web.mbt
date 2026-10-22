// 给网页用的导出层。
//
// 和 stlkit 的网页版同一套骨架：文件字节走 **base64** 过 JS 边界
//（MoonBit 的 `Bytes` 是编译器的内部表示，过不了边界；字符串两边都认），
// 结果排成文本或 SVG 字符串回去。
//
// 格式与几何诊断进入报告；这层还处理base64解码错误。`svg` 的返回值会被页面塞进
// innerHTML，解码失败的文案走独立的 `svg_error`——不把错误信息
// 往 HTML 里拼。

///|
/// 页面的一次解码/解析/展开入口；旧函数保留供已有调用方使用。
pub fn analyze(file_base64 : String, min_gap : Double, tol : Double) -> String {
  let data = match decode(file_base64) {
    Ok(data) => data
    Err(msg) => return ({"report": "读不了：" + msg, "svg": "", "error": msg, "unit": ""} : Json).stringify()
  }
  let drawing = @dxfkit.build_drawing(@dxfkit.scan_tags(data))
  let result = drawing.analyze({tol, min_gap})
  let report = "单位声明：\{result.unit}；坐标及阈值使用图纸原始单位，请先确认。\n" + result.report.to_text()
  ({"report": report, "svg": result.svg, "error": "", "unit": result.unit} : Json).stringify()
}

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
  "单位声明：\{drawing.declared_unit_label()}；坐标及阈值使用图纸原始单位，请先确认。\n" +
  drawing.check({ tol: 0.05, min_gap, }).to_text()
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
