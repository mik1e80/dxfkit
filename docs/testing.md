# 模型来源、许可与验证层次

模型能读取、字段已解码、几何已重建、设计量已对照、整图已认证是不同结论。日常只重放受影响案例；历史结果注明原验证身份，不因文档更新而自动成为当前源码全量证据。

[R12 拟合网格、阵列属性及标注](../examples/r12-semantics/README.md)保存自建 AC1009 数据和独立预期，定向重放接缝、曲面解析值、属性字形、标注关联及七类重算的数值和诊断。

[实际 CAD 的 OCS 和阵列](../examples/cad-ocs/README.md)包括 NotoCAD 保留非默认法向的正例、FreeCAD 省略法向的反例、展平阵列的 12 条边和 QCAD 两条阵列导出路径。模型目录保留来源、哈希和 WCS 断言。

| 模型组 | 来源/许可与追溯 | 可复核的预期与验证边界 |
| --- | --- | --- |
| [47份外部DXF](corpus-validation.md) | ezdxf测试语料，MIT；[逐文件路径/哈希](../testdata/ezdxf/MANIFEST.json)，历史上游commit/blob未知 | 读取、实体、展开和告警回归；整图独立几何真值仍为0/47，不叫47张标准兼容认证 |
| [六份AC1009设计模型](../examples/r12-validation/README.md) | 项目自建，Apache-2.0；[来源/设计/哈希](../examples/r12-validation/provenance.json)及[专用许可](../examples/r12-validation/LICENSE.md) | 独立设计运算核对22实例、132坐标分量；已保存实际TSV不冒充独立预期 |
| [第三方阵列专项](../examples/r12-validation/EXTERNAL.md) | 复用上述MIT语料；不改成项目自建 | 25个FLAG、100个WCS顶点及圆采样的局部验证；ezdxf格式审计与数学对照分别说明 |
| [十类参数模型](../examples/model-validation/README.md) | 项目自建DXF/参考CSV/SVG，Apache-2.0；生成器、expected.json和实际结果均在该目录 | 正常与故意错误输入、尺寸/端点/面积/方向/告警的断言；自建公式与库输出比较不等于第三方CAD认证 |
| [三份既有CAD导出](../examples/cad-exports/README.md) | 项目自建FCStd/SCAD及导出，Apache-2.0；[版本/设置/哈希](../examples/cad-exports/provenance.json) | FreeCAD/OpenSCAD实际导出；R14/未声明版本的文件不冒充R12，未做GUI人工验收 |
| [三份原生R12导出](../examples/cad-r12/README.md) | 项目自建，Apache-2.0；[源文件/导出哈希](../examples/cad-r12/provenance.json)；复用上述FCStd原件 | 两个正常案例及一个开放椭圆反例；第二个案例是同一板模型的轮廓子集，不是第二个CAD来源；未声明单位仍保持未指定 |
| [历史边界案例](../examples/advisor-boundaries/README.md)、examples/evidence、examples/regressions、examples/consumer/fixtures及examples根目录示例 | 项目构造的最小输入，Apache-2.0；由对应测试和提交历史追溯 | 只证明对应错误、公开调用或边界；不是外部生产图纸。部分旧文件名保留历史缺陷背景，以当前断言为准 |
| 诊断洪泛回归 | [maintenance_security_test.mbt](../maintenance_security_test.mbt)现场构造小输入，无需归档超大恶意文件；Apache-2.0 | 1500个坏顶点/结束标记触发预算，断言诊断数量、原始输入保留、Unknown和检查不完整；不是吞吐量、峰值内存或全面fuzz证明 |

新增模型须记录：来源/作者或未知状态、合法分发依据、工具和版本、原始文件与本地哈希、设计尺寸及预期出处、实际结果、允许误差和未验证部分。第三方材料另固定上游提交/路径；不要为了补齐清单猜测历史。具体许可见[许可适用范围](licensing.md)。

维护时先保存能暴露问题的输入和预期，再修代码；正常控制案例须确认没有误报。必要时执行对应CLI的strict正/反例及公开API消费者。警告总数变化必须解释新诊断的语义，不能只改数字。

新增安全回归可运行：`moon test maintenance_security_test.mbt security_test.mbt security_wbtest.mbt stream_wbtest.mbt --target wasm --deny-warn`。固定工具链与更广定向集见[复现说明](reproducibility.md)；模型/许可/文档检查不代替功能测试，定向检查不称为full suite。
