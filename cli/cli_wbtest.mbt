// 白盒测试：CLI 的小工具函数。
//
// 判定逻辑全在库里有专门的测试，这里只管「命令行这层」自己：
// 数字不解析错、标签不打错。

///|
test "严重程度标签" {
  assert_true(severity_tag(@dxfkit.Fatal) == "致命")
  assert_true(severity_tag(@dxfkit.Warn) == "警告")
  assert_true(severity_tag(@dxfkit.Info) == "提示")
}

///|
test "数字解析：正常值原样，坏输入退回默认" {
  assert_true(parse_num("0.5", 1.0) == 0.5)
  assert_true(parse_num("2", 1.0) == 2.0)
  // 解析不了的会先打一行提示，然后退回默认
  assert_true(parse_num("半毫米", 1.0) == 1.0)
}
