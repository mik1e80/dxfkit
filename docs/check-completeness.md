# 检查完整性约定

当前0.2.0开发版：`Report::has_incomplete_checks()`识别输入恢复、覆盖限制、文字未转轮廓或非法参数。`verdict()`和`to_text()`保留全部具体原因，即使同文件有正常轮廓也不隐藏。普通开放轮廓等几何警告不自动等于覆盖缺失；strict仍会因任意警告退出1。

| 原因 | 当前行为 |
| --- | --- |
| 损坏坐标、缺顶点、缺块、循环/过深、离散或资源上限 | 保留诊断和原始记录；不得把恢复后的几何冒充完整结果 |
| 未重建实体或语义、关联ATTRIB布局 | 说明哪些内容未参与检查 |
| OCS与平面 | 适用实体先转WCS；不能转的非法方向诊断，转换成功但不在Z=0检查平面的几何保留XYZ并标为二维不完整 |
| 文字 | 插入点或简化预览不等于字体轮廓已检查 |
| 参数非法、无可检查轮廓 | 明确失败或不完整，不用空输入作为通过依据 |

负Z OCS本身不再触发“未转换”警告。合法阵列的全部行列已展开，不再靠“只检查首实例”触发strict；关联属性、未支持子实体和预算截断仍可使整个检查不完整。

## 实际入口

`examples/completeness-mixed.dxf`包含正常圆、负Z圆、RAY、损坏多段线和样条。正常轮廓继续可见；负Z圆已转换，其他损坏/未知语义仍使报告不完整。普通模式可退出0，strict必须退出1。

```sh
moon run cli check examples/completeness-mixed.dxf --strict
node scripts/verify-completeness.cjs --report docs/completeness-results.json
```

网页回归的10个场景分别覆盖未知实体、倾斜WCS、两类多段线丢点、离散失败、样条丢控制点、倾斜INSERT及资源上限，另有正常圆和只有开放几何警告两个对照。每个限制场景带正常同级圆，验证正常部分不能掩盖缺失。

[当前机器结果](completeness-results.json)与[历史失败结果](completeness-before.json)是不同版本；旧全目标计数不套用到当前。更多读取结构和实例来源证据见[R12矩阵](r12-profile.md)及[本轮修复](resubmission-20261027.md)。没有完整性诊断只表示列明检查范围内未发现覆盖问题，不表示完整DXF符合性或可加工性。
