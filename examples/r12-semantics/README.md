# R12 拟合网格、阵列属性和标注图块案例

三份 ASCII DXF 由本项目按 AC1009 字段约定编制，[Apache-2.0](../../LICENSE)。它们是用于验证具体字段与坐标的自建数据。实际 CAD 导出另见 [OCS 和阵列导出](../cad-ocs/README.md)。

| 模型 | 独立预期 |
| --- | --- |
| [拟合网格](fitted-mesh.dxf) | 三次 B 样条类型字段，2×2 控制框和 3×2 已存 WCS 样点交错保存。M 闭合接缝四角依次是 (2,0,3)、(0,0,1)、(0,2,1)、(2,2,3)。验证器另检查仅控制框及缺失部分样点。样点按文件读取，案例未验证由控制框重拟合的结果。 |
| [阵列属性](array-attributes.dxf) | 3 列、2 行，间距 7 和 11，旋转 90°，INSERT 法向为 −Z。第 (1,1) 行列单元在所在空间的增量为 (11,7,0)。已存 ATTRIB 的锚点和对齐点分别成为 (10,10,2) 和 (7,13,5)。常量 ATTDEF 由块坐标变换，锚点为 (1,29,0)。还检查文字基向量、越界单元和缺少 SEQEND。 |
| [标注图块](dimension-picture.dxf) | 读取合法 DIMSTYLE 和两个 DSTYLE 项。−Z 法向、标注高程 2 和 OCS 平移 (3,4,5) 使标注线从 (−4,6,−7) 指向 (−7,6,−7)，嵌套箭头延伸至 (−7,7,−7)。同时验证图元预算和损坏 DSTYLE。 |

在仓库根目录运行 `moon run examples/r12-semantics/runner --deny-warn`，定向 CI 使用同一入口。曲面样点、属性位置和标注图块都通过独立的读取接口取得，二维检查的既有覆盖边界仍适用。格式依据见 [Autodesk AutoCAD R12 DXF Reference](https://forums.autodesk.com/autodesk/attachments/autodesk/autocad-lt-forum-en/25135/1/DXF%20Reference.pdf) 和 [Autodesk 的 DSTYLE 说明](https://help.autodesk.com/cloudhelp/2018/ENU/OARXMAC-RefGuide/files/OREFMAC-Dimension_Style_Overrides.html)。
