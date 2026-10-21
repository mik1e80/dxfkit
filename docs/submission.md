# dxfkit 项目申报书（修订稿）

## 基本信息

- 项目名称：dxfkit —— MoonBit ASCII DXF 读取与二维轮廓辅助检查库
- 项目方向：工业软件 / 开发者工具
- GitHub：<https://github.com/mik1e80/dxfkit>
- 在线演示：<https://mik1e80.github.io/dxfkit/>
- 提交版本：固定标签 `delivery-0.1.1-20261022-ellipse`，以该标签的提交 SHA 为准；[干净环境复现与版本核对](reproducibility.md)。网页 release.json 和 verification.json 记录实际源码提交及本文件、生态对比和来源记录的哈希，CI 通过后才部署同一产物。
- 是否为整体移植：否；参考资料、公式移植和外部语料见下文。
- 参赛者及联系方式：报名表保留原信息，不在公开仓库展示。

## 项目简介

dxfkit 用 MoonBit 实现 ASCII DXF 读取、部分二维实体解码、曲线离散和几何辅助检查，提供库、CLI 与浏览器入口。面向需要读取 CAD 图纸、预览轮廓或在进入 CAM 前筛查几何问题的 MoonBit 开发者。

交付终点是：对声明范围内的 ASCII DXF 输入，输出结构化记录、可处理的 XY 折线和检查报告，同时提示未覆盖的实体或语义。项目不是完整 DXF 标准实现，不判断图纸是否可以直接上机加工。

本次范围固定为七类核心轮廓实体和普通 INSERT，附带三个 CLI 命令、浏览器演示和自动验证。逐字段输入、输出、限制及验证入口见[交付范围](delivery-scope.md)，六类核心问题的预期、实际和自动断言见[修复验证](delivery-verification.md)。这些是本项目的完成标准，不作为主办方额外要求。

## DXF 兼容边界与几何检查的关系

撤回原申报中的“解析覆盖 R10–R2018”承诺。47 个回归文件包含 AC1006、AC1009 到 AC1032 的样例，仅证明这些具体文件的回归行为，不代表每个版本、每种实体或全部字段均兼容。

处理流程：ASCII 字节 → 组码及诊断 → 段与原始记录 → 部分实体解码 → 支持几何的 XY 离散及块展开 → 几何报告。读取成功、识别实体类型、轮廓参与检查是三个不同结论。

| 层次 | 已交付范围 | 未覆盖或限制 |
| --- | --- | --- |
| 文件读取 | ASCII 组码、段、子类、HEADER、图层与块；未知记录保留及部分坏行诊断 | 二进制 DXF、写回、字节级无损往返、完整引用和标准一致性审计 |
| 二维轮廓 | LINE、CIRCLE、ARC、ELLIPSE、SPLINE、LWPOLYLINE 与普通 POLYLINE 的支持字段 | 不承诺全部实体字段、网格或通用三维模型支持 |
| 曲线 | bulge、椭圆、连续正权重 NURBS；checked 接口报告无效输入与资源上限 | 不保证任意次数、权重及数值尺度的精度 |
| 块引用 | 普通 INSERT 的 XY 仿射变换、图层 0 继承、最多 8 层，循环和缺失引用提示 | 第 9 层截断；阵列只展开首实例；非默认 OCS 引用整体跳过并诊断 |
| 元数据 | 文字内容与位置，HATCH、DIMENSION 的部分字段，SOLID/TRACE/3DFACE 角点 | 字体转轮廓、完整填充边界、关联标注重建及面实体检查 |
| 坐标与单位 | XY 投影，显示单位声明；阈值沿用原始坐标单位 | 非默认 OCS 未转换，不自动换算毫米 |

HATCH、DIMENSION、SOLID、TRACE、3DFACE、未知实体的轮廓未参与检查；非默认 OCS 会提示未转换。存在覆盖警告时，不能将其他几何未报错理解为整份图纸通过。CLI `--strict` 将警告也作为失败退出条件。

完整性通过 `Report::has_incomplete_checks()` 统一判断；丢失顶点/控制点、未转换坐标系、未支持实体及离散失败都进入报告，并明确标为“检查不完整”。同文件有正常轮廓时仍保留全部原因，混合案例和 strict 退出码有[自动验证](check-completeness.md)。

## 核心功能范围

