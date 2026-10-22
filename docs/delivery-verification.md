# 六类最小技术用例与修复证据

核对日期：2026-10-21。本轮将已识别的问题分成以下六类，先对原有本地工作副本的网页编译产物运行同一组最小输入，再修复和自动断言；没有按审查文字直接修改算法。

基线由 main `80c8655` 加当时已有的本地未提交改动组成，**包含已有 INSERT OCS 修复**，因此 C6 在本轮开始时已通过。不能把这份基线等同于 GitHub main 的纯净构建。

原有默认后端测试为 227/227 通过；新增 11 条针对性测试在修复前为 1 通过、10 失败，证实原测试集没有覆盖全部反例。六类实际网页编译产物用例在修复前为 1/6 通过、修复后为 6/6 通过。后续另补顶点标志、8/9 层边界和公开包调用测试。

## 输入、预期、实际与自动断言

本表 C5 保留 2026-10-21 的降级修复历史。2026-10-22 已追加 SOLID/TRACE 的受限二维边界，当前 C5 输出两条有序轮廓及 3DFACE 未覆盖诊断；原始 Face 不重排。当前行为和迁移见[追加审查验收](review-cases.md)，当前机器结果见 delivery-results.json，不能把历史降级行为当作当前范围。

输入文件均在 [`examples/regressions/`](../examples/regressions/)，为项目自建的 Apache-2.0 最小案例。

| 编号 | 最小输入及预期 | 修复前实际 | 修复后实际和断言 |
| --- | --- | --- | --- |
| C1 椭圆字段 | ellipse-offset.dxf：圆心 (10,20)、长轴向量 (2,0)、比值 0.5；参数 0 的点应为 (12,20) | 点为 (2,0)，再次减圆心导致形状错误 | 点为 (12,20)；核对解码向量、完整椭圆、旋转椭圆弧端点 |
| C2 SVG 数值 | svg-coordinate-range.dxf：端点 (-300000,1e-9)、(300010,2e-9)；输出坐标应可往返读取 | X 被截成 ±214748.3647，两个 Y 均变为 0 | 两个点的数值逐项相等；另验证负数、小数与 1e20 的数值往返 |
| C3 LWPOLYLINE | lwpolyline-missing-y.dxf：中间顶点缺 Y；应诊断并拒绝该轮廓 | 静默丢失顶点，剩余顶点生成 1 条轮廓 | 0 条轮廓，含缺失坐标和未检查提示；另测孤立 Y、末尾 X、声明数量不符 |
| C4 POLYLINE | polyline-missing-y.dxf：一个 VERTEX 缺 Y；应诊断并拒绝该轮廓 | 静默跳过 VERTEX，剩余顶点生成 1 条轮廓 | 0 条轮廓并定位损坏顶点；另测拟合/空间标志和缺 SEQEND 的明确恢复提示 |
| C5 面实体降级 | face-metadata-only.dxf：SOLID、TRACE、3DFACE；只保留字段、报告未覆盖 | 3 条轮廓，矩形角点被错误串联后报自交，并参与重叠检查 | 0 条轮廓，三个类型各有覆盖提示，无自交误报；Face 字段仍可读取 |
| C6 INSERT OCS | insert-unsupported-ocs.dxf：AB / CUT / PART 引用非默认 OCS；应整体跳过并保留诊断身份 | 已有本地修复：通过 | 仍为 0 条轮廓，诊断含 OCS、句柄、图层和块名；嵌套引用与同级支持实体另有回归 |

机器可读的完整输出：[`delivery-before.json`](delivery-before.json)、[`delivery-results.json`](delivery-results.json)，包含被测产物的 SHA-256。这些结果来自实际编译产物，不是手写成功标记。

## C1 补充：非原点椭圆与平移不变性（2026-10-22）

当前 `entity.mbt` 已直接使用组码 11/21/31 的相对长轴向量，本次没有再次修改解析算法；新增验收位于 [`entity_wbtest.mbt`](../entity_wbtest.mbt)。输入均经 DXF 扫描、结构读取和实体解码，不直接构造生产几何对象。

