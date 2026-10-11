# dxfkit

用 MoonBit 写的 DXF（CAD 图纸）工具链。回答一个问题：**这份图纸能不能上机床。**

> **项目状态**：开发中（2026-10 月）。库、命令行、网页三种形态都已落地：
> 解析器、图纸骨架、实体层、几何离散（曲线折线化、块展开）、
> **加工前检查**（轮廓闭合、自相交、重复切割、最小间隙、退化几何、
> 文字未转曲线）和 **SVG 预览**，197 个测试。
> 这里列的每一条都是已经能跑的。

## 为什么需要它

DXF 是 CAD 之间交换图纸的通用格式——机械制图、建筑设计、**激光切割、CNC 加工、
PCB 制板**都在用它。但**能打开图纸的软件多，能告诉你图纸能不能加工的少**：

- 轮廓没闭合，切完零件直接散架
- 同一段线画了两遍，激光会烧焦、铣刀会多切一刀
- 圆的半径是 0 或者负数，部分机床直接报错
- 图纸上还有没转成曲线的文字，机床不认字符串，那块字直接不切
- 两条轮廓靠得太近，中间那点材料扛不住激光的热、也扛不住铣刀的力

这些从预览图上看都不出来——图看着是好好的。

## 和 stlkit 的关系

这个项目和 [stlkit](https://github.com/mik1e80/stlkit) 是同一个思路的两个领域：

| | stlkit | dxfkit |
| --- | --- | --- |
| 问的问题 | 这个模型能不能 **3D 打印** | 这份图纸能不能**上机床** |
| 格式 | STL / OBJ / 3MF / PLY | DXF |
| 维度 | 三维网格 | 二维图纸 |
| 核心分析 | 水密性、非流形边、**壁厚** | 轮廓闭合性、自相交、**最小间隙** |

**上一版是往模型里面打射线量壁厚，这一版是在平面内量轮廓之间的净距**——
同一个思路，3D 投到 2D。

## 能做什么

```text
解析    ASCII DXF（R10–R2018 多版本规则、三种换行、坏行恢复）
        子类驱动的组码解释、未知 tag 保留；大文件可流式扫描
实体    18 种：LINE / CIRCLE / ARC / ELLIPSE / SPLINE / POINT、
        LWPOLYLINE / POLYLINE / TEXT / MTEXT / ATTRIB、INSERT（含嵌套块）、
        SOLID / HATCH / DIMENSION 等；认不出的保留原记录
几何    曲线折线化（bulge 圆弧、NURBS 样条，容差是弦高）、块展开
检查    加工前检查：轮廓闭合、自相交、重复切割、最小间隙、退化几何、文字未转曲线
预览    SVG 渲染
形态    库 + 命令行 + 网页
```

还没做的：二进制 DXF、写回文件、引用完整性校验。

## 用法

```bash
moon run cli check 图纸.dxf                 # 加工前检查（有致命问题退出码 1）
moon run cli check 图纸.dxf --min-gap 0.5   # 带最小净距阈值（单位同图纸）
moon run cli svg 图纸.dxf > 预览.svg         # 画出来看一眼
moon run cli stats 大图纸.dxf                # 流式统计，整份不进内存
```

网页版：打开 [`web/index.html`](web/index.html) 直接就能用（双击即可，
不用构建），或者在线版 <https://mik1e80.github.io/dxfkit/>。
把 DXF 拖进去，左边出预览、右边出检查报告；点「用内置样例试一下」
可以先看一张故意画坏的图纸长什么样。

网页产物是 `moon build --target js` 编出来的、提交进仓库的——
改了库代码记得跑一次 `bash web/build.sh` 重新生成。

## 文档

详细的实现说明在 [`README.mbt.md`](README.mbt.md)；
和成熟框架 `ezdxf` 的逐项对比在 [`COMPARISON.md`](COMPARISON.md)。

## 开发

仓库根目录就是 MoonBit 模块根：

```bash
moon test                              # 跑测试
moon check --target all --deny-warn    # 全目标检查，要求零警告
```

## 许可证

[Apache License 2.0](LICENSE)。

第三方内容的声明见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
