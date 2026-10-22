# 退回意见响应表

依据参赛者提供的退回通知截图，原意见为：

> 申报的 R10–R2018 覆盖承诺与有限实体范围未形成完整标准读取终点，请明确 DXF 兼容边界及其与几何检查的关系并附带案例。

以下将这一条意见拆开回应；不将后续整改建议写成主办方新增的正式规则。交付固定标签 `delivery-0.1.1-20261022-evidence`，随[修订申报书](submission.md)提供。[材料索引](resubmission-evidence.md)汇总实际输入、报告、SVG、误差与复现命令。

| 原意见中的问题 | 如何整改 | 证据位置 | 如何验证 |
| --- | --- | --- | --- |
| R10–R2018 覆盖承诺过宽 | 撤回完整跨版本承诺，按记录/字段/轮廓/检查分层表述；不从 ACADVER 推断全部能力 | [申报书兼容边界](submission.md#dxf-兼容边界与几何检查的关系)、[实体矩阵](entity-capabilities.md) | 阅读未承诺字段列；运行旧版本最小文件的 strict 案例，应因无可检查轮廓退出 1 |
| 有限实体范围与“完整标准读取终点”不相称 | 交付终点收敛为 ASCII DXF 结构化记录、受限 XY 轮廓和辅助报告，逐组码列限制 | [交付范围](delivery-scope.md)、[独立消费工程](../examples/consumer/README.md) | `node scripts/verify-consumer.cjs` 及 `--target native`，确认库接口能在独立模块直接调用 |
| DXF 兼容边界与几何检查关系不明确 | 将未支持实体、OCS、损坏坐标、未展开阵列和离散失败统一进入不完整报告；正常部分不能掩盖缺失 | [完整性约定](check-completeness.md)、[实际限制案例](resubmission-evidence.md#真实入口案例) | `node scripts/verify-submission-evidence.cjs`：所有限制案例 strict=1，原因逐项存在；正常板件 strict=0 |
| 缺少可核对案例 | 保存正常、问题及覆盖限制输入、报告、SVG、命令、输入哈希；47 文件分层登记而非统称兼容通过 | [10 个真实入口记录](submission-evidence/results.json)、[独立对照](independent-validation.md)、[47 文件表](corpus-validation.md) | 同一脚本重跑快照与解析误差；`node scripts/verify-corpus-records.cjs` 核对语料记录；几何真值仍为 0/47 |

## 后续整改建议的落实情况（项目自定验收）

| 建议 | 已落实的证据 | 复核入口 |
| --- | --- | --- |
| 固定范围和六类技术问题先复现再修 | [范围](delivery-scope.md)、[六类修复](delivery-verification.md)、[追加审查修复前后](review-cases.md) | `node scripts/verify-delivery.cjs`、`node scripts/verify-review-cases.cjs`；后者需先构建网页 |
| 不完整检查统一、提供可复用调用例 | [完整性](check-completeness.md)、[消费者工程](../examples/consumer/README.md) | `node scripts/verify-completeness.cjs`、`node scripts/verify-consumer.cjs` |
| 测试判断正确性，保留独立参照 | [成对及几何验收](test-accuracy.md)、[解析公式和实际误差](independent-validation.md) | `node scripts/verify-test-sensitivity.cjs`、`node scripts/verify-submission-evidence.cjs` |
| 整理第三方文件，说明生态价值 | [47 文件分层记录](corpus-validation.md)、[生态对比及固定来源](../COMPARISON.md) | `node scripts/verify-corpus-records.cjs`；生态对比是文档核对，没有声称实跑相邻库 |
| 从干净环境复现同一提交 | [固定工具、依赖、标签和完整步骤](reproducibility.md) | 新检出运行 `node scripts/verify-reproduction.cjs --fresh`，核对 CI / Pages 的实际提交及哈希 |

上述内容回应技术意见，不表示主办方已经认可或报名已重新提交。本次未代为填写报名表、发布 Mooncakes 或声称其他参赛条件已完成。