| 输入 / 操作 | 明确预期 | 实际结果与自动断言 |
| --- | --- | --- |
| 圆心 (10,0,0)，长轴向量 (10,0,0)，轴比 0.5，参数 0→2π | 长 / 短半轴 10 / 5，X 包围盒 [0,20]、Y 包围盒 [-5,5]，宽高 20×10；参数 0 的点 (20,0) | 解码字段与精确包围盒逐项相等；闭合轮廓首点 (20,0)，所有离散顶点满足 ((x−10)/10)²+(y/5)²=1，误差 <1e-10 |
| 保持长轴向量与轴比，只将原点中心平移到 (10,0)、(-35,17)、(1000,-2000) | 大小始终为 20×10；包围盒等量平移，轮廓去掉平移量后形状和点序保持 | 向量、轴比、闭合标记、包围盒与尺寸断言通过；每个顶点减去平移量后与原点对照的差 <1e-9，并检查椭圆方程误差 <1e-10 |
| 只在临时副本中恢复“长轴向量再次减圆心”的旧错误 | 新增两项验收必须失败；语法 / 编译错误不算检出 | 副本编译成功，实体测试 57 项中 55 通过、2 失败，正是上述两项；未修改版本 57/57 通过 |

可执行 `moon test entity_wbtest.mbt --deny-warn` 和 `node scripts/verify-test-sensitivity.cjs` 重放。后者新增 `ellipse-major-subtract-center` 故障，失败明细和测试源码哈希见 [`test-sensitivity-results.json`](test-sensitivity-results.json)。这补充了截图所列精确输入，不改变前述 C1 旧案例的修复前后记录。

## 可复现命令

在仓库根目录执行：

```sh
moon update
moon test delivery_regression_wbtest.mbt --deny-warn
moon check --target all --deny-warn
moon test --deny-warn
moon test --target js --deny-warn
moon test --target native --deny-warn
moon build --target js --release
```

将 `_build/js/release/build/web/web.js` 复制到 `web/dist/web.js`；也可直接执行现有的 `bash web/build.sh`。随后运行：

```sh
node scripts/verify-delivery.cjs
node scripts/verify-delivery.cjs --report docs/delivery-results.json
node cli/smoke.cjs
node web/smoke.cjs
moon run examples/library --target js
```

`verify-delivery.cjs` 对每个案例执行断言，任意失败都会以非零退出；支持 `--bundle 路径` 对指定旧产物重放。CLI 回归核对六类文件的实际输出和严格模式退出码；网页回归检查正常、问题、未覆盖三类内置示例。CI 和 Pages 构建也执行六类用例。

## 第一轮六类修复验证记录

以下是新增完整性任务前的记录。后续 P0 的测试增量和当前结果见[检查完整性验证](check-completeness.md)；六类实际产物 JSON 随当前源码重建。

本地工具链：moon 0.1.20260920，moonc v0.10.14+7d59c7ec9。不同后端的适用包不同，测试数不能直接当作功能覆盖率比较。

| 验证 | 实际结果 |
| --- | --- |
| 全目标检查，deny-warn | 通过 |
| 默认后端 | 241 / 241 |
| JavaScript | 224 / 224 |
| Wasm-GC | 224 / 224 |
| Windows Native | 241 / 241 |
| 六类实际网页产物断言 | 6 / 6 |
| CLI 文件、退出码与六类回归 | 通过 |
| 网页行为及三类内置样例 | 通过；最小 DOM 不验证浏览器布局 |
| 独立包公开接口调用 | JS 运行通过；默认、JS、Wasm-GC、Native 测试均通过 |

源码和网页产物在本地同步重建。GitHub 推送、在线 Pages 部署、Mooncakes 发布以及报名表提交不由本地测试结果代替。

## 兼容变化

- ELLIPSE 修复为标准的相对长轴向量解释；此前依赖错误绝对坐标解释的调用方应修正输入。
- SVG 使用 Double 往返数字表示，可能出现科学计数法；不要依赖固定四位小数的字符串格式。
- Face 保留原始角点。裸 Geometry 的 flatten / checked 缺少实体身份，仍返回 Empty；新的 Entity::flatten_checked 为受限 SOLID/TRACE 提供正确边界，Drawing::expand/check/SVG 使用该入口。3DFACE 仍只保留字段，不再依赖旧版假轮廓。
- 损坏坐标或不支持的 POLYLINE 变体保留记录并报告，不能再依赖剩余顶点拼出的轮廓。仅声明顶点数不一致时保留完整坐标并警告；缺 SEQEND 可恢复完整顶点并报告。

椭圆字段依据 [Autodesk ELLIPSE 组码定义](https://help.autodesk.com/cloudhelp/2020/ENU/AutoCAD-DXF/files/GUID-107CB04F-AD4D-4D2F-8EC9-AC90888063AB.htm)。这些定向测试和 47 文件回归都不构成完整 DXF 标准认证，也不证明图纸可加工。
