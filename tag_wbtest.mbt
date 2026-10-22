// 白盒测试：组码的类型表与语义分类。
//
// 这张表是二进制格式的地基（决定读几个字节），也是 ASCII 格式里
// 「怎么解析这一行的文本」的依据。区间是从 ezdxf 源码核对的，测试用来防抄错。

// ── 组码 → 类型 ─────────────────────────────────────────────────────────

///|
test "坐标和尺寸是浮点" {
  // 坐标（10-39）、半径和角度（40-59）、挤出方向（210-239）
  for c in [10, 20, 30, 39, 40, 50, 59, 110, 149, 210, 239, 460, 1010, 1059] {
    assert_true(code_type(c) is F64)
  }
}

///|
test "16 位整数的区间" {
  for c in [60, 70, 79, 170, 179, 270, 289, 370, 389, 400, 409, 1060, 1070] {
    assert_true(code_type(c) is I16)
  }
}

///|
test "32 位整数的区间" {
  for c in [90, 99, 420, 429, 440, 459, 1071] {
    assert_true(code_type(c) is I32)
  }
}

///|
test "64 位整数的区间" {
  // 只有 160-169 这一段
  for c in [160, 165, 169] {
    assert_true(code_type(c) is I64)
  }
  // 相邻的不是
  assert_false(code_type(159) is I64)
  assert_false(code_type(170) is I64)
}

///|
test "布尔只有 290-299" {
  for c in [290, 295, 299] {
    assert_true(code_type(c) is Bool)
  }
  assert_false(code_type(289) is Bool)
  assert_false(code_type(300) is Bool)
}

///|
test "二进制块的两个区间" {
  for c in [310, 319, 1004] {
    assert_true(code_type(c) is Bin)
  }
  // 320 开始是句柄引用，不是二进制
  assert_false(code_type(320) is Bin)
}

///|
test "没列到的组码一律当字符串" {
  // 这不是兜底——DXF 里「名字」类的字段（实体类型名、图层名、句柄）
  // 本来就散落在各个区间之外，而字符串是唯一能安全容纳未知内容的类型
  for
    c in [
      0, 1, 2, 3, 5, 6, 7, 8, 100, 102, 105, 300, 330, 347, 390, 410, 999, 1000,
      1001,
    ] {
    assert_true(code_type(c) is Str)
  }
}

///|
test "区间边界两侧" {
  // 每个区间的两端都要测：差一位就会把整数当浮点读
  assert_true(code_type(9) is Str)
  assert_true(code_type(10) is F64)
  assert_true(code_type(59) is F64)
  assert_true(code_type(60) is I16)
  assert_true(code_type(79) is I16)
  assert_true(code_type(80) is Str)
  assert_true(code_type(89) is Str)
  assert_true(code_type(90) is I32)
}

// ── 坐标组码的归组 ──────────────────────────────────────────────────────

///|
test "坐标组码：十位定轴、个位定第几个点" {
  // 10/20/30 是第 0 个点的 x/y/z
  assert_true(point_code_parts(10) == Some((0, 0)))
  assert_true(point_code_parts(20) == Some((0, 1)))
  assert_true(point_code_parts(30) == Some((0, 2)))
  // 11/21/31 是第 1 个点（3DFACE 的四个角就是这么排的）
  assert_true(point_code_parts(11) == Some((1, 0)))
  assert_true(point_code_parts(21) == Some((1, 1)))
  assert_true(point_code_parts(31) == Some((1, 2)))
  // 12/22/32 是第 2 个点
  assert_true(point_code_parts(12) == Some((2, 0)))
}

///|
test "38 在通用规则下是第 8 个点的 z" {
  // 这里要说清楚一层分工：**通用规则只看组码本身**，38 就是「第 8 个点的 z」。
  //
  // 但 LWPOLYLINE 把它当**标高**用——这正是「同一个组码在不同子类里含义不同」
  // 的例子。覆盖发生在子类那一层（`subclass.mbt` + 各实体的解码），
  // 不在这张通用表里。
  assert_true(is_point_code(38))
  assert_true(point_code_parts(38) == Some((8, 2)))
  // 39 按公式是「第 9 个点的 z」，但多数实体里它是**厚度**。
  // 通用表照公式给答案，具体含义由子类层定
  assert_true(point_code_parts(39) == Some((9, 2)))
}

///|
test "十位是 4 以上就不是坐标了" {
  // 40 是半径、50 是角度，都不在坐标区间
  assert_true(point_code_parts(40) == None)
  assert_true(point_code_parts(50) == None)
}

///|
test "不是坐标组码就返回空" {
  assert_true(point_code_parts(9) == None)
  assert_true(point_code_parts(40) == None)
  assert_true(point_code_parts(0) == None)
}

///|
test "坐标组码的范围是 10 到 39" {
  assert_false(is_point_code(9))
  assert_true(is_point_code(10))
  assert_true(is_point_code(39))
  // 40 是半径、50 是角度，都不是坐标
  assert_false(is_point_code(40))
  assert_false(is_point_code(50))
}

// ── 其它分类 ────────────────────────────────────────────────────────────

///|
test "句柄组码有两个" {
  // 5 是通用的句柄，105 是 DIMSTYLE 专用的——同一个含义用了两个码，
  // 是历史包袱，两个都得认
  assert_true(is_handle_code(5))
  assert_true(is_handle_code(105))
  assert_false(is_handle_code(6))
  assert_false(is_handle_code(330))
}

///|
test "引用组码" {
  // 330 是所有者、360 是硬引用、390 是打印样式引用
  assert_true(is_pointer_code(330))
  assert_true(is_pointer_code(347))
  assert_true(is_pointer_code(360))
  assert_true(is_pointer_code(390))
  assert_true(is_pointer_code(481))
  // 320 之前不是
  assert_false(is_pointer_code(319))
  // 370 是线宽（整数），不是引用
  assert_false(is_pointer_code(370))
}

///|
test "扩展数据组码的范围" {
  assert_false(is_xdata_code(999))
  assert_true(is_xdata_code(1000))
  assert_true(is_xdata_code(1001))
  assert_true(is_xdata_code(1071))
  assert_false(is_xdata_code(1072))
}

///|
test "记录开始与子类标记" {
  assert_true(Tag::new(0, Str("CIRCLE")).is_record_start())
  assert_false(Tag::new(1, Str("CIRCLE")).is_record_start())
  assert_true(Tag::new(100, Str("AcDbEntity")).is_subclass_marker())
  assert_false(Tag::new(101, Str("Embedded Object")).is_subclass_marker())
}

// ── 取值 ────────────────────────────────────────────────────────────────

///|
test "从各种类型里取浮点" {
  assert_true(TagValue::F64(1.5).as_double() == 1.5)
  // 整数也认——现实里见过把整数写在坐标位上的文件
  assert_true(TagValue::I16(3).as_double() == 3.0)
  assert_true(TagValue::I32(4).as_double() == 4.0)
  // 字符串取浮点给 0，不崩
  assert_true(TagValue::Str("abc").as_double() == 0.0)
}

///|
test "从各种类型里取字符串" {
  assert_true(TagValue::Str("CIRCLE").as_string() == "CIRCLE")
  assert_true(TagValue::F64(1.0).as_string() == "")
}

///|
test "从各种类型里取布尔" {
  assert_true(TagValue::Bool(true).as_bool())
  assert_false(TagValue::Bool(false).as_bool())
  assert_true(TagValue::I16(1).as_bool())
  assert_false(TagValue::I16(0).as_bool())
  assert_true(TagValue::F64(0.5).as_bool())
}
