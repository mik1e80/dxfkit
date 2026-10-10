// 白盒测试：ASCII 扫描。
//
// 重点全在**真实文件的怪异之处**——正常格式的解析谁都会写，能读真实文件
// 才算数。下面每一条都对应一个实测过的现象，不是假想的边界。

///|
/// 把字符串转成字节。
fn bytes_of(s : String) -> Bytes {
  @utf8.encode(s)
}

///|
/// 扫描后按 `组码: 值` 列出来，方便断言。
///
/// 每种类型用不同的前缀，这样断言能同时盯住「值对不对」和「类型对不对」：
/// 整数 `#5`、浮点 `~5.0`、布尔 `?true`、二进制 `bin`。
fn tags_text(data : Bytes) -> String {
  let scan = scan_tags(data)
  let sb = StringBuilder()
  for t in scan.tags {
    match t.value {
      Str(s) => sb.write_string("\{t.code}:\{s} ")
      I16(v) | I32(v) => sb.write_string("\{t.code}:#\{v} ")
      I64(v) => sb.write_string("\{t.code}:#\{v} ")
      F64(v) => sb.write_string("\{t.code}:~\{v} ")
      Bool(b) => sb.write_string("\{t.code}:?\{b} ")
      Bin(_) => sb.write_string("\{t.code}:bin ")
    }
  }
  sb.to_string()
}

// ── 基本形态 ────────────────────────────────────────────────────────────

///|
test "最基本的组码值对" {
  let d = bytes_of("0\nSECTION\n2\nENTITIES\n0\nEOF\n")
  assert_true(tags_text(d) == "0:SECTION 2:ENTITIES 0:EOF ")
}

///|
test "组码按三位右对齐：必须 trim 才能解析" {
  // 这是 DXF 规范里的 %3d 格式，实测 circle.dxf 有 1124 行是缩进的。
  // 不 trim 的话除了三位数以外全都读不出来
  let d = bytes_of("  0\nSECTION\n 70\n5\n100\nAcDbEntity\n0\nEOF\n")
  assert_true(tags_text(d) == "0:SECTION 70:#5 100:AcDbEntity 0:EOF ")
}

///|
test "缩进的文件和不缩进的文件结果一样" {
  // 这是 key 的测试：同一个内容的两种写法必须给出同一个结果。
  // 实测 circle.dxf（缩进）和 Minimal_DXF_AC1021.dxf（不缩进）就是这样一对
  let indented = bytes_of("  0\nSECTION\n  2\nHEADER\n 70\n5\n  0\nEOF\n")
  let plain = bytes_of("0\nSECTION\n2\nHEADER\n70\n5\n0\nEOF\n")
  assert_true(tags_text(indented) == tags_text(plain))
}

// ── 值不能被 trim ───────────────────────────────────────────────────────

///|
test "字符串值的首尾空格要保留" {
  // TEXT 实体的文字内容可能真的以空格开头，一起 trim 就把用户数据改了。
  // 数值类型当然可以 trim（数字周围的空格无意义），字符串必须原样留着
  let d = bytes_of("1\n  hello  \n0\nEOF\n")
  let scan = scan_tags(d)
  assert_true(scan.tags[0].value.as_string() == "  hello  ")
}

///|
test "数值两侧的空格要容掉" {
  // 数值周围的空格无意义，而且要容——有些写出器会补空格做对齐
  let d = bytes_of(" 10\n   1.5   \n0\nEOF\n")
  let scan = scan_tags(d)
  assert_true(scan.tags[0].value.as_double() == 1.5)
}

// ── 换行 ────────────────────────────────────────────────────────────────

///|
test "LF / CRLF / 裸 CR 三种换行都要认" {
  let lf = bytes_of("0\nSECTION\n0\nEOF\n")
  let crlf = bytes_of("0\r\nSECTION\r\n0\r\nEOF\r\n")
  let cr = bytes_of("0\rSECTION\r0\rEOF\r")
  let want = "0:SECTION 0:EOF "
  assert_true(tags_text(lf) == want)
  assert_true(tags_text(crlf) == want)
  assert_true(tags_text(cr) == want)
}

///|
test "CRLF 的值不能带上尾部回车" {
  // Windows 导出的 DXF 几乎全是 CRLF。不处理的话值会变成 "SECTION\r"，
  // 后面的字符串比较全部失败——而且报错信息里看不出来
  let d = bytes_of("0\r\nSECTION\r\n0\r\nEOF\r\n")
  let scan = scan_tags(d)
  assert_true(scan.tags[0].value.as_string() == "SECTION")
}

