# dxfkit 在 MoonBit 生态中的价值与差异

**核对日期：2026-10-22（Asia/Shanghai）。** 本文比较 MoonBit 中实际存在的 CAD、二维几何、G-code 和位图轮廓项目。dxfkit 的贡献是把 **DXF 数据模型、普通块展开、二维轮廓提取与检查完整性诊断** 组成可被其他 MoonBit 程序调用的流程。距离、相交、曲线离散等算法与现有项目有交集，不能据此宣称独占。

## 核对方法与证据范围

核对了下表六个模块的 `moon.mod` 和项目文档，链接固定到实际读取的 GitHub 提交；模块名、版本、提交和文档 blob SHA 另存于[来源记录](docs/ecosystem-sources.json)。表中的版本是本次核对版本，不承诺始终为最新版本。

这六个模块也存在于 2026-10-22 刷新成功的 [Mooncakes 注册表](https://mooncakes.io/git/index)快照 `8e723fa3236d4145bb3dcbf02cf5ade258cbd3d8`。检索了 3201 份模块索引的名称、描述和关键词，使用 `dxf|cad|geometry|gcode|contour|step|vector.trace` 大小写无关匹配，再人工选择 CAD、二维几何、G-code、位图轮廓及制造检查方向的代表项目。子串检索含误命中，也会漏掉未使用这些关键词的模块，不把候选列表当作完整目录。

下表反映公开文档中的接口与目标；**本轮没有运行这六个项目的测试、性能比较或跨库集成**。未在所核对文档中列出的功能只记为“未见声明”，不推断其源码中绝对不存在。本次不是对全部公开、私有或未发布 MoonBit 项目的普查，不得据此写“生态唯一”。

## MoonBit 同类与相邻项目对比

| 实际项目与核对版本 | 文档证据中的能力 / 接口 | 与 dxfkit 的交集 | dxfkit 的差异与边界 | 核对日期 |
| --- | --- | --- | --- | --- |
| [gmlewis/step 0.1.22](https://mooncakes.io/docs/gmlewis/step)；[固定文档](https://github.com/gmlewis/moonbit-step/blob/3d77e2bed4bef957f7019af754bf8d2a5e772cea/README.md) | STEP 解析 / 序列化与三维建模 DSL；`parse_repository_from_string_result`、`Design::new`、`write_step` | CAD 交换数据模型、结构化读取、变换及错误报告 | dxfkit 面向 ASCII DXF 的段、图层、实体与普通 INSERT，输出有限范围的 XY 轮廓与报告；不提供 STEP 写出、三维建模或无损序列化。对方所核对文档未声明 DXF 读取流程 | 2026-10-22 |
| [cn-xjr/moongeokit 0.3.0](https://mooncakes.io/docs/cn-xjr/moongeokit)；[固定文档](https://github.com/cn-xjr/moongeokit/blob/0300c9cd7600c255011ddae96c9f7d929679e18a/README.mbt.md) | `Point` / `Polyline` / `Polygon`、距离 / 相交 / 凸包，`GridSpatialIndex::query_nearest`，GeoJSON 输出 | 二维点列、包围盒、距离和相交等计算 | dxfkit 增加 DXF 读取、图层 / 句柄来源、bulge / 样条、块展开和覆盖诊断；不提供通用可变网格索引或 GeoJSON 接口。对方所核对文档未声明 DXF 模型与块解码 | 2026-10-22 |
| [totto2727/geo 0.1.3](https://mooncakes.io/docs/totto2727/geo)；[固定文档](https://github.com/totto2727-org/geo/blob/bc35dd29f37d3a052cd67310d5a2cb62fd3118ab/README.mbt.md) | 二维类型与算法、布尔 / 三角剖分、鲁棒谓词和 R-tree；如 `HasArea::unsigned_area`、`orient2d` | 点线面计算、测量、变换与拓扑相关处理 | dxfkit 聚焦 DXF 到带来源轮廓和辅助报告的流程；不提供整套地理算法、鲁棒谓词或区域布尔接口，不宣称几何基础更广。对方所核对文档未声明 DXF 组码与块引用入口 | 2026-10-22 |
| [cjcjwe/gcode-toolkit 0.3.1](https://mooncakes.io/docs/cjcjwe/gcode-toolkit)；[固定文档](https://github.com/cjcjwe/moonbit-gcode-toolkit/blob/89c6b7c9dd7c3b7de7566cb917cdc86a5fa5d516/README.mbt.md) | `parse_gcode` / `parse_gcode_document`、模态状态、控制器子集诊断、改写和离线刀路审查 | 工业文本解析、结构化数据、带位置的诊断与批处理 | 输入和检查阶段不同：dxfkit 读取 CAD 图纸并检查轮廓，对方处理 G-code 程序和运动状态。dxfkit 不生成 G-code，不验证控制器指令，没有已实现的 DXF→CAM→G-code 集成 | 2026-10-22 |
| [zgfzgf899/moonbit-vector-trace-plan 0.2.2](https://mooncakes.io/docs/zgfzgf899/moonbit-vector-trace-plan)；[固定文档](https://github.com/zgfzgf899/moonbit-vector-trace-plan/blob/f1cb9c7e813971ad1f51c29dfbbfe758b6f436bb/README.md) | 位图 / 掩码轮廓追踪、路径 IR、几何与简化、路径排序及机器命令；`lib/trace` / `lib/geometry` / `lib/plan` | 轮廓、点列、曲线近似、几何处理与 SVG 等输出 | 对方从像素得到路径并规划绘制；dxfkit 从 DXF 保留实体、图层、块引用语义后提取轮廓。不提供位图追踪、路径排序或机器计划；两者目前没有现成适配器 | 2026-10-22 |
| [Mgk789a/moonbit-gerberkit 0.2.4](https://mooncakes.io/docs/Mgk789a/moonbit-gerberkit)；[固定文档](https://github.com/Mgk789a/moonbit-gerberkit/blob/80e332f79d2d826fca00e40f3fd8cd0593b95b2f/README.mbt.md) | Gerber / Excellon 读取、共享板模型与 DFM；`parse_auto`、`board_from_layers`、`run_dfm`，闭合 / 重复 / 净距等检查 | 制造数据模型、轮廓、几何诊断、批处理与 CLI / SVG；净距、重复和闭合检查都有真实交集 | 对方处理 PCB 制造数据并归一化为毫米；本库处理 DXF 实体与 INSERT，阈值使用原图单位。dxfkit 不提供 PCB 板模型、孔环宽 / 电气连通 / 制造配置检查；对方所核对文档未声明 DXF 块读取 | 2026-10-22 |

## 组合价值如何落实到可调用接口

| 调用阶段 | 已有接口与输出 | 调用方得到的实际价值 | 限制与验证证据 |
| --- | --- | --- | --- |
| DXF 数据模型 | `scan_tags` → `build_drawing`；`Drawing::entities()` / `blocks()`，保留原记录、图层、句柄 | 导入程序可读取类型化字段，并对未覆盖记录自行处理，无需从像素反推 CAD 实体 | 仅 ASCII 与[字段矩阵](docs/delivery-scope.md)；保留未知记录不等于完整语义或可写回 |
| 块展开 | `Drawing::expand(tol)` → `Expansion.placed` / `warnings`；`Placed` 保留实体、生效图层与离散结果 | 获得累计 XY 变换后的点列及来源，无需在应用侧重新实现块基点、缩放、旋转和图层 0 继承 | 普通 INSERT 最多 8 层；阵列只处理首实例，非默认 OCS 跳过并诊断；[最小反例](docs/delivery-verification.md)与[精度矩阵](docs/test-accuracy.md) |
| 轮廓提取 | `Entity::flatten_checked(tol)` / `Geometry::flatten_checked(tol)` → `Result[Flat, String]`；`Flat::Outline(points, closed)` | 将支持的曲线转为 XY 点列供显示或计算；局部离散与整图块展开可分别使用 | 七类核心实体及受限 SOLID/TRACE 的声明字段；无效输入、资源上限返回错误；不支持的几何不能当正常轮廓 |
| 诊断接口 | `Drawing::check(options)` → `Report`；`has_incomplete_checks()`、`has_fatal()`、`to_text()` | 区分“已检查部分未发现问题”与“整图有未检查内容”，实施退出或人工复核策略 | 正常轮廓不能抵消覆盖警告；[混合输入验收](docs/check-completeness.md) |

[独立消费工程](examples/consumer/README.md)已在 Wasm / Native 各用 8 个案例验证读取、实体提取、checked 离散、块展开和报告调用。它不依赖网页，也不复制内部实现。CLI 和网页是这些接口的使用入口，库的复用价值不依赖演示页面存在。

应用可以在 `Expansion` 后取出点列，按目标库的坐标类型、单位、闭合约定和容差写适配层，将 DXF 来源信息作为附加属性传递。这是与通用几何库结合的可行设计方向，**目前没有跨库适配和端到端验证**。从轮廓到刀路还需要 CAM 策略，不能把与 G-code 项目相邻描述为已能直接加工。

## 与成熟参考框架的关系

[ezdxf](https://ezdxf.readthedocs.io/en/stable/) 是 Python DXF 读写框架，作为格式处理和部分公式的参考，不作为 MoonBit 生态差异性的主要对照。dxfkit 提供 MoonBit 调用方式及有限范围的辅助检查；不覆盖其二进制 DXF、广泛实体、写回编辑和完整审计能力，不承诺全面替代。参考与外部图纸许可见[第三方声明](THIRD_PARTY_NOTICES.md)。

## 可用于报名表的差异性说明

> MoonBit 生态已有 STEP 建模、二维几何、G-code 审查和位图轮廓项目。dxfkit 面向已有 ASCII DXF 图纸，将段 / 图层 / 实体数据模型、普通 INSERT 的 XY 展开、支持曲线的轮廓提取及检查完整性诊断组成可复用接口；独立 MoonBit 工程可直接调用，并以明确尺寸案例、覆盖反例和跨目标测试验证。其差异在于 DXF 语义到轮廓及诊断的组合流程。项目只承诺已列明实体与字段，不提供完整 CAD / CAM 能力；与相邻项目的集成仍需适配和验证。

本轮未取得用户采用或第三方集成证据，因此“实际价值”由已运行的独立调用工程及明确输入 / 输出支持，不写成已有生产部署、性能领先或市场占有结论。第三方图纸独立几何真值仍为 0/47，生态比较不提升该覆盖等级。
