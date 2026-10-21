# DXF 测试语料

这 47 个 `.dxf` 文件取自 [mozman/ezdxf](https://github.com/mozman/ezdxf) 的
`examples_dxf/` 目录，首次收录说明为原样引入。本轮保留现有全部 DXF 字节，逐文件 SHA-256 见[验证记录](../../docs/corpus-validation.json)。

本仓库首次收录提交为 `6f5d18250170d52921e9cc35cee583c045355ab5`；当时未记录上游提交号。当前 master 路径仅用于来源引用，不作为与上游逐字节一致的证明。

**许可证**：MIT（Copyright © 2020, Manfred Moitzi）。完整文本见仓库根目录的
[`THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md)。

## 为什么要拿真实文件

自己造的测试数据干净、规整，测不出真实世界的问题。这批文件里有：

- **前导空白**——`circle_radius_le_0.dxf` 有 1124/3016 行是缩进的，而
  `Minimal_DXF_AC1021.dxf` 一行都没有。不 trim 就整份读不出来
- **三个年代**——AC1006（R10）、AC1009（R12）、AC1021（R2007）到 AC1032（R2018）。
  老版本没有 `100` 子类标记，结构完全不同
- **退化几何**——半径 0 和 -1 的圆
- **块与属性、嵌套块、填充、视口、冻结图层、外部参照裁剪**……
- **编码陷阱**——`circle_radius_le_0.dxf` 是 AC1027，却声明着已失效的
  `ANSI_1252`，而文件实际是 UTF-8

## 怎么跑

```bash
moon run conformance                 # 全部跑一遍，出报告
moon run conformance 某文件.dxf       # 只跑一个
moon test                            # 回归测试（遍历式，新增文件自动进测试）
moon run conformance -- --audit       # 读取/解码/覆盖诊断，JSON Lines
node scripts/verify-corpus-records.cjs # 重放实际测试并核对逐文件记录
```

## 几个文件专门是干什么的

| 文件 | 拿来验什么 |
| --- | --- |
| `Minimal_DXF_AC1006/1009/1021.dxf` | 三个年代的完整结构；1009 那个只有 35 字节、连 HEADER 段都没有 |
| `circle_radius_le_0.dxf` | **前导空白**（trim）+ **退化几何**（半径 0 和 -1） |
| `3dface.dxf` | 三维面、大量 OBJECTS 段的样式对象 |
| `multi_insert_with_attribs.dxf` | 块引用 + 属性 + 老式 POLYLINE（`POLYLINE/VERTEX/SEQEND` 三条记录一组） |
| `text_*.dxf`（10 个） | 文字对齐、字体、镜像、倾斜、堆叠分数、负挤出方向 |
| `hatches_*.dxf`、`hatch_*.dxf`（6 个） | 填充边界与岛屿 |
| `dimension_in_block.dxf`、`dimension_in_nested_blocks.dxf` | 嵌套块的变换展开 |
| `xclip.dxf` | 外部参照裁剪（只记路径，不跟进加载） |
| `viewport_frozen_layers.dxf` | 视口与冻结图层 |
| `uncommon.dxf` | 少见的记录类型 |

## 分层验证记录

完整[逐文件案例表](../../docs/corpus-validation.md)区分读取成功、实体字段输出、几何独立验证及未覆盖部分，列出每张图纸实际参与的测试。JSON 保留来源、文件哈希、编码、实体类型、展开诊断和完整检查发现。

47 张图纸均读取成功；顶层实体输出 5524，其中 5404 个有解码字段，但不等于所有字段和几何均被验证。46 份检查报告为“检查不完整”。**当前没有逐图纸的独立几何真值：0/47。** 原有离散、展开及检查汇总锚点不应写成“几何兼容通过”。

## 扫描层历史锚点

`moon run conformance` 的输出：

```text
47 个文件，共 339913 个 tag，0 条警告，0 个读不了
```

每个文件的 tag 数、警告数、判定出来的编码都会打在报告里，改了解析器之后
跑一遍就能看出有没有文件被动坏。

语料里的数字同时也是**锚点**——`circle_radius_le_0.dxf` 的 1508 个 tag
写进了回归测试，不是「跑得过就算数」。