1. 读取与诊断：保留原始记录，供调用方识别未覆盖内容和继续处理。
2. 几何离散：支持曲线转折线，按累计块变换调整局部离散容差。
3. 辅助检查：退化几何、文字、同图层端点闭合、单实体非相邻段自交、共线重叠、同图层不同实体的指定净距。
4. SVG 和网页：网页调用同一 MoonBit 库的 JS 编译产物，文件在浏览器本地处理。
5. CLI：`check`、`svg`、`stats`。普通模式退出 0 仍可能有警告；严格模式可作警告门禁。
6. 流式扫描：`TagStream` 和 `stats` 不保存全量图纸；超长行、警告和统计项仍可能增长。`check` 与 `svg` 读取完整文件。

净距不等于材料壁厚，不覆盖单实体窄颈或跨图层关系。关闭 / 冻结图层的筛选是工具约定，不代表 CAM 一定如此处理。材料、刀具、切缝和加工策略需要另行确认。

## 可复现案例与完成标准

在仓库根目录执行 `moon update` 后运行以下命令。边界反例详见 [兼容性案例](compatibility-cases.md)。

| 输入与命令 | 验证内容 | 预期结果 |
| --- | --- | --- |
| `moon run cli check examples/plate.dxf --min-gap 0.5 --strict` | 毫米声明、100×60 外框和四个半径 3 的孔 | 退出 0，仅表示已覆盖检查项未发现问题 |
| `moon run cli check examples/issues.dxf` | 重复路径、开放轮廓、负半径 | 退出 1，报告具体问题 |
| `moon run cli check examples/plate.dxf --min-gap 8 --strict` | 指定净距阈值生效 | 退出 1，报告最小间隙 |
| `moon run cli check examples/coverage-limits.dxf --strict` | 可读文件含未覆盖语义 | 退出 1，报告 HATCH、DIMENSION、RAY 和 OCS 覆盖限制 |
| `moon run cli check testdata/ezdxf/Minimal_DXF_AC1009.dxf --strict` | 版本标识与几何覆盖的区别 | 退出 1，提示没有可检查的二维轮廓 |

`node cli/smoke.cjs` 自动核对实际退出码和关键诊断。曲线另用负 bulge、S 形样条及独立 de Boor 密集采样对照验证。47 个外部文件用于回归，不是完整标准认证套件。测试数量随修订变化，以 CI 和实际运行结果为准。

`node scripts/verify-delivery.cjs` 对实际网页产物执行六类最小问题断言：非原点椭圆、SVG 大/微小坐标、LWPOLYLINE 损坏顶点、POLYLINE 损坏顶点、面实体降级、INSERT OCS。机器可读预期和实际输出随仓库保存，未把已有本地 OCS 修复误记为本轮新发现。独立调用工程见 [`examples/consumer/`](../examples/consumer/README.md)：自带模块配置、读取 DXF、提取实体、checked 离散和报告处理；通过 moon.work 使用本地未发布修订，无需网页或内部实现复制。`node scripts/verify-consumer.cjs` 将其复制到仓库外，在 Wasm 和 Native 分别验证 7 个编译/运行用例。正常、问题、未覆盖三种浏览器样例均调用同一 MoonBit 库。

几何和检查器的结果验收见[测试矩阵](test-accuracy.md)：9 个几何精度测试核对坐标、尺寸、包围盒或独立解析曲线误差；8 个检查器成对测试核对分类、严重程度、定位和阈值边界。另有 2 个实体测试验证圆心 (10,0)、长轴向量 (10,0)、轴比 0.5 的精确包围盒和平移不变性。临时副本中的七类故障均被编译后的实际测试拒绝，包括恢复长轴重复减圆心的旧错误；不以实体数、点数或警告总数代替判定正确。

第三方文件另有[47 张逐图纸验证记录](corpus-validation.md)：保留来源及文件哈希，分别列出读取结果、实体字段解码、实际参与测试和未覆盖部分。47 张均可读取，当前逐图纸独立几何验证为 0/47；自建解析几何测试不替代这些外部文件的真值，不能写成 47 张“兼容通过”。

## 参考、依赖与许可

项目自身采用 Apache-2.0。参考 ezdxf 的能力组织、格式资料与部分公式；bulge 换算公式存在移植参考关系，不声称全部算法原创。样条离散采用 Boehm 节点插入与 de Casteljau 细分，测试保留独立 de Boor 求值对照。

47 个外部 DXF 文件来自 ezdxf，来源和完整 MIT 条款收录于 `THIRD_PARTY_NOTICES.md`；`examples/` 为项目自建案例。核心库仅使用 MoonBit core，CLI 和语料回归子包使用 `moonbitlang/x`、`moonbitlang/async`，不将整个仓库描述为零依赖。

