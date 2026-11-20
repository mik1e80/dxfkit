# FreeCAD R12 空间圆导出反例

[原生模型](spatial-circle.FCStd)、[实际导出](spatial-circle.dxf)和[生成宏](generate.FCMacro)均为项目自建，按项目 [Apache-2.0](../../LICENSE) 分发。[原件字节哈希](SHA256SUMS)用于复核。导出由 FreeCADCmd 1.1.3 的 `Import.writeDXFObject` 直接完成，版本参数为 12，保留导出原件，CAD 应用二进制不随模型分发。

设计圆心为 (3,4,5)，半径 2，单位法向 (0,0.6,0.8)，因此原生设计的 Z 范围为 3.8 至 6.2。FreeCAD 导出为 AC1009 的 CIRCLE，保留圆心和半径，却省略挤出方向组码 210/220/230。采用默认方向后，导出文件表达的是 Z=5 的平行圆。库按导出字节解释世界几何，并因其不在 Z=0 而报告二维检查不完整。此例记录实际导出器丢失平面方向的情况，不能作为原生非默认 OCS 字段导出成功的证据。

在仓库根目录运行 `moon run examples/cad-ocs/runner --deny-warn`。验证器核对版本、原始组码、采样半径和高程以及报告状态。非默认 OCS 的坐标真值另见[设计模型](../r12-validation/README.md)。

实测共 71 个 WCS 采样点，Z 范围为 [5,5]，相对导出圆定义的最大半径误差为 4.45e-16 个图纸单位，报告为不完整。
