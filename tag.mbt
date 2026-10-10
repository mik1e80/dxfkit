// DXF 的 tag：一个组码配一个值。
//
// DXF 文件在最低层就是一串 `(组码, 值)` 对，ASCII 版里长这样（各占一行）：
//
//     0
//     CIRCLE
//     10
//     0.0
//
// 组码是个整数，**它的数值范围决定了值是什么类型**——这是整个格式的地基：
//
//     10-59    双精度浮点（坐标、半径、角度…）
//     60-79    16 位整数
//     90-99    32 位整数
//     160-169  64 位整数
//     210-239  双精度（挤出方向）
//     290-299  布尔（单字节）
//     310-319  二进制块
//     其余     字符串（包括所有「名字」类的字段）
//
// 这张表有两种用法：ASCII 版里所有值都是文本，用它决定怎么解析文本；
// 二进制版里值本来就是二进制的，用它决定读几个字节。
//
// 区间划分是照 ezdxf 的 `lldxf/types.py` 核对的——那里面踩过的坑没必要再踩一遍。

// ── 值的类型 ────────────────────────────────────────────────────────────

///|
/// 组码对应的数据类型。
pub(all) enum TagType {
  /// 字符串。DXF 里所有「名字」类的字段都是它——实体类型名、图层名、句柄
  Str
  /// 16 位整数
  I16
  /// 32 位整数
  I32
  /// 64 位整数
  I64
  /// 双精度浮点
  F64
  /// 布尔（二进制版里占 1 个字节）
  Bool
  /// 二进制块（二进制版里前面有个 1 字节长度）
  Bin
}

///|
/// 一个 tag 的值。
///
/// 有意做成强类型而不是「一律存字符串」：二进制格式里值本来就是分类型的，
/// 而且取用时不用每次都重新解析文本（一张图几万个 tag，省下来的是实打实的）。
pub(all) enum TagValue {
  Str(String)
  I16(Int)
  I32(Int)
  I64(Int64)
  F64(Double)
  Bool(Bool)
  Bin(Bytes)
}

///|
/// 取字符串。不是字符串时返回空串。
pub fn TagValue::as_string(self : TagValue) -> String {
  match self {
    Str(s) => s
    _ => ""
  }
}

///|
/// 取浮点数。整数会转成浮点，其它类型返回 0。
///
/// 坐标组码理论上都是 F64，但现实里见过把整数写在坐标位上的文件，
/// 所以整数也认。
pub fn TagValue::as_double(self : TagValue) -> Double {
  match self {
    F64(v) => v
    I16(v) | I32(v) => v.to_double()
    I64(v) => v.to_double()
    Bool(b) => if b { 1.0 } else { 0.0 }
    _ => 0.0
  }
}

///|
/// 取整数。浮点会截断，其它类型返回 0。
pub fn TagValue::as_int(self : TagValue) -> Int {
  match self {
    I16(v) | I32(v) => v
    I64(v) => v.to_int()
    F64(v) => v.to_int()
    Bool(b) => if b { 1 } else { 0 }
    _ => 0
  }
}

///|
/// 取布尔。整数非零为真。
pub fn TagValue::as_bool(self : TagValue) -> Bool {
  match self {
    Bool(b) => b
    I16(v) | I32(v) => v != 0
    I64(v) => v != 0L
    F64(v) => v != 0.0
    _ => false
  }
}

///|
/// 一个 tag：组码 + 值。
pub(all) struct Tag {
  code : Int
  value : TagValue
}

///|
pub fn Tag::new(code : Int, value : TagValue) -> Tag {
  { code, value }
}

///|
/// 组码是不是标志一条新记录（`0`）。
///
/// 组码 0 的值就是记录类型名——`CIRCLE` / `LINE` / `SECTION` / `EOF`。
/// 整个文件的骨架就是靠它切出来的。
pub fn Tag::is_record_start(self : Tag) -> Bool {
  self.code == 0
}

///|
/// 组码是不是子类标记（`100`）。
///
/// 这是 DXF 最特别的地方：`100` 的值是一个类名（`AcDbEntity` / `AcDbCircle`…），
/// **它一出现，后面组码的含义就换成那个类的定义了**。
/// 同一个组码 70 在 `AcDbSymbolTable` 里是「最大条目数」，在图层记录里是「标志位」。
pub fn Tag::is_subclass_marker(self : Tag) -> Bool {
  self.code == 100
}