## 差异性与对比

**核对日期：2026-10-22。** [生态对比表](../COMPARISON.md)逐项列出六个真实 MoonBit 项目的核对版本、固定源码文档、能力交集和差别；[来源记录](ecosystem-sources.json)保存提交与文档 blob SHA。本轮核对公开配置和文档，未运行相邻项目的测试、性能比较或跨库集成，不据此作生态穷尽性结论。

| MoonBit 项目（核对版本） | 能力交集 | dxfkit 的范围与差别 |
| --- | --- | --- |
| [gmlewis/step 0.1.22](https://github.com/gmlewis/moonbit-step/blob/3d77e2bed4bef957f7019af754bf8d2a5e772cea/README.md) | CAD 数据模型、读取、变换与诊断 | 本库面向 ASCII DXF 及 XY 轮廓，不提供对方的 STEP 序列化和三维建模 |
| [cn-xjr/moongeokit 0.3.0](https://github.com/cn-xjr/moongeokit/blob/0300c9cd7600c255011ddae96c9f7d929679e18a/README.mbt.md) | 距离、相交、包围盒与二维点列 | 本库增加 DXF 图层 / 句柄、块展开及覆盖诊断，不提供通用网格索引 |
| [totto2727/geo 0.1.3](https://github.com/totto2727-org/geo/blob/bc35dd29f37d3a052cd67310d5a2cb62fd3118ab/README.mbt.md) | 二维测量、变换与拓扑处理 | 本库聚焦 DXF 语义到轮廓，不提供对方整套地理算法、鲁棒谓词和布尔接口 |
| [cjcjwe/gcode-toolkit 0.3.1](https://github.com/cjcjwe/moonbit-gcode-toolkit/blob/89c6b7c9dd7c3b7de7566cb917cdc86a5fa5d516/README.mbt.md) | 工业文本解析、结构化诊断及批处理 | 本库处理 CAM 前的图纸轮廓，不生成 G-code，不检查控制器指令 |
| [zgfzgf899/moonbit-vector-trace-plan 0.2.2](https://github.com/zgfzgf899/moonbit-vector-trace-plan/blob/f1cb9c7e813971ad1f51c29dfbbfe758b6f436bb/README.md) | 轮廓、曲线近似、几何和 SVG 输出 | 对方从像素描摹路径并规划绘制，本库从 DXF 实体 / 图层 / 块提取轮廓，不提供位图追踪或机器计划 |
| [Mgk789a/moonbit-gerberkit 0.2.4](https://github.com/Mgk789a/moonbit-gerberkit/blob/80e332f79d2d826fca00e40f3fd8cd0593b95b2f/README.mbt.md) | 制造数据模型、闭合、重复几何、净距与报告 | 对方处理 PCB Gerber / Excellon；本库处理 DXF 实体与块。不提供 PCB 孔环宽、电气连通或制造配置检查 |

组合价值落实为 `scan_tags` / `build_drawing` 的数据模型、`Drawing::expand()` 的带来源世界坐标轮廓、`Geometry::flatten_checked()` 的显式离散结果，以及 `Drawing::check()` / `Report::has_incomplete_checks()` 的完整性诊断。调用方可保留来源并决定如何处理未检查内容；[独立消费工程](../examples/consumer/README.md)已验证这些公共接口的直接调用。

将点列转交其他几何或路径库仍需坐标、单位、闭合约定和容差适配，目前没有跨库适配器或完整 CAM 流程。不使用“生态唯一”“加工能力独占”、已有生产采用或未经验证的性能领先结论；ezdxf 是成熟 Python 参考，不是生态差异性的主要对照，也不宣称全面替代它。

## 预期场景

- MoonBit 程序读取 ASCII DXF，提取图层、记录及支持的二维轮廓。
- 工作室进入 CAM 前辅助筛查开放边界、重叠线和指定净距，并人工复核覆盖警告。
- 图纸档案批量统计版本声明、段和规模；流式统计不表示已检查几何。

## 再次提交说明

本次撤回跨版本完整覆盖承诺，改为分层能力说明，并补充“读取成功但几何未完整检查”的反例。请同步替换报名表的项目名、简介、功能和差异性，避免其他字段继续保留旧承诺。

源码修订版本 0.1.1 尚未完成本次 Mooncakes 发布，不能描述为已发布版本。报名表更新及其他参赛条件需另外核对，本修订不表示已经通过审核。
