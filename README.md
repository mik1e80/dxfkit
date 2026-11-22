# dxfkit — MoonBit ASCII DXF R12 记录读取与二维轮廓辅助检查库

把 ASCII DXF 转为可访问的原始记录、实体字段、WCS XYZ、受支持的二维轮廓、诊断和 SVG，供其他 MoonBit 程序、CLI 和浏览器使用。当前可安装版本为 [0.2.0](https://mooncakes.io/docs/mik1e80/dxfkit%400.2.0)，以 AC1009 为 R12 记录读取配置；其他版本按已实现能力尽力读取。

[接口与迁移](README.mbt.md) · [R12 范围矩阵](docs/r12-profile.md) · [本轮维护与验证](docs/maintenance-20261120.md) · [许可与模型来源](docs/licensing.md)

维护状态（2026-11-16）：据参赛者反馈，项目已通过报名初审，现围绕既有方向持续维护；这不表示当前开发版已通过最终验收。[八月黑客松说明](docs/august-hackathon.md)保留已有基础、新增成果及后续交付的区分，本仓库不代操作报名系统。

处理外部图纸前请查看[安全使用边界](SECURITY.md)与[11月7日整改记录](docs/security-20261107.md)。当前源码加入读取/几何预算、统一结构警告、分叉连接诊断和网页Worker；已发布0.1.1及历史Pages不含这些新增防护。[机器能力矩阵](docs/capabilities.json)分别描述记录、字段、几何与检查状态。

## 能做什么

当前内置 UTF-8、CP1252 和 ANSI_936 的 GBK 双字节解码。932、949、950 可由库调用者传入解码器，CLI 与网页默认仍会告警并降级。编码声明在前 1024 字节内探测。详见[兼容性](docs/compatibility.md)。

- `read_document` 保留源字节与扫描预算范围内的有序组码记录，诊断段、表、块和子实体序列结构；读取诊断与几何检查分开。
- 按实体坐标规则转换 OCS→WCS，保留 XYZ；展开 INSERT 的全部行列、三维基点、缩放、旋转和最多八层嵌套，保留实例来源。
- 库接口提供常用 R12 字段和块引用审计、独立几何容差、结构化检查状态和 SVG 输出字节预算。调用方式见[接口说明](README.mbt.md)。
- 离散七类既有核心轮廓及受限 SOLID/TRACE；对落在 WCS Z=0 检查平面的几何辅助检查闭合、自交、重复、退化和指定净距，输出报告和 SVG。
- 未重建语义、关联属性布局、非检查平面、损坏输入及资源截断明确报告不完整；`--strict` 将警告作为失败。

`ReadDocument::r12_semantics()` 读取空间 POLYLINE/网格拓扑、3DFACE 隐边、SHAPE 位置、VIEWPORT/MVIEW、DIMENSION 定义点与标注块，以及 INSERT 属性序列。本版还读取拟合网格的控制框和已存样点，支持按单元放置阵列属性，并可单独展开保存的标注图块。新增从控制框重拟合曲面、基于字体提供器的属性字形排版，以及从定义点重算七类标注的数值、标签和基本图元。字体入口支持传统指令的横排与竖排 BIGFONT、TrueType 点对点复合字形和多字体轮廓。HarfBuzz 示例处理一个完整双向段落并按字素簇回退。标注支持自定义箭头、堆叠容差与替代单位，另可在 WCS XY 内为整张图纸的标签避开图元和彼此。曲面比较器能导出逐点误差，旧版 CAD 原始拟合网格仍待取得。详情见[案例与复现方法](examples/r12-semantics/README.md)。HATCH、ELLIPSE、SPLINE、LWPOLYLINE 按非 R12 扩展处理。详见[读取终点与分层矩阵](docs/r12-profile.md)。

## 快速运行

使用[固定工具链](docs/reproducibility.md)在仓库根目录运行：

```sh
moon update
moon run cli read examples/r12-validation/models/06-ocs-array.dxf
moon run cli check examples/plate.dxf --min-gap 0.5 --strict
moon run cli svg examples/plate.dxf > plate.svg
```

`plate.dxf` 是声明毫米单位的 100×60 外框与四个 Φ6 圆孔。阈值使用原图单位，不自动换算毫米。CLI 退出码：0 为未触发当前退出条件，1 为严重问题或 strict 警告，2 为参数/文件错误；普通模式退出 0 仍可能检查不完整。

## 版本与使用入口

| 版本 | 身份与可用入口 | 验证范围 |
| --- | --- | --- |
| 已发布 0.2.0 | [Mooncakes](https://mooncakes.io/docs/mik1e80/dxfkit%400.2.0)，[发布源码 bb8d70a](https://github.com/mik1e80/dxfkit/commit/bb8d70ac166a7a60775ecb5d869e7f9913331d96) | [完整验收与注册表验证](docs/acceptance-0.2.0.md) |
| 已发布 0.1.1 | [Mooncakes](https://mooncakes.io/docs/mik1e80/dxfkit)，发布源 `dc3acc8` | [发布及 registry 消费记录](docs/mooncakes-0.1.1.md)；不包含新 R12 API |
| 历史 r2 | [固定标签](https://github.com/mik1e80/dxfkit/tree/submission-0.1.1-20261022-r2)，源码 `94509f3`；[线上演示](https://mik1e80.github.io/dxfkit/) | [历史完整 CI #26](https://github.com/mik1e80/dxfkit/actions/runs/39761104538)，不用于证明当前 R12 已完成全量验收 |

安装当前发布版使用 `moon add mik1e80/dxfkit@0.2.0`。独立消费工程可重跑注册表版本和本地源码的验证，网页演示的版本见上表。 [独立消费工程](examples/consumer/README.md)

## 模型与正确性证据

新增[FreeCAD原生R12导出](examples/cad-r12/README.md)：两份正常图和一份开放椭圆导出反例，均声明AC1009。该证据覆盖一个CAD应用的实际导出路径，不代表完整R12兼容。

[模型许可与验证索引](docs/testing.md)统一列明各组模型的来源、许可、预期依据和实际验证层次；原始字节保留受读取预算约束，截断后的记录不能当作完整输入。

| 证据 | 可确认的内容 |
| --- | --- |
| [六份 AC1009 模型](examples/r12-validation/README.md) | 行列、缩放、旋转、XYZ 基点、嵌套与 OCS；22实例、132个坐标分量对照 |
| [R12 拟合网格、阵列属性及标注](examples/r12-semantics/README.md) | 自建模型核对闭合接缝、重拟合解析值、属性字形坐标和七类标注重算 |
| [真实 CAD 的 OCS 与阵列](examples/cad-ocs/README.md) | NotoCAD 倾斜圆保留非默认法向，FreeCAD 导出反例省略法向。QCAD dxflib 保留 6 个 INSERT 单元并通过 36 个坐标分量断言 |
| [第三方阵列专项](examples/r12-validation/EXTERNAL.md) | 25个FLAG的100个WCS顶点、25个圆采样；独立格式审计与解析数学对照分开记录 |
| [十类参数模型](examples/model-validation/README.md) | 正常板、孔、弧、椭圆、bulge、样条、块、图层、错误和覆盖限制；[实际总结](examples/model-validation/SUMMARY.md) |
| [47文件逐层记录](docs/corpus-validation.md) | 读取、解码、展开与诊断回归；整图独立真值仍为0/47，专项部分验证单列 |
| [三份实际 CAD 导出](examples/cad-exports/README.md) | FreeCAD/OpenSCAD 原生模型、原始DXF、版本/设置与测量记录；保留原验证日期，不冒充本轮新导出 |

## 生态价值

MoonBit 已有 DXF 读写模块及相邻几何、STEP、G-code、位图轮廓和 Gerber 项目。dxfkit 的独立贡献是 **有来源的 DXF 记录 → 坐标与块实例 → 受限轮廓 → 检查完整性诊断** 的可调用流程。[生态对比](COMPARISON.md)包含直接相关的 `walkzzz/moon-geometry/io/dxf_io`，逐项说明交集及未覆盖能力；不宣称生态唯一或全面替代其他项目。

## 验证与开发

日常使用必要的定向检查，不运行整仓库四后端全量：

本次维护的最小回归为 `moon test maintenance_security_test.mbt security_test.mbt security_wbtest.mbt stream_wbtest.mbt --target wasm --deny-warn`；首次修改解析逻辑时另做相关类型检查与模型消费验证。更广的既有定向集入口为：

```sh
node scripts/verify-advisor.cjs
```

该入口明确记录 `targeted-r12`、源码 SHA 和 `full_suite_run=false`，包含格式/API、各后端类型检查、相关库测试、语料子集、真实入口和网页回归。首次干净检出可加 `--fresh`；开发中已有未提交修改时显式加 `--allow-dirty`。完整验收仅在需要时手动运行，不能用定向 CI 绿灯代替。具体命令及证据身份见[复现说明](docs/reproducibility.md)。

## 审阅与申报材料

[0.2.0 发布与验收证据](docs/acceptance-0.2.0.md) · [发布与验收流程](docs/release-process.md) · [当前项目说明](docs/submission.md) · [退回意见响应](docs/review-response.md) · [证据索引](docs/resubmission-evidence.md) · [材料导航](docs/verification-guide.md) · [路线图](docs/roadmap.md)

当前项目说明对应 0.2.0；初审状态来自参赛者反馈，不代替当前源码的功能验证或最终验收。主赛退回响应及一页PDF保留其原修订背景，当前维护变化见上方维护记录；本仓库修改不代表已更新报名表。

## 许可

项目自身代码、文档和自建模型采用 [Apache-2.0](LICENSE)，第三方内容按其各自许可证分发，见[许可适用范围](docs/licensing.md)和[第三方声明](THIRD_PARTY_NOTICES.md)。功能边界不是额外许可限制，也不构成加工保证。问题反馈请附源码SHA、工具链、可分发最小输入、预期依据和实际报告，提交到 [Issues](https://github.com/mik1e80/dxfkit/issues)；敏感漏洞按[安全报告方式](SECURITY.md)处理。
