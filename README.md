# dxfkit — MoonBit ASCII DXF R12 记录读取与二维轮廓辅助检查库

面向 MoonBit 开发者的 **ASCII DXF R12（AC1009）记录读取与二维轮廓辅助检查库**。当前 main 增加原始字节/记录保留、OCS→WCS 和 INSERT 阵列展开，分别报告读取、坐标重建与二维检查的边界。其他版本按已实现能力尽力读取。

**版本区别：** 本轮 R12 API 尚未发布到 Mooncakes，未建立新的最终交付标签。[R12 范围与符合性矩阵](docs/r12-profile.md)及[六份模型、坐标数据和总结](examples/r12-validation/README.md)描述当前源码；保留全部原始字段不等于已验证全部 R12 标准语义。已发布的 0.1.1、固定 r2 标签及线上演示保持各自原版本。

[在线试用](https://mik1e80.github.io/dxfkit/) · [接口文档](README.mbt.md) · [一页项目申报 PDF](output/pdf/dxfkit-submission-one-page.pdf)

固定申报版本为 [`submission-0.1.1-20261022-r2`](https://github.com/mik1e80/dxfkit/tree/submission-0.1.1-20261022-r2)（`94509f3`），已经完成 `validation=full` 的[完整 CI #26 及同提交 Pages 部署](https://github.com/mik1e80/dxfkit/actions/runs/39761104538)，标签已创建。[r2 收敛记录](docs/r2-submission-20261022.md)说明该版的 SPLINE 修复与交付材料。当前 main 另含后续文档整理及[三份实际 CAD 导出验证](examples/cad-exports/README.md)；这些补充仅作本地定向验证，不追加入固定 r2 标签，也不改变已部署的 r2 版本。

## 能做什么

- 按 R12 配置保留各段原始记录和字段，提供七类既有核心轮廓、受限二维 SOLID/TRACE 以及带实例来源的块/阵列展开。
- 辅助检查开放轮廓、退化、自交、重复路径与指定净距，生成报告和 SVG。
- 将适用实体的 OCS 转为 WCS 并保留 XYZ；非 XY 检查平面、未支持语义、预算截断和离散失败进入不完整报告，`--strict` 拦截警告。

## 快速运行

已有 MoonBit 工具链时，在仓库根目录执行：

```sh
moon update
moon run cli read examples/r12-validation/models/06-ocs-array.dxf
moon run cli check examples/plate.dxf --min-gap 0.5 --strict
moon run cli svg examples/plate.dxf > plate.svg
```

样例是声明毫米单位的 100×60 外框与四个半径 3 的圆孔轮廓。首次获取工具链/依赖的时间取决于环境，安装与固定版本见[复现说明](docs/reproducibility.md)。**0.1.1 已发布到 [Mooncakes](https://mooncakes.io/docs/mik1e80/dxfkit)**；上述示例从仓库源码运行。

其他 MoonBit 工程可运行 `moon add mik1e80/dxfkit@0.1.1`，导入核心库；[registry 消费教程](examples/consumer/README.md#通过-mooncakes-使用)说明如何脱离本地 `moon.work` 使用。发布源提交和包校验和见[0.1.1 发布记录](docs/mooncakes-0.1.1.md)。

只承诺[实体矩阵](docs/entity-capabilities.md)列明的字段和检查，不能据此保证图纸可加工。

## 解决什么问题

面向已有 DXF 图纸的读取、预览与加工前辅助检查。例如，激光切割前复核轮廓是否开放、是否有重复线段，以及同图层不同实体的轮廓距离是否低于指定值。

项目以 DXF 的既有格式和几何算法为基础，参考 Python [ezdxf](https://ezdxf.readthedocs.io/en/stable/) 的能力组织。库可被其他 MoonBit 程序调用，CLI 可用于批量处理，网页可在本地浏览器处理文件。

在 MoonBit 生态中，已有 STEP、二维几何、G-code 和位图轮廓项目。本库的组合价值是 DXF 数据模型、普通块展开、带来源的轮廓提取与检查完整性诊断；通用几何能力存在交集。[生态对比表](COMPARISON.md)按 2026-10-22 核对的六个真实项目列明版本、固定文档、交集与边界，不据此宣称生态唯一；跨库适配尚未实现。

**检查结果不是可加工证明。** 材料、刀具、切缝、进给、机床和 CAM 策略不在本工具的验证范围内。

## 已实现能力

| 层次 | 内容 |
| --- | --- |
| 读取 | ASCII DXF 组码、三种换行、分段与子类、HEADER、图层和块；保留未知实体记录并给出诊断 |
| 核心轮廓 | LINE、CIRCLE、ARC、ELLIPSE、LWPOLYLINE、普通二维 POLYLINE、受限 SPLINE；仅承诺字段矩阵中的行为 |
| 块与其他信息 | INSERT 行列阵列、XYZ 基点、缩放/旋转/OCS、最多 8 层嵌套；WorldExpansion 保留来源句柄和逐层行列号 |
| 几何 | bulge 圆弧、椭圆、连续正权重 NURBS 的 XY 离散；嵌套块仿射变换 |
| 检查 | 退化几何、文字、图层、端点闭合、单实体自交、共线重叠、指定净距与检查覆盖提示 |
| 输出 | SVG 预览、文字报告、CLI 退出码 |
| 大文件 | `TagStream` 分块扫描与 CLI `stats`，不保存整份文件或全量 tag 列表 |

R12 的 SHAPE、VIEWPORT、DIMENSION、空间/网格 POLYLINE 等保留原始字段，尚未完整重建语义；HATCH、ELLIPSE、SPLINE、LWPOLYLINE 是非 R12 扩展，沿用明确受限的既有能力。3DFACE 保留 WCS 角点但不参与二维轮廓检查。SOLID/TRACE 在零厚度、局部同 Z 且转换后落入 WCS Z=0 检查平面时生成边界；其余三维轮廓保留 XYZ 并报告二维检查不完整。[R12 矩阵](docs/r12-profile.md)为当前行为入口；旧审查/模型数据保留其原验证版本，不代表本轮已重新完成全部验证。

## 十类模型与测试数据

[模型、DXF 与测试说明](examples/model-validation/README.md) · [10/10 结果总结](examples/model-validation/SUMMARY.md) · [设计真值](examples/model-validation/expected.json) · [实际数据](examples/model-validation/results.json)。包含独立解析参考；如未进行外部 CAD 确认，记录会明确标明。

## 实际使用示例

```bash
moon update
moon run cli check examples/plate.dxf --min-gap 0.5 --strict
moon run cli svg examples/plate.dxf > plate.svg
moon run cli check examples/issues.dxf
moon run cli svg examples/curves.dxf > curves.svg
moon run cli stats testdata/ezdxf/circle_radius_le_0.dxf
moon run examples/library --target js
```

- `plate.dxf`：声明毫米单位的 100×60 外框及四个半径 3 的孔，用来演示有明确尺寸的二维图纸复核。
- `issues.dxf`：重复线段和负半径；开放轮廓单独用 `examples/evidence/open-contour.dxf` 验证。
- `curves.dxf`：负 bulge 与 S 形样条，复现本次修复的曲线离散问题。

这些文件是项目自建示例，不代表生产设备或材料的加工认证。`testdata/ezdxf/` 另有 47 个第三方 DXF 回归文件；来源及完整 MIT 条款见第三方声明。

`examples/regressions/` 提供椭圆、SVG 坐标、损坏多段线、面实体和 INSERT OCS 六类最小反例；`node scripts/verify-delivery.cjs` 对真实网页产物逐项断言。`examples/library/` 是同模块内的简短包示例；真正有独立 `moon.mod` 的文件调用工程位于 [`examples/consumer/`](examples/consumer/README.md)，无需复制库内部实现或运行网页。

## CLI 和网页

`check` 支持 `--tol`、`--min-gap`、`--strict`。默认容差 0.05，默认不检查净距；容差必须为正，净距必须非负，二者都必须有限。

| 退出码 | 含义 |
| --- | --- |
| 0 | 未触发所选退出条件；普通模式仍可能有警告 |
| 1 | 有严重问题；启用 `--strict` 时，警告也触发此退出码 |
| 2 | 参数错误或文件读取失败 |

坐标和阈值都使用图纸原始单位，显示 HEADER 的单位声明供确认，不自动转换成毫米。

网页可打开 `web/index.html`，或访问在线版。文件在浏览器本地处理；可上传图纸、调整净距、查看报告和预览，并选择正常、问题、未覆盖三类内置示例。仓库包含编译产物，修改库后需重建：

```bash
node scripts/build-web.cjs
node web/smoke.cjs
node scripts/verify-delivery.cjs
node scripts/verify-completeness.cjs
```

## 算法与范围

NURBS 先按节点插入分解为有理 Bézier 段，再用控制点凸包判定细分；不再用单个中点代表整条曲线。负 bulge 保持多段线原始的起终点顺序。块放大时根据累计变换调整局部离散容差。

推荐使用带实体身份的 `Entity::flatten_checked()`；曲线也可使用 `Geometry::flatten_checked()`、`spline_points_checked()` 获得曲线输入或资源上限的错误原因。`Flat::Empty` 仍表示没有可离散轮廓，调用方须单独核对覆盖范围；旧 `flatten()` / `spline_points()` 保留兼容回退，不能用其占位结果证明几何正确。

ELLIPSE 长轴字段按相对圆心向量读取。SVG 输出使用有限 Double 的往返数字表示，不依赖整数缩放或固定四位小数。损坏顶点拒绝生成整条多段线轮廓并报告；拟合、空间或网格 POLYLINE 不作为普通二维折线处理。接口行为收紧及迁移说明见[历史最小反例](docs/delivery-verification.md#兼容变化)。

以下限制需在集成时考虑：

- 二进制 DXF、写回与编辑、完整引用审计、刀路生成、参数化草图求解尚未实现。
- 几何以 XY 投影分析，不是三维 CAD 内核；非默认 OCS 未转换。非默认 OCS 的 INSERT（包括嵌套引用）整体跳过并报告句柄、图层和块名，避免把错误 XY 几何用于检查或预览。
- 闭合、自交、重复和净距检查按图层处理，不检查跨图层关系。
- 净距比较同图层不同实体的离散线段，跳过容差内端点接触，不覆盖单实体内部窄颈或真实材料厚度。
- 自交检查针对同一实体的非相邻线段；并非通用多实体相交或区域布尔检查。
- UTF-8、CP1252 可解码；其他声明代码页降级并警告。HEADER 编码探测只读取文件开头 1024 字节。
- 资源上限、浮点精度与离散误差会影响结果，尤其是阈值附近；详细说明见接口文档。

## 流式统计

`stats` 每次读取 256 KiB，主要保留当前块、未完成文本行、扫描警告和统计表。不构造全量图纸，不能在这个入口执行几何检查。

**总内存并非对任何输入都为常数**：超长行、警告数量、不同段名及调用方保留的输出都可能使存储增长。`check` 和 `svg` 仍需读取完整文件。

## 验证与开发

按改动选取必要检查，默认轻量验证。文档/PDF 改动运行 `node scripts/verify-submission-docs.cjs`；代码改动选择相关测试文件和受影响入口，不默认运行以下全部命令。命令列表保留作按需验收参考，见[验证约定](docs/verification-guide.md#本轮材料修订如何验证)。

格式与公开接口的轻量门禁为 `node scripts/verify-maintenance.cjs`，执行 `moon fmt --check` 和 `moon info`，核对已提交的 [API 快照](pkg.generated.mbti)。该门禁已接入当前 main 的 CI / full 流程；[接口审阅与迁移约定](docs/public-api-review.md)说明兼容接口及 checked 边界，独立维护 CI 不部署页面。

```bash
moon check --target all --deny-warn
moon build
moon test
moon test --target js
moon test --target native
moon run conformance
node cli/smoke.cjs
node scripts/build-web.cjs
node web/smoke.cjs
node scripts/verify-delivery.cjs
node scripts/verify-completeness.cjs
node scripts/verify-consumer.cjs
node scripts/verify-consumer.cjs --target native
node scripts/verify-test-sensitivity.cjs
node scripts/verify-corpus-records.cjs
```

测试包含负 bulge 顺序、S 形样条、非均匀节点、有理权重、重节点和未钳制样条；用独立 de Boor 求值的密集采样对照新离散结果。另测试块放大后的世界坐标误差、无效参数、数值解析、检查覆盖及 CLI / 网页入口。

9 个几何精度验收、8 个检查器成对测试及另补的 2 个椭圆实体测试从最小 DXF 开始验证结果。测试敏感性脚本在临时副本中注入长轴重复减圆心、坐标偏移、样条直线化、bulge 镜像、漏报、误报和阈值错误，要求实际断言失败；编译失败不算检出。具体预期和结果见验收矩阵。

独立工程验收把 `examples/consumer/` 复制到系统临时目录后编译运行；Wasm 和 Native 各有 8 个实际检查、运行与退出码断言，含 SOLID 的 Entity 入口；结果记录见教程。示例文件可在独立模块中直接读取。

47 个第三方文件用于读取和回归验证，不是完整 DXF 一致性测试套件。逐文件来源、SHA-256、实际测试和分层结果见[语料案例表](docs/corpus-validation.md)及对应 JSON；当前没有这些外部文件的独立几何真值，不把自建精度测试迁移为逐图纸认证。网页回归使用实际编译产物与最小 DOM，不验证浏览器布局。

## 审阅与申报材料

[兼容性案例](docs/compatibility-cases.md) · [修订后的申报材料](docs/submission.md)：区分文件读取、实体解码和几何检查，不承诺 R10–R2018 完整兼容。

[冻结交付范围与实体字段矩阵](docs/delivery-scope.md) · [历史最小反例与修复记录](docs/delivery-verification.md)

[检查不完整的统一处理与混合输入验收](docs/check-completeness.md)：通过 `Report::has_incomplete_checks()` 判断，CLI 与网页报告明确标示，`--strict` 触发失败。

[独立 MoonBit 工程调用教程](examples/consumer/README.md)：独立模块依赖本库，直接读取 DXF、提取实体、checked 离散和生成检查报告；包含复制到仓库外的步骤。

[几何正确性与检查器验收矩阵](docs/test-accuracy.md)：核对坐标、尺寸、包围盒与解析曲线误差；成对验证报警与不报警，并在临时副本中验证九类故障能否被测试发现。含非原点椭圆的精确包围盒与平移不变性验收。

[47 张第三方图纸的逐文件验证记录](docs/corpus-validation.md)：分别记录读取、实体字段解码、实际测试和未覆盖部分，不将语料回归统一标为兼容通过。

Mooncakes 版本 **0.1.1** 已发布，对应源码提交 `dc3acc8`。固定 r2 申报标签仍对应 `94509f3`，两者的验证范围分别记录。

[再次申报的证据索引](docs/resubmission-evidence.md) · [实体分层矩阵](docs/entity-capabilities.md) · [独立对照及实际误差](docs/independent-validation.md) · [退回意见响应表](docs/review-response.md)。10 个真实 CLI 案例保存输入、报告、SVG 和断言，运行 `node scripts/verify-submission-evidence.cjs` 复核。

交付固定标签：`submission-0.1.1-20261022-r2`。[干净环境复现步骤](docs/reproducibility.md)固定工具链和依赖；运行 `node scripts/verify-reproduction.cjs --fresh` 验证测试、CLI、网页和申报材料对应同一提交。

[验证材料导航与名称约定](docs/verification-guide.md)统一使用“历史最小反例 / 补充几何审查 / 正确性与故障检出 / 真实入口证据”四个名称，具体数量留在对应记录中。

代码、README、一页 PDF、十类模型及证据统一收录于上述最终申报标签；旧标签保留其历史提交。

## 许可

项目采用 [Apache-2.0](LICENSE)。第三方语料与参考资料的来源、版权和完整条款见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。


## 覆盖限制回归案例

`moon run cli check examples/unsupported-insert-ocs.dxf --strict` 应报告未转换 OCS、跳过该引用，并以 1 退出。该文件故意超出支持边界；普通模式出现警告也可能以 0 退出，不代表完整几何通过。顶层及嵌套路径见 insert_ocs_wbtest.mbt，CLI 与网页另运行真实入口回归。

变更与兼容约定见 [CHANGELOG.md](CHANGELOG.md)；已完成工作、后续优先级及验收条件见[路线图](docs/roadmap.md)，问题复现可提交至 [Issues](https://github.com/mik1e80/dxfkit/issues)。

main 后续补充[两种实际 CAD 软件的三份导出验证](examples/cad-exports/README.md)：FreeCAD / OpenSCAD 原生模型、原始 DXF、版本设置、哈希、测试数据和报告随仓库保存，3/3 本地定向验证通过；这些软件内自建样本不称为第三方生产图纸。

固定 r2 标签及其完整验证记录保持不变；main 后续的文档整理和 CAD 导出补充分别记录验收范围，不移动 r2 标签。
