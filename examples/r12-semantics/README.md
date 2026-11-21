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
