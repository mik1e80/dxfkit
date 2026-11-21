# 真实 CAD 的 R12 OCS 和阵列验证

以下模型由本项目建模，导出文件均为 CAD 软件直接生成的 AC1009 ASCII DXF。提供模型或 CAD 建模脚本、[逐字节 SHA-256](SHA256SUMS)和独立的坐标预期。[项目许可](../../LICENSE)适用于这些自建模型、脚本和导出文件。FreeCAD、QCAD、dxflib 和 NotoCAD 各自适用上游许可，仓库不分发这些工具的源码或安装包。

| CAD 与导出路径 | 建模源与导出原件 | 原件内容与验证结果 |
| --- | --- | --- |
| FreeCADCmd 1.1.3，`Import.writeDXFObject` 版本参数 12 | [FCStd](spatial-circle.FCStd)、[宏](generate.FCMacro)、[DXF](spatial-circle.dxf) | 省略非默认法向。71 个 WCS 采样的 Z 均为 5，半径误差小于 1e-9，二维报告为不完整 |
| NotoCAD 0.2.74，`DXFOUT` | [UCS/CIRCLE 建模脚本](generate-notocad-circle.lsp)、[DXF](notocad-tilted-circle.dxf) | 保留 210/220/230。核对 OCS 圆心、WCS 起点和 71 个采样。Z 范围约为 [3.800294,6.199706]，半径及平面残差均小于 1e-9，二维报告为不完整 |
| FreeCADCmd 1.1.3，`Import.writeDXFObject` 版本参数 12 | [FCStd](rectangular-array.FCStd)、[宏](generate-array.FCMacro)、[DXF](rectangular-array.dxf) | 3×2 阵列展平为 12 条线，逐条核对两端点，无重复或漏项 |
| QCAD 27.0.5，dxflib 3.26.4.0 的 R12 导出 | [QCAD 建模脚本](generate-qcad-array.js)、[DXF](qcad-array.dxf) | 保留单个 INSERT、行列数和两向间距。核对 6 个来源单元、12 个端点的 36 个 XYZ 分量 |
| 同一 QCAD 模型，专业版 R12 导出 | [QCAD 建模脚本](generate-qcad-array.js)、[DXF](qcad-array-pro.dxf) | 省略阵列组码，留下一个 INSERT 单元。额外核对默认图纸空间 VIEWPORT 和 MVIEW v16 |

## 独立真值

- 两个倾斜圆都以 WCS (3,4,5) 为设计圆心、半径 2、法向 (0,0.6,0.8)。真实倾斜圆的 Z 范围为 [3.8,6.2]。按 DXF 任意轴算法，OCS 基底为 (-1,0,0)、(0,-0.8,0.6)、(0,0.6,0.8)，因此圆心组码为 (-3,-0.2,6.4)，首样点 WCS 为 (1,4,5)。NotoCAD 保留该平面。FreeCAD 缺省法向后，文件表达的是 Z=5 的平行圆。
- FreeCAD 阵列的两条种子边是 (2,3)→(5,3)→(5,5)。第 `column` 列、第 `row` 行的平移为 (7×column,11×row)，列和行从 0 开始。
- QCAD 块基点为 (2,3)，块内线段长 3。图纸插入点为 (10,20)，沿块 X 轴放大二倍并逆时针旋转 90°。每个单元应从 (10−11×row,20+7×column,0) 开始，终点在该点的世界 Y 方向加 6。阵列间距随角度旋转，不乘块缩放。

## 复验

在仓库根目录运行 `moon run examples/cad-ocs/runner --deny-warn`。在有 `sha256sum` 的环境可先运行 `sha256sum --check examples/cad-ocs/SHA256SUMS`。默认定向 CI 重放这两个步骤，无需安装 CAD。

- FreeCAD 复导出使用 `FreeCADCmd -c`，在其 Python 控制台执行对应 `.FCMacro`；宏从仓库根目录解析路径。[FreeCAD 1.1.3](https://github.com/FreeCAD/FreeCAD/releases/tag/1.1.3)。
- QCAD 使用 `qcadcmd.com -no-gui -allow-multiple-instances -autostart <脚本绝对路径> <输出目录绝对路径>`。同一脚本以两个过滤器保存原件。[QCAD](https://www.qcad.org/en/download/)。
- NotoCAD 使用 `ncad examples/cad-ocs/generate-notocad-circle.lsp`。原件由固定提交 10b6c38 的 CLI 在 Windows 上生成，构建中对该平台不可用的可选 Perl 计算器使用禁用实现，UCS、CIRCLE 和 DXFOUT 为上游原实现。上游标准构建同样可运行该脚本。工具采用 BSD-3-Clause。[NotoCAD 源码与许可](https://github.com/sadie-f2/NotoCAD/tree/10b6c381443d863e8ee9939694a395ab84913293)。

哈希用于确认仓库保存的导出原件；软件版本、平台或保存时间可能使再次导出的文件字节不同。复验几何时以表内坐标、原始字段和诊断断言为准。
