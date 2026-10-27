# R12 读取配置与几何边界

核对日期：2026-10-27。本文对应当前main的未发布0.2.0实现，不改写Mooncakes0.1.1或`submission-0.1.1-20261022-r2`的行为与验收记录。[本轮自查反馈整改](resubmission-20261027.md)记录新增结构诊断和接触误报修复。

项目定位为 **MoonBit ASCII DXF R12 记录读取与二维轮廓辅助检查库**。选择 `$ACADVER=AC1009` 为明确基线，但目前不使用“完整符合 R12 标准”的表述：有序保留记录和字段，与逐实体验证全部必填字段、关联语义和几何重建，是不同工作。二进制 DXF、DWG、写回、完整 CAD 绘制和 CAM 决策不在范围内。

## 三层结果

1. **读取：** `read_document(bytes)` 返回源字节、扫描结果、逐条原始记录、Drawing、自动选择的配置和 `read_warnings`。所有被扫描的组码顺序、重复项、未知字段、XDATA、SECTION/ENDSEC、TABLE/ENDTAB、BLOCK/ENDBLK、VERTEX/SEQEND、EOF 均可访问。完整源字节另外保留注释、格式、异常数据及 EOF 后内容。扫描器不把 EOF 后内容解释为新记录。
2. **坐标与展开：** `Drawing::expand_world(tol)` 返回 WCS XYZ、有效图层、源实体及外到内的 INSERT 实例链；每层有源 INSERT 句柄、块名、从 0 开始的行列号。展开失败、未知语义、缺块、循环、超过八层或资源上限均诊断。原始读取记录仍可单独访问。
3. **二维检查：** `Drawing::check()` / `expand()` 只采用转换后处于 WCS Z=0、误差不超过指定容差的轮廓。倾斜、非零标高或未重建的几何不能因投影看似正常而获得二维通过结论；strict 模式以警告失败。XYZ 转换成功不等于二维检查适用。

`ConformanceProfile::R12` 仅表示版本配置选择；`BestEffort` 用于无版本或其他版本，必须有范围提醒。`read_warnings` 为空只表示当前结构检查未发现问题，不是每个字段合法的认证。缺失/损坏几何字段由实体解码和检查层继续诊断。

## 规范项 → 实现 → 测试 → 结果

| 项目 | 实现入口 | 本轮证据 | 已验证范围 |
| --- | --- | --- | --- |
| AC1009 版本选择；其他版本 best effort | `read_document.mbt` | `r12_read_test.mbt` | 已通过；不外推为跨版本符合性 |
| HEADER 所有变量、TABLES 所有表项的原始字段 | `RawRecord.tags`、`ReadDocument.source` | `r12_read_test.mbt` | 有序保留；部分 HEADER/表有既有类型解码，不声称全表语义校验 |
| BLOCKS、ENTITIES、控制记录和 XDATA | 同上 | `r12_read_test.mbt` | 未知实体/字段也保留；读取状态与几何覆盖独立 |
| 缺 ENDSEC、ENDTAB、ENDBLK、SEQEND、EOF | `validate_record_structure` | `r12_read_test.mbt` | 明确结构警告；不是完整语法验证器 |
| 孤立VERTEX/ATTRIB、序列中断、错误所在段/缺外层记录 | 同上 | `r12_structure_test.mbt` | 原记录保留，结构问题必须诊断；正常序列有不报警对照 |
| Arbitrary Axis Algorithm、方向归一化 | `ocs.mbt` | `r12_world_wbtest.mbt` | ±Z、X、Y、(1,1,1)、零向量和大尺度方向 |
| LINE、POINT、3DFACE 坐标本属 WCS | `world_flat.mbt` | `r12_world_wbtest.mbt` | 挤出方向不再错误旋转这些坐标 |
| OCS 圆/弧/二维多段线/文字/SOLID/TRACE | `entity_world_flat` | 圆心、半径及反射 SOLID 定向测试 | 平面离散后转换 XYZ；局部非法/空间语义仍拒绝 |
| INSERT 行列、间距、基点和变换顺序 | `expand.mbt`、`insert_transform3` | [六份文件级模型](../examples/r12-validation/README.md) | 22 实例、132 个坐标分量；误差不超过 1e-9 |
| 嵌套、图层 0 继承及实例来源 | `WorldPlaced.instances` | 嵌套阵列、普通块测试 | 八层上限；重复位置的行列实例也保留，不合并 |
| 全图预算覆盖空数组实例 | `expand_visit`、`ExpandLimits` | `R12 large empty arrays stop at visit budget` | 输入行列巨大时停止并报告不完整，不承诺实时性 |
| 非 XY 几何保留与二维适用性 | `WorldFlat`、`world_to_xy` | YZ 轮廓及混合正常/倾斜图测试 | 不静默丢掉 Z；报告带图层和实例来源 |
| 第三方MINSERT及端点接触 | `conformance/corpus_wbtest.mbt`、`checker_array_contacts_wbtest.mbt` | [外部阵列专项](../examples/r12-validation/EXTERNAL.md) | 25个FLAG/100顶点解析对照、25圆采样；接触不误报，真交叉仍检出 |

