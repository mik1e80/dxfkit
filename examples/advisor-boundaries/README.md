# 最近一次顾问审查的边界回归

[修复前执行摘要](before.json) · [修复后真实 CLI 结果](results.json) · [整改说明](../../docs/advisor-review-20261022.md)

`models/` 是十个最小输入，`actual/` 保存真实文字报告和 SVG。组码 70 的闭合/周期标志、部分/额外权重、缺 ENDBLK、轴比 1.2 及非零宽度/厚度应使 strict 退出 1 并报告不完整；零宽度控制应退出 0。未支持样条应没有该轮廓，且不报普通开放轮廓；宽度模型保留中心线但不将区域称为已检查。

在仓库根目录运行 `node examples/advisor-boundaries/verify.cjs`。默认比较输入与实际输出，不更新快照；核实差异后才用 `--write`。库测试另覆盖相邻块不被吞并、普通 POLYLINE 顶点宽度、默认/完整权重控制、层状态别名及资源预算；见根目录 `advisor_boundary_wbtest.mbt`。
