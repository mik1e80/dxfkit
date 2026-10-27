# 补充几何审查：当前预期与历史迁移

2026-10-27更新为0.2.0开发候选。原2026-10-22面实体修复及其[历史失败记录](review-cases-before.json)保留；当前[网页/CLI结果](review-cases-results.json)重放12个案例，非默认OCS不再按旧版本直接跳过。

| 案例组 | 当前预期 |
| --- | --- |
| SOLID/TRACE矩形（2例） | 按0→1→3→2形成合法边界，无假自交；原始角点顺序不改写 |
| SOLID三角形（1例） | 格式规定的重复第三/第四角点只输出一次，不报零长度边 |
| 3DFACE（1例） | 保留原顺序WCS角点，不套用SOLID重排；二维覆盖不足必须说明 |
| 外层/嵌套负Z INSERT（2例） | 正确复合反射，保留两个圆；断言首点分别为(2,0)/(-101,100)及(-2,0)/(101,100)，正常不报不完整 |
| 倾斜INSERT（1例） | 转换WCS并保留XYZ，但不投影成假二维轮廓；报告包含OUTER来源和检查平面原因 |
| 损坏LW/普通POLYLINE、数量矛盾（3例） | 不能丢点后悄悄拼出正常图形；原始记录保留且诊断不完整 |
| 大坐标/微坐标SVG（2例） | 精确断言坐标、尺寸和相对大小；不经32位整数中转破坏数值 |

库级回归在`review_cases_wbtest.mbt`；新阵列接触与真实交叉另在`checker_array_contacts_wbtest.mbt`。这些测试集有覆盖交集，不把案例数相加当功能数量。

```sh
moon test review_cases_wbtest.mbt checker_array_contacts_wbtest.mbt --target wasm --deny-warn
node scripts/build-web.cjs
node scripts/verify-review-cases.cjs --report docs/review-cases-results.json
```

日常用[定向验证入口](reproducibility.md)，不重复运行整仓库全量。核心限制和读取/几何/检查分层见[R12矩阵](r12-profile.md)。早期“未转换OCS”和“阵列首实例”记录仅作为历史，不再是当前正确输出。
