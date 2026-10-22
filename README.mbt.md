# dxfkit：接口与实现边界

MoonBit 的 ASCII DXF 读取、二维几何处理与辅助检查库。安装、场景、CLI 和网页入口见 [README.md](README.md)。源码修订版本 0.1.1，本次修订尚未发布到 Mooncakes。

本次范围为七类核心轮廓实体、受限二维 SOLID/TRACE 边界和普通 INSERT；逐字段输入、输出、限制与案例见[交付范围](docs/delivery-scope.md)，追加行为见[补充几何审查](docs/review-cases.md)。

## 为什么选择这个范围

DXF 图纸交换与脚本处理是已有需求，Python ezdxf 是成熟参照。dxfkit 的交付目标是可复用的 MoonBit 读取与几何接口，附带可验证的检查示例。它不保证图纸可加工，也不以“生态唯一”或功能数量作为正确性的证据。

## 读取与数据模型

```moonbit nocheck
let scan = @dxfkit.scan_tags(bytes)
let drawing = @dxfkit.build_drawing(scan)
let entities = drawing.entities()
let report = drawing.check({ tol: 0.05, min_gap: 0.5 })
println(report.to_text())
let svg = drawing.to_svg(0.05)
```

`TagScan` 返回 tag、诊断与编码；`Drawing` 保存段、记录、子类与警告。`Entities` 保存已解码实体及未解码记录。未知实体不自动丢弃，但本项目不提供写回或字节级无损往返承诺。

支持不同时期 ASCII DXF 的组码和子类写法。47 个回归文件包含 AC1006、AC1009 到 AC1032 的示例，这不表示支持这些版本的全部实体与语义。

数值异常保留文本并警告；整数使用整数解析，64位值不再经 Double 舍入。UTF-8 和 CP1252 可解码，其他声明代码页以 Latin-1 降级并警告；UTF-8 使用宽容解码。编码探测限于文件头 1024 字节。

## 几何与离散

`bounds()` 是原始解码数据的几何包围估计，不代表通过 checked 合法性验证；非法 ELLIPSE 仍可能得到包围估计。可靠几何处理须先使用 `flatten_checked()`，本轮不新增 bounds_checked API。

当前 main 要求显式 SPLINE 次数（71），缺失不再默认三次；明确拒绝 Closed/Periodic 标志，以及非空但不等于控制点数的权重数组；无权重才按全 1。ELLIPSE 轴比接收 `(0,1]`。多段线非零宽度/厚度保留中心线并报告不完整；缺 ENDBLK 按下一块或段末恢复且警告。完整修订见[本轮记录](docs/advisor-review-20261022.md)。

核心轮廓为 LINE、CIRCLE、ARC、ELLIPSE、LWPOLYLINE、普通二维 POLYLINE、受限 SPLINE。POINT 和文字用于位置或简化预览；SOLID/TRACE 在下述受限范围内支持二维边界；HATCH、DIMENSION、3DFACE 等保留已有字段，不能据此认为它们的轮廓已参与检查。

ELLIPSE 的 11/21/31 是相对圆心长轴向量。普通 POLYLINE 不接受拟合、空间和网格语义；损坏顶点保留记录并拒绝整条轮廓，避免拼接出新形状。裸 `Geometry::Face` 不携带 SOLID/TRACE/3DFACE 身份，调用其 `flatten()` / `flatten_checked()` 返回 Empty。SOLID/TRACE 应使用 `Entity::flatten_checked(tol)`，在默认 OCS、零厚度、所有角点同 Z 的范围内生成二维边界；3DFACE 仍报告未覆盖。

- `Geometry::flatten_checked(tol)` 返回 `Result[Flat, String]`，是曲线的 checked 入口；整图展开使用保留身份的 Entity::flatten_checked。
- `spline_points_checked(degree, knots, control_points, weights, tol)` 支持连续、正权重 NURBS 的 XY 离散。
- `arc_from_bulge()` 用逆时针形式描述点集；多段线连接时根据 bulge 符号选择遍历方向，并保留精确原始端点。
- `Drawing::expand(tol)` 展开嵌套 INSERT，复合仿射变换并处理图层0继承；累计最大拉伸上界用于调整局部容差。
- `Drawing::declared_unit_label()` 只显示单位声明，不转换坐标或阈值。

样条通过 Boehm 节点插入分解为有理 Bézier 段，使用齐次 de Casteljau 细分。正权重下，曲线位于投影控制点的凸包中；用控制点到线段的距离判定细分，避免中点恰好落在弦上时漏掉曲线。椭圆由每段不超过90°的有理二次 Bézier 表示，复用同一离散过程。

资源边界：样条次数不超过32，输入控制点不超过4096；递归深度16，输出最多65536点。圆弧最多4096段。checked入口达到上限且不能满足容差时返回错误，而不是宣称已满足目标。Double 运算仍有舍入误差；这些限制不构成任意数值尺度的严格精确算术保证。

旧 `flatten()`、`spline_points()` 和 `ellipse_points()` 为兼容保留占位 / 空结果回退，调用方如需判断完整性应使用 checked 入口。

## 检查的实际语义

`Drawing::check(CheckOptions)` 返回 `Report`，每条 `Finding` 有检查项、严重程度和文字说明。

`Report::has_incomplete_checks()` 统一判断解析恢复、覆盖限制、文字未转轮廓或非法检查参数。报告结论明确标为“检查不完整”，即使同一文件中存在正常轮廓也保留这些原因；CLI `--strict` 因此失败。具体混合输入和自动断言见[完整性约定](docs/check-completeness.md)。普通的开放轮廓几何告警不自动等于检查覆盖缺失。

