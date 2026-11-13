# 第三方内容声明

本项目自己的代码是 Apache-2.0（见 [LICENSE](LICENSE)）。下面这些内容来自别处，
按各自的许可证使用。

项目Apache-2.0不将第三方语料或代码重新授权。来源按实际用途区分：第1节为测试语料，第2节为格式/公式与实现移植参考，第3节为构建/运行依赖；浏览器携带的core代码另带上游LICENSE和NOTICE。`tag.mbt`类型区间与`flatten.mbt`的bulge移植保留ezdxf来源及MIT全文，不笼统宣称全部算法独立原创。新增材料应固定上游提交、路径、blob、日期与本地哈希；历史47份文件的上游提交未知，不猜测补写。

维护门禁将浏览器分发的core LICENSE/NOTICE与固定编译器SDK实际文件按LF规范化后比较，变更工具链须重新核对。x/async的固定版本及来源由`reproduction.json`与依赖图核对；这不是全面供应链/CVE安全审计。贡献与授权规则见[CONTRIBUTING](CONTRIBUTING.md)。

---

## 1. DXF 测试语料

[逐文件来源及许可清单](testdata/ezdxf/MANIFEST.json)记录47个原始文件的本地SHA-256、来源路径、MIT和首次导入日期；未知的历史上游commit/blob保持null。六个自建AC1009模型另见[专用许可](examples/r12-validation/LICENSE.md)及[来源清单](examples/r12-validation/provenance.json)，不混用第三方MIT身份。

**位置**：`testdata/ezdxf/`（47 个 `.dxf` 文件）

**来源**：[mozman/ezdxf](https://github.com/mozman/ezdxf) 的 `examples_dxf/` 目录。
收录的是原文件，未做任何修改。

本轮保留现有语料字节，逐文件来源路径、大小、SHA-256 及实际验证层次见[第三方图纸案例表](docs/corpus-validation.md)。本仓库首次收录提交为 6f5d18250170d52921e9cc35cee583c045355ab5；未记录上游提交号，来源 master 链接不构成当前上游字节一致性证明。

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

## 2. ezdxf（API、格式资料与公式参考）

**来源**：[ezdxf](https://ezdxf.mozman.at/) —— Python 的 DXF 读写框架，MIT 许可证
（文本同上）。

**使用方式**：项目记录了 API、格式资料和 bulge 换算公式的参考关系。
下列资料不作为原创算法声明；本项目采用 MoonBit 实现。

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

本次样条离散采用标准的 Boehm 节点插入与 de Casteljau 细分。
原有 de Boor 求值保留在测试中，作为不同算法路径的误差对照。

ezdxf 的版权与完整 MIT 条款已在上一节保留，随项目分发。

---

## 3. 依赖

**库本体（仓库根包）只用 MoonBit 自带的核心库**（`moonbitlang/core`），
没有任何第三方依赖。这一点是刻意的——三端都能跑，网页版才能是同一份代码
编译出来的。

| 依赖 | 用途 | 用在哪 | 许可证 |
| --- | --- | --- | --- |
| `moonbitlang/x` | 读文件（`fs`）；命令行退出码（`sys`） | `conformance/`、`cli/` 及独立 `examples/consumer/` 工程；库本体和网页版不使用 | Apache-2.0 |
| `moonbitlang/async` | 分块读文件及可选验证脚本的文件/子进程接口 | `cli/` 的 `stats` 与 `.mbtx` 开发脚本；核心库不使用 | Apache-2.0 |


## 浏览器分发补充

网页包含 MoonBit core 编译代码；完整上游许可及附带声明保存在 web/licenses/moonbit-core.LICENSE 和 web/licenses/moonbit-core.NOTICE，构建时随站点复制，保留其中第三方来源及免责声明。网页界面和示例模型由本项目编写。
