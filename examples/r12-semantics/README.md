# R12 拟合网格、阵列属性和标注图块案例

这些 ASCII DXF 由本项目按 AC1009 字段约定编制，[Apache-2.0](../../LICENSE)。它们是用于验证具体字段与坐标的自建数据。实际 CAD 导出另见 [OCS 和阵列导出](../cad-ocs/README.md)。

| 模型 | 独立预期 |
| --- | --- |
| [拟合网格](fitted-mesh.dxf) | 三次 B 样条类型字段，2×2 控制框和 3×2 已存 WCS 样点交错保存。M 闭合接缝四角依次是 (2,0,3)、(0,0,1)、(0,2,1)、(2,2,3)。验证器另检查仅控制框及缺失部分样点。样点按文件读取，案例未验证由控制框重拟合的结果。 |
| [阵列属性](array-attributes.dxf) | 3 列、2 行，间距 7 和 11，旋转 90°，INSERT 法向为 −Z。第 (1,1) 行列单元在所在空间的增量为 (11,7,0)。已存 ATTRIB 的锚点和对齐点分别成为 (10,10,2) 和 (7,13,5)。常量 ATTDEF 由块坐标变换，锚点为 (1,29,0)。还检查文字基向量、越界单元和缺少 SEQEND。 |
| [标注图块](dimension-picture.dxf) | 读取合法 DIMSTYLE 和两个 DSTYLE 项。−Z 法向、标注高程 2 和 OCS 平移 (3,4,5) 使标注线从 (−4,6,−7) 指向 (−7,6,−7)，嵌套箭头延伸至 (−7,7,−7)。同时验证图元预算和损坏 DSTYLE。 |

在仓库根目录运行 `moon run examples/r12-semantics/runner --deny-warn`，定向 CI 使用同一入口。曲面样点、属性位置和标注图块都通过独立的读取接口取得，二维检查的既有覆盖边界仍适用。格式依据见 [Autodesk AutoCAD R12 DXF Reference](https://forums.autodesk.com/autodesk/attachments/autodesk/autocad-lt-forum-en/25135/1/DXF%20Reference.pdf) 和 [Autodesk 的 DSTYLE 说明](https://help.autodesk.com/cloudhelp/2018/ENU/OARXMAC-RefGuide/files/OREFMAC-Dimension_Style_Overrides.html)。

## 重拟合、字形排版和标注重算

| 模型 | 独立预期 |
| --- | --- |
| [五个控制框](refit-frames.dxf) | 二次、三次 B 样条开区间使用端点夹持的均匀结点，采样中点 Z 分别为 3×(1/2)² 和 3×(3/8)²。双线性 Bézier 中点 Z 为 4/4。闭合 B 样条使用周期均匀结点，闭合 Bézier 按三点一段的三次链连接。验证闭合接缝、预算拒绝和原始采样未改写。 |
| [属性字形](glyph-layout.dxf) | 文件引用自建 STYLE，验证器为 K-9 提供自建的描边字形（含闭合路径）。检查中心/顶部对齐、Fit 与 Aligned 的不同字高、倾斜、镜像、不可见属性和点数预算。示例中的字体名是用来核对 STYLE 传递的标签，字体文件不随示例分发。 |
| [七类标注](recompute-dimensions.dxf) | 旋转、对齐、两线角、直径、半径、三点角、坐标标注的量值依次为 3、5、π/2、10、5、3π/2、−1。独立校验线端点、反角、文本锚点、样式倍率和省零。定义点修改后，重算值由 3 变为 8，标签由 `[6 mm]` 变为 `[16 mm]`。 |

开放 Bézier 方向使用单一张量积参数区间。采样网格由调用方指定，闭合方向不重复起点。组码 75 标出曲面类型，生成的样点以本库结点约定为准。属性需要调用方提供字体整形、度量以及带孔的轮廓或开路径。本库负责 R12 排版和仿射放置，支持的字形集合由提供器决定。标注重算输出量值、十进制标签、基本线和圆弧，支持选定样式项 `DIMLFAC`、`DIMRND`、`DIMZIN` 和 `DIMPOST`。箭头造型、容差格式、自动挪让、编辑目标绑定及外部字体解码未覆盖。

曲面类型和标注定义点参考 [Autodesk PEDIT 曲面说明](https://help.autodesk.com/cloudhelp/2027/ENG/AutoCAD-Core/files/GUID-88A3C094-3001-439D-8AE8-6F57412AFE70.htm)与 [R12 DXF Reference](https://forums.autodesk.com/autodesk/attachments/autodesk/autocad-lt-forum-en/25135/1/DXF%20Reference.pdf)。

## 字体解码、动态标注及逐点对照

| 案例 | 验证结果与边界 |
| --- | --- |
| [TrueType](fixture.ttf)、[传统 SHX](fixture.shx)、[Unicode SHX](fixture-unicode.shx) | 项目自建字体原件按 Apache-2.0 分发。验证 TrueType 的二次轮廓中点、平移复合字形和前进宽度，以及两种 SHX 签名、16 位子字形、递归超限与截断。字形字节可直接用于属性排版。 |
| [编辑绑定与样式](bound-style.dxf) | 句柄 A0 的线段端点从 10 改到 14 后，D1 的标注重算为 14。验证句柄缺失和重复、文字高度、颜色、间隙、箭头及延伸线抑制。 |
| [逐点误差](mesh-compare.dxf) | 9 个 M-major WCS 点中，仅中心点人为加入 0.125 偏差。比较器返回 9 个误差、最大误差 0.125、索引 4、超差数 1。此案例为自建数值真值。 |

字体读入有字节、递归和工作预算。TrueType 范围为单 sfnt、水平度量、Unicode cmap 4/12、简单二次轮廓与 XY 偏移复合字形。SHX 支持传统和 Unicode 横排笔画。BIGFONT、点对点复合附件、CFF、指令 hinting、GSUB/GPOS、复杂字形整形不在当前字节解码范围。[OpenType 格式](https://learn.microsoft.com/en-us/typography/opentype/spec/glyf) · [SHX 笔画定义](https://help.autodesk.com/cloudhelp/2024/ENU/AutoCAD-Customization/files/GUID-06832147-16BE-4A66-A6D0-3ADF98DC8228.htm) · [SHX 容器布局参考](https://github.com/mozman/ezdxf/blob/v1.4.4/src/ezdxf/fonts/shapefile.py)

关联由编辑器保存，R12 DXF 可缺少与源实体的连结，库不从相同坐标猜测对象。重渲染支持默认闭合箭头或短划、ACI 颜色、延伸线偏移和抑制、直线标签间隙及文字高度。自定义箭头块、容差与替代单位、自动挪让等样式仍应读取已存图块或交给上层绘制。[Autodesk 的 R12 降版限制](https://help.autodesk.com/cloudhelp/2022/ENU/AutoCAD-Core/files/GUID-C36C0AF2-6925-4E7F-BDAD-F57897D837B2.htm)

**旧版 CAD 样本未取得。** 当前真实 CAD 案例与第三方语料中，没有经核实从旧版 CAD 原生导出且同时保留拟合控制框和样点的 AC1009 文件。真实对照需记录软件版本、原件来源和许可、采样网格尺寸与闭合位，再以 `compare_refit()` 记录逐点 WCS 误差。现代程序仅写出 AC1009 版本号不构成旧版 CAD 的验证。
