# dxfkit — MoonBit ASCII DXF R12 记录读取与二维轮廓辅助检查库

把 ASCII DXF 转为可访问的原始记录、实体字段、WCS XYZ、受支持的二维轮廓、诊断和 SVG，供其他 MoonBit 程序、CLI 和浏览器使用。当前 main 为 **未发布的 0.2.0 开发版**，以 AC1009 为 R12 记录读取配置；其他版本按已实现能力尽力读取。

[接口与迁移](README.mbt.md) · [R12 范围矩阵](docs/r12-profile.md) · [本轮修改与证据](docs/resubmission-20261027.md) · [一页项目说明](output/pdf/dxfkit-submission-one-page.pdf)

## 能做什么

- `read_document` 保留源字节和有序组码记录，诊断段、表、块和子实体序列结构；读取诊断与几何检查分开。
- 按实体坐标规则转换 OCS→WCS，保留 XYZ；展开 INSERT 的全部行列、三维基点、缩放、旋转和最多八层嵌套，保留实例来源。
- 离散七类既有核心轮廓及受限 SOLID/TRACE；对落在 WCS Z=0 检查平面的几何辅助检查闭合、自交、重复、退化和指定净距，输出报告和 SVG。
- 未重建语义、关联属性布局、非检查平面、损坏输入及资源截断明确报告不完整；`--strict` 将警告作为失败。

**原始记录保留不等于完整 R12 标准符合性。** 全部必填字段、引用约束、SHAPE/VIEWPORT/空间网格等完整语义、字形和标注重建仍未完成；HATCH、ELLIPSE、SPLINE、LWPOLYLINE 等按声明的非 R12 扩展处理。不提供写回、DWG、刀路或可加工性认证。详见[读取终点与分层矩阵](docs/r12-profile.md)。

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
| 当前 main / 0.2.0 开发版 | 本提交的代码、README、项目说明、PDF及当前证据；新增 R12 API 尚未发布 | `targeted-r12` 定向 CI，明确 `full_suite_run=false`；精确 SHA 见同提交 CI 和构建清单 |
| 已发布 0.1.1 | [Mooncakes](https://mooncakes.io/docs/mik1e80/dxfkit)，发布源 `dc3acc8` | [发布及 registry 消费记录](docs/mooncakes-0.1.1.md)；不包含新 R12 API |
| 历史 r2 | [固定标签](https://github.com/mik1e80/dxfkit/tree/submission-0.1.1-20261022-r2)，源码 `94509f3`；[线上演示](https://mik1e80.github.io/dxfkit/) | [历史完整 CI #26](https://github.com/mik1e80/dxfkit/actions/runs/39761104538)，不用于证明当前 R12 已完成全量验收 |

安装已发布包使用 `moon add mik1e80/dxfkit@0.1.1`。使用新增 R12 API 请检出当前源码；[独立消费工程](examples/consumer/README.md)区分 registry 与本地源码模式。当前修改不覆盖历史标签、不发布 0.2.0，也不自动替换旧演示。

## 模型与正确性证据

| 证据 | 可确认的内容 |
| --- | --- |
| [六份 AC1009 模型](examples/r12-validation/README.md) | 行列、缩放、旋转、XYZ 基点、嵌套与 OCS；22实例、132个坐标分量对照 |
| [第三方阵列专项](examples/r12-validation/EXTERNAL.md) | 25个FLAG的100个WCS顶点、25个圆采样；独立格式审计与解析数学对照分开记录 |
| [十类参数模型](examples/model-validation/README.md) | 正常板、孔、弧、椭圆、bulge、样条、块、图层、错误和覆盖限制；[实际总结](examples/model-validation/SUMMARY.md) |
| [47文件逐层记录](docs/corpus-validation.md) | 读取、解码、展开与诊断回归；整图独立真值仍为0/47，专项部分验证单列 |
| [三份实际 CAD 导出](examples/cad-exports/README.md) | FreeCAD/OpenSCAD 原生模型、原始DXF、版本/设置与测量记录；保留原验证日期，不冒充本轮新导出 |

## 生态价值

MoonBit 已有 DXF 读写模块及相邻几何、STEP、G-code、位图轮廓和 Gerber 项目。dxfkit 的独立贡献是 **有来源的 DXF 记录 → 坐标与块实例 → 受限轮廓 → 检查完整性诊断** 的可调用流程。[生态对比](COMPARISON.md)包含直接相关的 `walkzzz/moon-geometry/io/dxf_io`，逐项说明交集及未覆盖能力；不宣称生态唯一或全面替代其他项目。

## 验证与开发

日常使用必要的定向检查，不运行整仓库四后端全量：

```sh
node scripts/verify-advisor.cjs
```

该入口明确记录 `targeted-r12`、源码 SHA 和 `full_suite_run=false`，包含格式/API、各后端类型检查、相关库测试、语料子集、真实入口和网页回归。首次干净检出可加 `--fresh`；开发中已有未提交修改时显式加 `--allow-dirty`。完整验收仅在需要时手动运行，不能用定向 CI 绿灯代替。具体命令及证据身份见[复现说明](docs/reproducibility.md)。

## 审阅与申报材料

[当前项目说明](docs/submission.md) · [退回意见响应](docs/review-response.md) · [证据索引](docs/resubmission-evidence.md) · [材料导航](docs/verification-guide.md) · [路线图](docs/roadmap.md)

当前材料描述0.2.0开发候选，是否接受这一明确范围由主办方评审判断，不写成已审核通过。Gitlink同步地址仍须参赛者另行核对；本仓库修改不代表已操作报名系统或更新报名表。

## 许可

采用 [Apache-2.0](LICENSE)。上游资料、ezdxf语料及工具、依赖的参考关系与完整许可见[第三方声明](THIRD_PARTY_NOTICES.md)。问题反馈请附源码SHA、工具链、最小输入、预期依据和实际报告，提交到 [Issues](https://github.com/mik1e80/dxfkit/issues)。