///|
test "最后一行没有换行也要认" {
  // 有些文件在 EOF 之后不加换行
  let d = bytes_of("0\nSECTION\n0\nEOF")
  assert_true(tags_text(d) == "0:SECTION 0:EOF ")
}

// ── 结束与垃圾 ──────────────────────────────────────────────────────────

///|
test "EOF 之后的内容不再解析" {
  // 真实文件在 EOF 之后可能有垃圾字节（语料里就有
  // R12_with_trash_beyond_EOF.dxf）。那些不是数据
  let d = bytes_of("0\nSECTION\n0\nEOF\ngarbage here\n99\nmore\n")
  let scan = scan_tags(d)
  assert_true(tags_text(d) == "0:SECTION 0:EOF ")
  assert_eq(scan.tags.length(), 2)
}

///|
test "没有 EOF 也要能读完" {
  // 截断的文件：尽力读完已有的部分
  let d = bytes_of("0\nSECTION\n2\nENTITIES\n")
  let scan = scan_tags(d)
  assert_eq(scan.tags.length(), 2)
}

// ── 坏行恢复 ────────────────────────────────────────────────────────────

///|
test "组码行不是整数时跳过并报警告" {
  // 坏一行不该让整份文件读不出来
  let d = bytes_of("0\nSECTION\nnot_a_number\n2\nENTITIES\n0\nEOF\n")
  let scan = scan_tags(d)
  // 组码行被跳过，它的「值」行会被当成下一个组码——也读不出，再跳一次
  // 但后面的好数据必须还在
  assert_true(tags_text(d).contains("0:SECTION"))
  assert_true(tags_text(d).contains("0:EOF"))
  assert_true(scan.warnings.length() > 0)
}

///|
test "组码后面没有值要报警告" {
  // 文件在最后被截断：组码读到了，值没了
  let d = bytes_of("0\nSECTION\n2\n")
  let scan = scan_tags(d)
  assert_true(scan.warnings.length() > 0)
  assert_true(scan.warnings[0].contains("截断"))
}

///|
test "空行直接跳过，不报警告" {
  // 空行是正常现象（有些写出器会在段之间空一行），不该刷警告
  let d = bytes_of("0\nSECTION\n\n\n0\nEOF\n")
  let scan = scan_tags(d)
  assert_eq(scan.warnings.length(), 0)
  assert_true(tags_text(d) == "0:SECTION 0:EOF ")
}

// ── 编码判断 ────────────────────────────────────────────────────────────

///|
test "版本号新就一律 UTF-8，不管代码页写了什么" {
  // 这是真实语料里的活陷阱：circle.dxf 是 AC1027，却声明着 ANSI_1252，
  // 而文件实际是 UTF-8。照代码页解会把中文解成乱码而不报错
  let d = bytes_of(
    "0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1027\n" +
    "9\n$DWGCODEPAGE\n3\nANSI_1252\n0\nENDSEC\n0\nEOF\n",
  )
  assert_true(decide_encoding(d) is Utf8)
}

///|
test "老版本才看代码页" {
  let d = bytes_of(
    "0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n" +
    "9\n$DWGCODEPAGE\n3\nANSI_936\n0\nENDSEC\n0\nEOF\n",
  )
  match decide_encoding(d) {
    Other(n) => assert_eq(n, 936)
    _ => fail("老版本应该按代码页走")
  }
}

///|
test "老版本没写代码页时退回 CP1252" {
  let d = bytes_of("0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n0\nEOF\n")
  assert_true(decide_encoding(d) is Cp1252)
}

///|
test "认不出的代码页降级但不静默" {
  // 降级成 Latin-1 是有损的（GBK 会变乱码），所以必须让调用方能知道
  assert_true(Encoding::Other(936).is_fallback())
  assert_false(Encoding::Utf8.is_fallback())
  assert_false(Encoding::Cp1252.is_fallback())
}

///|
test "CP1252 的高位区不是 Latin-1" {
  // 0x80-0x9F 这一段 CP1252 填的是引号、破折号、欧元符号，
  // 按 Latin-1 解会得到一堆控制字符
  // 0x93 是左双引号 U+201C
  let d = Bytes::from_array([b'\x93'])
  let s = decode_text(d, Cp1252)
  assert_true(s == "\u{201C}")
  // 欧元符号
  let e = Bytes::from_array([b'\x80'])
  assert_true(decode_text(e, Cp1252) == "\u{20AC}")
  // 0xE9 在 Latin-1 和 CP1252 里都是 é
  let a = Bytes::from_array([b'\xE9'])
  assert_true(decode_text(a, Cp1252) == "\u{E9}")
}

///|
test "UTF-8 解码" {
  let d = bytes_of("图层")
  assert_true(decode_text(d, Utf8) == "图层")
}
