# dxfkit

MoonBit ASCII DXF 读取与二维轮廓辅助检查库：在声明字段范围内处理七类轮廓实体和普通 INSERT，提供可复用接口、SVG 预览、三个 CLI 命令和浏览器演示。

[在线试用](https://mik1e80.github.io/dxfkit/) · [接口与边界](README.mbt.md) · [项目对比](COMPARISON.md) · [第三方声明](THIRD_PARTY_NOTICES.md)

[兼容性案例](docs/compatibility-cases.md) · [修订后的申报材料](docs/submission.md)：区分文件读取、实体解码和几何检查，不承诺 R10–R2018 完整兼容。

[冻结交付范围与实体字段矩阵](docs/delivery-scope.md) · [六类最小问题的预期、实际和自动断言](docs/delivery-verification.md)

[检查不完整的统一处理与混合输入验收](docs/check-completeness.md)：通过 `Report::has_incomplete_checks()` 判断，CLI 与网页报告明确标示，`--strict` 触发失败。

[独立 MoonBit 工程调用教程](examples/consumer/README.md)：独立模块依赖本库，直接读取 DXF、提取实体、checked 离散和生成检查报告；包含复制到仓库外的步骤。

[几何正确性与检查器验收矩阵](docs/test-accuracy.md)：核对坐标、尺寸、包围盒与解析曲线误差；成对验证报警与不报警，并在临时副本中验证七类故障能否被测试发现。含非原点椭圆的精确包围盒与平移不变性验收。

[47 张第三方图纸的逐文件验证记录](docs/corpus-validation.md)：分别记录读取、实体字段解码、实际测试和未覆盖部分，不将语料回归统一标为兼容通过。

源码修订版本 **0.1.1**。本次修订尚未发布到 Mooncakes。

交付固定标签：`delivery-0.1.1-20261022-ellipse`。[干净环境复现步骤](docs/reproducibility.md)固定工具链和依赖；运行 `node scripts/verify-reproduction.cjs --fresh` 验证测试、CLI、网页和申报材料对应同一提交。

## 解决什么问题

面向已有 DXF 图纸的读取、预览与加工前辅助检查。例如，激光切割前复核轮廓是否开放、是否有重复线段，以及同图层不同实体的轮廓距离是否低于指定值。

项目以 DXF 的既有格式和几何算法为基础，参考 Python [ezdxf](https://ezdxf.readthedocs.io/en/stable/) 的能力组织。库可被其他 MoonBit 程序调用，CLI 可用于批量处理，网页可在本地浏览器处理文件。

在 MoonBit 生态中，已有 STEP、二维几何、G-code 和位图轮廓项目。本库的组合价值是 DXF 数据模型、普通块展开、带来源的轮廓提取与检查完整性诊断；通用几何能力存在交集。[生态对比表](COMPARISON.md)按 2026-10-22 核对的六个真实项目列明版本、固定文档、交集与边界，不据此宣称生态唯一；跨库适配尚未实现。

**检查结果不是可加工证明。** 材料、刀具、切缝、进给、机床和 CAM 策略不在本工具的验证范围内。

## 已实现能力

| 层次 | 内容 |
| --- | --- |
| 读取 | ASCII DXF 组码、三种换行、分段与子类、HEADER、图层和块；保留未知实体记录并给出诊断 |
| 核心轮廓 | LINE、CIRCLE、ARC、ELLIPSE、LWPOLYLINE、普通二维 POLYLINE、受限 SPLINE；仅承诺字段矩阵中的行为 |
| 块与其他信息 | 普通 INSERT 的 XY 展开、最多 8 层；点/文字预览及其他实体已有元数据提取 |
| 几何 | bulge 圆弧、椭圆、连续正权重 NURBS 的 XY 离散；嵌套块仿射变换 |
| 检查 | 退化几何、文字、图层、端点闭合、单实体自交、共线重叠、指定净距与检查覆盖提示 |
| 输出 | SVG 预览、文字报告、CLI 退出码 |
| 大文件 | `TagStream` 分块扫描与 CLI `stats`，不保存整份文件或全量 tag 列表 |

HATCH 边界、DIMENSION 关联几何、SOLID/TRACE/3DFACE 面几何、未知实体、非默认 OCS 和 INSERT 阵列的其余实例未完整检查，报告会提示覆盖限制。解码出实体身份不代表已验证其几何。面角点仍可读取，但不作为轮廓检查或绘制。

## 实际使用示例

```bash
moon update
moon run cli check examples/plate.dxf --min-gap 0.5 --strict
moon run cli svg examples/plate.dxf > plate.svg
moon run cli check examples/issues.dxf
moon run cli svg examples/curves.dxf > curves.svg
moon run cli stats testdata/ezdxf/circle_radius_le_0.dxf
moon run examples/library --target js
```

- `plate.dxf`：声明毫米单位的 100×60 外框及四个半径 3 的孔，用来演示有明确尺寸的二维图纸复核。
- `issues.dxf`：重复线段、开放边界和负半径，演示发现具体问题。
- `curves.dxf`：负 bulge 与 S 形样条，复现本次修复的曲线离散问题。

这些文件是项目自建示例，不代表生产设备或材料的加工认证。`testdata/ezdxf/` 另有 47 个第三方 DXF 回归文件；来源及完整 MIT 条款见第三方声明。

`examples/regressions/` 提供椭圆、SVG 坐标、损坏多段线、面实体和 INSERT OCS 六类最小反例；`node scripts/verify-delivery.cjs` 对真实网页产物逐项断言。`examples/library/` 是同模块内的简短包示例；真正有独立 `moon.mod` 的文件调用工程位于 [`examples/consumer/`](examples/consumer/README.md)，无需复制库内部实现或运行网页。

## CLI 和网页

`check` 支持 `--tol`、`--min-gap`、`--strict`。默认容差 0.05，默认不检查净距；容差必须为正，净距必须非负，二者都必须有限。

| 退出码 | 含义 |
| --- | --- |
| 0 | 未触发所选退出条件；普通模式仍可能有警告 |
| 1 | 有严重问题；启用 `--strict` 时，警告也触发此退出码 |
| 2 | 参数错误或文件读取失败 |

坐标和阈值都使用图纸原始单位，显示 HEADER 的单位声明供确认，不自动转换成毫米。

网页可打开 `web/index.html`，或访问在线版。文件在浏览器本地处理；可上传图纸、调整净距、查看报告和预览，并选择正常、问题、未覆盖三类内置示例。仓库包含编译产物，修改库后需重建：

```bash
node scripts/build-web.cjs
node web/smoke.cjs
node scripts/verify-delivery.cjs
node scripts/verify-completeness.cjs
```

## 算法与范围

NURBS 先按节点插入分解为有理 Bézier 段，再用控制点凸包判定细分；不再用单个中点代表整条曲线。负 bulge 保持多段线原始的起终点顺序。块放大时根据累计变换调整局部离散容差。

推荐使用 `Geometry::flatten_checked()`、`spline_points_checked()` 获得曲线输入或资源上限的错误原因。`Flat::Empty` 仍表示没有可离散轮廓，调用方须单独核对覆盖范围；旧 `flatten()` / `spline_points()` 保留兼容回退，不能用其占位结果证明几何正确。

ELLIPSE 长轴字段按相对圆心向量读取。SVG 输出使用有限 Double 的往返数字表示，不依赖整数缩放或固定四位小数。损坏顶点拒绝生成整条多段线轮廓并报告；拟合、空间或网格 POLYLINE 不作为普通二维折线处理。接口行为收紧及迁移说明见[六类修复验证](docs/delivery-verification.md#兼容变化)。

以下限制需在集成时考虑：

- 二进制 DXF、写回与编辑、完整引用审计、刀路生成、参数化草图求解尚未实现。
- 几何以 XY 投影分析，不是三维 CAD 内核；非默认 OCS 未转换。非默认 OCS 的 INSERT（包括嵌套引用）整体跳过并报告句柄、图层和块名，避免把错误 XY 几何用于检查或预览。
- 闭合、自交、重复和净距检查按图层处理，不检查跨图层关系。
- 净距比较同图层不同实体的离散线段，跳过容差内端点接触，不覆盖单实体内部窄颈或真实材料厚度。
- 自交检查针对同一实体的非相邻线段；并非通用多实体相交或区域布尔检查。
- UTF-8、CP1252 可解码；其他声明代码页降级并警告。HEADER 编码探测只读取文件开头 1024 字节。
- 资源上限、浮点精度与离散误差会影响结果，尤其是阈值附近；详细说明见接口文档。

## 流式统计

`stats` 每次读取 256 KiB，主要保留当前块、未完成文本行、扫描警告和统计表。不构造全量图纸，不能在这个入口执行几何检查。

**总内存并非对任何输入都为常数**：超长行、警告数量、不同段名及调用方保留的输出都可能使存储增长。`check` 和 `svg` 仍需读取完整文件。

## 验证与开发

```bash
moon check --target all --deny-warn
moon build
moon test
moon test --target js
moon test --target native
moon run conformance
node cli/smoke.cjs
node scripts/build-web.cjs
node web/smoke.cjs
node scripts/verify-delivery.cjs
node scripts/verify-completeness.cjs
node scripts/verify-consumer.cjs
node scripts/verify-consumer.cjs --target native
node scripts/verify-test-sensitivity.cjs
node scripts/verify-corpus-records.cjs
```

测试包含负 bulge 顺序、S 形样条、非均匀节点、有理权重、重节点和未钳制样条；用独立 de Boor 求值的密集采样对照新离散结果。另测试块放大后的世界坐标误差、无效参数、数值解析、检查覆盖及 CLI / 网页入口。

9 个几何精度验收、8 个检查器成对测试及另补的 2 个椭圆实体测试从最小 DXF 开始验证结果。测试敏感性脚本在临时副本中注入长轴重复减圆心、坐标偏移、样条直线化、bulge 镜像、漏报、误报和阈值错误，要求实际断言失败；编译失败不算检出。具体预期和结果见验收矩阵。

独立工程验收把 `examples/consumer/` 复制到系统临时目录后编译运行；Wasm 和 Native 各有 7 个实际检查、运行与退出码断言，结果记录见教程。示例文件可在独立模块中直接读取。

47 个第三方文件用于读取和回归验证，不是完整 DXF 一致性测试套件。逐文件来源、SHA-256、实际测试和分层结果见[语料案例表](docs/corpus-validation.md)及对应 JSON；当前没有这些外部文件的独立几何真值，不把自建精度测试迁移为逐图纸认证。网页回归使用实际编译产物与最小 DOM，不验证浏览器布局。

## 许可

项目采用 [Apache-2.0](LICENSE)。第三方语料与参考资料的来源、版权和完整条款见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。


## 覆盖限制回归案例

`moon run cli check examples/unsupported-insert-ocs.dxf --strict` 应报告未转换 OCS、跳过该引用，并以 1 退出。该文件故意超出支持边界；普通模式出现警告也可能以 0 退出，不代表完整几何通过。顶层及嵌套路径见 insert_ocs_wbtest.mbt，CLI 与网页另运行真实入口回归。

变更与兼容约定见 [CHANGELOG.md](CHANGELOG.md)。
