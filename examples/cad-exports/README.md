# 两种 CAD 软件的实际 DXF 导出验证

2026-10-22 实跑：**3/3 本地定向验证通过**。实际执行 FreeCAD 1.1.3 和 OpenSCAD 2021.01，先在软件内通过建模 API 创建几何，再调用各自官方导出器写出 DXF；没有用手写组码或 ezdxf 代替 CAD 导出，也没有事后修改 DXF。

模型是本项目自建、尺寸已知的测试件，**不是第三方生产图纸**。本轮使用 CAD 命令行/API，没有 GUI 手动画图、CAD 内人工目视验收或截图。这是补充真实导出器证据，不是完整 DXF 兼容认证；原有 47 张第三方语料的逐图纸独立几何真值仍为 0/47。

| 模型与原生源文件 | 软件与输出 | 已知几何及实际断言 |
| --- | --- | --- |
| [四孔板 FCStd](sources/01-freecad-four-hole-plate.FCStd) / [DXF](models/01-freecad-four-hole-plate.dxf) | FreeCAD 1.1.3，原生 C++ 导出，ASCII R14 / AC1014 | 100×60 mm、外边界四 LINE 端点闭合、周长 320、面积 6000；四个 Φ6 孔，中心 (10,10)、(90,10)、(90,50)、(10,50)；核对圆心、半径、全部中心间距、圆轮廓及包围盒，并与 FreeCAD OCC 测量对照。 |
| [偏移椭圆 FCStd](sources/02-freecad-offset-ellipse.FCStd) / [DXF](models/02-freecad-offset-ellipse.dxf) | FreeCAD 1.1.3，保留 ELLIPSE | 中心 (10,20)、长轴向量 (10,0)、轴比 0.5，包围盒 [0,15,20,25]；核对字段、逐点椭圆方程，以及 2049 个独立解析采样到离散曲线的距离。 |
| [矩形 SCAD](sources/03-openscad-rectangle.scad) / [DXF](models/03-openscad-rectangle.dxf) | OpenSCAD 2021.01，四 LINE | 设计 100×60、四边端点闭合、周长 320、面积 6000；DXF 未声明单位，保留“未声明”，不冒称文件声明了 mm。 |

完整数据见 [results.json](results.json)；各模型的实际公开 API 数据、strict 报告和 SVG 位于 [actual](actual)。三模型的 strict 退出码均为 0，检查不完整均为 false。SVG 的点与公开 API 输出逐项比较，不能只凭“文件可打开”算通过。

## 发现并保留的导出差异

- FreeCAD 原生导出四孔板的外框是四个 LINE，不是一个 closed polyline。验证端点构成闭环；不把每条 LINE 的 `Outline.closed=false` 误写成闭合多段线。
- FreeCAD 椭圆输出的结束参数是 **6.28318**，不是精确 `2π`。dxfkit 保留开放的参数语义，`Outline.closed=false`；实际接缝约 **0.000026536 mm**，小于本轮 0.002 mm 检查容差，所以 strict 没有闭合告警。不能据此宣称参数已精确闭合。
- 椭圆 2049 点参考到离散曲线的最大距离约 **0.000666114 mm**，在 0.002 mm 容差内；逐顶点椭圆方程最大误差约 `1.78e-15`。
- FreeCAD 的 `usePolyline=true` 会强制椭圆离散。本轮最终设置为 false，保留真实 ELLIPSE；[导出脚本](export-freecad.py)记录参数，测试不为迁就导出结果修改库算法。
- OpenSCAD 原始文件没有 HEADER / INSUNITS，也不提供句柄；断言按几何连接验证，不用空句柄将四条边覆盖为一条。

## 来源与可复现性

[provenance.json](provenance.json)记录软件完整版本、官方包来源、下载包哈希、导出设置，以及 DXF/原生模型/导出脚本的 SHA-256。[freecad-export.json](freecad-export.json)保存生成时 OCC 独立测量。FreeCAD 安装包已与官方 release digest 核对；OpenSCAD release 未提供同类 digest，记录的是本地 SHA-256，不声称做过官方摘要比对。软件二进制不提交仓库。

- [FreeCAD 1.1.3 官方发行包](https://github.com/FreeCAD/FreeCAD/releases/tag/1.1.3)；官方 [writeDXFObject 实现](https://github.com/FreeCAD/FreeCAD/blob/1.1.3/src/Mod/Import/App/AppImportPy.cpp)说明 version、usePolyline 与 optionSource 参数。
- [OpenSCAD 2021.01 官方发行包](https://github.com/openscad/openscad/releases/tag/openscad-2021.01)；官方[命令行手册](https://files.openscad.org/documentation/manual/Using_OpenSCAD_in_a_command_line_environment.html)说明 `-o` 按扩展名导出。

本项目创建的建模脚本、模型和导出图纸按仓库 Apache-2.0 许可提供；不分发 CAD 软件及其依赖。没有外部客户图纸或额外来源许可要求。

从仓库根目录，使用 [固定 MoonBit 工具链](../../docs/reproducibility.md)和依赖，运行：

```sh
moon update
node examples/cad-exports/verify.cjs
```

只验证这三份保存的原始导出，不需要安装 CAD 软件，不运行全量测试。默认检查输入哈希并重放输出；调查差异后才能用 `--write` 更新快照。运行环境和实际源码身份另写 `_build/cad-exports.json`；保存的 `results.json` 不冒充干净 CI 或 r2 的新执行结果。

重新建模/导出需要对应便携软件，在 PowerShell 执行：

```powershell
./examples/cad-exports/export.ps1 -FreeCADCmd 'C:/path/to/freecadcmd.exe' -OpenSCAD 'C:/path/to/openscad.com'
```

导出日志保存在 `actual/*-export.log` 和 `actual/openscad-version.log`。重新保存 FCStd 可能改变时间戳及文件哈希；脚本不会自动改预期或 provenance，必须先复核几何再更新哈希。目录的 Git 属性禁止换行转换，保留 CAD 输出的原始字节。

本批证据是 **r2 后 main 的补充**，验证的库源码基线为 `315ac94`（库算法与 r2 相同）；不移动 `submission-0.1.1-20261022-r2`，不更新其 PDF，不宣称这批文件已经包含在该历史标签中。未新增 SPLINE/bulge 的 CAD 导出或人工目视确认。
