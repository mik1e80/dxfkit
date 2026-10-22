# 验证材料导航与名称约定

当前使用四个固定名称组织证据，避免把历史问题组、测试条数、错误注入种类混在一起相加。原记录中的日期、编号、实际通过/失败数保持不变。

| 固定名称 | 内容与作用 | 入口 |
| --- | --- | --- |
| 历史最小反例 | 最初六组技术问题，保留修复前后和迁移记录；其中面实体的历史降级不是当前 SOLID/TRACE 行为 | [历史最小反例](delivery-verification.md) |
| 补充几何审查 | 后续五组审查主题，实际拆成 11 个库测试与 11 个网页/CLI 案例 | [补充几何审查](review-cases.md) |
| 正确性与故障检出 | 几何解析预期、检查器正反例、九种故障注入；敏感性 10/10 包括基线，不等于十种故障 | [正确性验收](test-accuracy.md)、[机器结果](test-sensitivity-results.json) |
| 真实入口证据 | 10 个完整 CLI 场景的报告、SVG、独立解析误差和退出码；与历史分组存在覆盖交集 | [再申报索引](resubmission-evidence.md)、[独立对照](independent-validation.md) |

## 本轮材料修订如何验证

当前最终申报标签为 `submission-0.1.1-20261022`，统一包含代码、README、一页 PDF、模型测试与证据。2026-10-22 的历史文档提交 848617a 使用 [skip ci]，当时 Pages 留在 679f81a；这是历史状态，本轮最终完整 CI 及同提交 Pages 通过后才创建最终标签，旧标签不移动。

日常默认按改动运行必要的轻量验证；本次十类模型和两句报告措辞先做针对性检查，最终收敛阶段按明确要求运行一次完整 CI。

```sh
node scripts/verify-submission-docs.cjs
node examples/model-validation/generate-models.cjs
node examples/model-validation/verify.cjs
```

[十类模型目录](../examples/model-validation/README.md)包含输入、真值、实际数据、报告、SVG 和总结。[一页申报 PDF](../output/pdf/dxfkit-submission-one-page.pdf)与[完整申报书](submission.md)使用同一最终标签，提交 SHA 从标签和 CI/Pages 记录解析。旧机器记录中的采集时源码/编译产物哈希保留其历史含义，不冒充最终执行 SHA；最终实际执行身份见 verification.json 和模型验证记录。

PDF 生成源为 [build-submission-pdf.py](../scripts/build-submission-pdf.py)，依赖 reportlab 和可嵌入的中文 TrueType 字体；更新后检查页数、文本并渲染查看。未核实截图中的 OSC2026 规则，不将“一页 PDF 必交”写成已核实的官方要求。

后续仍按改动选取相关测试与必要后端，不默认运行全量。完整复现命令保留作明确需要时的最终验收入口。
