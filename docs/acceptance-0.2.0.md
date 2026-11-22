# 0.2.0 发布及验收证据

已发布模块为 `mik1e80/dxfkit@0.2.0`，固定于 [bb8d70a](https://github.com/mik1e80/dxfkit/commit/bb8d70ac166a7a60775ecb5d869e7f9913331d96)。已在干净检出执行 `node scripts/verify-reproduction.cjs --fresh`。本记录对应源码工程验证，正式赛事验收以主办方结果为准。

| 证据 | 结果 |
| --- | --- |
| Windows 干净检出 | 格式、公开接口快照、构建和全目标类型检查通过。Wasm 366 项、JS 349 项、Native 366 项、Wasm GC 349 项均通过。 |
| 源码独立消费工程 | Wasm 与 Native 各 9/9。新增用例用公开 API 验证 AC1009 原始记录、非默认 OCS 展开、阵列列号及 WCS 端点。 |
| 候选包 | 520 个条目。归档含项目许可、第三方声明、WHATWG 映射许可和公开接口快照。解包后独立消费 Wasm 与 Native 各 9/9。 |
| CLI、网页及案例 | 真实入口、资源防护、语料记录、模型与 R12 语义回归通过。同提交网页构建已生成。 |
| GitHub | [同提交完整 CI](https://github.com/mik1e80/dxfkit/actions/runs/45038388369)已通过。 |
| Mooncakes | [0.2.0](https://mooncakes.io/docs/mik1e80/dxfkit%400.2.0)已上线，注册表元数据及独立下载的包 SHA-256 与上传包一致。大小 2,205,401 字节，SHA-256 为 `0706136c15d2793ee3143cd8e4943e4764a7bc4b728bd453eca06bc1aeadede9`。 |
| 注册表独立消费工程 | Wasm 与 Native 各通过 9/9 项，依赖树确认从 Mooncakes 解析 `mik1e80/dxfkit@0.2.0`。 |

仓库的日常 CI 仍使用定向模式。手动完整验证另有网页部署开关，便于单独验证候选。复现需要 README 中的固定工具链和依赖。 [复现说明](reproducibility.md) · [发布流程](release-process.md)

可复用接口覆盖 ASCII R12 记录、坐标和阵列、已支持的轮廓与诊断。真实旧版 CAD 拟合网格的逐点一致性仍待验证，当前证据为解析案例和自建控制框。 [R12 兼容矩阵](r12-conformance-matrix.md) · [曲面证据](../examples/r12-semantics/README.md#旧版-cad-曲面的证据)
