# R12 分层符合性维护清单

这份实现清单以 AC1009 读取配置为基线。具体实体见[范围矩阵](r12-profile.md)和[机器矩阵](capabilities.json)。

`audit_r12_fields()` 检查 LINE、POINT、VERTEX、ARC、CIRCLE、BLOCK、INSERT 被当前解码器消费的部分单值字段及 INSERT 本地块引用。诊断包含原始记录下标、组码和问题类别，可定位缺失、重复、错误类型或半径，以及缺失或重复定义的块名。Z 缺省沿用二维兼容约定。字段含义参考 [Autodesk LINE](https://help.autodesk.com/cloudhelp/2023/ENU/AutoCAD-DXF/files/GUID-FCEF5726-53AE-4C43-B4EA-C84EB8686A66.htm)、[ARC](https://help.autodesk.com/cloudhelp/2020/ENU/AutoCAD-DXF/files/GUID-0B14D8F1-0EBA-44BF-9108-57D8CE614BC8.htm)和[INSERT](https://help.autodesk.com/cloudhelp/2024/ENU/AutoCAD-DXF/files/GUID-28FA4CFB-9D5E-4880-9F11-36C97578252F.htm)。

| 要求层次 | 已实现 | 已验证的证据 | 未完成/限制 |
| --- | --- | --- | --- |
| 文件结构：段、表、块、子实体结束与EOF | 已诊断缺失/孤立/中断并保留原始记录 | r12_structure_test.mbt、security_wbtest.mbt、maintenance_security_test.mbt | 所有合法组合与版本例外未穷举；超限后只保留派生前缀 |
| 记录：组码顺序、重复/未知字段、XDATA | 扫描预算范围内保留，source保留原字节 | r12_read_test.mbt、encoding_boundary_test.mbt | 保留不等于字段合法；GBK 已内置，其他旧双字节代码页需提供解码回调 |
| 常用几何必填字段 | LINE/POINT坐标、CIRCLE半径、ARC角度等有缺失/数值错误诊断；Z可按当前二维约定缺省 | entity_wbtest.mbt、security_test.mbt、security_wbtest.mbt | 不是全部实体全部必填字段/重复字段审计；严格解析与宽松兼容入口不同 |
| POLYLINE 序列与类型 | 二维顶点与 SEQEND，另有 3D、M/N 网格与 Polyface 拓扑读取 | r12_semantics_test.mbt、geometry_regression_wbtest.mbt | 空间拓扑不进入二维检查，拟合面和非零宽度区域尚未重建 |
| OCS/WCS | 按实体语义变换，保留XYZ | r12_world_wbtest.mbt、六模型坐标对照及 [实际倾斜圆](../examples/cad-ocs/README.md) | 非当前检查平面不参与二维检查；并非完整3D建模 |
| TABLES 的显式引用 | 在已声明的 LAYER、LTYPE、STYLE、DIMSTYLE、APPID 中审计对应名称，另审计实体 XDATA 的本地 1005 句柄 | maintenance_foundation_test.mbt | 名称按大写匹配，跳过内建默认项和未声明的表；尚未校验所有表项字段和应用私有 XDATA 语义 |
| BLOCK/INSERT 引用与阵列 | 基点、变换、全部行列、嵌套来源，按忽略大小写的名称查找，诊断缺失或歧义。ATTRIB 关联到所属 INSERT 与对应 ATTDEF | expand_wbtest.mbt、r12_semantics_test.mbt、[真实 CAD](../examples/cad-ocs/README.md) | 外部参照、阵列逐实例属性复制和完整排版尚未覆盖 |
| 标注、SHAPE、VIEWPORT、3DFACE | 类型化读取标注定义点和块关联、符号参数、MVIEW v16 和冻结图层、面隐边 | r12_semantics_test.mbt、QCAD 实际 MVIEW 导出 | 字形和外部资源、标注求值、相机投影和裁剪未覆盖 |
| 几何检查完整性 | 解析和展开警告贯通，预算耗尽不能作完整结论 | completeness_wbtest.mbt、security_wbtest.mbt、maintenance_security_test.mbt | 完整仅指已选检查范围，不是图纸认证、CAM判断或无漏洞承诺 |

新增语义前先列出格式字段、缺省规则、参考资料、正/反例与独立预期；更新实现、公开API及对应文档后再把该项标为已验证。旧的全量记录不能替代当前改动验证。