## R12 实体矩阵

下表“保留”指原始字段读取，不代表重建全部实体语义。完整原始字段应从 `ReadDocument.records` 取得；`Geometry` 是面向已实现几何的选择性解码。

| R12 记录 | 原始读取 | 坐标/几何重建 | 二维检查 |
| --- | --- | --- | --- |
| LINE、POINT | 全部 tag 及源字节 | WCS 端点/位置，父 INSERT 变换 | XY 线参与；点不作为闭合轮廓 |
| CIRCLE、ARC | 同上 | OCS 平面曲线→WCS XYZ | 位于检查平面时参与 |
| 普通二维 POLYLINE、VERTEX、SEQEND | 同上，序列控制记录不丢 | 顶点、bulge；使用 POLYLINE 头部标高，OCS→WCS | 中心线；宽度/厚度另报覆盖限制 |
| 三维、拟合、网格/多面 POLYLINE 变体 | 同上 | 尚未重建，空间坐标保留在原字段 | 不参与，明确不完整 |
| SOLID、TRACE | 同上 | 局部同 Z 的角点按 0→1→3→2 形成边界后转 WCS；不改写原始顺序 | 零厚度且位于检查平面时参与 |
| 3DFACE | 同上 | `Face3` 保留原顺序 WCS 角点及父变换 | 不推断二维切割边界 |
| INSERT | 同上 | XYZ 基点、3轴缩放、旋转、OCS、行列与间距、嵌套和来源 | 已重建子轮廓按适用性检查 |
| TEXT、ATTRIB、ATTDEF | 同上 | 已有文本与插入点的简化预览；适用字段转换 OCS | 字形不检查；多实例关联属性的完整布局尚未重建 |
| SHAPE、VIEWPORT、DIMENSION、其他记录 | 同上 | 保留已有解码或原字段；完整显示、关联语义尚未实现 | 轮廓覆盖不足时提示不完整 |

TABLES 中 LAYER、LTYPE、STYLE、VIEW、UCS、VPORT、DIMSTYLE、APPID，以及自定义/未知记录均由有序 RawRecord 保留。没有因为只做二维检查而删除这些记录；当前不承诺全部表项的约束、字体、视口、符号及扩展数据应用语义均已解释。

ELLIPSE、SPLINE、LWPOLYLINE、HATCH、MTEXT 等不属于本 R12 标准实体集合；现有支持作为扩展保留，不将其混入 R12 符合性计数。非 XY 椭圆/空间样条不会用局部 XY 离散冒充 WCS 曲线。

## 变换依据与方案修正

采用 Autodesk 的 [Arbitrary Axis Algorithm](https://help.autodesk.com/cloudhelp/2020/ENU/AutoCAD-DXF/files/GUID-E19E5B42-0CC7-4EBA-B29F-5E1D595149EE.htm) 和 [坐标系统分类](https://help.autodesk.com/cloudhelp/2024/ENU/AutoCAD-DXF/files/GUID-D99F1509-E4E4-47A3-8691-92EA07DC88F5.htm)。这些文档用于坐标规则，不能代替全部 R12 字段符合性验证。

块内点 `p`、块基点 `b`、插入点 `i`、阵列偏移 `g=(column*44,row*45,0)` 的单层变换为：

```text
OCS_to_WCS( i + R*g + R*S*(p-b) )
```

阵列间距不乘 S；嵌套时再复合父变换。方案中“把阵列偏移放进缩放内”的写法会错误放大间距，已根据 [ezdxf 1.4.4 的 INSERT 实现](https://github.com/mozman/ezdxf/blob/v1.4.4/src/ezdxf/entities/insert.py#L617-L649)核对修正。当前文件级对照使用独立设计运算，不声称本轮已实际运行 ezdxf 独立导出对照。零间距重复实例仍保留各自行列来源，与 ezdxf 的位置去重策略不同。

## 验证与后续交付

本轮只跑相关测试、类型检查、格式/API 检查和文件级模型，不运行整套测试，不创建最终申报标签，不发布新版 Mooncakes，也不自动替换旧 Pages 演示。新旧公开结构的原字段保持不变，新增 API 快照已生成并审阅；`Entity::flatten_checked` 和整图展开的坐标/平面行为发生上述变化，调用者应处理 Result 和完整性诊断。

本轮已刷新受影响的CLI、47文件观察、十类参数模型、网页审查和PDF，旧“OCS未转换/阵列仅首实例”不再作为当前正确预期；这些重放仍不等于整仓库全量。历史数据可在旧提交核对。建立新最终交付前仍须按需要完成相应完整验收，再为同一提交建立新标签；旧标签不移动。全部R12必填字段、引用约束及语义符合性验证仍属待办，不能仅通过改标题宣布完成。
