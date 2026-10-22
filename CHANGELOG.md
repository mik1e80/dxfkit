# 变更记录

## 未发布 — r2 后的补充

- 统一固定工具链下的 MoonBit 格式，新增 `moon fmt --check` / `moon info --frozen` 维护门禁及核心公开 API 快照，接入 targeted/full 并提供独立轻量 CI；公开签名与格式化前一致。`is_machinable()` 明确文档弃用与兼容行为，见[API 核对](docs/public-api-review.md)。不发布包、不移动 r2 标签。
- 新增[两种 CAD 软件的三份实际导出](examples/cad-exports/README.md)：FreeCAD 1.1.3 四孔板与偏移椭圆、OpenSCAD 2021.01 矩形，保存原生源文件、原始 DXF、软件/设置/哈希、OCC 测量、API/CLI/SVG 输出及逐项断言，3/3 本地定向通过；未改库算法。保留并记录椭圆结束参数截断与 OpenSCAD 单位未声明的真实导出差异，未运行全量测试或移动 r2 标签。
- 文档整理提交补齐以下 r2 交付记录，新增[路线图](docs/roadmap.md)和 README 导航；该文档提交未修改库行为、PDF、验证数据或模块版本。
- 固定申报版本仍为 `submission-0.1.1-20261022-r2`（`94509f3`）；这些后续文档不追加入已存在的标签，不把文档提交声称为新的完整验证版本。

## 0.1.1 源码交付 r2 — 2026-10-22（尚未发布 Mooncakes）

