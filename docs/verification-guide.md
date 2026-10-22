# 验证材料导航与名称约定

当前使用四个固定名称组织证据，避免把历史问题组、测试条数、错误注入种类混在一起相加。原记录中的日期、编号、实际通过/失败数保持不变。

| 固定名称 | 内容与作用 | 入口 |
| --- | --- | --- |
| 历史最小反例 | 最初六组技术问题，保留修复前后和迁移记录；其中面实体的历史降级不是当前 SOLID/TRACE 行为 | [历史最小反例](delivery-verification.md) |
| 补充几何审查 | 后续五组审查主题，实际拆成 11 个库测试与 11 个网页/CLI 案例 | [补充几何审查](review-cases.md) |
| 正确性与故障检出 | 几何解析预期、检查器正反例、九种故障注入；敏感性 10/10 包括基线，不等于十种故障 | [正确性验收](test-accuracy.md)、[机器结果](test-sensitivity-results.json) |
| 真实入口证据 | 10 个完整 CLI 场景的报告、SVG、独立解析误差和退出码；与历史分组存在覆盖交集 | [再申报索引](resubmission-evidence.md)、[独立对照](independent-validation.md) |

## 本轮材料修订如何验证

2026-10-22 本次仅整理 GitHub 文档、About 信息和一页 PDF，不改 MoonBit 算法、测试输入及已有验证结果。默认只做与改动相关的轻量检查：

```sh
node scripts/verify-submission-docs.cjs
```

PDF 生成时另用 pypdf 检查实际页数与文字，并渲染为 PNG 人工检查中文、间距和裁切。生成源在 [`build-submission-pdf.py`](../scripts/build-submission-pdf.py)，需要 reportlab 和可嵌入的中文 TrueType 字体：

```sh
python scripts/build-submission-pdf.py --font /path/to/cjk-font.ttf --bold-font /path/to/cjk-bold-font.ttf
```

[一页申报 PDF](../output/pdf/dxfkit-submission-one-page.pdf)面向快速审阅；[完整申报书](submission.md)保留详细字段、证据和限制。未核实截图中的 OSC2026 规则，因此不将“一页 PDF 必交”描述成已经核实的官方要求。

本轮同步使用 `[skip ci]` 的文档提交，避免自动触发原工作流的全量测试；不修改 CI 配置。既有已验证技术交付仍是 `delivery-0.1.1-20261022-evidence` / `679f81a`，Pages 保留其已验证部署。本轮新增 PDF 和文档通过 GitHub 查看；不将它们冒充为旧标签中的材料或旧 Pages 部署产物。

后续验证按改动选取：文档检查链接/材料；几何修改运行对应测试文件及必要的受影响入口；优先一个相关后端，不默认跑四个后端或故障注入全套。完整复现命令保留作历史交付和明确需要时的验收入口。
