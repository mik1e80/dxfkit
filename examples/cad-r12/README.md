# FreeCAD 原生 R12 导出验证

2026-11-13实际运行FreeCADCmd 1.1.3，打开已保存的本项目原生FCStd，调用`Import.writeDXFObject(...,12,False,'User parameter:DXFKitCADR12')`直接导出三份ASCII DXF。三份文件均实际声明AC1009，未手改版本或任何DXF字节，未使用ezdxf转存。软件来自此前已核对的[FreeCAD发行包](../cad-exports/provenance.json)。

**3/3验证案例通过，包括两个正常案例和一个应报警的导出反例，不是三个正常图纸都通过strict。** 仅覆盖同一个CAD应用；GUI人工目视验收、MINSERT、非默认OCS与完整R12语义未验证。

| 导出 | 设计依据与实际检查 | strict | 证据 |
| --- | --- | --- | --- |
| [01 四孔板](models/01-four-hole-plate.dxf) | 外框100×60、四个LINE、端点各出现两次、周长320、面积6000；四个圆心(10,10)/(90,10)/(90,50)/(10,50)，半径3；348个圆采样点半径误差最大约6.66e-15 | 0 | [报告](actual/01.txt) / [SVG](actual/01.svg) |
| [02 矩形](models/02-rectangle.dxf) | 同一原生板模型只导出Contour0，四边与闭合端点、包围盒、周长和面积一致；不是独立的第二个CAD来源 | 0 | [报告](actual/02.txt) / [SVG](actual/02.svg) |
| [03 偏移椭圆](models/03-offset-ellipse.dxf) | 原生闭合椭圆中心(10,20)、半轴10/5；FreeCAD R12导出为10顶点的**开放POLYLINE**，接缝约3.31596014。逐个原始VERTEX与库输出一致，顶点椭圆方程误差约1.46e-10；正确报未闭合 | 1 | [报告](actual/03.txt) / [SVG](actual/03.svg) |

第三个案例的方程误差仅描述顶点，不是椭圆连续轮廓逼近误差；不得把开放折线称为忠实闭合椭圆。没有为了让strict通过而改DXF闭合位或容差。CAD设计使用mm，但这些R12输出的单位声明为“未指定”，库保持该结果，不替用户补单位。

[实际数据](actual/results.json) · [来源、设置与哈希](provenance.json) · [公开API验证工程](runner/main.mbt)。模型源文件直接引用[板件FCStd](../cad-exports/sources/01-freecad-four-hole-plate.FCStd)及[椭圆FCStd](../cad-exports/sources/02-freecad-offset-ellipse.FCStd)，不重复打包副本。它们是项目自建模型，不是客户生产图纸。模型、导出及验证代码按根目录[Apache-2.0](../../LICENSE)分发；不分发FreeCAD二进制。

## 仅重放必要验证

在仓库根目录使用[固定工具链](../../docs/reproducibility.md)：

```sh
moon run examples/cad-r12/runner --deny-warn
moon run cli check examples/cad-r12/models/01-four-hole-plate.dxf --strict --tol 0.002
moon run cli check examples/cad-r12/models/02-rectangle.dxf --strict --tol 0.002
moon run cli check examples/cad-r12/models/03-offset-ellipse.dxf --strict --tol 0.002
```

最后一条预期退出1。重放不需要安装FreeCAD；CI核对原始DXF及原生源文件哈希后执行该消费者。它不运行全量测试、不自动重新导出。

## 导出复现

本次通过`FreeCADCmd -c`交互控制台调用原生API。以仓库根目录作为工作目录，在控制台逐条执行（API要求的路径用实际仓库绝对路径替换）：

```python
import FreeCAD as App, Import
d = App.openDocument('/absolute/repo/examples/cad-exports/sources/01-freecad-four-hole-plate.FCStd')
Import.writeDXFObject(d.Objects, '/absolute/repo/examples/cad-r12/models/01-four-hole-plate.dxf', 12, False, 'User parameter:DXFKitCADR12')
Import.writeDXFObject([d.Objects[0]], '/absolute/repo/examples/cad-r12/models/02-rectangle.dxf', 12, False, 'User parameter:DXFKitCADR12')
App.closeDocument(d.Name)
d = App.openDocument('/absolute/repo/examples/cad-exports/sources/02-freecad-offset-ellipse.FCStd')
Import.writeDXFObject(d.Objects, '/absolute/repo/examples/cad-r12/models/03-offset-ellipse.dxf', 12, False, 'User parameter:DXFKitCADR12')
App.closeDocument(d.Name)
```

导出前在控制台核对App.Version及原生板件外框长度320/四条边、孔周长18.849555921538762、椭圆包围盒(0,15)-(20,25)和周长48.505863122387495；本次这些值与旧原生建模测量一致。重新导出可能改变句柄或格式，必须审阅几何与哈希后更新证据，不能自动改预期。

FreeCAD [官方实现](https://github.com/FreeCAD/FreeCAD/blob/1.1.3/src/Mod/Import/App/AppImportPy.cpp)明确接受版本参数12和14。本批证据补充此前只有AC1014/无版本声明的实际CAD导出，不替代[自建OCS/阵列真值](../r12-validation/README.md)、第三方语料回归或未来完整符合性验收。
