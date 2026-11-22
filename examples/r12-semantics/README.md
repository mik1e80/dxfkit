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

开放 Bézier 方向使用单一张量积参数区间。采样网格由调用方指定，闭合方向不重复起点。组码 75 标出曲面类型，生成的样点以本库结点约定为准。属性需要调用方提供字体整形、度量以及带孔的轮廓或开路径。本库负责 R12 排版和仿射放置，支持的字形集合由提供器决定。基础重算输出量值、十进制标签、基本线和圆弧，并应用选定的量值样式。编辑绑定、容差文本与箭头的独立案例见下表。

曲面类型和标注定义点参考 [Autodesk PEDIT 曲面说明](https://help.autodesk.com/cloudhelp/2027/ENG/AutoCAD-Core/files/GUID-88A3C094-3001-439D-8AE8-6F57412AFE70.htm)与 [R12 DXF Reference](https://forums.autodesk.com/autodesk/attachments/autodesk/autocad-lt-forum-en/25135/1/DXF%20Reference.pdf)。

## 字体解码、动态标注及逐点对照

| 案例 | 验证结果与边界 |
| --- | --- |
| [TrueType](fixture.ttf)、[传统 SHX](fixture.shx)、[Unicode SHX](fixture-unicode.shx) | 项目自建字体原件按 Apache-2.0 分发。验证 TrueType 的二次轮廓中点、平移复合字形和前进宽度，以及两种 SHX 签名、16 位子字形、递归超限与截断。字形字节可直接用于属性排版。 |
| [BIGFONT](fixture-bigfont.shx) | 项目自建。搭配普通 SHX 后，测试含双字节索引、扩展子形、独立 XY 缩放及错索引和截断拒绝。连续排版的第二条路径由 (1.4, 0.3) 指向 (2.4, 1.1)，总宽 3.2。 |
| [附着与整形](fixture-attachment.ttf) · [HarfBuzz 位置](shaped-attachment.json) | 项目自建单字体。复合字形 B 把缩放后的附属控制点对齐到前一轮廓的点 2。子轮廓起点 x=2，曲线中点 (2.5, 0.5)。GSUB 将 AB 替换为 glyph 2，1200 设计单位对应排版宽 2.4。另拒绝越界附着点。 |
| [进阶标注样式](advanced-dimension.dxf) | 项目自建。10 的测量值显示非对称容差 +0.20/−0.10 和等值替代单位。另校验极限值 10.20/9.90、非零块基点、不对称箭头的端点、箭头缺失、窄标注移出箭头及过宽文字外移。 |
| [编辑绑定与样式](bound-style.dxf) | 句柄 A0 的线段端点从 10 改到 14 后，D1 的标注重算为 14。验证句柄缺失和重复、文字高度、颜色、间隙、箭头及延伸线抑制。 |
| [逐点误差](mesh-compare.dxf) | 9 个 M-major WCS 点中，仅中心点人为加入 0.125 偏差。比较器返回 9 个误差、最大误差 0.125、索引 4、超差数 1。此案例为自建数值真值。 |

TrueType 支持单 sfnt、Unicode cmap 4/12、二次轮廓、XY 偏移和实际轮廓点附件。幻点、hinting、字体变化轴、CFF 保留为边界。BIGFONT 读横排索引与已覆盖的扩展原语，`bigfont_run()` 接收调用者指定的 Unicode 到双字节字形编号映射。调用方提供原始编码到字形编号的映射。竖排支持传统条件指令 14 和下移命令，厂商专用模式尚未验证。[OpenType 格式](https://learn.microsoft.com/en-us/typography/opentype/spec/glyf) · [SHX 笔画定义](https://help.autodesk.com/cloudhelp/2024/ENU/AutoCAD-Customization/files/GUID-06832147-16BE-4A66-A6D0-3ADF98DC8228.htm) · [BIGFONT 原语定义](https://help.autodesk.com/cloudhelp/2015/ENU/AutoCAD-Customization/files/GUID-00ED0CC6-A4BE-4591-93FA-598CC40AA43D.htm) · [BIGFONT 容器索引对照](https://github.com/mlightcad/shx-parser/blob/main/src/contentParser.ts)

关联由编辑器保存，R12 DXF 可缺少与源实体的连结。重渲染支持默认闭合箭头、短划及本地平面图块箭头，以及 ACI 颜色、延伸线偏移、抑制与文字高度。直线布局使用调用方传入的实际宽度，空间不足时将相应部分移出，尊重 `DIMTIX` 和 `DIMSOXD`。容差和替代单位同时提供单行文本与可测量的堆叠片段。整图避碰返回标签位置。前端负责绘制文字轮廓及跨图元引线。[Autodesk 的 R12 降版限制](https://help.autodesk.com/cloudhelp/2022/ENU/AutoCAD-Core/files/GUID-C36C0AF2-6925-4E7F-BDAD-F57897D837B2.htm)

### 用实际整形器重放

[HarfBuzz 适配器](shape-harfbuzz.mjs)为一段已选定方向、脚本、语言与字体的文字输出字形编号及设计单位位移。MoonBit 的 `positioned_run()` 用相同字体还原轮廓，并能交给 `r12_layout_attribute()`。字体选择、Unicode 双向段落分段和复杂脚本的整形由调用者及 HarfBuzz 完成。

```sh
npm install --prefix ./hb-example --no-audit --ignore-scripts harfbuzzjs@1.5.0
node examples/r12-semantics/shape-harfbuzz.mjs ./hb-example/node_modules/harfbuzzjs/dist/index.mjs examples/r12-semantics/fixture-attachment.ttf AB > shaped.json
moon run examples/r12-semantics/runner --target wasm --deny-warn -- shape examples/r12-semantics/fixture-attachment.ttf shaped.json
```

HarfBuzz 14.3.0 实际输出与提交的 [整形数据](shaped-attachment.json) 一致。另用本机 Arial 和阿拉伯文 `السَّلَام`（RTL、`Arab`、`ar`）联调，得到 7 个字形、9 条轮廓、归一化前进宽度约 2.629175，含零前进宽度和非零偏移的附标。系统字体由运行环境提供，仓库分发的字体均为可按 Apache-2.0 使用的自建案例。[HarfBuzz API](https://github.com/harfbuzz/harfbuzzjs)

### 竖排、整段双向与标注避碰

| 案例 | 独立预期 |
| --- | --- |
| [自建竖排 BIGFONT](fixture-bigfont-vertical.shx) | `中A中` 触发 14 后的竖排原语，A 使用普通 SHX。三个字形合计下移 5.2，第一条路径起点为 (0.2, −0.8)，经倾斜属性坐标基放置后为 WCS (9.8, 10, 1.2)。横排跳过同一原语。 |
| [回退字体](fixture-hebrew.ttf) · [整段数据](shaped-paragraph.json) | 对 `אב AB אב`，以首个希伯来字确定 RTL 段落。消费者验证视觉顺序为尾段、Latin 连字、首段，字体下标依次是 1、0、1。两种自建字体合成 8 条轮廓，总前进宽度 13。 |
| [堆叠容差](advanced-dimension.dxf) | 主字号 2 时，`DIMTFAC=0.6` 得到字号 1.2 的上下容差行（+0.20、−0.10），含行距的高度 2.52。替代单位也堆叠，单行字符串兼容原用法。 |
| [整图标签避碰](drawing-label-avoid.dxf) | 两条图线和两个标签共同占位。第一个标签向下移到 (0, −2)，第二个保留 (0, 2)。案例另外断言原位阻挡和检查预算耗尽的两种状态。 |

`bigfont_vertical_run()` 的原点是列顶端中心，Y 向上。它按竖排指令取负 Y 下移，普通 SHX 回退保留直立造型。列可通过 `r12_layout_vertical_attribute()` 放置到属性坐标系。字体文件和自建 DXF 均采用 [Apache-2.0](../../LICENSE)。[Autodesk 指令说明](https://help.autodesk.com/cloudhelp/2022/ENU/AutoCAD-Customization/files/GUID-06832147-16BE-4A66-A6D0-3ADF98DC8228.htm)

[整段适配器](shape-paragraph.mjs)以 bidi-js 1.0.3 的 Unicode 13 数据解析方向和视觉顺序，以字素簇选择 TrueType 回退，按区段交给 HarfBuzz 整形。一个完整的脚本区段优先由单一字体整形。缺字报告 UTF-16 位置。入口处理一段未折行的文字，使用调用方明确提供的字体路径。已用本机 Arial 复查 `AB السَّلَام AB`，得到三个区段和 13 条轮廓。系统字体与 npm 包不随仓库分发。[Unicode 双向算法](https://unicode.org/reports/tr9/) · [bidi-js](https://github.com/lojjic/bidi-js)

```sh
npm install --prefix ./hb-example --no-audit --ignore-scripts harfbuzzjs@1.5.0 bidi-js@1.0.3 unicode-properties@1.4.1
node examples/r12-semantics/shape-paragraph.mjs ./hb-example auto "אב AB אב" examples/r12-semantics/fixture-attachment.ttf examples/r12-semantics/fixture-hebrew.ttf > paragraph.json
moon run examples/r12-semantics/runner --target wasm --deny-warn -- paragraph paragraph.json examples/r12-semantics/fixture-attachment.ttf examples/r12-semantics/fixture-hebrew.ttf
```

整图避碰先用 `layout_text()` 测量堆叠片段，再用 `WorldExpansion::r12_dimension_obstacles()` 和 `R12StyledDimension::r12_dimension_obstacles()` 取得 WCS XY 保守包围盒。调用方补充实测文字盒，并传入全部标签与障碍。搜索按输入优先级选择有限网格位置，只移动标签中心。圆弧、斜边的保守包围盒可能阻挡其实可用的区域。画线联动、引线、三维避碰和全局最优解未覆盖。

### 旧版 CAD 曲面的证据

核对了 LibreDWG 的 R11 归档中的三份 ASCII DXF。三份都是 AC1009，`Constraints_12.dxf` 没有 POLYLINE，`entities-2d.dxf` 和 `entities-3d.dxf` 各有一个普通 POLYLINE，组码 70 和 75 均缺省或为零。本轮又查到 FlySong 的 AC1009 激光切割文件，其两条闭合 POLYLINE 的组码 70 均为 1，均无组码 75。考古论文《Visualising Danebury》记载使用 GRASS 生成 DXF 输入和 AutoCAD 曲面，公开档案中未找到对应的原始拟合 DXF 及授权。迄今仍缺可核实由旧版 CAD 原生导出、同时保留拟合控制框与采样点的文件。[FlySong 原件](https://github.com/janelia-experimental-technology/FlySong/blob/d5d611d2937f28aef9fb42064c50096401d9a7d6/Mechanical/LaserCuts/laserMesh.dxf) · [Danebury 论文](https://proceedings.caaconference.org/files/1997/43_Earl_CAA_1997.pdf) · [LibreDWG 归档](https://github.com/LibreDWG/libredwg/tree/27e828d212852b8cd08c1cd5d2721e5b738ca8a9/test/test-data/r11)

继续检查了 UK VR-SIG 的 13 份历史 DXF。三份为 AC1009，其中 `balloon.dxf`、`lights.dxf` 各有两个多边形网格，组码 75 均缺省或不属于拟合类型 5、6、8。另查阅了 Simtel 于 1992 年公开归档的 `STREK.DXF`，其 4324 条 POLYLINE 均只有普通轮廓标志（0 或 1），没有拟合网格。这些外部文件仅用于筛查，仓库只记录来源及结果。[UK VR-SIG 档案](https://www.martinreddy.net/ukvrsig/ftp.html) · [Simtel 档案](https://infania.net/misc/simtelnet/msdos/autocad.html)

```sh
moon run examples/r12-semantics/runner --target wasm --deny-warn -- compare-mesh examples/r12-semantics/mesh-compare.dxf 0.01
```

命令输出记录下标、M/N 序号和 WCS 欧氏误差。取得授权原件后可替换输入，另外记录 CAD 软件版本、导出设置、来源、许可、SHA-256、网格尺寸、闭合位及容差。

又检查了 JSCAD 样例库的 10 份候选。AC1009 的 heart.dxf 只有一条非网格 POLYLINE，pyramid-base.dxf 的 60 个多边形网格均未拟合，文件版本为 AC1014。AeroHydro 的 1998 年手册记录了 PEDIT 曲面拟合及早期 AutoCAD 示例，但未取得其中含控制点和拟合样点且有许可说明的原始 DXF。 [JSCAD 样例目录](https://github.com/jscad/sample-files/tree/master/dxf) · [AeroHydro 手册](https://www.aerohydro.com/msdownload/test/MS48Manual/1f-MS40Apps.pdf)

#### 在授权的旧版 CAD 中取得可分发的证据

[自建控制框](legacy-refit-input.dxf)按 Apache-2.0 分发。它有一个 5×4 开放多边形网格，保留 20 个输入点。该文件只用于输入测试，拟合采样须由 CAD 生成。本地定向验证已核对网格类型、顺序、尺寸及坐标。

1. 在有权使用的旧版 CAD 中导入控制框。对支持这些命令的 AutoCAD 版本，设置 `SURFTYPE=6`、`SURFU=7`、`SURFV=6`，选中图层 `FITINPUT` 的唯一网格，执行 `PEDIT` 的 Smooth Surface，再用 `DXFOUT` 导出未改写的 ASCII DXF。保留 CAD 版本、导出选项、操作记录和文件哈希。密度设置与导出的实际样点数分别记录。 [Autodesk PEDIT 网格选项](https://help.autodesk.com/cloudhelp/2023/ENU/AutoCAD-MAC-Core/files/GUID-88A3C094-3001-439D-8AE8-6F57412AFE70.htm) · [AutoCAD R12 DXF 参考](https://damassets.autodesk.net/content/dam/autodesk/www/developer-network/platform-technologies/autocad-dxf-archive/acad_r12_dxf.pdf)
2. 用上面的 `compare-mesh` 命令读取原始导出。确认父网格的拟合类型和控制点数、样点数均符合实际导出，再保存导出文件、许可依据及逐点 CSV。真实证据以实际采样结果为准，即使超出容差也应保留原始差异。当前仍未取得该导出。