///|
/// 记录的显示用名字（组码 + 值），出错信息里用。
pub fn Tag::to_display(self : Tag) -> String {
  match self.value {
    Str(s) => "\{self.code}: \{s}"
    _ => "\{self.code}: \{self.value.as_double()}"
  }
}

// ── 组码 → 类型 ─────────────────────────────────────────────────────────

///|
/// 查一个组码对应什么类型。
///
/// 区间照抄 ezdxf 的 `lldxf/types.py`（已核对）。没列到的组码一律当字符串——
/// 这不只是兜底：DXF 里「名字」类的字段散落在各个区间之外，
/// 而字符串是唯一能安全容纳未知内容的类型。
pub fn code_type(code : Int) -> TagType {
  if in_ranges(code, [(60, 79), (170, 179), (270, 289), (370, 389), (400, 409), (1060, 1070)]) {
    I16
  } else if in_ranges(code, [(90, 99), (420, 429), (440, 459), (1071, 1071)]) {
    I32
  } else if in_ranges(code, [(160, 169)]) {
    I64
  } else if in_ranges(code, [(10, 59), (110, 149), (210, 239), (460, 469), (1010, 1059)]) {
    F64
  } else if in_ranges(code, [(290, 299)]) {
    Bool
  } else if in_ranges(code, [(310, 319), (1004, 1004)]) {
    Bin
  } else {
    Str
  }
}

///|
/// 组码是否落在给定的若干闭区间里。
fn in_ranges(code : Int, ranges : Array[(Int, Int)]) -> Bool {
  for r in ranges {
    if code >= r.0 && code <= r.1 {
      return true
    }
  }
  false
}

// ── 组码的语义分类 ──────────────────────────────────────────────────────
//
// 下面这些都只回答「这个组码属于哪一类」，不回答「它具体是什么意思」——
// 后者要看当前在哪个子类里（见 `subclass.mbt`）。

///|
/// 是不是坐标组码（`10`-`39`）。
///
/// DXF 的坐标是**成组**出现的：`10/20/30` 是一个点的 x/y/z，
/// `11/21/31` 是第二个点，以此类推。规律是「个位数定轴、十位数定第几个点」。
pub fn is_point_code(code : Int) -> Bool {
  code >= 10 && code <= 39
}

///|
/// 把坐标组码拆成 `(第几个点, 哪个轴)`。
///
/// 轴用 0/1/2 表示 x/y/z。不是坐标组码时返回 `None`。
///
/// 例：`10` → (0, 0)、`21` → (1, 1)、`32` → (2, 2)。
pub fn point_code_parts(code : Int) -> (Int, Int)? {
  if !is_point_code(code) {
    return None
  }
  // 十位：1=x 2=y 3=z（10/20/30 就是第一个点的三个分量）
  let axis = code / 10 - 1
  if axis > 2 {
    // 4-9 不是坐标轴（48/49 之类在部分实体里另有含义）
    return None
  }
  // 个位：第几个点（10 → 第 0 个，11 → 第 1 个）
  Some((code % 10, axis))
}

///|
/// 是不是句柄组码（`5` / `105`）。
///
/// 句柄是对象在文件内的唯一编号（十六进制字符串），`330` 之类的引用指向它。
/// `105` 是 DIMSTYLE 专用的句柄组码——同一个含义用了两个码，是历史包袱。
pub fn is_handle_code(code : Int) -> Bool {
  code == 5 || code == 105
}

///|
/// 是不是对象引用组码（软指针 / 硬指针）。
///
/// 值是另一个对象的句柄。`330` 是「所有者」，`360` 之类是硬引用。
/// 靠这些把文件里散落的记录连成一张引用图。
pub fn is_pointer_code(code : Int) -> Bool {
  in_ranges(code, [(320, 369), (390, 399), (480, 481), (1005, 1005)])
}

///|
/// 是不是扩展数据（XDATA）组码（`1000`-`1071`）。
///
/// 第三方程序把自己的信息挂在实体上用的。解析时可以整段跳过，
/// 但**要原样保留**——否则读一遍写回去就把别人的数据弄丢了。
pub fn is_xdata_code(code : Int) -> Bool {
  code >= 1000 && code <= 1071
}

///|
/// 是不是二进制块组码。
pub fn is_binary_code(code : Int) -> Bool {
  in_ranges(code, [(310, 319), (1004, 1004)])
}
