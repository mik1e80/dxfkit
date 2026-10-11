// HEADER 段：图纸的全局设置。
//
// 这一段和别处长得不一样，得单独说：
//
//     SECTION
//     2       HEADER        ← 段名
//     9       $ACADVER      ← 变量名（组码 9）
//     1       AC1027        ← 变量的值（类型随变量而定）
//     9       $INSUNITS
//     70      4
//     ...
//     ENDSEC
//
// **变量之间没有组码 0 分隔**。别处的记录都是 `0/类型名` 开头，HEADER 里
// 一个 0 都没有——所有变量全挂在 `SECTION` 那一条记录上，靠 `9` 成对。
// 所以切记录那一层切完之后，HEADER 段是「一条巨长的记录」，得在这里
// 再做一次成对扫描。

///|
/// 一个 HEADER 变量。
pub(all) struct HeaderVar {
  /// 变量名，带 `$` 前缀（`$ACADVER`）
  name : String
  /// 这个变量的全部值 tag。
  ///
  /// **多数变量只有一个值，但坐标类的是三个**——`$EXTMIN` 的值写成
  /// `10 / x`、`20 / y`、`30 / z` 三个 tag。所以这里存数组而不是单个值。
  values : Array[Tag]
}

///|
/// HEADER 段。
pub(all) struct Header {
  vars : Array[HeaderVar]
}

///|
/// 从 HEADER 段解析出变量表。
///
/// 走法：碰到 `9` 就开一个新变量，**把后面所有不是 `9` 的 tag 全收进去**，
/// 直到下一个 `9` 或者段结束。不能按「两个两个一组」扫——坐标类的变量
/// 有三个值，按对扫会把 y/z 丢掉，`$EXTMIN` 就只剩一个 x 了。
pub fn parse_header(section : Section) -> Header {
  let vars : Array[HeaderVar] = []
  for record in section.records {
    let tags = record.common
    let mut i = 0
    while i < tags.length() {
      if tags[i].code != 9 {
        i = i + 1
        continue
      }
      let values : Array[Tag] = []
      let mut j = i + 1
      while j < tags.length() && tags[j].code != 9 {
        values.push(tags[j])
        j = j + 1
      }
      vars.push({ name: tags[i].value.as_string(), values })
      i = j
    }
  }
  { vars, }
}

///|
/// 取一个变量的原始值。
pub fn Header::get(self : Header, name : String) -> HeaderVar? {
  for v in self.vars {
    if v.name == name {
      return Some(v)
    }
  }
  None
}

///|
/// 取一个变量的第一个值（字符串）。
pub fn Header::get_string(self : Header, name : String) -> String {
  match self.get(name) {
    Some(v) =>
      if v.values.length() > 0 {
        v.values[0].value.as_string()
      } else {
        ""
      }
    None => ""
  }
}

///|
/// 取一个变量的第一个值（数值）。没有就用默认值。
///
/// 注意 HEADER 变量的值**有时是字符串有时是数字**（`$ACADVER` 是字符串，
/// `$INSUNITS` 是整数），所以两个取值函数都要有。
pub fn Header::get_int(self : Header, name : String, default : Int) -> Int {
  match self.get(name) {
    Some(v) =>
      if v.values.length() > 0 {
        v.values[0].value.as_int()
      } else {
        default
      }
    None => default
  }
}

///|
/// 取一个变量表示的三维点（`$EXTMIN` / `$EXTMAX` 这类）。
///
/// 值不够三个时返回 `None`——宁可说「不知道」，也不要拿 x 当 z 用。
pub fn Header::get_point(self : Header, name : String) -> Vec3? {
  match self.get(name) {
    Some(v) =>
      if v.values.length() >= 3 {
        Some(
          Vec3::new(
            v.values[0].value.as_double(),
            v.values[1].value.as_double(),
            v.values[2].value.as_double(),
          ),
        )
      } else {
        None
      }
    None => None
  }
}

// ── 几个常用的变量 ──────────────────────────────────────────────────────
//
// 这几个是加工检查要用到的，单独给个名字，省得到处写字符串。

///|
/// 图纸单位。
///
/// `$INSUNITS` 的值是个编号：0 = 没指定、1 = 英寸、4 = 毫米、6 = 米。
/// **0 是最危险的值**——没指定单位意味着图纸上的「1」到底是 1 毫米还是
/// 1 英寸无从判断，差 25.4 倍。加工检查会把这一条报出来。
pub fn Header::insunits(self : Header) -> Int {
  self.get_int("$INSUNITS", 0)
}

///|
/// 单位编号的中文名。
pub fn unit_name(code : Int) -> String {
  match code {
    0 => "未指定"
    1 => "英寸"
    2 => "英尺"
    3 => "英里"
    4 => "毫米"
    5 => "厘米"
    6 => "米"
    7 => "千米"
    8 => "微英寸"
    9 => "密尔"
    10 => "码"
    11 => "埃"
    12 => "纳米"
    13 => "微米"
    14 => "分米"
    15 => "十米"
    16 => "百米"
    17 => "兆米"
    18 => "天文单位"
    19 => "光年"
    20 => "秒差距"
    _ => "未知（\{code}）"
  }
}

///|
/// 一个单位编号对应多少毫米。没指定（0）或认不出时返回 `None`——
/// **不猜**，猜错了尺寸差几百倍。
pub fn unit_to_mm(code : Int) -> Double? {
  match code {
    1 => Some(25.4)
    2 => Some(304.8)
    3 => Some(1609344.0)
    4 => Some(1.0)
    5 => Some(10.0)
    6 => Some(1000.0)
    7 => Some(1000000.0)
    8 => Some(0.0000254)
    9 => Some(0.0254)
    10 => Some(914.4)
    11 => Some(1.0e-7)
    12 => Some(1.0e-6)
    13 => Some(0.001)
    14 => Some(100.0)
    15 => Some(10000.0)
    16 => Some(100000.0)
    17 => Some(1.0e9)
    18 => Some(1.495978707e14)
    19 => Some(9.4607304725808e18)
    20 => Some(3.0856775814913673e19)
    _ => None
  }
}

///|
/// 图纸范围的左下角（`$EXTMIN`）。
pub fn Header::extmin(self : Header) -> Vec3? {
  self.get_point("$EXTMIN")
}

///|
/// 图纸范围的右上角（`$EXTMAX`）。
pub fn Header::extmax(self : Header) -> Vec3? {
  self.get_point("$EXTMAX")
}
