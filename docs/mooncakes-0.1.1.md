# Mooncakes 0.1.1 发布记录

日期：2026-10-26。模块 [`mik1e80/dxfkit@0.1.1`](https://mooncakes.io/docs/mik1e80/dxfkit) 已正式发布；Mooncakes 返回 `200 OK`，随后 `moon view mik1e80/dxfkit@0.1.1 --json` 返回 success，版本非 yanked。

- 发布源提交：[dc3acc8ed4fc68242728214e0575c098a893c8cb](https://github.com/mik1e80/dxfkit/commit/dc3acc8ed4fc68242728214e0575c098a893c8cb)。实际发布前确认 main 为该提交、工作区干净、登录账号为 mik1e80。
- 包大小：1,819,443 字节。
- 上传包 SHA-256：`f13c7213b4a801d73de579a920b8ebacd9a6e7ca6c89032a2d69faf3e66d3d43`；注册表 metadata.checksum 与之相同。
- 许可：Apache-2.0；包保留 LICENSE、第三方语料/公式引用声明与浏览器 core 许可文件，未包含 `.git`、凭据或依赖/构建缓存。
- 核心库公开 API 与发布准备前一致。发布准备增加 registry 安装说明及消费验证模式，没有新增库算法。

## 安装及独立使用

```sh
moon add mik1e80/dxfkit@0.1.1
```

包导入名为 `mik1e80/dxfkit`。示例见[独立调用工程](../examples/consumer/README.md)；registry 模式只复制应用和 fixtures，不复制 `moon.work`，也不复制库内部源码。

发布后应先 `moon update` 刷新索引；旧索引可能尚不包含新版本。随后运行：

```sh
node scripts/verify-consumer.cjs --registry
```

## 本次验证与版本边界

发布前已通过格式/API 门禁、本地独立消费工程 8 项、文档检查；`moon package` 预打包及发布命令对原目录和解压后的包均实际执行 `moon check` 并通过。没有依靠全量测试或把 `moon publish --dry-run` 当作只读打包命令；本次 CLI 的该开关仍会访问发布接口，本地预检采用 `moon package`。

发布后 registry 消费 **8/8 通过（Wasm）**：实际下载 `mik1e80/dxfkit@0.1.1` 后，验证外部编译、读取/字段提取/checked 离散、普通与 strict 的不完整报告、离散失败、读文件失败、参数错误和 SOLID 实体边界。依赖树确认来源为 `registry`、版本为 0.1.1；临时工程没有 `moon.work`，不使用本地源码替换。未执行 Native registry 验证。

[机器记录](mooncakes-0.1.1.json)保存全部命令输出、退出码、依赖来源及成功断言；另从官方公开下载地址完整下载包并再次核对 SHA-256。首次旧索引不含新版本、下载连接超时均已在刷新/重试后排除，记录中的通过结果来自最终实际运行。

旧 `submission-0.1.1-20261022-r2` 保留在 `94509f3`，对应其完整 CI #26 和 Pages。此次 Mooncakes 包发布自更晚的 `dc3acc8`，包含后续格式/API 与示例材料；本次只做发布所需的轻量验证，没有新的全量 CI 或网页部署。后续 main 的发布状态文字更新也不会改变已上传的 0.1.1 包或旧标签。
