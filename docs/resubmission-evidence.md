# 当前重新申报候选的证据索引

2026-10-27，当前main／未发布0.2.0。[项目说明](submission.md)、[一页PDF](../output/pdf/dxfkit-submission-one-page.pdf)、代码与本页证据随同一GitHub提交保存；精确源码身份由该提交CI的`source_commit`核对。旧r2、旧发布包和旧演示单独记录，不能代替本轮验证。

| 核对事项 | 入口 | 可得结论 |
| --- | --- | --- |
| 读取终点和范围 | [R12矩阵](r12-profile.md)、`read_document.mbt`、`r12_read_test.mbt`、`r12_structure_test.mbt` | 源字节与有序记录保留、已实现结构诊断；不代表全字段符合性 |
| 新坐标与阵列 | [六份AC1009模型](../examples/r12-validation/README.md)、[实际数据](../examples/r12-validation/results.tsv) | 22实例、132坐标分量、基点/缩放/旋转/OCS/嵌套 |
| 外部输入与独立参照 | [第三方阵列专项](../examples/r12-validation/EXTERNAL.md) | 25个FLAG世界顶点及25个圆采样的解析对照；ezdxf另做格式审计 |
| 两个失败回归及假自交修复 | [本轮整改记录](resubmission-20261027.md)、`checker_array_contacts_wbtest.mbt`、语料G1/C0 | 原因、修复前后、真正交叉仍可检出；不是只改警告总数 |
| 十类参数模型 | [模型说明](../examples/model-validation/README.md)、[结果](../examples/model-validation/results.json) | 本轮重放，负Z圆已转换；HATCH仍保持不完整 |
| 47张第三方文件 | [逐文件表](corpus-validation.md)、[JSON](corpus-validation.json) | 读取/解码/展开/报告回归；部分顶点对照单列，整图认证0/47 |
| 既有CAD导出 | [FreeCAD/OpenSCAD记录](../examples/cad-exports/README.md) | 原版本、原生模型、设置及尺寸测量证据；不是本轮新导出 |
| 独立消费与发布 | [独立工程](../examples/consumer/README.md)、[0.1.1发布记录](mooncakes-0.1.1.md) | registry旧包与源码workspace使用分开；新增R12接口尚未发布 |
| 生态差异与来源 | [对比表](../COMPARISON.md)、[来源记录](ecosystem-sources.json)、[许可证声明](../THIRD_PARTY_NOTICES.md) | 直接相关项目、实际交集、固定来源及许可 |

## 当前CLI场景

[输入、命令、报告、SVG与预期/实际](submission-evidence/results.json)包括：正常板件、重复/负半径、开放轮廓、净距不足、未知语义、损坏顶点、完整2×2阵列、离散上限、解析椭圆和解析三次样条。

阵列场景现在应输出四个圆、strict=0，逐点验证四个圆心和半径；它不再以“首实例未完整展开”作为正确预期。负Z OCS已能转换；倾斜平面另以明确的WCS适用性反例覆盖。完整性、错误检出和正常无误报均有对应断言。

## 验证身份

默认入口`node scripts/verify-advisor.cjs`记录`validation_profile=targeted-r12`、`full_suite_run=false`、源码SHA、脏状态和逐步退出码；CI干净检出使用`--fresh`。[复现步骤](reproducibility.md)说明固定SDK与输出。

本轮未执行整仓库四后端全量验收、未发布0.2.0、未创建新的最终申报标签、未替换旧Pages演示。历史r2的完整成功记录仍可从[原标签](https://github.com/mik1e80/dxfkit/tree/submission-0.1.1-20261022-r2)核对，不把旧SHA的结果归到当前候选。
