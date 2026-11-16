# 资源限制及超限行为

以下为当前源码的默认值，不是压力测试证明的安全阈值。原始调用方Bytes已经分配，`ReadDocument.source`继续引用它；库预算不能撤回该分配，也不是操作系统内存沙箱。

| 阶段 | 当前默认值/控制入口 | 超限含义 |
| --- | --- | --- |
| 读取 | ReadLimits：64MiB输入，1MiB单行/字符串，100万tag，20万组码0记录，1000扫描警告 | 停止扫描，保留前缀与警告；TagStream.is_limited后调用方应停止读取 |
| 段分组与实体内部诊断 | 各阶段约1000条；本轮为单条多段线/样条和段分组补充早停 | 派生段或几何可能缺失；原始records/source仍可核对，不声明完整检查；阶段收尾可能另有少量诊断 |
| 展开 | ExpandLimits：1万placed、20万点、10万访问；固定8层路径限制 | 停止相应展开并诊断；不是仅按最终非空实体计数 |
| 几何检查 | GeometryBudget.max_candidates默认100万，共享于拓扑/相交/净距 | 候选预算耗尽为不完整；不是独立的三份各100万预算 |
| 文本与预览 | 语义标识256字符、文本65536字符；渲染20万点及65536文字字符 | 拒绝或限制派生表示；当前没有对外可配置的32MiB SVG字节预算 |
| Web源码 | 读入前16MiB、可终止Worker、15秒检查超时、取消/过期任务隔离 | 与CLI入口预算不同；历史Pages不自动获得当前源码的防护 |

ReadLimits可由`scan_tags_with_limits`、`read_document_with_limits`、`TagStream::with_limits`配置；非正读取预算会停止并告警。`Drawing::check_with_limits`配置展开预算，`check_with_budget`配置候选预算；它们是现有独立入口，不宣称已有统一的全阶段Budget API。诊断上限不是ReadLimits.max_warnings对所有后续阶段的全局配置。

strict只决定CLI退出策略，不能关闭底层资源限制。服务端处理不可信输入仍应在独立进程设置外部时间/内存限制。中间表示可以同时驻留；自定义增大预算、手工构造Drawing/TagScan应由调用方负责。数值域与漏洞报告见[SECURITY](../SECURITY.md)。
