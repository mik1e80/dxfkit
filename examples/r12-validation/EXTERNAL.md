# 第三方阵列文件：坐标与误报专项

2026-10-27，使用仓库已有的原始 [multi_insert_with_attribs.dxf](../../testdata/ezdxf/multi_insert_with_attribs.dxf)。来源为MIT许可的ezdxf示例语料，未改动输入、未新增或冒称CAD软件导出。文件版本为 **AC1027**，用于验证与R12共有的INSERT/阵列/仿射语义，不由此宣称完整AC1027或R12符合性。

## 两种独立证据分别证明什么

| 验证 | 预期依据 | 本轮实际结果 |
| --- | --- | --- |
| 外部格式审计 | ezdxf1.4.4公开CLI，未使用`--save`或`--explore` | [审计输出](external-actual/ezdxf-audit.txt)：No errors found；不等于dxfkit坐标已正确 |
| FLAG顶点 | 文件声明的(0,0)/(0,5)/(4,3)/(0,3)、5×5阵列、间距10、旋转15°；用cos15°=(√6+√2)/4、sin15°=(√6-√2)/4的解析矩阵，未调用库的变换辅助函数作为真值 | 25实例、100顶点、300个XYZ分量；最大误差约1.42e-14，小于1e-9 |
| 圆的采样坐标 | 原圆心(0,0)、半径0.4，解析阵列圆心及起点 | 25个圆、175个采样点，最大半径误差约1.66e-14；起点误差约1.25e-14 |
| 自交误报 | 末点(0,3)在首段(0,0)-(0,5)上，是端点接触；仿射变换不应使它成为内部交叉 | 修复前误报15条自交，修复后0；开放轮廓与属性限制仍如实报告 |

[实际数据JSON](external-actual/geometry.json) · [输入Git blob身份](external-actual/input-git-blob.txt) · [公开接口调用与解析断言](external/main.mbt)。原始字节SHA-256、来源路径与局限还在[47文件记录](../../docs/corpus-validation.json)中；当年未记录上游提交号，不补猜。

这不是整图认证：文字、关联ATTRIB布局及其复制仍未重建，报告必须保持检查不完整；25个FLAG本身是开放折线，不能把本专项“与预期一致”写成图纸可加工。圆验证的是采样半径与起点，不是完整解析曲线的独立公差认证。47文件的整图独立真值计数仍为0/47。

## 复现

固定项目SDK后运行`moon run examples/r12-validation/external`。默认定向CI执行这一公开接口程序，并执行包含FLAG/空间LINE来源和顶点断言的语料G1/C0。

本地可选独立审计记录器：

```sh
moon run scripts/record-external-validation.mbtx <固定SDK目录> <Python可执行文件> <ezdxf1.4.4依赖目录>
```

记录器用较新MoonBit脚本运行器编排，项目子进程明确调用固定SDK；Python只运行已安装的ezdxf公开CLI，不执行自写Python几何算法。记录前后核对输入Git blob一致，不保存修复。新CAD导出器、不同来源和更多复杂空间模型仍可后续补充。
