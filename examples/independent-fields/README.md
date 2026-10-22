# 独立字段交叉核对

实跑 ezdxf **1.4.4**，从已有 47 文件中选取 5 个外部输入，比较 ENTITIES（含模型空间/图纸空间，排除 BLOCKS 内部）的双方声明字段：LINE XYZ 端点、CIRCLE 圆心半径、ARC 圆心半径和角度、ELLIPSE 圆心轴向量轴比参数、LWPOLYLINE 顶点/bulge/闭合位、INSERT 名称/插入点/缩放/旋转。角度统一弧度，绝对误差上限 1e-9。

[独立参考](ezdxf-fields.json) · [全部逐字段差值](results.json) · [参考生成脚本](export-ezdxf.py)

输入是 `circle_radius_le_0.dxf`、`uncommon.dxf`、`insert_bricscad_level_1.dxf`、`VP4.dxf`、`viewports.dxf`，原始文件 SHA-256 随参考保存；不改输入。来源和 MIT 全文见仓库 THIRD_PARTY_NOTICES.md。实际共比较 67 条实体记录，所有列明数值及文字/布尔字段均通过。

这是独立实现的**字段对照**，不构成几何、OCS 转换、布局呈现或整体兼容证明，也不将这 5 个已有语料写成新导出的 CAD 图。原 CAD 软件版本、导出设置和人工测量值没有可靠记录，明确为 null；不能补猜。47 个文件的逐图纸独立几何真值仍为 0/47。

仓库根目录执行 `node examples/independent-fields/verify.cjs` 会实际调用 dxfkit 与已保存的 ezdxf 参考比较。重新生成参考需要安装固定版本 `ezdxf==1.4.4`，运行 `python examples/independent-fields/export-ezdxf.py`；隔离安装时可传 `--dependency-dir`。参考生成不调用 dxfkit、不覆盖 DXF。`--write` 只用于核实差异后的实际记录更新，默认验证不更新快照。
