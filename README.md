# dxfkit

MoonBit DXF 工具库：读取 ASCII DXF，将支持的二维曲线离散为折线，检查几何问题，并提供 SVG 预览、命令行和网页入口。

[在线试用](https://mik1e80.github.io/dxfkit/) · [接口与边界](README.mbt.md) · [项目对比](COMPARISON.md) · [第三方声明](THIRD_PARTY_NOTICES.md)

[兼容性案例](docs/compatibility-cases.md) · [修订后的申报材料](docs/submission.md)：区分文件读取、实体解码和几何检查，不承诺 R10–R2018 完整兼容。

源码修订版本 **0.1.1**。本次修订尚未发布到 Mooncakes。

## 解决什么问题

面向已有 DXF 图纸的读取、预览与加工前辅助检查。例如，激光切割前复核轮廓是否开放、是否有重复线段，以及同图层不同实体的轮廓距离是否低于指定值。

项目以 DXF 的既有格式和几何算法为基础，参考 Python [ezdxf](https://ezdxf.readthedocs.io/en/stable/) 的能力组织。库可被其他 MoonBit 程序调用，CLI 可用于批量处理，网页可在本地浏览器处理文件。

**检查结果不是可加工证明。** 材料、刀具、切缝、进给、机床和 CAM 策略不在本工具的验证范围内。

## 已实现能力

| 层次 | 内容 |
| --- | --- |
| 读取 | ASCII DXF 组码、三种换行、分段与子类、HEADER、图层和块；保留未知实体记录并给出诊断 |
| 实体 | 线、点、圆、圆弧、椭圆、样条、多段线、文字、INSERT 等；部分实体仅提取元数据 |
| 几何 | bulge 圆弧、椭圆、连续正权重 NURBS 的 XY 离散；嵌套块仿射变换 |
| 检查 | 退化几何、文字、图层、端点闭合、单实体自交、共线重叠、指定净距与检查覆盖提示 |
| 输出 | SVG 预览、文字报告、CLI 退出码 |
| 大文件 | `TagStream` 分块扫描与 CLI `stats`，不保存整份文件或全量 tag 列表 |

HATCH 边界、DIMENSION 关联几何、未知实体、非默认 OCS 和 INSERT 阵列的其余实例未完整检查，报告会提示覆盖限制。解码出实体身份不代表已验证其几何。

## 实际使用示例

```bash
moon update
moon run cli check examples/plate.dxf --min-gap 0.5 --strict
moon run cli svg examples/plate.dxf > plate.svg
moon run cli check examples/issues.dxf
moon run cli svg examples/curves.dxf > curves.svg
moon run cli stats testdata/ezdxf/circle_radius_le_0.dxf
```

- `plate.dxf`：声明毫米单位的 100×60 外框及四个半径 3 的孔，用来演示有明确尺寸的二维图纸复核。
- `issues.dxf`：重复线段、开放边界和负半径，演示发现具体问题。
- `curves.dxf`：负 bulge 与 S 形样条，复现本次修复的曲线离散问题。

这些文件是项目自建示例，不代表生产设备或材料的加工认证。`testdata/ezdxf/` 另有 47 个第三方 DXF 回归文件；来源及完整 MIT 条款见第三方声明。

## CLI 和网页

`check` 支持 `--tol`、`--min-gap`、`--strict`。默认容差 0.05，默认不检查净距；容差必须为正，净距必须非负，二者都必须有限。

| 退出码 | 含义 |
| --- | --- |
| 0 | 未触发所选退出条件；普通模式仍可能有警告 |
| 1 | 有严重问题；启用 `--strict` 时，警告也触发此退出码 |
| 2 | 参数错误或文件读取失败 |

坐标和阈值都使用图纸原始单位，显示 HEADER 的单位声明供确认，不自动转换成毫米。

网页可打开 `web/index.html`，或访问在线版。文件在浏览器本地处理；可上传图纸、调整净距、查看报告和预览。仓库包含编译产物，修改库后需重建：

```bash
bash web/build.sh
node web/smoke.cjs
```

## 算法与范围

NURBS 先按节点插入分解为有理 Bézier 段，再用控制点凸包判定细分；不再用单个中点代表整条曲线。负 bulge 保持多段线原始的起终点顺序。块放大时根据累计变换调整局部离散容差。

推荐使用 `Geometry::flatten_checked()`、`spline_points_checked()` 获得曲线输入或资源上限的错误原因。`Flat::Empty` 仍表示没有可离散轮廓，调用方须单独核对覆盖范围；旧 `flatten()` / `spline_points()` 保留兼容回退，不能用其占位结果证明几何正确。

以下限制需在集成时考虑：

- 二进制 DXF、写回与编辑、完整引用审计、刀路生成、参数化草图求解尚未实现。
- 几何以 XY 投影分析，不是三维 CAD 内核；非默认 OCS 未转换。
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
bash web/build.sh
node web/smoke.cjs
```

测试包含负 bulge 顺序、S 形样条、非均匀节点、有理权重、重节点和未钳制样条；用独立 de Boor 求值的密集采样对照新离散结果。另测试块放大后的世界坐标误差、无效参数、数值解析、检查覆盖及 CLI / 网页入口。

47 个第三方文件用于读取和回归验证，不是完整 DXF 一致性测试套件。网页回归使用实际编译产物与最小 DOM，不验证浏览器布局。

## 许可

项目采用 [Apache-2.0](LICENSE)。第三方语料与参考资料的来源、版权和完整条款见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