| 检查 | 实际覆盖 |
| --- | --- |
| 退化几何 | 非正圆半径、空或单点轮廓、零长度线段 |
| 闭合 | 同图层开放实体的端点串链与缝隙；不等于完整拓扑证明 |
| 自相交 | 同一实体内非相邻折线段的真交叉 |
| 重复路径 | 同图层线段的共线重叠，排除同实体相邻段 |
| 最小净距 | 同图层不同实体的线段距离；跳过容差内的端点接触 |
| 检查覆盖 | 未支持或只提取元数据的实体、无轮廓、非默认OCS、未展开阵列、解析与离散诊断 |
| 文字与图层 | 未转换的文字、图层引用和关闭 / 冻结状态提示 |

净距不是材料最窄厚度。它不覆盖单实体窄颈、跨图层关系，也不能代替刀具半径补偿或热 / 力学分析。曲线先离散后比较，阈值附近的结论需考虑两侧离散误差。

关闭 / 冻结图层在部分几何检查中跳过，是本工具的筛选约定，不代表 CAM 一定按同样方式处理图层。

参数要求 `tol > 0`、`min_gap >= 0` 且有限。`min_gap = 0` 不检查净距。单位沿用图纸坐标，HEADER声明仅供使用者确认。

## 流式入口

`TagStream::new()` / `feed(Bytes)` / `finish()` 共用 ASCII 扫描状态机。跨块保留编码探测前缀、未完成行及组码状态。扫描警告会积累；不同调用方保留的输出也影响总内存。

CLI `stats` 分块读文件、统计 tag、段、版本、编码，不保存全量 tag 或实体。`scan_tags()` 则会保留所有 tag；`check` / `svg` 使用全量图纸，不能作为低内存几何检查入口。

## 使用与验证

`Layer::is_enabled_for_checks()` 只表示本工具默认筛选规则，旧 `is_machinable()` 保留为同义兼容接口，不判断能否加工。`Drawing::expand_with_limits(tol, ExpandLimits)` 和 `check_with_limits` 支持图纸预算；默认展开上限为 10000 条放置记录、200000 点、100000 次访问，截断会标为不完整。`Drawing::analyze(options)` 使用同一 Expansion 生成 Report/SVG/单位；网页新增 `analyze` JSON 入口，旧 check/svg/svg_error 继续兼容。

- 核心库仅依赖 MoonBit core；CLI / conformance 使用 `moonbitlang/x` 和 `moonbitlang/async` 的文件接口。
- 库支持 wasm / wasm-gc / JS / native；文件工具支持 wasm / native。
- CLI `--strict` 将警告也作为失败，便于批处理门禁；普通模式的0退出码不代表检查完全或可加工。
- 网页使用同一库编译产物，部署前重新构建并执行回归。
- SVG 数值使用 Double 往返表示，可含科学计数法；调用方不要依赖固定四位小数。
- `examples/library` 是同模块调用包；[`examples/consumer`](examples/consumer/README.md) 是独立模块工程，用公开 API 读取文件、提取实体、checked 离散和检查，已在仓库外以 Wasm、Native 验证。

验证命令见 [README.md](README.md#验证与开发)。几何正确性以明确反例、解析几何和独立de Boor密集采样验证；第三方文件读取成功、测试数量或汇总点数不能单独证明正确性。

逐实体坐标/尺寸/包围盒/误差和检查器正反例见[验收矩阵](docs/test-accuracy.md)。故障注入只作用于临时副本，验证列明的语义故障能被测试检出，不以“能够编译运行”替代判定正确。

外部语料另按文件记录[读取、实体字段解码和几何验证证据](docs/corpus-validation.md)。现有 47 张文件均没有逐图纸独立几何真值；产生点列或能执行检查仍只记为已运行不变量回归。

## SOLID / TRACE 的实体入口

`Entity::flatten_checked(tol)` 保留实体身份，默认 OCS、零厚度、所有角点同 Z 时按 0→1→3→2 生成 SOLID/TRACE 闭合边界，标准三角形只输出一次重复的第三/第四点。原始 `Face.corners` 保持文件顺序，3DFACE 不统一重排。

此前这些类型仅保留元数据的边界已调整，详见[追加审查验收与迁移](docs/review-cases.md)。裸 `Geometry::Face` 没有实体身份，其 flatten / checked 仍返回 Empty。整图展开、检查和 SVG 使用新的 Entity 入口。非默认 OCS、非零厚度、非平行 XY 面不产生轮廓；省略第四角点的恢复会报告不完整，部分第四坐标拒绝。

## 暂未实现

二进制DXF、文件写回、通用编辑、完整引用审计、OCS变换、完整HATCH边界、关联标注重建、通用面实体及三维轮廓检查、全部INSERT阵列、字体转轮廓、刀路生成和参数化草图约束求解。

## 来源

样条格式参考 [Autodesk SPLINE 文档](https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-DXF/files/GUID-E1F884F8-AA90-4864-A215-3182D47A9C74.htm)；能力与公式参考 [ezdxf](https://ezdxf.readthedocs.io/en/stable/)；标准样条算法为节点插入、de Casteljau及de Boor。第三方版权、完整许可及已记录的参考关系见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。


非默认 OCS 的 INSERT 在块展开入口报告并跳过整个引用；子实体不会作为正确的 XY 轮廓参与检查或预览。其他实体的非默认 OCS 仍按原有检查覆盖警告处理，未新增通用 OCS 转换。
