name = "mik1e80/dxfkit"

version = "0.1.0"

readme = "README.mbt.md"

repository = "https://github.com/mik1e80/dxfkit"

license = "Apache-2.0"

keywords = [ "dxf", "cad", "laser-cutting", "cnc", "drawing", "parser", "moonbit" ]

description = "MoonBit 实现的 DXF（CAD 图纸）工具链：解析、校验、几何求值、加工前检查"

// **库本体（仓库根包）只用 MoonBit 自带的核心库，零第三方依赖。**
//
// 这一点和 stlkit 一样是刻意的：解析和几何求值都是纯算法，不需要外部库。
// 好处是 native / wasm / js 后端都能跑，没有 FFI 也没有 JS 依赖——
// 网页版才能是「同一份代码编译成的 JS」而不是重写一遍。
//
// 下面这些依赖**只有子包用**（conformance 读语料、cli 读文件和
// 分块流式读大文件）。库本体不碰它们，所以上面那条约束仍然成立。

import {
  "moonbitlang/x@0.5.5",
  "moonbitlang/async@0.22.1",
}
