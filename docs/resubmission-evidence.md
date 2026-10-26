# 再次申报的验证材料索引

[一页申报 PDF](../output/pdf/dxfkit-submission-one-page.pdf) · [验证材料导航](verification-guide.md)。本页、PDF、代码与十类模型统一收录于最终申报标签 `submission-0.1.1-20261022-r2`，以同提交 CI 和发布记录核对。

本次以“MoonBit ASCII DXF 二维轮廓读取与辅助检查库”为交付终点，固定源码标签 `submission-0.1.1-20261022-r2`。这是项目自行整理的技术验收材料，不是主办方公布的新门槛，也不表示报名已经重新提交或审核通过。

保留现有 47 个第三方文件及来源、逐层回归记录；本轮只补针对性输入和证据，不增加第三方数量。六类最小问题及追加审查的修复前后记录继续保留。当前材料可以支持收敛后的能力陈述，不能支持完整 R10–R2018 标准读取、完整 OCS 或可加工性承诺。

## 评审可从哪里核对

最终新增的[十类模型及测试数据](../examples/model-validation/README.md)与[模型总结](../examples/model-validation/SUMMARY.md)保存在 examples 下；与下面已有 10 个 CLI 场景分开登记，存在能力覆盖交集，不把两组相加当作独立功能数量。

| 材料 | 证据位置 | 能确认的结论 |
| --- | --- | --- |
| 实体能力矩阵 | [读取/解码/离散/检查分层矩阵](entity-capabilities.md)、[字段边界](delivery-scope.md) | 哪些字段、坐标语义和检查有承诺，哪些仅保留记录 |
| 正常、问题和限制案例 | 下表的输入、实际报告、实际 SVG；[机器记录](submission-evidence/results.json) | 不只“能打开”；有预期分类、实际退出码与几何数值 |
| 独立正确性对照 | [公式、指标、阈值与实际误差](independent-validation.md)、[成对检查器测试](test-accuracy.md) | 预期不完全来自生产算法；哪些仍是有限采样或仓库内求值对照 |
| 第三方语料 | [47 文件分层表](corpus-validation.md)及对应 JSON | 文件来源、实际参与的测试和未覆盖部分；独立几何真值仍为 0/47 |
| 可复现说明 | [固定版本与完整命令](reproducibility.md)、`reproduction.json` | 指定标签可重建库、CLI、网页和材料；实际 CI 结果另按提交核对 |
| 退回意见回应 | [原意见→整改→证据→验证](review-response.md)、[修订申报书](submission.md) | 退回问题如何逐项响应，避免重复旧的跨版本承诺 |

## 真实入口案例

表中每一行都实际执行 `check --strict` 与 `svg`，完整命令和输入 SHA-256（换行规范为 LF）保存在 [results.json](submission-evidence/results.json)。通常 tol=0.01；最后两行 tol=0.002。生成 SVG 的退出 0 **不代表**几何检查通过，错误/限制案例仍会保存部分或空预览。

