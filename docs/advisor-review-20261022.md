# a5d747f 顾问方案整改记录（历史）

此页保存 a5d747f 阶段的 targeted 验证；当前 r2 的次数修复、更新 PDF 和最终 full 版本收敛见 [r2 记录](r2-submission-20261022.md)。

本轮仅依据参赛者引用对话中**最近一次针对 `f233ddc` 的源码审查**实施，没有重新执行更早对话的范围变更。基线是 `f233ddc6c08ffec43e4ef8abfdf4d1cad8f4092e`。旧申报标签 `submission-0.1.1-20261022` 保持原提交；本轮 main 是后续修订，不移动旧标签、不声称旧标签已经包含这些修正。原一页 PDF 是该历史申报标签的材料，当前增量整改以本页为准。

## 先复现，再修复

先新增 5 个最小语义测试，在未修改生产算法时实际执行，**0/5 通过，5 个实际断言失败**：闭合/周期样条产生了轮廓；部分权重仍为 Spline；缺 ENDBLK 吞并下一块导致 1≠2；轴比 1.2 未拒绝；非零宽度未报告不完整。修复后 5/5 通过，另补普通 POLYLINE、段末恢复、图层兼容 API、全局预算和共享分析等测试，新增文件最终 11/11 通过。

| 方案项目 | 实施结果 | 验证 |
| --- | --- | --- |
| P0：SPLINE closed/periodic | 检测组码 70 的位 1/2，保留实体/记录，返回 Unknown，明确报告不完整；不误报普通开放轮廓 | flags=1/2/3；严格 CLI 退出 1，SVG 无该轮廓，不出现闭合告警 |
| P0：部分权重 | 完全未写 41 才补全 1；非空权重长度必须等于控制点数，少/多均拒绝 | 部分/额外权重拒绝；无权重和完整正权重控制通过 |
| P0：缺 ENDBLK | 段末或下一 BLOCK 前恢复并警告；不把下一块吞入前块 | 段末恢复、相邻块恢复；仍可预览已恢复圆，报告不完整 |
| P1：图层 API | 新增 `is_enabled_for_checks()`，内部筛选及 SVG 淡画统一使用；`is_machinable()` 保留为兼容别名并收窄注释 | 启用/关闭/冻结/锁定四种状态；不推断 CAM 或机床行为 |
| P1：ELLIPSE 轴比 | checked 入口拒绝非有限、≤0、>1 的轴比，不自动交换长短轴或改参数 | 0/-1/1.2 拒绝，1 为有效边界 |
| P1：多段线宽度/厚度 | LW 43/40/41/39，普通 PL 默认 40/41/39 及 VERTEX 40/41 非零时明确仅中心线被检查 | 仍输出中心线并报告不完整；显式零值不误报；strict 失败 |
| P2：全局预算 | `ExpandLimits` / `expand_with_limits` / `check_with_limits`，限制放置实体、点数及访问次数；默认 10000 / 200000 / 100000 | 60 个圆最多放置 50；点预算 2 拒绝首个圆；空块扇出也被访问预算截断 |
| P2：网页重复解析 | `Drawing::analyze()` 复用一个 Expansion 生成报告/SVG；网页只调用一次 `analyze(base64,min_gap,tol)` | 与旧分开接口输出比较；网页测试禁止调用旧多解析路径，兼容导出保留 |
| 独立实现对照 | 实跑 ezdxf 1.4.4，对已有 5 个外部 DXF 比较 67 条实体、507 个数值字段，最大绝对差 0 | [全部字段与差值](../examples/independent-fields/results.json)；非数值名称/闭合标志也逐项比较 |
| 3–5 张新 CAD 导出 | **未完成**：没有取得可核验软件版本、导出设置和人工尺寸的新增文件；公开仓库样例不能凭文件名当作已确认导出 | 已有 5 文件字段核对不冒充新 CAD 导出，10 个自建模型也不改称真实导出 |
| Web Worker | 本轮未引入；单次解析与全局预算已做，但不承诺网页在所有大输入下无卡顿 | 属于方案中的后续迭代项 |

[十个真实 CLI 边界案例](../examples/advisor-boundaries/results.json)保存输入、报告和 SVG：`node examples/advisor-boundaries/verify.cjs`。普通 PL、预算和别名等补充验证见 [`advisor_boundary_wbtest.mbt`](../advisor_boundary_wbtest.mbt)。

## 与已有证据的关系

没有改动现有 47 个 DXF 的字节。对旧/新逐文件审计进行比较后，确认只有 `text.dxf`、`text_negative_extrusion.dxf`、`viewports.dxf` 和 `VP4.dxf` 新增宽度/厚度提示：共 **5 条**。顶层实体 5524、已解码 5404、展开记录 6210 不变；警告 148→153，实体解析警告 2→4，展开警告 3→8。相应测试不仅调整总数，还限定警告来源文件和中心线原因。

原 [10 类自建模型](../examples/model-validation/README.md)以及旧 CLI 场景仍按保存的几何/诊断结果复核。新预算高于这些语料的实际规模，默认未截断。5 文件的独立字段核对不提升 47 文件的逐图纸几何真值等级，仍为 0/47；外部 CAD 目视与样条导出缺口仍保留。

## 验证范围及部署身份

按用户要求，本轮默认**针对性验证，不执行全量四后端、全量故障注入或完整独立消费者工程套件**。

```sh
node scripts/verify-advisor.cjs
```

该流程运行一个 Wasm 后端的 112 个相关库测试、14 个受影响语料测试、10 个新边界 CLI、5 文件独立字段核对、原 10 模型/CLI 场景及网页入口检查。`--fresh` 用于 CI 干净检出；开发未提交改动需要显式 `--allow-dirty`。

工作流默认使用此针对性流程，只有手动明确选择 `full` 才跑原完整复现。`verification.json` 和 `release.json` 都标注 `validation_profile: targeted-advisor`，验证记录另有 `full_suite_run:false`；这是针对性 CI 成功，不称为本轮全量回归通过。站点打包仍要求同提交、同验证 profile、源码干净、模型记录通过以及资产哈希一致。旧 full 标签的历史验证身份不改写。

资源限制约束展开输出和遍历，不是输入字节、解析内存、墙钟时间或检查器 O(n²) 工作量的完整预算。单个实体离散仍可能分配局部上限范围内的临时点；不是“所有输入都不会 OOM”的承诺。未提供性能 benchmark，也没有因此宣称百万实体或无阻塞网页支持。

## 格式依据

- [Autodesk SPLINE](https://help.autodesk.com/cloudhelp/2020/ENU/AutoCAD-DXF/files/GUID-E1F884F8-AA90-4864-A215-3182D47A9C74.htm)：Closed/Periodic 标志及权重字段。
- [Autodesk LWPOLYLINE](https://help.autodesk.com/cloudhelp/2017/ENU/AutoCAD-DXF/files/GUID-748FC305-F3F2-4F74-825A-61F04D757A50.htm)：宽度与厚度字段；本工具只保留中心线。
- [Autodesk ELLIPSE](https://help.autodesk.com/cloudhelp/2020/ENU/AutoCAD-DXF/files/GUID-107CB04F-AD4D-4D2F-8EC9-AC90888063AB.htm)及 [ezdxf ELLIPSE 约束](https://ezdxf.readthedocs.io/en/stable/dxfentities/ellipse.html)：短长轴比语义；本库明确采用 `(0,1]` 的接收边界。
