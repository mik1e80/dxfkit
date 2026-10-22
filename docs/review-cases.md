# 五项追加审查：预期、修复与实际验收

核对日期：2026-10-22。基线为纯净提交 `43e6c5b244b33e53562f77cd28f5c1ac16c98718`。先编写 9 项库测试并实际运行，4 项通过、5 项失败；失败集中在面边界和第四角点诊断。随后修复，再增加非零厚度和真实重复边两项保护，当前 11/11 库测试通过。[修复前记录](review-cases-before.json)是原始执行摘要，不把后来新增两项算入修复前总数。

当前[实际编译产物及 CLI 记录](review-cases-results.json)保存 11 个完整 DXF 输入、输出点列、尺寸、报告和严格退出码；[测试源码](../review_cases_wbtest.mbt)从 DXF 读取开始断言几何，不只核对实体或警告总数。

| 审查项 | 输入与独立预期 | 当前实际与断言 |
| --- | --- | --- |
| 矩形 SOLID / TRACE | 文件顶点 (0,0)/(2,0)/(0,1)/(2,1)，边界应为 (0,0)→(2,0)→(2,1)→(0,1)，面积 2 | 两种类型分别验证四点顺序、正边长、面积和零告警；没有交叉对角线或自交误报，CLI strict 退出 0。原始 Face.corners[2]/[3] 仍为文件顺序 |
| 三角形 SOLID | 第四角点按格式重复第三点 (0,1)，应为三点闭合边界，面积 1 | 原始角点仍为 4 个，输出边界只为 3 个；每条边长度 >0，无零长度误报，strict 退出 0。真正的重复相邻角点另有反例，仍报告退化 |
| 非默认 OCS 的 INSERT | 外层和嵌套分别设置 230=-1；引用及子树不能当作正确 XY 结果 | 外层 0 轮廓；嵌套保留同级正常圆的 1 条轮廓，报告保留 OUTER/INNER 身份、OCS 和“检查不完整”，两者 strict 均退出 1 |
| 缺坐标的多段线 | LWPOLYLINE / POLYLINE 中间顶点缺 Y，并放入一个正常圆；另测声明数量 4、实有 3 的闭合折线 | 缺坐标的整条多段线拒绝，仅正常圆存活；数量不符保留完整三点坐标但报告恢复和检查不完整，strict 都退出 1；不能把恢复轮廓当完整验证 |
| SVG 大/微小矩形 | (300000,7) 起点、宽 2 高 1；(1e-9,2e-9) 起点、宽 4e-9 高 3e-9 | 实际 SVG 四点、相对宽高逐项核对，大矩形误差 ≤1e-12；微小矩形误差 ≤1e-12，坐标没有经过 32 位整数中转归零或截断。CLI 使用匹配尺度的 tol=1e-12，strict 退出 0 |

3DFACE 单独验证 WCS 原角点顺序，不套用 SOLID/TRACE 的后两点交换；仍只保留元数据、报告未参与轮廓检查。SVG 微小输入与默认网页检查阈值不是同一个承诺：网页 check 目前固定 tol=0.05，微小案例验证 SVG 和显式小容差的 CLI，不宣称网页默认容差适合微小图纸。

## 接口和兼容变化

新增 `Entity::flatten_checked(tol)`，按实体 kind 区分 SOLID/TRACE 与 3DFACE。`Face.corners` 和原始 Record 不改写，裸 `Geometry::Face` 无法识别格式身份，其 flatten / checked 保持 Empty。整图 expand、check 和 SVG 改用 Entity 入口；[独立消费工程](../examples/consumer/README.md)也使用此公共 API，在仓库外的 Wasm / Native 各通过 8 项验收。

SOLID/TRACE 的正式边界仅为默认 OCS、厚度 39 为 0、所有角点有限且 Z 相等的二维边界。非默认 OCS、非零厚度和非平行 XY 面拒绝生成轮廓，报告原因。缺整个第四点时保留历史三点恢复，但明确诊断检查不完整；部分第四坐标不再被当成“省略”，拒绝该实体轮廓。这里只处理边界，不提供填充布尔、三维面或体的几何认证。

此前七类核心轮廓范围新增这一有限的二维边界行为。2026-10-21 的 C5 面实体降级记录保留历史；当前同一混合文件里 SOLID 与 TRACE 生成两条有序矩形，3DFACE 仍报告未覆盖。文件旧名 face-metadata-only.dxf 不代表当前所有类型仍仅有元数据。两条矩形重合时，重复路径报告属于真实输入问题，不能为了零告警删除该诊断。

## 测试确实检出错误

在临时副本中恢复“按存储顺序输出边界”和“保留三角形重复第四点”两种错误，代码均编译成功，分别有 2 项矩形测试、1 项三角形测试失败。其余历史故障仍全部检出，当前敏感性验收 10/10；[机器记录](test-sensitivity-results.json)包含失败明细与测试源码哈希。编译或语法失败不算检出。

47 张语料只有 uncommon.dxf 的顶层 59B SOLID 新增三点边界，展开轮廓数从 29 到 30，移除一条 SOLID 未覆盖告警；其他文件的诊断列表不变。更新汇总警告数前，在 conformance 测试中核对了该句柄的三个实际坐标和非零边长。语料仍没有逐图纸独立几何真值，0/47 的等级不因这个局部断言或新增轮廓而提升；所有 DXF 字节保持不变。

## 复现

```sh
moon test review_cases_wbtest.mbt --deny-warn
node scripts/build-web.cjs
node scripts/verify-review-cases.cjs
node scripts/verify-test-sensitivity.cjs
node scripts/verify-corpus-records.cjs
```

完整验证运行 `node scripts/verify-reproduction.cjs --fresh`，要求新的干净检出，固定版本和交付标签见[复现文档](reproducibility.md)。

字段与连接顺序参考 Autodesk [SOLID](https://help.autodesk.com/cloudhelp/2018/ENU/AutoCAD-DXF/files/GUID-E0C5F04E-D0C5-48F5-AC09-32733E8848F2.htm)、[TRACE](https://help.autodesk.com/cloudhelp/2018/ENU/AutoCAD-DXF/files/GUID-EA6FBCA8-1AD6-4FB2-B149-770313E93511.htm)、[3DFACE](https://help.autodesk.com/cloudhelp/2024/ENU/AutoCAD-DXF/files/GUID-747865D5-51F0-45F2-BEFE-9572DBC5B151.htm) 及 ezdxf 的 [SOLID 顶点顺序说明](https://ezdxf.readthedocs.io/en/stable/dxfentities/solid.html)。不将这组定向案例描述为完整 DXF/CAD/CAM 验证。
