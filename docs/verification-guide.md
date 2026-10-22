# 验证材料导航与名称约定

当前使用四个固定名称组织证据，避免把历史问题组、测试条数、错误注入种类混在一起相加。原记录中的日期、编号、实际通过/失败数保持不变。

| 固定名称 | 内容与作用 | 入口 |
| --- | --- | --- |
| 历史最小反例 | 最初六组技术问题，保留修复前后和迁移记录；其中面实体的历史降级不是当前 SOLID/TRACE 行为 | [历史最小反例](delivery-verification.md) |
| 补充几何审查 | 后续五组审查主题，实际拆成 11 个库测试与 11 个网页/CLI 案例 | [补充几何审查](review-cases.md) |
| 正确性与故障检出 | 几何解析预期、检查器正反例、九种故障注入；敏感性 10/10 包括基线，不等于十种故障 | [正确性验收](test-accuracy.md)、[机器结果](test-sensitivity-results.json) |
| 真实入口证据 | 10 个完整 CLI 场景的报告、SVG、独立解析误差和退出码；与历史分组存在覆盖交集 | [再申报索引](resubmission-evidence.md)、[独立对照](independent-validation.md) |

## 本轮材料修订如何验证

当前统一申报目标为 `submission-0.1.1-20261022-r2`。旧 `submission-0.1.1-20261022` 保留 f233ddc，a5d747f 的针对性记录也保留历史身份；r2 不移动旧标签。

日常按改动做必要验证，push 默认 targeted-advisor。此次最终收敛在 SPLINE 71 修复、README/申报书/PDF/证据同步完成后，手动运行 validation=full，完整验收及同提交 Pages 成功后才创建 r2。

```sh
node scripts/verify-advisor.cjs
# 最终 full 复现（干净检出）
node scripts/verify-reproduction.cjs --fresh
```

[r2 说明](r2-submission-20261022.md)记录 3 个次数库测试、14 个边界 CLI 及版本身份规则；[十类模型](../examples/model-validation/README.md)、[ezdxf 对照](../examples/independent-fields/README.md)和[一页 PDF](../output/pdf/dxfkit-submission-one-page.pdf)统一收录。validation_profile=full 且 full_suite_run=true 才表示本次完整验证，不能用 targeted 成功代替。

PDF 的可复现生成源为 [build-submission-pdf.py](../scripts/build-submission-pdf.py)，更新后用 pypdf 检查一页及文本，并渲染核对排版。未核实比赛官方材料门槛，不作必交规则陈述。
