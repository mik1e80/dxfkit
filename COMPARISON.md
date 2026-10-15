# dxfkit 与相关项目的对比

本项目提供 MoonBit ASCII DXF 读取、二维几何离散和图纸辅助检查。差异应以可用接口、可复现案例和明确限制说明，不以未经验证的独占性或性能数字说明。

## 与 ezdxf

[ezdxf](https://ezdxf.readthedocs.io/en/stable/) 是成熟的 Python DXF 读写框架，本项目参考其能力组织及部分公式资料。

| 能力 | ezdxf | dxfkit |
| --- | --- | --- |
| 实现与使用 | Python库，含丰富附加功能 | MoonBit库；附CLI与浏览器入口 |
| DXF读取 | ASCII、二进制与广泛实体支持 | ASCII及本文档声明的实体范围 |
| 写回与编辑 | 提供 | 尚未提供 |
| 结构审计 | 数据与引用审计 | 解析诊断、部分块引用检查；不是完整引用审计 |
| 几何 | 变换、样条、路径等 | XY离散、嵌套块展开、有限范围的几何检查 |
| 绘图 | drawing等附加模块 | SVG预览 |
| 大文件 | iterdxf等流式工具 | TagStream及stats；完整性与内存边界见README |
| 加工辅助 | 可用其几何接口构建应用 | 提供现成的闭合、自交、重叠与指定净距报告 |

两者存在格式读取与几何处理交集。dxfkit 的贡献是 MoonBit 可复用接口和附带的辅助检查流程；不宣称这些几何能力是独有算法，也不把 ezdxf 没有同名报告入口等同于无法完成相关任务。

## MoonBit 相邻项目

2026-10-15依据公开注册表及项目文档核对的相邻方向如下；这不是所有公开或未公开项目的穷尽性结论。

| 项目 | 相关方向 | 与本项目的关系 |
| --- | --- | --- |
| [gmlewis/step](https://mooncakes.io/docs/gmlewis/step) | STEP解析、序列化和建模DSL | 同属CAD文件处理，格式与接口目标不同 |
| [cn-xjr/moongeokit](https://mooncakes.io/docs/cn-xjr/moongeokit) | 二维几何、测量和空间索引 | 共享部分几何基础，dxfkit增加DXF语义及读取流程 |
| [totto2727/geo](https://mooncakes.io/docs/totto2727/geo) | 二维地理几何算法 | 有真实几何能力交集，不能笼统称现有项目只渲染 |
| [cjcjwe/gcode-toolkit](https://mooncakes.io/docs/cjcjwe/gcode-toolkit) | G-code处理与刀路审查 | 处理不同阶段的数据；dxfkit不生成刀路 |
| [zgfzgf899/moonbit-vector-trace-plan](https://mooncakes.io/docs/zgfzgf899/moonbit-vector-trace-plan) | 位图描摹与路径规划 | 图像输入与CAD图纸读取不同，路径处理有交集 |

## 使用价值与完成标准

- 给需要读取ASCII DXF的MoonBit程序提供库接口。
- 用有尺寸的板件、负bulge和S形曲线等具体示例证明输入、处理和输出能形成可复现流程。
- 用解析几何、独立算法对照和跨后端测试检查结果；不把测试总数等同于标准兼容性。
- 把未支持实体和未覆盖语义显式报告，避免把“读取了”误解为“检查过”。

详细能力范围、单位约定和验证命令见 [README.md](README.md)。本项目采用Apache-2.0；第三方语料与参考关系见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
