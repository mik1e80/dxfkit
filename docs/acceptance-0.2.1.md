# 0.2.1 八月黑客松技术验收

本次交付为 MoonBit ASCII DXF R12 记录读取与二维轮廓辅助检查库。0.2.1 增加 BricsCAD V20 原生拟合网格修复及实测案例。参赛初审状态仍按 [活动说明](august-hackathon.md) 记录，正式验收结果由主办方确认。

| 交付项 | 核对入口 |
| --- | --- |
| GitHub 固定源码 | [v0.2.1](https://github.com/mik1e80/dxfkit/tree/v0.2.1) |
| Mooncakes | [mik1e80/dxfkit@0.2.1](https://mooncakes.io/docs/mik1e80/dxfkit%400.2.1) |
| 线上演示 | [Pages](https://mik1e80.github.io/dxfkit/) · [构建版本和源码 SHA](https://mik1e80.github.io/dxfkit/dist/release.json) |
| 同提交定向 CI | [GitHub Actions](https://github.com/mik1e80/dxfkit/actions/workflows/ci.yml) · [线上验证摘要与源码 SHA](https://mik1e80.github.io/dxfkit/verification.json) |
| BricsCAD 原件及逐点结果 | [原始 DXF、CSV、来源与许可证](../examples/r12-semantics/legacy-cad/README.md) |
| 可复用接口与许可 | [README 与命令](../README.md) · [独立调用工程](../examples/consumer/README.md) · [Apache-2.0](../LICENSE) · [第三方声明](../THIRD_PARTY_NOTICES.md) |

验收运行 `targeted-r12`，覆盖类型检查、构建、核心回归、公开 API 独立调用、网页回归和 BricsCAD 原件重放。页面清单和验证摘要中的 `source_commit` 应与 GitHub 标签相同。Mooncakes 包的注册表入口使用同一标签源码发布，以下命令可核对实际解析到的库来源和版本，并运行 R12 记录、OCS、阵列和 BricsCAD 测试。

```sh
moon update
node scripts/verify-consumer.cjs --registry --r12
node scripts/verify-consumer.cjs --registry --r12 --target native
```

BricsCAD V20.1.08 开放三次 B 样条案例保留 20 个控制点与 56 个拟合样点，最大误差约 2.18×10⁻¹⁵ 图纸单位。浏览器提供二维轮廓检查演示。曲面逐点重放通过库 API 或仓库命令进行。兼容边界及尚未获得外部拟合证据的类型见 [R12 兼容矩阵](r12-conformance-matrix.md)。上一版本的四后端完整验证见 [0.2.0 发布证据](acceptance-0.2.0.md)。
