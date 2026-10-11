# dxfkit

用 MoonBit 写的 DXF（CAD 图纸）工具链。回答一个问题：**这份图纸能不能上机床。**

> **项目状态**：开发中（2026-10 月）。解析器、图纸骨架、实体层、几何离散、
> 加工前检查和 SVG 预览已落地。这份文档随功能落地逐步展开，
> 不写还没做的东西。

## 为什么需要它

DXF 是 CAD 之间交换图纸的通用格式——机械制图、建筑设计、激光切割、CNC 加工、
PCB 制板都在用。能打开图纸的软件很多，但**能把「这份图纸能不能加工」说清楚的很少**。

加工失败的原因往往不在机床，在图纸本身：轮廓没闭合、同一段线画了两遍、
圆的半径是零或负数、文字没转成曲线、曲线被打成低精度多段线。
这些从预览图上看都不出来——图看着是好好的。

## 能做什么

```text
解析    ASCII DXF（R10–R2018）、二进制 DXF
实体    LINE / CIRCLE / ARC / ELLIPSE / SPLINE / POINT
        LWPOLYLINE / POLYLINE / TEXT / MTEXT / INSERT / HATCH
几何    轮廓离散（bulge 圆弧、NURBS 样条）、块引用的嵌套变换
检查    轮廓闭合、自相交、重复切割、最小间隙、文字未转曲线
预览    SVG 渲染
形态    库 + 命令行 + 网页
```

（上面是**目标范围**。已经能跑的部分在下面的「已完成」里列。）

## 已完成

- `vec.mbt` —— `Vec2` / `Vec3` / `Aabb2` / `Aabb3`、角度归一化、容差比较
- `tag.mbt` —— 组码 → 类型的区间表、各类谓词、坐标组码归组
- `codepage.mbt` —— 编码判断（版本规则）、UTF-8 / CP1252 解码
- `reader_ascii.mbt` —— ASCII 行对扫描：trim、三种换行、EOF 处理、坏行恢复
- `structure.mbt` —— 段 → 记录 → 子类三级切分，坏结构尽力而为
- `subclass.mbt` —— 老格式（R10/R12 没有 `100` 标记）按类型合成子类名
- `header.mbt` —— HEADER 变量成对扫描、单位换算表、图纸范围
- `tables.mbt` —— 图层（含开关/冻结/锁定）、线型、文字样式、块记录
- `entity.mbt` —— 实体层：LINE / POINT / CIRCLE / ARC / ELLIPSE / SPLINE、
  LWPOLYLINE / POLYLINE（含 bulge）、TEXT / MTEXT / ATTRIB、INSERT 与块定义、
  SOLID / HATCH / DIMENSION；认不出的实体保留原记录进 `Unknown`
- `flatten.mbt` —— 几何离散：bulge 圆弧（照 ezdxf 公式移植）、圆 / 弧、
  椭圆、NURBS 样条（de Boor、含有理权重），自适应细分，容差是弦高
- `expand.mbt` —— 块展开：INSERT 嵌套变换（仿射复合）、图层 0 继承、循环检测
- `check.mbt` —— 加工前检查：退化几何、文字未转曲线、图层提醒、轮廓闭合、
  自相交、重复切割、最小间隙（阈值由调用方给）；只报告不修改
- `preview.mbt` —— SVG 预览：世界坐标折线 → 图（y 翻转、图层颜色、
  关闭/冻结图层淡画、文字转义）
- `cli/` —— 命令行：`check`（退出码 0/1/2）、`svg`
- `conformance/` —— 语料回归工具与测试

**实测**：47 个真实 DXF 文件、339,913 个 tag、**0 条警告、0 个读不了**
（`moon run conformance`）。结构报告（`moon run conformance --info`）
能打出每份文件的版本、段、图层、单位、范围。同一份语料上：实体层
**5524 个实体、5404 个解码（98%）、0 条警告**；几何层
**3559 条曲线摊成 21430 个点、块展开 6210 条几何**，两边零异常。
加工检查在同一份语料上给出 **1 致命、122 警告、1 提示**——那条致命的
就是语料里为负半径造的 `circle_radius_le_0.dxf`，被精确逮到。

## 实现上的几个决定

**容差是参数，不是常量。** 图纸的单位跨度极大——`circle.dxf` 的 `$INSUNITS` 是 6（米），
而机加工图纸常常是毫米甚至微米。写死一个「1e-6 就算同一个点」，在公里级的图纸上会把
本来分开的点焊在一起，在微米级的图纸上又会把同一个点当成两个。所以凡是判「相等 /
重合 / 闭合」的地方，容差一律由调用方传进来。

**解析器永不 panic。** 产出「图纸 + 一串警告」。真实世界的 DXF 大量来自第三方导出器，
损坏的文件比想象中多；「读了 90% 然后告诉你哪里坏了」比「抛异常」有用得多。

## 开发

仓库根目录就是 MoonBit 模块根：

```bash
moon test                              # 跑测试
moon check --target all --deny-warn    # 全目标检查，要求零警告
```

## 项目结构

- `vec.mbt` — 二维/三维向量、轴对齐包围盒、角度归一化
- `tag.mbt` — 组码与值的类型、组码到类型的区间表、语义分类谓词
- `codepage.mbt` — 文本编码的判断与解码
- `reader_ascii.mbt` — ASCII DXF 的行对扫描
- `structure.mbt` — 段 / 记录 / 子类的三级切分
- `subclass.mbt` — 老格式记录的子类名合成
- `header.mbt` — HEADER 变量、单位、图纸范围
- `tables.mbt` — TABLES 段：图层、线型、文字样式、块记录
- `entity.mbt` — 实体层：几何翻译、块定义与引用、`Unknown` 兜底
- `flatten.mbt` — 几何离散：曲线 → 折线点列（容差 = 弦高）
- `expand.mbt` — 块展开：INSERT → 世界坐标几何
- `check.mbt` — 加工前检查（能上机床吗）
- `preview.mbt` — SVG 预览
- `cli/` — 命令行入口（可执行）
- `conformance/` — 语料批量工具（可执行）与回归测试
- `testdata/ezdxf/` — 47 个真实 DXF 文件（来自 ezdxf，MIT）

## 参考

设计上参考 [ezdxf](https://ezdxf.mozman.at/)（Python 的 DXF 库，MIT 许可）。
**只参考 API 与设计，没有复制代码**——本项目是 MoonBit 实现，数据结构和 API 都不同。
逐项对比见 [`COMPARISON.md`](COMPARISON.md)。

## 许可证

Apache License 2.0，见 [LICENSE](LICENSE)。
