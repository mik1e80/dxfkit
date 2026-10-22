# r2 次数修复与最终版本收敛

本轮只执行最近一次针对 `a5d747f19f8297040a924af38334b7d4e66a75f9` 的复核方案：停止猜测 SPLINE 次数，并将已落地的边界修复、预算、共享分析和独立字段对照收录到同一个完整验证的 r2 提交。不再扩展实体、Worker、benchmark 或新的 checked bounds API。

## SPLINE 71 修复

`parse_spline()` 必须见到组码 71 才构造 Spline；缺失时保留类型和原始 Record、返回 Unknown，并报告“缺少次数（71）；无法确定曲线定义，保留记录，轮廓未检查”。不再默认三次。次数 0/33 保留原值，交给 checked 离散拒绝；没有自动修复曲线定义。

新增 [`r2_spline_wbtest.mbt`](../r2_spline_wbtest.mbt) 三组测试：缺失次数、正常三次、超范围 0/33。修改前实际 2/3 通过，缺次数的 Unknown 断言失败；修改后 3/3 通过。正常三次另按独立 Bernstein 公式比较曲线误差，不只验证实体/点数。

[边界 CLI 记录](../examples/advisor-boundaries/results.json)增补缺次数、0、33 和正常三次四个案例，合计 14/14。正常开放三次曲线的 strict=1 来自预期闭合告警，不是不完整；缺次数和无效次数则有不完整诊断，不误归为普通开放轮廓。输入、报告与 SVG 均随仓库保存。

## r2 的版本与完整验证

新标签为 `submission-0.1.1-20261022-r2`，**不移动**旧 `submission-0.1.1-20261022`（f233ddc）。r2 的源码、README、submission.md、PDF、十模型、边界案例、ezdxf 对照均来自同一个提交。

推送前做必要针对性检查；提交后在 GitHub Actions 对 main **手动选择 `validation=full`**，执行 `node scripts/verify-reproduction.cjs --fresh`。只有该 full 作业及同提交 Pages 都成功，并核对线上身份与资产哈希后才创建 r2 标签。本轮默认 push 的针对性流程不能代替该最终 full 验收。

成功后的 `verification.json` 必须 `validation_profile=full`、`full_suite_run=true`、`source_dirty=false`；`release.json` 同样为 full。两者的 source_commit、模型实跑记录的 source_commit 和新标签解析出的 SHA 必须相同。PDF 写固定标签，通过标签解析 SHA，避免把自引用哈希写进自身导致无法形成提交。

原 `f233ddc` 的 full、`a5d747f` 的 targeted-advisor 和旧采集记录均保留历史身份，不冒充为 r2 的执行结果。CI 通常仍按针对性策略工作，完整流程是明确手动验收选项。

## 同步说明与保留边界

复现文档现在区分普通 push 的 targeted 与最终手动 full；不再写成每次 CI 都完整复现。PDF 增加实跑 ezdxf 1.4.4 的 5 文件、67 实体、507 数值字段、最大差值 0，但不将字段一致升级为完整几何兼容。

`Geometry::bounds()` / `Entity::bounds()` 是原始解码字段的包围估计，不代表该实体已通过 checked 几何验证；非法 ELLIPSE 可能仍给出包围估计。可靠几何处理先使用 `flatten_checked()` 或检查报告，本轮不新增 `bounds_checked()`。

3 张具有软件版本、导出设置、已知尺寸和原始文件哈希的新 CAD 导出仍未取得，本次方案将其列为可选加分项，不作为代码收敛或 r2 验收阻塞。47 文件的逐图纸独立几何真值仍为 0/47；报名表不在本轮操作范围。
