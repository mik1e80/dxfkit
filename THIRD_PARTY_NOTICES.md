# 第三方内容声明

本项目自己的代码是 Apache-2.0（见 [LICENSE](LICENSE)）。下面这些内容来自别处，
按各自的许可证使用。

---

## 1. DXF 测试语料

**位置**：`testdata/ezdxf/`（47 个 `.dxf` 文件）

**来源**：[mozman/ezdxf](https://github.com/mozman/ezdxf) 的 `examples_dxf/` 目录。
收录的是原文件，未做任何修改。

**用途**：真实文件回归测试。自己造的测试数据干净规整，测不出真实世界的问题——
前导空白、三种换行、老版本的格式差异、退化的几何、第三方导出器的怪写法，
这些都只有真实文件才覆盖得到。

**许可证**：MIT。完整文本见下。

```
MIT License

Copyright (c) 2020 Manfred Moitzi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 2. ezdxf（设计参考，未使用代码）

**来源**：[ezdxf](https://ezdxf.mozman.at/) —— Python 的 DXF 读写框架，MIT 许可证
（文本同上）。

**使用方式**：**只参考了 API 设计与能力范围，没有复制任何代码。**
本项目是 MoonBit 实现，语言、数据结构、算法实现都与它不同。

具体参考了这些地方（列出来是为了如实说明设计来源）：

- 能力清单（读写哪些版本、ASCII 与二进制、未知 tag 保留、流式遍历）——
  用来确定本项目该覆盖什么
- 组码 → 数据类型的区间划分（二进制格式要用），照 `lldxf/types.py` 核对
- 二进制 DXF 的字节布局（22 字节魔数、两种组码编码、各类型的字节数），
  照 `lldxf/tagger.py` 核对
- **bulge（凸度）→ 圆弧的换算公式**，照 `math/bulge.py` 移植成
  MoonBit（`flatten.mbt`）。那个文件的公式源头是 Lee Mac 的
  Bulge to Arc 推导；移植时逐行核对过。换算公式本身是数学事实，
  这里照实说明出处
- 样条权重的组码与加载顺序，照 `entities/spline.py` 的
  `load_spline_data` 核对（组码是格式规范的一部分，核对是为了不出错）

另外，NURBS 求值用的是 de Boor 算法（The NURBS Book 的 A3.1 式）——
教科书算法，没有复制任何代码。

因为它没有代码进入本项目，MIT 许可证的条款不触发。

---

## 3. 依赖

**库本体（仓库根包）只用 MoonBit 自带的核心库**（`moonbitlang/core`），
没有任何第三方依赖。这一点是刻意的——三端都能跑，网页版才能是同一份代码
编译出来的。

| 依赖 | 用途 | 用在哪 | 许可证 |
| --- | --- | --- | --- |
| `moonbitlang/x` | 读文件（`fs`）；命令行退出码（`sys`） | **只有 `conformance/` 和 `cli/` 两个子包**，库本体和网页版都不碰 | Apache-2.0 |
| `moonbitlang/async` | 分块读文件（`fs` 的 `read_at`，`moonbitlang/x/fs` 只能一次读完） | **只有 `cli/` 子包**（`stats` 命令） | Apache-2.0 |
