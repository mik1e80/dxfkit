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