| 场景 / 输入 | 预期及实际结果 | 保存的证据 |
| --- | --- | --- |
| [正常板件](../examples/plate.dxf)，min_gap=0.5 | 毫米声明、CUT 图层，100×60 外框，4 个半径 3 的圆形孔轮廓；5 条闭合折线，无发现，strict=0；不推断加工区域内外拓扑 | [报告](submission-evidence/normal-plate.txt) · [SVG](submission-evidence/normal-plate.svg) |
| [重复线和负半径](../examples/issues.dxf) | 重复切割警告及负半径致命，strict=1；此文件**未触发闭合告警**，不再将其写成开放轮廓证据 | [报告](submission-evidence/problem-paths.txt) · [SVG](submission-evidence/problem-paths.svg) |
| [开放轮廓](../examples/evidence/open-contour.dxf) | 单独 LINE 长 10，闭合警告，strict=1；无重复/退化误报，开放刀路需另按工艺解释 | [报告](submission-evidence/open-contour.txt) · [SVG](submission-evidence/open-contour.svg) |
| 正常板件改 min_gap=8 | 最小间隙警告，4 对实体，折线最小距离 7；strict=1；无重复和单实体自交误报 | [报告](submission-evidence/insufficient-gap.txt) · [SVG](submission-evidence/insufficient-gap.svg) |
| [不支持实体与 OCS](../examples/coverage-limits.dxf) | HATCH/DIMENSION/RAY 和 CIRCLE 的未转换 OCS 均在报告，检查不完整、strict=1；有圆投影不代表空间几何已验证 | [报告](submission-evidence/unsupported-and-ocs.txt) · [SVG](submission-evidence/unsupported-and-ocs.svg) |
| [损坏顶点混合输入](../examples/completeness-mixed.dxf) | 正常圆与 OCS 圆投影仍可见；坏多段线/样条不静默拼接；全部原因保留、检查不完整、strict=1 | [报告](submission-evidence/damaged-vertices.txt) · [SVG](submission-evidence/damaged-vertices.svg) |
| [2×2 INSERT 阵列](../examples/evidence/array-limit.dxf) | 只展开首实例，明确其余行列未检查；1 条轮廓，检查不完整、strict=1 | [报告](submission-evidence/array-first-only.txt) · [SVG](submission-evidence/array-first-only.svg) |
| [离散资源上限](../examples/consumer/fixtures/discretization-error.dxf) | 大半径圆在 tol=0.01 下超过 4096 段，离散失败原因明确；无轮廓，检查不完整、strict=1 | [报告](submission-evidence/discretization-limit.txt) · [空 SVG](submission-evidence/discretization-limit.svg) |
| [解析椭圆](../examples/evidence/analytic-ellipse.dxf) | 旋转椭圆方程与双向采样距离达标，无发现、strict=0 | [报告](submission-evidence/analytic-ellipse.txt) · [SVG](submission-evidence/analytic-ellipse.svg) |
| [解析三次样条](../examples/evidence/analytic-cubic.dxf) | Bernstein 对照达标；因轮廓开放出现预期闭合警告，strict=1；不把“曲线正确”等同于“检查无发现” | [报告](submission-evidence/analytic-cubic.txt) · [SVG](submission-evidence/analytic-cubic.svg) |

## 复算、快照和提交身份

```sh
moon update
node scripts/verify-submission-evidence.cjs
node scripts/verify-reproduction.cjs
```

首个脚本逐项检查诊断、退出码、正常几何与独立解析误差，并比较实际报告/SVG/结果和保存的快照；任何差异失败。只有人工核对原因后才用 `--write` 更新保存值，不能直接修改总数。自动验证不调用 `--write`。原始报告和 SVG 按 LF 保存；度量 JSON 使用 12 位有效数字用于展示，计算断言仍用未舍入值。

静态结果的 `historical_geometry_baseline_commit` 标识原几何验收基线 `1a8185925e2c038039e6f57f32c69421e833d437`，不是当前提交 SHA。本轮另改报告措辞，当前结果由实际 CI 重跑核对。当前实跑的 HEAD、dirty 状态、平台和工具版本在 `_build/submission-evidence.json`，部署时复制为站点根目录 `submission-evidence-verification.json`；网页 `release.json` 与 `verification.json` 绑定实际发布提交及材料和输入哈希。完整流程只有通过后才打包部署，包括本页、响应表、矩阵、独立对照、案例输入和保存的所有报告/SVG/JSON。

## 尚未覆盖及提交前状态

47 文件没有独立逐图纸几何真值；不支持完整 OCS、其余阵列实例、通用三维面/体、填充/标注/字体轮廓重建和加工认证。正式发布和报名流程也分开核对：Mooncakes 0.1.1 已于 2026-10-26 发布，源提交及包校验和见[发布记录](mooncakes-0.1.1.md)；该发布不改写旧 r2 标签，仓库和 Pages 更新也不等于报名表已更新。申报时应使用[修订稿](submission.md)，并核对报名表不再保留旧的 R10–R2018 承诺。

如后续增加不同来源、尺寸或导出方式的二维图纸，应先建立预期及来源，再扩充回归。5–10 张是可选测试建议，不是已经核实的官方数量门槛，本轮没有为凑数增加文件。
