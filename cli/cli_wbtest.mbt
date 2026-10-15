// 白盒测试：CLI 的小工具函数。
//
// 判定逻辑和报告排版全在库里有专门的测试（`Report::to_text`），
// 这里只管「命令行这层」自己不把数字看错。

///|
test "数字解析：拒绝非法值，不静默退回默认" {
  assert_true(parse_num("0.5") == Some(0.5))
  assert_true(parse_num("2") == Some(2.0))
  assert_true(parse_num("半毫米") is None)
  assert_true(parse_num("NaN") is None)
  assert_true(parse_num("Infinity") is None)
}

///|
/// 把 (组码, 字符串值) 列表变成 tag 数组——测试 StatsTracker 用。
fn str_tags(pairs : Array[(Int, String)]) -> Array[@dxfkit.Tag] {
  let out : Array[@dxfkit.Tag] = []
  for p in pairs {
    out.push(@dxfkit.Tag::new(p.0, @dxfkit.Str(p.1)))
  }
  out
}

///|
test "stats 统计器：版本、段、记录数" {
  // 一份小文件的 tag 骨架：HEADER 一条变量、ENTITIES 两条记录
  let tracker = StatsTracker::new()
  tracker.feed(
    str_tags([
      (0, "SECTION"),
      (2, "HEADER"),
      (9, "$ACADVER"),
      (1, "AC1027"),
      (0, "ENDSEC"),
      (0, "SECTION"),
      (2, "ENTITIES"),
      (0, "LINE"),
      (0, "CIRCLE"),
      (0, "ENDSEC"),
      (0, "EOF"),
    ]),
  )
  assert_eq(tracker.tag_count(), 11)
  assert_true(tracker.version() == "AC1027")
  let sections = tracker.sections()
  assert_eq(sections.length(), 2)
  assert_true(sections[0].0 == "HEADER")
  // HEADER 的变量不是组码 0 记录，所以记 0
  assert_eq(sections[0].1, 0)
  assert_true(sections[1].0 == "ENTITIES")
  // SECTION / ENDSEC 自己不算记录
  assert_eq(sections[1].1, 2)
}

///|
test "stats 统计器：分块喂入不丢状态" {
  // 版本号横跨两次 feed——$ACADVER 的「等值」状态要跨块活着
  let tracker = StatsTracker::new()
  tracker.feed(str_tags([(0, "SECTION"), (2, "HEADER"), (9, "$ACADVER")]))
  tracker.feed(str_tags([(1, "AC1009"), (0, "ENDSEC")]))
  assert_true(tracker.version() == "AC1009")
  assert_eq(tracker.tag_count(), 5)
}
