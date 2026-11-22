# 发布和版本验证

日常维护按受影响入口验证。纯说明更新检查链接及版本事实。解析或几何修改重放相关单元、原始语料和实际调用。语料机器记录带源码指纹，修改后用 `node scripts/verify-corpus-records.cjs --write` 重放并审阅差异。发现观察变化时，先核对输入、预期和原因，再更新记录。

发布候选从干净提交开始。核对 CHANGELOG、README、接口快照、能力矩阵和许可证，运行与承诺对应的验收。需要仓库完整验收时使用 GitHub Actions 的手动 `validation=full` 入口或在干净检出运行 `node scripts/verify-reproduction.cjs --fresh`。Pages 部署单独使用 `deploy_pages` 选项，由该次完整验证成功后触发。以对应源码 SHA 和该次结果记录候选身份。历史 r2、已发布 0.1.1 与当前开发源码分别引用各自的证据。

候选打包使用 `moon package`，使用 `moon package --list` 检查清单。核对项目 LICENSE、第三方声明、WHATWG 映射原许可、分发内容及包中公开 API。通过预检的压缩包可以在隔离工作区核对。实际发布后，从注册表下载该版本并在独立消费工程验证依赖版本和来源。`node scripts/verify-consumer.cjs --r12 --library <解包目录>` 从候选包验证当前 API。实际发布后运行 `node scripts/verify-consumer.cjs --registry --r12`，确认依赖解析到当前候选版本并重放 AC1009 读取、OCS 转换、阵列来源与坐标断言。已有 `--registry` 模式继续验证已公开的兼容版本。

网页打包应附带对应源码 SHA、验证身份、MoonBit Core 许可及 WHATWG 许可。晚于历史标签的工作使用新发布身份，已有链接仍指向原证据。安全问题与相关范围见[安全政策](../SECURITY.md)。
