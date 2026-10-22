# 格式与公开 API 核对

核对日期：2026-10-22，固定 MoonBit 发行包 `0.10.14+7d59c7ec9`。这是 r2 后 main 的工程维护，不移动固定 r2 标签，也不声称该历史标签已经包含新门禁。

## 格式门禁

现有模块首次 `moon fmt --check` 失败；在副本执行同版本 `moon fmt` 后，统一 34 个源码/包配置文件的排版，不修改算法或测试预期。格式化前后分别运行 `moon info --frozen`，核心库生成的公开接口逐字相同。

[轻量维护脚本](../scripts/verify-maintenance.cjs)依次执行 `moon fmt --check`、`moon info --frozen`，再比较已提交的 [pkg.generated.mbti](../pkg.generated.mbti)。快照不一致即失败，不把自动生成的新签名静默当作审核通过。只有经过接口兼容审阅后才能提交更新后的快照。

该门禁已接入 targeted-advisor 和 full 脚本，位置在依赖获取之后、测试之前；另有[独立维护 CI](../.github/workflows/maintenance.yml)，仅执行依赖获取和格式/API 核对，无测试全量、站点构建、部署或包发布。结果写 `_build/maintenance.json`，明确 `validation_profile=maintenance`、`full_suite_run=false`。

## 核心接口审阅

| 层次 | 实际公开入口 | 说明与文档 |
| --- | --- | --- |
| 读取与数据模型 | `scan_tags`、`build_drawing`、Tag/Record/Section/Entity | 保留低层记录模型和解析入口，调用方可以检查原始字段；见[接口说明](../README.mbt.md)及[字段矩阵](entity-capabilities.md)。 |
| 展开与资源限制 | `Drawing::expand`、`expand_with_limits`、`ExpandLimits` | 类型及预算入口均出现在生成清单；默认预算与截断诊断见[整改记录](advisor-review-20261022.md)。 |
| 几何与结果 | `Entity::flatten_checked`、`Geometry::flatten_checked`、`Drawing::check` / `check_with_limits`、`Drawing::analyze`、`Report::has_incomplete_checks` | checked 返回值和完整性状态需同时处理；实体来源语义与裸 Geometry 入口不同，见下。 |
| 兼容名称 | `Layer::is_machinable`、`is_enabled_for_checks` | 旧名仅为同义兼容，不判断能否加工；新代码使用后者，保留现有调用行为。 |

此次没有新增公开函数或删除既有公开类型。现有 `pub(all)` 的记录、几何、向量、检查结果和预算类型供外部读取/构造；低层解析及几何函数也已是公开接口，不能仅因名字底层就无迁移删除。未发现本轮误将新的缓存、解析临时状态或测试辅助函数暴露出去；本结论不等于对每个既有 API 做长期稳定性承诺。

`is_machinable()` 采用**文档弃用**：源码说明及接口文档推荐 `is_enabled_for_checks()`。本次没有加编译器 deprecated 属性，避免老调用在 `--deny-warn` 下突然失败；旧行为仍由相关图层测试覆盖。

## checked / unchecked 的调用边界

- `Geometry::flatten()` 和低层 `*_points()` 不能替代完整性诊断。需要错误原因时优先 checked 入口；批量图纸应结合 Report 判断是否存在未检查部分。
- `Entity::flatten_checked()` 知道实体身份及记录上下文；受限 SOLID/TRACE 用该入口。裸 `Geometry::Face` 不能据此推导实体轮廓，返回 Empty；3DFACE 不进入二维轮廓检查。
- `bounds()` 是原始字段的包围估计，不是 checked 几何有效性证明；公开可构造的类型允许出现非法值，调用方不能绕过检查后把估计当认证。
- `has_incomplete_checks()==false` 仅表示本次流程没有报告已知未覆盖部分；它与“没有发现”、可加工保证或完整 DXF 标准兼容不是一回事。

## 开发与发布前检查

有固定工具链及依赖后，在仓库根目录运行：

```sh
moon update
node scripts/verify-maintenance.cjs
```

API 有意变化时，先审阅 `git diff -- pkg.generated.mbti`，补迁移及相应测试，然后将源码与新快照一并提交。仅核心库快照被版本管理，命令包、网页包装和示例包的生成清单忽略；独立消费模块不属于本门禁的模块范围。

日常仍按差异选择必要测试。本轮执行格式/API、全目标类型检查、相关边界/图层测试、语料记录重放以及三份 CAD 导出验证，不运行 full 套件。语料重放是为了核对格式化涉及源码的哈希：只允许源码哈希变化，不能改 47 个 DXF 字节或放宽几何/诊断预期。
