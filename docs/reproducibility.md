# 从指定提交复现交付版本

固定 r2（94509f3）已通过手动 `validation=full` 的[CI #26 及同提交部署](https://github.com/mik1e80/dxfkit/actions/runs/39761104538)，标签已创建。普通 main push 默认运行针对性流程 `verify-advisor.cjs`；targeted 与 full 的记录各自标明 profile，不互相冒充。后续 main 另增加[格式/API 维护门禁](public-api-review.md)，在依赖获取后执行 `moon fmt --check` 与 `moon info` 并比较快照；独立维护 CI 不构建或部署站点，这项新增流程不追加入旧 r2 标签。

交付版本使用固定标签 `submission-0.1.1-20261022-r2`。标签所指提交是本次库、CLI、测试、网页构建、申报说明与生态对比的共同源码；不以可变的 main 或在线页面当前内容替代提交身份。模块版本仍为 0.1.1，未发布 Mooncakes。此前的 `delivery-0.1.1-20261021`、`delivery-0.1.1-20261022`、`delivery-0.1.1-20261022-ellipse` 和 `delivery-0.1.1-20261022-review` 及 `delivery-0.1.1-20261022-evidence`（679f81a）保留原提交，不移动或覆盖；旧 `submission-0.1.1-20261022`（f233ddc）也保留原 SHA。

## 固定工具与依赖

配置文件：[reproduction.json](../reproduction.json)。

| 项目 | 固定/支持值 |
| --- | --- |
| MoonBit 官方发行包 | `0.10.14+7d59c7ec9` |
| moon / moonrun | `0.1.20260920` |
| moonc | `v0.10.14+7d59c7ec9` |
| Node.js | 22 或更新版本；本次本地和 CI 使用 24.19.0 |
| moonbitlang/x | 0.5.5 |
| moonbitlang/async | 0.22.1 |
| CI | Ubuntu 24.04，C 编译环境由 runner 提供 |

Native 目标需要 C 编译器：Windows 使用 Visual Studio Build Tools 的 C++ 工具，Linux 使用 GCC/Clang。Git 和 Node 必须在 PATH。复现脚本校验实际工具链和 `moon tree --json` 的依赖版本，版本不符时明确失败，不静默切换 latest。

Linux/macOS 安装固定版本（官方安装器的版本参数是 **moonc 发行包版本**，不是 moon 日期版本）：

```sh
curl -fsSL https://cli.moonbitlang.com/install/unix.sh | bash -s -- '0.10.14+7d59c7ec9'
export PATH="$HOME/.moon/bin:$PATH"
```

Windows PowerShell：

```powershell
$env:MOONBIT_INSTALL_VERSION = '0.10.14+7d59c7ec9'
Invoke-RestMethod https://cli.moonbitlang.com/install/powershell.ps1 | Invoke-Expression
$env:PATH = "$HOME/.moon/bin;" + $env:PATH
```

安装器及分平台归档来自 [MoonBit 官方下载服务](https://www.moonbitlang.com/download/)。本次独立下载的 Windows x86_64 编译器 ZIP 的 SHA-256 为 `faae225a8287d0ce69e44b5b3f754af988e97f4446056d8f32ceb3ddb998fce7`，core ZIP 为 `63e5b99991ac8fd49556b1e17bdcbdc662d797000250dd11ef090f38a2175e84`。首次获取工具链和依赖需要网络。

## 干净检出后一条命令复现

以下命令在 PowerShell、Bash 均可执行。使用尚不存在的目录：

```sh
git clone --branch submission-0.1.1-20261022-r2 --depth 1 https://github.com/mik1e80/dxfkit.git dxfkit-delivery
cd dxfkit-delivery
git rev-parse HEAD
node scripts/environment.cjs
node scripts/verify-reproduction.cjs --fresh
```

`--fresh` 要求检出目录没有 `_build/`、`.mooncakes/`，并要求源码干净。它不删除用户缓存或文件。CI 不恢复依赖缓存；本地本轮验证另从官方归档建立隔离工具链与空 registry，没有复制原项目的依赖、编译输出或用户凭据。

复现脚本依次执行：依赖获取及版本核对、全目标检查、构建、Wasm/JS/Native/Wasm-GC 测试、语料记录复核、故障检出验证、真实 CLI 回归、Wasm/Native 独立工程调用、10 个再申报证据案例及解析误差/保存输出复核、网页重建和行为断言，最后打包 `_site/`。任何一步失败都会使进程失败，验证记录为 `passed:false`。

最终发布将代码、README、PDF、模型及证据放在同一提交；CI 与 Pages 全部成功后仅建立一个最终申报标签 `submission-0.1.1-20261022-r2`。标签解析出的 SHA 与 release.json、verification.json、model-validation-verification.json 对应，不在 PDF 中写入自引用提交哈希。

成功后的输出：

- `_build/model-validation.json`：10 个模型的实际源提交、dirty 状态、工具版本和断言结果；部署副本为 `model-validation-verification.json`。
- `_build/reproduction.json`：实际提交、工具版本、依赖及各步退出码。
- `_build/submission-evidence.json`：当前提交、dirty 状态和工具版本，以及 10 个真实 CLI 案例、诊断和解析误差；与仓库静态基线记录的身份分开标识。
- `web/dist/release.json`：同一提交、模块版本、工具链、网页资产、申报说明、生态对比与来源，以及追加审查说明和修复前/后记录的 SHA-256。
- `_site/`：已验证的站点，含 `dist/release.json`、`verification.json` 和该提交的公开文档副本，包括申报说明、生态对比、追加审查及机器记录，以及再申报索引、分层矩阵、响应表、独立对照和 `docs/submission-evidence/` 全部保存的报告/SVG/JSON。新增材料同样写入 release.json 的哈希清单。

已有依赖的目录可不加 `--fresh` 重跑。开发时允许未提交改动须显式加 `--allow-dirty`；这类报告会记录 `source_dirty:true`，不能当作干净交付结果。

## 单独运行 CLI 和网页

全流程成功后，可在同一检出目录执行：

```sh
moon run cli check examples/plate.dxf --min-gap 0.5 --strict
moon run cli svg examples/plate.dxf
moon run cli stats testdata/ezdxf/circle_radius_le_0.dxf
node scripts/build-web.cjs
node web/smoke.cjs
```

网页构建使用 Node，可直接在 Windows PowerShell 执行，不要求 Git Bash。旧 `bash web/build.sh` 作为同一 Node 构建器的兼容包装保留。网页只需静态托管 `_site/`；本地直接打开 `web/index.html` 也可用，提交身份以构建生成的 release.json 为准。

## CI、Pages 与申报版本如何对应

同一个 [CI 工作流](../.github/workflows/ci.yml) 根据 validation profile 执行针对性验证或完整复现：普通 main push 默认 targeted-advisor；最终申报 r2 须手动选择 full。只有所选验证成功后才上传该提交的 `_site/`。Pages 部署任务通过 `needs: ci` 等待成功，使用同一工作流已上传的站点，不再独立检出或重编译。验证失败时，部署不会执行。

在线站点的 `dist/release.json`、`verification.json` 中的提交必须等于本次交付固定标签解析出的 SHA；release.json 中的申报说明、生态对比和来源记录哈希也必须等于该提交中的对应文件。提交、模块版本、资产哈希和完整验证结果因此能关联起来；打包脚本会拒绝混用另一提交的结果。标签保留历史版本，在线站点会随后续 main 的成功部署更新，核对历史交付应使用该标签和对应 CI 记录。

之前提交 `175d96a` 的[CI](https://github.com/mik1e80/dxfkit/actions/runs/39614185702) 在语料快照比较失败，而独立 Pages 已部署。干净克隆定位到 `images.dxf`、`text.dxf`、`text_negative_extrusion.dxf` 的本地 CRLF 副本与提交中的 LF 字节不一致。本修订从指定提交重建其大小和哈希记录，未改动 47 个已提交 DXF 的内容；本地旧 CRLF 副本另行保留为备份。比较仍严格检查全部数值、结构、分类和哈希，只增加差异字段定位，不放宽判定。

## 验证边界

本地 Windows 干净下载验证与 GitHub Ubuntu CI 分别提供证据，不互相替代。固定工具链及依赖用于功能复现，不宣称不同操作系统生成的字节逐一相同；每次实际产物以自己的哈希标识。第三方图纸的独立几何真值仍为 0/47，复现成功不提升其几何覆盖等级。
