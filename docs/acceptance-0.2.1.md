# 0.2.1 八月黑客松技术验收

本次交付为 MoonBit ASCII DXF R12 记录读取与二维轮廓辅助检查库。0.2.1 增加 BricsCAD V20 原生拟合网格修复及实测案例。参赛初审状态仍按 [活动说明](august-hackathon.md) 记录，正式验收结果由主办方确认。

| 交付项 | 核对入口 |
| --- | --- |
| GitHub 固定源码 | [v0.2.1](https://github.com/mik1e80/dxfkit/tree/v0.2.1) |
| Mooncakes | [mik1e80/dxfkit@0.2.1](https://mooncakes.io/docs/mik1e80/dxfkit%400.2.1) |
| 线上演示 | [Pages](https://mik1e80.github.io/dxfkit/) · [构建版本和源码 SHA](https://mik1e80.github.io/dxfkit/dist/release.json) |
| 同提交完整 CI | [完整验收 #45405781541](https://github.com/mik1e80/dxfkit/actions/runs/45405781541) · [验证记录归档](https://github.com/mik1e80/dxfkit/actions/runs/45405781541#artifacts) |
| 同提交定向 CI | [GitHub Actions](https://github.com/mik1e80/dxfkit/actions/workflows/ci.yml) · [线上验证摘要与源码 SHA](https://mik1e80.github.io/dxfkit/verification.json) |
| BricsCAD 原件及逐点结果 | [原始 DXF、CSV、来源与许可证](../examples/r12-semantics/legacy-cad/README.md) |
| 可复用接口与许可 | [README 与命令](../README.md) · [独立调用工程](../examples/consumer/README.md) · [Apache-2.0](../LICENSE) · [第三方声明](../THIRD_PARTY_NOTICES.md) |

固定标签 `v0.2.1` 的 `e07ec17f478628d38d3558b1bcf7532e55191c86` 已通过手动 `validation=full`。完整验收包含全后端类型检查、构建、Wasm／JS／Native／Wasm GC 测试、独立调用、BricsCAD 案例、CLI 和网页回归。线上演示继续提供同提交原有的 `targeted-r12` 部署记录。完整报告随 [CI 运行](https://github.com/mik1e80/dxfkit/actions/runs/45405781541) 保存。Mooncakes 包的注册表入口使用同一标签源码发布，以下命令可核对实际解析到的库来源和版本，并运行 R12 记录、OCS、阵列和 BricsCAD 测试。

```sh
moon update
node scripts/verify-consumer.cjs --registry --r12
node scripts/verify-consumer.cjs --registry --r12 --target native
```

BricsCAD V20.1.08 开放三次 B 样条案例保留 20 个控制点与 56 个拟合样点，最大误差约 2.18×10⁻¹⁵ 图纸单位。浏览器提供二维轮廓检查演示。曲面逐点重放通过库 API 或仓库命令进行。兼容边界及尚未获得外部拟合证据的类型见 [R12 兼容矩阵](r12-conformance-matrix.md)。上一版本的四后端完整验证见 [0.2.0 发布证据](acceptance-0.2.0.md)。

## 初审范围与交付对照

以下以仓库保留的[八月黑客松项目说明](august-hackathon.md)及其[最早留档版本](https://github.com/mik1e80/dxfkit/blob/535954d/docs/august-hackathon.md)为依据。主办方初审时收到的原始文本未在仓库公开，原文和主办方的认定仍待核实。

| 留档范围 | 0.2.1 实际交付及证据 |
| --- | --- |
| ASCII R12／AC1009 读取、原始记录与结构诊断 | 在读取预算内保留源字节和有序记录，记录缺失结束标记等结构问题。完整标准符合性及其他代码页边界见 [R12 兼容矩阵](r12-conformance-matrix.md)。 |
| OCS→WCS、INSERT 全行列、嵌套和来源链 | [六份模型及设计真值](../examples/r12-validation/README.md)与[真实 CAD 导出](../examples/cad-ocs/README.md)记录坐标、阵列、来源和适用范围。 |
| 二维轮廓、诊断、资源限制 | 检查适用的 WCS XY 轮廓。损坏或未覆盖内容出具诊断，超限标记检查不完整；[安全约束](../SECURITY.md)及完整 CI 记录入口和回归证据。 |
| 包、CLI、独立调用、网页与文档 | 公开包和同源码 Pages 已发布，库调用与 CLI 有可运行示例。接口、用法及边界见 [README](../README.md)。 |

## 第三方样例追溯

47 份 ezdxf 样例已逐文件追溯到导入前的同一固定快照。44 份原始字节一致，`images.dxf`、`text.dxf`、`text_negative_extrusion.dxf` 仅有 CRLF/LF 差异。原下载版本未留档。上游路径、blob、双方原始 SHA-256 和匹配类型见[来源清单](../testdata/ezdxf/MANIFEST.json)，测试覆盖见[语料记录](corpus-validation.md)。
