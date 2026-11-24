# 验证材料导航

当前维护新增[诊断洪泛与维护记录](maintenance-20261116.md)、[模型来源和验证层次](testing.md)、[许可适用范围](licensing.md)、[兼容性](compatibility.md)、[资源预算](resource-limits.md)及[R12分层清单](r12-conformance-matrix.md)。本轮只做必要验证，下面保留此前各轮证据入口。

当前交付版本为 `v0.2.1` / `e07ec17`。[一页 PDF](../output/pdf/dxfkit-submission-one-page.pdf)、[完整 CI](https://github.com/mik1e80/dxfkit/actions/runs/45405781541)和[验收说明](acceptance-0.2.1.md)记录当前发布身份。早期 R12 整改见[历史说明](resubmission-20261027.md)、[证据索引](resubmission-evidence.md)和[退回响应](review-response.md)。

| 名称 | 入口 | 验证角色 |
| --- | --- | --- |
| R12记录与结构 | `r12_read_test.mbt`、`r12_structure_test.mbt` | 有序记录保留、版本选择、孤立子记录/错误所在段/序列中断；不是全部字段符合性审计 |
| R12坐标与六模型 | [模型及数据](../examples/r12-validation/README.md) | 设计真值、XYZ、实例路径及资源边界 |
| 第三方阵列专项 | [外部案例](../examples/r12-validation/EXTERNAL.md) | 100个FLAG世界顶点、圆采样和独立格式审计；部分验证不算整图认证 |
| 语料回归 | [47文件表](corpus-validation.md) | 读取/解码/展开/报告；G1/C0包含在默认定向检查 |
| 参数模型和真实入口 | [十类模型](../examples/model-validation/SUMMARY.md)、[CLI结果](submission-evidence/results.json) | 几何数值、正常无误报、设计错误检出及strict行为 |
| 补充几何审查 | [说明](review-cases.md)、[结果](review-cases-results.json) | 当前网页/CLI行为；原“非默认OCS必拒绝”的预期已改为实际坐标及适用平面 |
| 历史最小反例 | [旧问题与迁移](delivery-verification.md) | 追踪早期修复，原始失败记录不是当前能力声明 |
| 正确性与故障检出 | [原验收](test-accuracy.md)、[历史敏感性结果](test-sensitivity-results.json) | 原版本证明的算法/故障检出范围，未在本轮重新执行故障注入 |
| 消费与发布 | [独立工程](../examples/consumer/README.md)、[0.1.1发布记录](mooncakes-0.1.1.md) | 源码workspace、已发布registry包分别记录 |

日常命令为`node scripts/verify-advisor.cjs`，CI使用干净检出的`--fresh`。结果明确为`targeted-r12`、`full_suite_run=false`；具体范围和精确源码身份见[复现说明](reproducibility.md)。格式/API维护门禁只证明格式与公开接口快照，不冒充功能或全量测试。

历史版本包括[r2 原版 PDF](https://github.com/mik1e80/dxfkit/blob/submission-0.1.1-20261022-r2/output/pdf/dxfkit-submission-one-page.pdf)与[0.2.0 发布证据](acceptance-0.2.0.md)，各自保留对应提交和完整验收记录。
