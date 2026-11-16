# R12 分层符合性维护清单

这是实现/验证清单，不是完整Autodesk R12标准目录或符合性认证。AC1009选择配置并不能代替逐字段审计。具体实体见[范围矩阵](r12-profile.md)与[机器矩阵](capabilities.json)。

| 要求层次 | 已实现 | 已验证的证据 | 未完成/限制 |
| --- | --- | --- | --- |
| 文件结构：段、表、块、子实体结束与EOF | 已诊断缺失/孤立/中断并保留原始记录 | r12_structure_test.mbt、security_wbtest.mbt、maintenance_security_test.mbt | 所有合法组合与版本例外未穷举；超限后只保留派生前缀 |
| 记录：组码顺序、重复/未知字段、XDATA | 扫描预算范围内保留，source保留原字节 | r12_read_test.mbt、encoding_boundary_test.mbt | 保留不等于字段合法；旧多字节代码页未正确解码 |
| 常用几何必填字段 | LINE/POINT坐标、CIRCLE半径、ARC角度等有缺失/数值错误诊断；Z可按当前二维约定缺省 | entity_wbtest.mbt、security_test.mbt、security_wbtest.mbt | 不是全部实体全部必填字段/重复字段审计；严格解析与宽松兼容入口不同 |
| POLYLINE序列与类型 | 普通二维顶点与SEQEND；不支持标志及坏顶点进入不完整诊断 | geometry_regression_wbtest.mbt、maintenance_security_test.mbt | 3D/网格/Polyface不重建，宽度不等于中心线 |
| OCS/WCS | 按实体语义变换，保留XYZ | r12_world_wbtest.mbt及六模型坐标对照 | 非当前检查平面不参与二维检查；并非完整3D建模 |
| BLOCK/INSERT引用与阵列 | 基点、变换、全部行列、嵌套来源；循环/缺失/歧义/预算诊断 | expand_wbtest.mbt、r12_world_wbtest.mbt、第三方阵列专项 | 完整关联属性布局、所有TABLES/句柄跨引用尚未校验 |
| 文字、标注、SHAPE/VIEWPORT及空间网格 | 原始字段或选择性解码，覆盖限制可见 | capabilities.json及对应覆盖测试 | 字形、资源引用、关联重建及全部R12语义仍未完成 |
| 几何检查完整性 | 解析和展开警告贯通，预算耗尽不能作完整结论 | completeness_wbtest.mbt、security_wbtest.mbt、maintenance_security_test.mbt | 完整仅指已选检查范围，不是图纸认证、CAM判断或无漏洞承诺 |

新增语义前先列出格式字段、缺省规则、参考资料、正/反例与独立预期；更新实现、公开API及对应文档后再把该项标为已验证。旧的全量记录不能替代当前改动验证。
