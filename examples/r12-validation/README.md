# R12 坐标与阵列文件级验证

2026-10-27：六份项目自建 AC1009 文件，22 个展开实例、44 个端点、132 个坐标分量全部满足绝对误差 ≤1e-9；最大误差 **1.7763568394002505e-15**。这些不是新 CAD 软件真实导出，也不是完整 R12 认证。

| 模型 | 实例 | 验证内容 | 实际 WCS 数据 |
| --- | --- | --- | --- |
| [01](models/01-array-2x3.dxf) | 6 | 2列3行；全部位置和来源 | [XYZ](actual/01-array-2x3-world.tsv) |
| [02](models/02-scaled-array.dxf) | 4 | 缩放2不缩放阵列间距 | [XYZ](actual/02-scaled-array-world.tsv) |
| [03](models/03-rotated-array.dxf) | 4 | 旋转90°、非均匀缩放、间距 | [XYZ](actual/03-rotated-array-world.tsv) |
| [04](models/04-base-xyz.dxf) | 2 | 非零 XYZ 基点和3轴缩放 | [XYZ](actual/04-base-xyz-world.tsv) |
| [05](models/05-nested-array.dxf) | 4 | 两层阵列与来源链 | [XYZ](actual/05-nested-array-world.tsv) |
| [06](models/06-ocs-array.dxf) | 2 | 非默认 OCS 和 WCS 坐标 | [XYZ](actual/06-ocs-array-world.tsv) |

[汇总数据](results.tsv) · [固定工具链输出](actual/toolchain.txt) · [公开 API 调用工程](runner/main.mbt)。每个 `actual/` 前缀另存 `-read.txt` 和 `-check.txt`，分别是 CLI 读取报告和 strict 检查报告。

输入中块基点与线段起点均为 `(1,2,3)`，端点差为 `(1,0,1)`，从而独立设计预期可明确区分 Z 基点扣除、缩放、旋转与 OCS。预期直接来自这些数字的手工矩阵运算，由[验证脚本](../../scripts/record-r12-validation.mbtx)逐坐标比较；不调用库的变换辅助函数作为真值。

这里的线段故意是开放/部分空间轮廓，因此所有 strict 检查预期退出 1；读取命令均退出 0。**模型验证通过不代表图纸二维检查通过。** 多层、非 XY 情况的几何数据照常保留，检查器需要报告自身的适用边界。

固定项目 SDK 后可直接运行：

```sh
moon run cli read examples/r12-validation/models/06-ocs-array.dxf
moon run examples/r12-validation/runner examples/r12-validation/models/06-ocs-array.dxf
moon test r12_world_wbtest.mbt r12_read_test.mbt --target wasm --deny-warn
```

重生成输入使用 `moon run scripts/generate-r12-fixtures.mbtx`；该脚本需要支持脚本模式的近期 MoonBit。Windows 上记录实际数据使用近期脚本运行器执行 `moon run scripts/record-r12-validation.mbtx <固定SDK目录>`，子进程明确选用记录的 v0.10.14+7d59c7ec9 SDK。脚本不属于库运行依赖，也不改变固定项目工具链。
