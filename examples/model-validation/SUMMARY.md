# 十类模型测试总结

核对日期：2026-10-22。10/10 主模型通过逐项断言；这是项目自建模型，不是新增第三方图纸认证。所有测试均从实际 DXF 文件经公开库接口和 CLI 执行。

| 模型 | 输入 | 实际 strict 退出码 | 检查不完整 | 报告 / SVG / 数据 |
| --- | --- | --- | --- | --- |
| 01 | [01-rectangle.dxf](models/01-rectangle.dxf) | 0 | false | [报告](actual/01-report.txt) / [SVG](actual/01-preview.svg) / [接口数据](actual/01-public-api.txt) |
| 02 | [02-four-hole-plate.dxf](models/02-four-hole-plate.dxf) | 0 | false | [报告](actual/02-report.txt) / [SVG](actual/02-preview.svg) / [接口数据](actual/02-public-api.txt) |
| 03 | [03-arcs.dxf](models/03-arcs.dxf) | 1 | false | [报告](actual/03-report.txt) / [SVG](actual/03-preview.svg) / [接口数据](actual/03-public-api.txt) |
| 04 | [04-ellipse.dxf](models/04-ellipse.dxf) | 0 | false | [报告](actual/04-report.txt) / [SVG](actual/04-preview.svg) / [接口数据](actual/04-public-api.txt) |
| 05 | [05-bulge.dxf](models/05-bulge.dxf) | 1 | false | [报告](actual/05-report.txt) / [SVG](actual/05-preview.svg) / [接口数据](actual/05-public-api.txt) |
| 06 | [06-spline.dxf](models/06-spline.dxf) | 1 | false | [报告](actual/06-report.txt) / [SVG](actual/06-preview.svg) / [接口数据](actual/06-public-api.txt) |
| 07 | [07-block-inserts.dxf](models/07-block-inserts.dxf) | 0 | false | [报告](actual/07-report.txt) / [SVG](actual/07-preview.svg) / [接口数据](actual/07-public-api.txt) |
| 08 | [08-layers-and-text.dxf](models/08-layers-and-text.dxf) | 1 | true | [报告](actual/08-report.txt) / [SVG](actual/08-preview.svg) / [接口数据](actual/08-public-api.txt) |
| 09 | [09-intentional-errors.dxf](models/09-intentional-errors.dxf) | 1 | false | [报告](actual/09-report.txt) / [SVG](actual/09-preview.svg) / [接口数据](actual/09-public-api.txt) |
| 10 | [10-coverage-boundaries.dxf](models/10-coverage-boundaries.dxf) | 1 | true | [报告](actual/10-report.txt) / [SVG](actual/10-preview.svg) / [接口数据](actual/10-public-api.txt) |

尺寸、字段、曲线双向采样误差、块坐标、预期和实际诊断见 [results.json](results.json)，人工指定的几何定义见 [expected.json](expected.json)。02 另保存阈值 8 的净距报警结果；0.5 时正常无发现。08 同时检出文字未转轮廓及两种图层状态提示，并断言关闭/冻结层未产生本工具的闭合告警。09 检出开口和重复线；10 明确标记检查不完整。

05 未进行 CAD 软件目视确认；06 使用独立 Bernstein 解析采样，未进行外部 CAD 导出对照。这两项外部确认不能由 10/10 自动测试结果代替。47 个第三方文件的逐文件独立几何真值仍为 0/47。
