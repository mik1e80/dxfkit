# P0：统一“检查不完整”的处理

## 对调用方的约定

`Report::has_incomplete_checks()` 统一判断本次检查是否存在输入恢复或覆盖限制。`Report::verdict()` 和 `to_text()` 会明确写出“检查不完整”，并保留每条具体原因及严重程度。Report 仍只有 findings 字段，不改变调用方构造报告的方式。

以下分类进入完整性判断：

| 分类 | 原因举例 | 行为 |
| --- | --- | --- |
| 解析 | 丢失顶点/控制点、扫描或结构恢复、数量声明矛盾、缺块、循环/过深引用、离散失败或超限、未展开的阵列部分 | 原因以警告保留；有正常同级轮廓也不能隐藏 |
| 检查覆盖 | 未支持实体、元数据实体、未转换 OCS、没有可检查轮廓 | 明确标为检查不完整 |
| 文字未转曲线 | 仅有文字字段和简化显示，没有可检查的字体轮廓 | 预览文字不代表该轮廓已检查 |
| 参数 | 库调用的检查参数非法，检查无法执行 | 返回严重问题且完整性为不完整；CLI 参数解析失败仍使用退出码 2 |

普通几何告警（例如已支持折线开放）不自动等同于覆盖缺失；它仍是警告，在 strict 下仍会失败。没有这些诊断，仅表示本次声明范围内未发现检查不完整，不等于完整 DXF 兼容、全文件标准认证或可加工证明。

CLI 普通模式保留原有退出码约定：没有严重问题时可退出 0，但打印的不完整报告必须人工或由调用方处理。`--strict` 遇到不完整诊断或任意警告退出 1；严重问题也退出 1，参数/读取失败退出 2。

## 混合输入的验收

[`examples/completeness-mixed.dxf`](../examples/completeness-mixed.dxf) 同时包含一个正常闭合圆，以及未知 RAY、非默认 OCS 圆、两种损坏多段线、不能离散的样条和缺少控制点坐标的样条。

```sh
moon run cli check examples/completeness-mixed.dxf
moon run cli check examples/completeness-mixed.dxf --strict
moon run cli svg examples/completeness-mixed.dxf
```

预期：普通 check 退出 0 但明确“检查不完整”；strict 退出 1，即使严重问题数为 0；报告列出所有上述类别，SVG 保留 (100,100) 附近正常圆的轮廓。失败来自未检查部分，不能依赖“空图纸”兜底实现门禁。

## 新发现的静默丢控制点

最小 SPLINE 输入使用一次曲线和四个有效节点，控制点记录为 (0,0)、(1,缺 Y)、(2,0)。旧解析器丢掉中间点后，剩余两个点恰好仍满足节点数量关系，能离散成一条错误的直线，泛化的离散失败诊断捕捉不到它。

现在解析器直接记录控制点丢失，保留原记录并拒绝该实体轮廓；孤立 Y/Z、末尾未完成点及声明数量不符也有定向验证。正常同级圆继续显示。

## 自动断言与实际结果

```sh
moon test completeness_wbtest.mbt --deny-warn
node scripts/verify-completeness.cjs
node scripts/verify-completeness.cjs --report docs/completeness-results.json
node cli/smoke.cjs
node web/smoke.cjs
```

网页产物验证包含 8 类不完整输入（未知实体、OCS、两类多段线丢点、离散错误、样条丢控制点、INSERT OCS、资源上限），以及两个正常范围对照（正常圆、只有开放轮廓几何告警）。每个输入都带正常圆，自动断言其可见性。

修复前同一网页产物用例为 2/10，通过的只是两个范围对照；修复后为 10/10。12 条库定向测试全部通过。完整预期、实际输出和被测产物 SHA-256 见 [`completeness-before.json`](completeness-before.json)、[`completeness-results.json`](completeness-results.json)。实际 CLI 退出码由 smoke 脚本断言，CI 和 Pages 构建执行同一套回归。

本轮全目标 `moon check --target all --frozen --deny-warn` 通过；默认后端与 Windows Native 各 253/253，JavaScript 与 Wasm-GC 各 236/236；此前六类交付案例仍为 6/6，CLI 和网页 smoke 均通过。不同后端的适用包不同，数量不能直接比较为覆盖率。Windows Native 编译时，现有 async 依赖仍有一条 C4005 宏重定义警告，测试通过。
