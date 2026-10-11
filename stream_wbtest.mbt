// 白盒测试：流式扫描（分块喂入）与整份扫描的等价性。
//
// 等价性是这一层唯一重要的性质——两个入口必须是同一套行为，
// 不然大文件和普通文件会得出不同的结果。
//
// `bytes_of` 定义在 `reader_ascii_wbtest.mbt`。

///|
/// 把一段字节按固定块大小喂给流式扫描器，收齐 tag。
fn streamed_tags(data : Bytes, chunk : Int) -> Array[Tag] {
  let stream = TagStream::new()
  let tags : Array[Tag] = []
  let mut i = 0
  while i < data.length() {
    let stop = if i + chunk > data.length() {
      data.length()
    } else {
      i + chunk
    }
    let part : Array[Byte] = []
    let mut j = i
    while j < stop {
      part.push(data[j])
      j = j + 1
    }
    tags.append(stream.feed(Bytes::from_array(part)))
    i = stop
  }
  tags.append(stream.finish())
  tags
}

///|
/// 两份 tag 序列逐条比（组码 + 显示值），不一致时报出第几条。
fn assert_same_tags(actual : Array[Tag], expected : Array[Tag]) -> Unit raise {
  if actual.length() != expected.length() {
    fail("tag 数不一致：\{actual.length()} vs \{expected.length()}")
  }
  let mut i = 0
  while i < actual.length() {
    if actual[i].code != expected[i].code {
      fail("第 \{i} 条 tag 组码不一致：\{actual[i].code} vs \{expected[i].code}")
    }
    if actual[i].to_display() != expected[i].to_display() {
      fail(
        "第 \{i} 条 tag 值不一致：\{actual[i].to_display()} vs \{expected[i].to_display()}",
      )
    }
    i = i + 1
  }
}

///|
test "逐字节喂入和整份扫描等价（CRLF 全部被劈开）" {
  // 全文用 CRLF：逐字节喂入时每个「\r\n」都落在块边界上，
  // 缓冲逻辑必须把它们重新拼起来
  let text = "0\r\nSECTION\r\n2\r\nENTITIES\r\n0\r\nCIRCLE\r\n40\r\n2.5\r\n0\r\nENDSEC\r\n0\r\nEOF\r\n"
  let data = bytes_of(text)
  let batch = scan_tags(data)
  assert_same_tags(streamed_tags(data, 1), batch.tags)
}

///|
test "攒够 1024 字节后 feed 边喂边出" {
  // 大文件不等 finish：feed 就吐 tag。也顺带验证了「先定编码再吐」
  let sb = StringBuilder()
  sb.write_string("0\nSECTION\n2\nENTITIES\n0\nLWPOLYLINE\n100\nAcDbPolyline\n")
  let mut i = 0
  while i < 100 {
    sb.write_string("10\n1.5\n20\n2.5\n")
    i = i + 1
  }
  sb.write_string("0\nENDSEC\n0\nEOF\n")
  let data = bytes_of(sb.to_string())
  assert_true(data.length() > 1024)
  let stream = TagStream::new()
  let first = stream.feed(data)
  assert_true(first.length() > 0)
  assert_true(stream.encoding() is Some(_))
  let rest = stream.finish()
  assert_eq(first.length() + rest.length(), scan_tags(data).tags.length())
}

///|
test "分块喂入的编码判断和整份一致" {
  // 中文逐字节喂入也不能被切坏——值的解码发生在成对之后，
  // 编码在攒够 1024 字节时（或 finish）就定死了
  let text = "0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1027\n0\nENDSEC\n" +
    "0\nSECTION\n2\nENTITIES\n0\nTEXT\n1\n基准孔\n0\nENDSEC\n0\nEOF\n"
  let data = bytes_of(text)
  let batch = scan_tags(data)
  let stream = TagStream::new()
  let tags : Array[Tag] = []
  let mut i = 0
  while i < data.length() {
    let part : Array[Byte] = [data[i]]
    tags.append(stream.feed(Bytes::from_array(part)))
    i = i + 1
  }
  tags.append(stream.finish())
  assert_true(stream.encoding().unwrap().to_display() == "UTF-8")
  assert_same_tags(tags, batch.tags)
  let mut seen = false
  for t in tags {
    if t.value.as_string() == "基准孔" {
      seen = true
    }
  }
  assert_true(seen)
}

///|
test "EOF 之后的内容不再产出" {
  let text = "0\nSECTION\n2\nENTITIES\n0\nENDSEC\n0\nEOF\n0\nGARBAGE\n"
  let data = bytes_of(text)
  let batch = scan_tags(data)
  let streamed = streamed_tags(data, 3)
  assert_same_tags(streamed, batch.tags)
  for t in streamed {
    assert_true(t.value.as_string() != "GARBAGE")
  }
}

///|
test "截断文件的警告和整份一致" {
  // 末尾一个组码后面没有值——两边都要报「截断了」
  let data = bytes_of("0\nSECTION\n2\nENTITIES\n0\nENDSEC\n0")
  let batch = scan_tags(data)
  assert_true(batch.warnings.length() > 0)
  let stream = TagStream::new()
  let tags = stream.feed(data)
  tags.append(stream.finish())
  assert_same_tags(tags, batch.tags)
  assert_eq(stream.warnings().length(), batch.warnings.length())
}

///|
test "finish 之后 feed 不再产出" {
  let stream = TagStream::new()
  let data = bytes_of("0\nEOF\n")
  let _ = stream.feed(data)
  let _ = stream.finish()
  let more = stream.feed(bytes_of("0\nLINE\n"))
  assert_eq(more.length(), 0)
}
