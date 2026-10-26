# 独立 MoonBit 调用工程

本目录是 `example/dxfkit-consumer` 模块，有自己的 `moon.mod`、`moon.pkg` 和 `moon.work`。它通过依赖 `mik1e80/dxfkit` 调用公开 API，运行时直接读取 DXF 文件。应用代码只在 `main.mbt`，不导入库的 CLI、web 或测试包。

## 在检出的仓库中运行

先安装 MoonBit 工具链，命令行需能运行 `moon`。本例验证使用 moon 0.1.20260920、moonc v0.10.14；文件接口来自 `moonbitlang/x@0.5.5`，可运行目标为 Wasm 和 Native。Native 需要本机 C 编译环境；使用 Wasm 不需要 Node 或网页。

从 dxfkit 仓库根目录执行：

```sh
cd examples/consumer
moon update
moon check --target wasm --deny-warn
moon run . --target wasm --deny-warn -- fixtures/normal.dxf --strict
```

`moon.work` 的 `members = [".", "../.."]` 将本例和仓库中的库模块放入同一工作区，用于源码开发。`moon.mod` 中的 `mik1e80/dxfkit@0.1.1` 在该模式下由本地源码解析，不验证注册表安装；其他依赖首次使用仍需联网获取。该方式依据 [MoonBit 官方本地模块说明](https://tour.moonbitlang.com/basics/module-and-package/index.html#local-module-dependencies)。

## 通过 Mooncakes 使用

独立工程保留 `moon.mod`、`moon.pkg`、`main.mbt` 和 `fixtures/`，不复制 `moon.work`。模块依赖固定为 `mik1e80/dxfkit@0.1.1`，由 registry 解析，不引用本仓库源码。仓库根目录执行以下定向验证会自动复制出独立工程，并核对依赖树来源与八项用例：

```sh
moon update
node scripts/verify-consumer.cjs --registry
```

该命令需要已发布的固定版本及网络，不能用本地工作区的通过结果替代。

正常样例的关键输出：

```text
ENTITIES=1
ENTITY kind=CIRCLE handle=C1 layer=
CIRCLE center=10,20 radius=2
LOCAL_OUTLINE vertices=32 closed=true
LOCAL_FIRST=12,20
WORLD_OUTLINES=1
INCOMPLETE=false
```

后面是完整检查报告，致命和警告均为 0，进程退出 0。圆周离散点不重复首点，`closed=true` 由调用方连接末点与首点。

## 复制到仓库外作为新工程

只需复制本目录的三个配置文件、`main.mbt` 和 `fixtures/`。不要复制 `_build/`、`.mooncakes/`。例如 PowerShell，在任意工作目录执行（按实际位置替换库路径）：

```powershell
$dxfLibrary = (Resolve-Path 'C:/path/to/dxfkit').Path.Replace('\','/')
New-Item -ItemType Directory -Path './my-dxf-app' | Out-Null
Copy-Item "$dxfLibrary/examples/consumer/moon.mod", "$dxfLibrary/examples/consumer/moon.pkg", "$dxfLibrary/examples/consumer/main.mbt" -Destination './my-dxf-app'
Copy-Item "$dxfLibrary/examples/consumer/fixtures" -Destination './my-dxf-app/fixtures' -Recurse
('members = [".", "' + $dxfLibrary + '"]') | Set-Content './my-dxf-app/moon.work' -Encoding utf8
Set-Location './my-dxf-app'
moon update
moon run . --target wasm --deny-warn -- fixtures/normal.dxf --strict
```

Linux/macOS 可使用 `mkdir` / `cp` 复制相同文件，再手动创建 `moon.work`：

```text
members = [".", "/absolute/path/to/dxfkit"]
```

复制后本工程不需要位于库目录之内。`moon.mod` 中的应用名称可以修改；库路径只写在 `moon.work`，无需修改源码或复制库内部文件。

## 四步接口与错误处理

| 步骤 | 公开 API | 本例处理 |
| --- | --- | --- |
| 读取 | `scan_tags(Bytes)` → `build_drawing(TagScan)` | 文件读成字节；扫描诊断随 Drawing 保留 |
| 实体提取 | `Drawing::entities()`、`Entity.common`、`Entity.geom` | 输出类型、句柄、图层；模式匹配 Circle 得到圆心和半径 |
| 离散 | `Geometry::flatten_checked(tol)`、`Drawing::expand(tol)` | 匹配 `Result` 并处理失败，消费 Outline 点坐标；展开提供整图的块变换结果和警告 |
| 检查 | `Drawing::check(CheckOptions)`、`Report::has_incomplete_checks()` | 输出所有发现；应用自行决定警告和不完整是否导致退出失败 |

直接对 Geometry 离散得到实体自身坐标，不会替你展开 INSERT 或转换 OCS。本例只对默认 OCS 的核心几何调用直接离散，整图使用 `Drawing::expand()`；它的输出也必须结合警告与报告判断覆盖。`Flat::Empty` 不能当作检查成功。

固定 `tol=0.01`、`min_gap=0.0`（关闭净距检查），沿用图纸原单位，不自动转换为毫米。库支持范围和资源上限见[接口边界](../../README.mbt.md)。

## 不完整输入与失败用例

仍在本工程目录执行：

```sh
moon run . --target wasm -- fixtures/incomplete.dxf
moon run . --target wasm -- fixtures/incomplete.dxf --strict
moon run . --target wasm -- fixtures/discretization-error.dxf --strict
moon run . --target wasm -- fixtures/does-not-exist.dxf
```

| 输入 | 预期输出 | 退出码 |
| --- | --- | --- |
| normal + strict | 圆心 (10,20)、半径 2、32 个离散点；完整性 false | 0 |
| incomplete 普通模式 | 保留正常圆；未知 RAY 诊断；`INCOMPLETE=true`、检查不完整 | 0 |
| incomplete + strict | 同样保留全部诊断和正常圆 | 1 |
| discretization-error + strict | `DISCRETIZATION_ERROR` 说明超过 4096 段；报告检查不完整 | 1 |
| 文件不存在 | `READ_ERROR` | 2 |
| solid + strict | Entity::flatten_checked 输出 4 点闭合边界、WORLD_OUTLINES=1、INCOMPLETE=false | 0 |
| 没有参数或参数格式错误 | Usage | 2 |

本例普通模式只因严重问题退出 1；strict 下，警告或不完整也退出 1。退出 0 不构成可加工证明。

在已配置 C 编译环境的机器上，将上述 `--target wasm` 换为 `--target native` 即可；代码和输入不变。

## 外部工程自动验收

从 dxfkit 仓库根目录执行（需要 Node.js 18+）：

```sh
node scripts/verify-consumer.cjs
node scripts/verify-consumer.cjs --target native
```

脚本将本工程复制到系统临时目录，配置本地库成员，真实执行编译检查和七次程序调用（共 8 项），新增 SOLID 的实体入口调用。它不调用网页或库 CLI，不复制库内部实现；CI 在 Wasm 和 Native 上执行相同验收。机器记录见 [Wasm](../../docs/consumer-wasm-results.json) 和 [Native](../../docs/consumer-native-results.json)。这些记录对应本次本地工具链，不能替代其他环境的实际运行。
