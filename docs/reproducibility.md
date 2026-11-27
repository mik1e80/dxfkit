# 从指定提交复现

## 固定发布源

11 月验收请按实际仓库快照的提交复现。当前 `main` 固定 MoonBit 1.0 RC1，项目说明和一页 PDF 所列的 0.2.1 发布证据仍对应 `e07ec17`。`reproduction.json`的`submission_ref=main`是分支定位，精确身份必须使用GitHub提交SHA，并核对同提交CI中的`source_commit`；不能只说“最新版本”。当前交付使用 [v0.2.1](https://github.com/mik1e80/dxfkit/tree/v0.2.1)，定向结果见[八月黑客松验收记录](acceptance-0.2.1.md)。0.2.0 发布源为 `bb8d70a`，本地和 GitHub 完整验证见[验收记录](acceptance-0.2.0.md)。

| 项目 | 固定值 |
| --- | --- |
| MoonBit发行包 | `1.0.0-rc1+3c0520448` |
| moon/moonrun | `0.1.20261126` |
| moonc | `v1.0.0-rc1+3c0520448` |
| Node | CI为`24.19.0`；脚本要求22及以上 |
| CLI依赖 | `moonbitlang/x@0.5.5`、`moonbitlang/async@0.22.1` |
| 核心库 | 仅MoonBit core |

在 Linux 或 macOS 可运行 `curl -fsSL https://cli.moonbitlang.com/install/unix.sh | bash -s -- 1.0.0-rc1+3c0520448`。在 Windows 使用[官方安装脚本](https://www.moonbitlang.com/download)，执行前设置 `$env:MOONBIT_INSTALL_VERSION = "1.0.0-rc1+3c0520448"`。安装后以 `moon version --all` 核对版本。独立`.mbtx`开发脚本可使用较新脚本运行器，但内部项目验证明确调用固定SDK，不混用编译器与core。

首次干净检出并切换到所需SHA后运行：

```sh
git clone https://github.com/mik1e80/dxfkit.git
cd dxfkit
git checkout <提交SHA>
node scripts/verify-advisor.cjs --fresh
```

`--fresh`要求没有`_build`和`.mooncakes`，随后获取固定依赖。已有工作目录可不加`--fresh`；只在明确允许未提交源码参与本地验证时加`--allow-dirty`。不删除用户已有目录来满足fresh条件。

## 定向验证检查什么

- 格式、`moon info`公开API快照、依赖版本及各后端类型检查。
- R12记录/结构、WCS与阵列、端点接触和真实交叉、相关几何与完整性库测试。
- 语料包的14项回归及47文件观察记录，包括两个曾失败的G1/C0；不运行整仓库测试。
- 第三方阵列解析坐标、14项既有输入边界、五文件字段对照、十类参数模型、十个真实CLI场景。
- 同提交网页构建、网页必要回归和静态站点打包；默认CI不部署。

输出`_build/reproduction.json`包含`passed`、`validation_profile=targeted-r12`、`full_suite_run=false`、源码SHA、脏状态、工具链和执行步骤。`web/dist/release.json`记录同一源码身份及分发资产哈希；两者profile必须一致。模型/CLI侧边记录分别在`_build/model-validation.json`、`_build/submission-evidence.json`，只证明列明范围。

## 可单独运行的必要回归

```sh
moon test checker_array_contacts_wbtest.mbt r12_structure_test.mbt --target wasm --deny-warn
moon test conformance --filter '*语料块展开*' --target wasm --deny-warn
moon test conformance --filter '*语料加工检查*' --target wasm --deny-warn
moon run examples/r12-validation/external
```

[六模型记录器](../scripts/record-r12-validation.mbtx)及[外部审计记录器](../scripts/record-external-validation.mbtx)是可选开发工具；后者需Python和ezdxf1.4.4，不属于库的运行依赖。详见[模型说明](../examples/r12-validation/README.md)与[外部案例](../examples/r12-validation/EXTERNAL.md)。

## 版本不可混用

| 身份 | 对应范围 |
| --- | --- |
| 0.2.1／`v0.2.1` | BricsCAD 拟合网格修复、Mooncakes 包、Pages 部署及原工具链的同源码验证见[验收记录](acceptance-0.2.1.md) |
| 已发布 0.2.0／`bb8d70a` | 新R12结构和坐标能力，日常使用当前提交的定向证据；固定候选的完整结果见[验收记录](acceptance-0.2.0.md) |
| Mooncakes0.1.1／源`dc3acc8` | [已发布包及registry验证](mooncakes-0.1.1.md)，不含新R12 API |
| `submission-0.1.1-20261022-r2`／`94509f3` | [完整CI #26及同提交Pages](https://github.com/mik1e80/dxfkit/actions/runs/39761104538)；固定历史结果与旧演示，不移动 |

只有明确需要最终完整验收时，才手动选择CI的`validation=full`或在新的干净检出执行`node scripts/verify-reproduction.cjs --fresh`。它会运行各目标完整测试、含 R12 接口的独立消费工程及额外回归，工作量大于日常定向检查。完整验收结果以候选提交实际生成的机器记录为准。Pages 部署在 GitHub 上由手动 `deploy_pages` 选项控制。