固定标签：[submission-0.1.1-20261022-r2](https://github.com/mik1e80/dxfkit/tree/submission-0.1.1-20261022-r2)，提交 `94509f3d76bfaabde409d39e1b57b8e215a794f3`。以下汇总该标签包含的后续整改；更早轮次的采集记录保留在下面。

### 正确性与覆盖边界

- SPLINE 缺少次数组码 71 时不再默认三次：保留原始记录、返回 Unknown 并报告检查不完整；次数 0/33 由 checked 入口拒绝。缺失、正常三次和越界输入的测试及 CLI 结果见[r2 记录](docs/r2-submission-20261022.md)。
- SPLINE 的 Closed / Periodic 语义尚未实现时拒绝生成轮廓；部分权重缺失不再自动补 1，只有完全没有权重时使用默认等权重。
- BLOCK 缺少 ENDBLK 时增加恢复诊断，并保留下一个块定义；不把恢复后的图纸当作完整检查结果。
- checked 入口拒绝 ELLIPSE 轴比大于 1；LWPOLYLINE 宽度/厚度及普通 POLYLINE 顶点宽度增加覆盖诊断，中心线检查不能代表完整宽度几何验证。
- 新增 `Layer::is_enabled_for_checks()`，旧 `is_machinable()` 保留兼容；文字与关闭/冻结图层的提示改为本工具的检查边界，不承诺下游机床行为。
- 新增 `ExpandLimits` 控制展开资源；`Drawing::analyze()` 共享一次展开，减少网页重复解析。尚未引入 Web Worker，不承诺所有大输入均无卡顿。
- 明确 `bounds()` 是原始解码字段的包围估计，不等于通过 checked 几何验证；本次没有新增 `bounds_checked()`。

### 验证与交付

- 增加[十类参数模型](examples/model-validation/README.md)，保存 DXF、参考数据、实际报告/SVG 和总结；不将这些模型称为来自多种 CAD 软件的新导出文件。
- [边界 CLI 案例](examples/advisor-boundaries/README.md)扩为 14/14；ezdxf 1.4.4 实跑核对 5 文件、67 条记录、507 个数值字段，最大绝对差 0，见[独立字段对照](examples/independent-fields/README.md)。字段一致不等于完整几何认证，47 张第三方图纸的独立逐图纸几何真值仍为 0/47。
- 更新一页 PDF、README、复现说明及 GitHub About；区分日常 targeted 验证与最终手动 full 验收，保留旧标签。
- r2 的[完整 CI 与同提交 Pages 部署](https://github.com/mik1e80/dxfkit/actions/runs/39761104538)成功；四后端测试全部通过（Wasm/Native 各 297，JS/Wasm-GC 各 280），并通过外部消费工程、语料、敏感性与实际入口验证。发布后核对 161 个线上资产，验证身份为 `full`、`full_suite_run=true`、`source_dirty=false`。

### 使用与迁移

- 原来依赖缺失次数默认值、部分权重自动补齐或不支持语义的输入，可能从生成轮廓变为明确拒绝或检查不完整；调用方应处理 `Report::has_incomplete_checks()`，不能把“读取成功”当作“完整几何通过”。
- SOLID/TRACE 继续通过 `Entity::flatten_checked()` 使用受限二维边界；裸 `Geometry::Face` 的 checked/flatten 仍返回 Empty，3DFACE 不参与二维轮廓检查。本条确认既有行为，没有重新扩大支持范围。

## 未发布 — 2026-10-22

- 追加五项审查验收：11 项库测试及 11 个真实网页/CLI 案例；最初 9 项修复前 4 通过/5 失败，另补非零厚度和真实零长度边保护。默认 OCS、零厚度、同 Z 的 SOLID/TRACE 新增有序边界，三角形消除格式规定的重复第四点；原始 Face 与 3DFACE 顺序不改写。
- 新增 Entity::flatten_checked，裸 Geometry::Face 仍返回 Empty；残缺第四点明确拒绝，缺整个第四点恢复会报告不完整。敏感性扩为 10/10，独立消费工程各 8 项。
- 语料仅 uncommon.dxf 的 59B SOLID 增加正确三点轮廓，移除一条未覆盖警告；核对该实体逐坐标与边长后更新严格记录，47 张逐图纸独立几何真值仍为 0/47。
- 新交付标签使用 delivery-0.1.1-20261022-review，既有标签保留。

- 补非原点椭圆的两个实体验收：圆心 (10,0)、长轴向量 (10,0)、轴比 0.5 的精确包围盒，以及平移后逐顶点形状与尺寸不变；解析算法已正确，本次未改动 entity.mbt。
- 临时副本恢复长轴再次减圆心的旧错误，编译后仅新增两项实体测试失败；敏感性验收扩为 8/8。新交付标签使用 delivery-0.1.1-20261022-ellipse，既有标签保留。

- 重新核对六个 MoonBit 相邻项目，生态对比记录具体版本、固定提交文档、能力交集与边界；新增机器可读来源记录，不把文档核对描述为第三方测试或已完成集成。
- 申报说明和 README 突出 DXF 数据模型、普通块展开、带来源轮廓提取与完整性诊断的组合价值；生态对比及来源记录纳入部署副本与哈希清单。
- 新交付使用 delivery-0.1.1-20261022；20261021 标签保留不变。本次不修改库算法，不发布 Mooncakes。

## 未发布 — 2026-10-21

- 固定 MoonBit 发行包与依赖，新增干净检出全流程复现、跨平台 Node 网页构建及提交/产物/申报说明哈希清单。
- CI 成功后部署同一验证产物，移除独立 Pages 构建；按 Git 提交的字节重建三份本地换行不同图纸的哈希记录，保留全部严格比较并增加差异定位。

- 整理 47 张第三方 DXF 的逐文件验证表及 JSON，记录来源、SHA-256、读取/实体字段解码结果、实际参与测试和未覆盖部分；明确独立几何真值验证为 0/47。
- conformance 新增 --audit JSON Lines，CI 重放 14 条语料测试和空图纸 strict 门禁，并核对记录；未修改现有 DXF 文件。

- 增加七类核心实体与 INSERT 的 9 个几何精度测试、8 个检查器正反/阈值测试；原 S 形曲线点数断言升级为解析 Bernstein 曲线误差对照。
- 增加临时副本故障注入验收，六类坐标/几何/检查器错误全部被断言拒绝；矩阵、实际输出及复现命令见 docs/test-accuracy.md。

- 新增 examples/consumer 独立 MoonBit 模块，公开 API 完成文件读取、实体提取、checked 离散和完整性报告处理；提供本地依赖与仓库外复制教程。
- 新增真实外部工程验收，Wasm / Native 各 7 个检查与运行案例，并接入 CI；当前修订仍通过本地 moon.work 使用。

- 统一检查完整性：新增 Report::has_incomplete_checks()，报告结论明确“检查不完整”，保留原因分类；CLI strict 对这类结果失败，即使仍有正常轮廓。
- 修复 SPLINE 缺坐标控制点静默丢失后仍离散的问题；拒绝该实体轮廓并诊断，补声明数量和未完成控制点验证。
- 增加包含正常圆的混合文件、10 个实际网页完整性案例、12 条库测试及真实 CLI 退出码断言；完整记录见 docs/check-completeness.md。

- 冻结为七类核心二维轮廓及普通 INSERT，新增字段矩阵、六类最小输入、修复前后输出和自动断言；申报稿明确读取、解码与检查的关系。
- 修复 ELLIPSE 相对长轴向量被再次减去圆心的问题；补非原点及旋转椭圆弧验证。
- SVG 改用 Double 往返数字表示，修复整数缩放溢出与微小坐标归零；输出不再固定四位小数，可含科学计数法。
- LWPOLYLINE / POLYLINE 损坏坐标不再静默丢顶点后拼接；保留记录并拒绝该轮廓，增加数量声明及 SEQEND 恢复诊断。
- 普通二维 POLYLINE 不再接收拟合、空间和网格标志；这些记录以未解码几何和覆盖提示交付。
- SOLID / TRACE / 3DFACE 保留角点字段，但 Face 的 flatten / checked 返回 Empty，退出轮廓检查和 SVG；需要面几何的调用方应使用原字段另行处理。
- 保留并验证已有 INSERT OCS 修复；新增公开包调用示例及正常、问题、未覆盖三个浏览器示例。
- 本次仍未发布 Mooncakes。迁移说明和复现命令见 docs/delivery-verification.md。

## 未发布 — 2026-10-17

- 修复顶层及嵌套 INSERT 非默认 OCS 在展开后丢失诊断的问题；不支持的引用整体跳过并说明来源。
- 增加复现图纸、严格 CLI 及网页回归。
- Pages 分发携带完整项目许可与来源说明。
- 本次未发布 Mooncakes。

兼容约定：非法或未支持输入可能因正确性修复从成功变为明确失败，此类收紧会记录反例和原因；公开接口移除或含义改变必须说明迁移办法。
