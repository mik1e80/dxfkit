# 旧版 CAD 拟合网格来源筛查

2026-11-23 核对公开 DXF 样本，目标是由可确认版本的旧版 CAD 直接导出的 ASCII AC1009 文件。逐点对照需要同一 `POLYLINE` 原样保留控制框和拟合样点，并有适用于该图纸的公开再分发许可。

先读 `$ACADVER`，再按实体记录检查父 `POLYLINE` 的组码 70 是否设置多边形网格位（16），组码 75 是否为 5、6 或 8。命中后，检查子 `VERTEX` 的控制点位（16）与拟合生成点位（8），以及两组实存顶点数量是否与父记录的网格尺寸一致。闭合位、样点顺序和容差在取得可用原件后单独核对。 [Autodesk R12 DXF 格式参考](https://damassets.autodesk.net/content/dam/autodesk/www/developer-network/platform-technologies/autocad-dxf-archive/acad_r12_dxf.pdf)

| 样本来源与固定提交 | `.dxf` 文件 | ASCII | AC1009 | 含拟合网格的 ASCII 文件 |
| --- | ---: | ---: | ---: | ---: |
| [NextGIS dwg_samples](https://github.com/nextgis/dwg_samples/tree/ff05d5a89ce123da511ed93c5fe5e6df85e02ab8) | 42 | 42 | 7 | 0 |
| [ACadSharp](https://github.com/DomCR/ACadSharp/tree/6ef32981983904695060e055c66acbe5a6220b89) | 26 | 19 | 1 | 0 |
| [ezdxf](https://github.com/mozman/ezdxf/tree/b396c3aa7a79d4cfbd7abbef79f8fcf040336807) | 103 | 99 | 6 | 0 |
| [dxfgrabber](https://github.com/mozman/dxfgrabber/tree/312ba2a0639c0ca67726717c0134b7028873d909) | 1 | 1 | 0 | 0 |
| [LibreDWG](https://github.com/LibreDWG/libredwg/tree/14bd716579e14a5621241ede0cd8df7f5fbfcbaa) | 121 | 121 | 6 | 0 |
| [IxMilia.Dxf](https://github.com/ixmilia/dxf/tree/f1d8ec36487884be0eb9bad7c83b5e123b5b7265) | 1 | 0 | 0 | 0 |
| [netDxf](https://github.com/haplokuon/netDxf/tree/3d24d7c23418bd3a077d0e32a639f2ffe95bff51) | 2 | 1 | 0 | 1（AC1032） |

七个快照共筛查 296 个文件，其中 283 个为 ASCII，20 个声明 AC1009。这 20 个文件没有命中上述拟合网格字段组合。筛查仅用于定位候选，表格计数不表示任何文件已获再分发许可。

netDxf 的 `TestDxfDocument/sample.dxf` 确实含一组二次 B 样条网格。父记录句柄 `1A66`，组码 70 为 20，组码 75 为 5，控制框为 6×4，拟合采样为 20×10。子记录实存 24 个标志 80 的控制点、200 个标志 72 的拟合点。对该路径的 14 个历史修订核对了组码，只有 2022 和 2023 年的两个 AC1032 版本含拟合网格，其余版本为 AC1024 或 AC1032。上游根目录为 MIT，当前未取得该图纸来自旧版 CAD 原生导出的证据。 [原件](https://github.com/haplokuon/netDxf/blob/3d24d7c23418bd3a077d0e32a639f2ffe95bff51/TestDxfDocument/sample.dxf) · [文件历史](https://github.com/haplokuon/netDxf/commits/master/TestDxfDocument/sample.dxf) · [上游许可](https://github.com/haplokuon/netDxf/blob/3d24d7c23418bd3a077d0e32a639f2ffe95bff51/LICENSE)

对照工具的 Wasm 定向验证使用现有的[自建样例](mesh-compare.dxf)，输出 9 个点。容差为 0.01 图纸单位，中心点误差为 0.125，其余 8 点误差为 0。用当前 netDxf 原件作为版本边界输入时，命令退出码为 1，未输出逐点数据。旧版 CAD 的逐点外部验证仍待取得符合条件的原始 DXF。本次提交仅包含筛查记录。

## 补查 BricsCAD 原生导出及历史教材

- OpenCADCodec 收录两份 BricsCAD V20.1.07 的原生几何导出。实查 `native-geometry.dxf` 与 `native-geometry-edited.dxf` 均为 ASCII AC1009，各含组码 70 = 16、71 = 2、72 = 3 的 2×3 多边形网格，均没有组码 75。这两份文件提供旧格式的真实网格记录，缺少逐点重拟合对照所需的已存样点。 [上游导出说明](https://github.com/buianhduc-ai/opencadcodec/blob/ff75fddc322bda4cf817c5f68535c5c2b316b9c4/src/docs/ac1009_support.md) · [两份 DXF 原件](https://github.com/buianhduc-ai/opencadcodec/tree/ff75fddc322bda4cf817c5f68535c5c2b316b9c4/tests/fixtures/r12/cad-created)
- Kabeja 的 `draft2.dxf`、`draft3.dxf` 和 `draft4.dxf` 声明 AC1009，均未发现多边形网格。 `hatch_1.dxf` 和 `hatch_16.dxf` 声明 AC1014。该目录其余样本见下方补查。 [固定上游样本目录](https://github.com/fuzziness/kabeja/tree/dd499942c8421e826ee1e04ab2960f23a94d3b78/samples/dxf)
- Wiley 教材第 23 章的图 23-10 展示了 AutoCAD 2005 的 PEDIT 曲面平滑，图中未标出对应的 DXF 文件。出版社提供配套图纸下载，尚未找到该图对应的 AC1009 原件和允许公开再分发的条款。 [教材第 23 章与附录](https://home.agh.edu.pl/~milenin/Dydaktyka/CADCAM/eBooks/Finkelstejn.pdf) · [出版社配套资源](https://uat.store.wiley.com/en-us/autocad-2005-and-autocad-lt-2005-bible-p-9780764569890)

## 历史档案补查

| 来源 | 已读取的 ASCII DXF | 声明 AC1009 | 含拟合多边形网格 |
| --- | ---: | ---: | ---: |
| [Sembiance 格式样本集](https://sembiance.com/fileFormatSamples/poly/dxf/) | 13 | 1 | 0 |
| [Kabeja 完整样本目录](https://github.com/fuzziness/kabeja/tree/dd499942c8421e826ee1e04ab2960f23a94d3b78/samples/dxf) | 6 | 4 | 0 |
| [Langmuir Systems DXF 样本](https://github.com/langmuirsystems/dxf-samples/tree/a1152e5d5c15a8ba4f6be5ebda21cdd2092b2b90/samples) | 102 | 19 | 0 |

Sembiance 的 `abydos.dxf` 声明 AC1009，另外 10 份文件没有 `$ACADVER`，因此未计入 AC1009。旧模型中常见的 `3DFACE` 已经按面存储，缺少由控制框重拟合所需的记录。Kabeja 缓存补齐后确认 `draft1.dxf` 也是 AC1009，未发现多边形网格。

### 用旧版 CAD 生成独立参考

OpenCADCodec 已记录在有授权的 BricsCAD V20.1.07 中直接输出 AC1009 的路径，使用 `SaveAs` 的 `acR12_dxf = 1`。若在该版本成功执行拟合，可用 dxfkit 自建控制框复现并保留 CAD 原始输出。需检查原件是否同时保存组码 75 及两组实存顶点，再执行比较器。Bricsys 的旧版下载需要登录，V20 的曲面拟合与导出组合尚未实际运行。 [V20.1.07 原生导出记录](https://github.com/buianhduc-ai/opencadcodec/blob/ff75fddc322bda4cf817c5f68535c5c2b316b9c4/tests/bricscad/ac1009-validation-2026-10-13.md) · [Bricsys 旧版下载说明](https://help.bricsys.com/en-us/document/knowledge-base/installation/where-can-i-download-older-bricscad-releases)
