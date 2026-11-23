# BricsCAD V20.1.08 原生拟合网格

2026-11-23 在 Windows x64 简体中文版 BricsCAD V20.1.08（可执行文件版本 `20.1.08.74241`）试用环境中执行。输入是项目自建的 [5×4 开放控制框](../legacy-refit-input.dxf)。在 CAD 内调用 `Teigha.DatabaseServices.PolygonMesh.SurfaceFit((PolyMeshType)6, 7, 6)`，由 CAD 生成三次 B 样条样点。再用同一 CAD 数据库的 `DxfOut(path, 16, DwgVersion.AC1009)` 直接导出 ASCII DXF。输入和输出之间没有使用 dxfkit 写入、换序或重采样。 [BricsCAD SurfaceFit 接口说明](https://developer.bricsys.com/bricscad/help/en_US/V25/DevRef/source/html/2752932d-ece1-32db-337f-20789bf7f531.htm)

[原件](bricscad-v20-cubic-r12.dxf)为 13,449 字节，SHA-256 为 `e9931fc962c8d6506aeb187262d494e48d7323a94efabe9a2a9f28bca0355d29`。曲面模型和检测记录均为本项目编制，按 [Apache-2.0](../../../LICENSE) 分发。BricsCAD 软件及其 SDK 适用厂商许可。

| 核对项 | 原件和对照结果 |
| --- | --- |
| 父记录 | `FITINPUT` 图层，句柄 `29`，组码 70 为 20，75 为 6，两轴开放 |
| 控制框 | 5×4，20 个控制点，子顶点标志 16 |
| 采样网格 | 请求密度 7×6，CAD 实际保存 8×7，56 个样点，子顶点标志 8 |
| 按相同 M/N 索引逐点对照 | 容差 0.01 图纸单位，0/56 超差，最大 WCS 欧氏误差约 2.18×10⁻¹⁵，均方根误差约 7.75×10⁻¹⁶ |
| 验证边界 | 一个开放三次 B 样条曲面。二次 B 样条、Bézier、闭合拟合及其他 CAD 的原生拟合结果仍待外部对照 |

初次用 ActiveX 设置 `Type=6` 的导出只写入类型和原控制框，保存的样点数为零。本案例使用独立的原生 `SurfaceFit` 路径以保留两组顶点。dxfkit 在拟合父记录内接受 BricsCAD 输出的显式角色标志，同时保留对附带网格位的现有文件的支持。 [逐点误差 CSV](bricscad-v20-cubic-errors.csv)

在仓库根目录复现。

```sh
moon run examples/r12-semantics/runner --target wasm --deny-warn -- bricscad-fit
moon run examples/r12-semantics/runner --target native --deny-warn -- bricscad-fit
moon run examples/r12-semantics/runner --target wasm --deny-warn -- compare-mesh examples/r12-semantics/legacy-cad/bricscad-v20-cubic-r12.dxf 0.01
```
