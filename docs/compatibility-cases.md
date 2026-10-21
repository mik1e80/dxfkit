# DXF 读取与几何检查的边界案例

读取字节、解码实体、检查几何是不同阶段，不以文件头版本号推断完整兼容性。

第三方语料的逐文件来源、实际测试、三层验证结果及未覆盖内容见[47 张图纸案例表](corpus-validation.md)。读取成功与实体字段解码不能自动升级为几何已验证。

正式实体及字段范围见[交付范围](delivery-scope.md)。六类最小技术问题的修复前后结果见[复现与验证](delivery-verification.md)；运行 `node scripts/verify-delivery.cjs` 可核对实际网页编译产物。

`examples/completeness-mixed.dxf` 将正常轮廓与多种未检查情况放在同一文件；`--strict` 必须退出 1，并保留全部诊断，详见[完整性约定和验证](check-completeness.md)。

## 范围内的二维板件

`moon run cli check examples/plate.dxf --min-gap 0.5 --strict`

自建 100×60 外框与四个半径 3 的孔，HEADER 声明毫米。退出 0 只表示本次参数及覆盖范围内未触发门禁。改为 `--min-gap 8 --strict`，预期退出 1 并报告最小间隙，验证阈值参与几何计算。

## 读取成功但几何未完整覆盖

`moon run cli check examples/coverage-limits.dxf --strict`

自建最小诊断输入含四个实体：带非默认挤出方向的 CIRCLE、部分元数据可解码的 HATCH 和 DIMENSION、未解码的 RAY。此输入用于验证未支持内容的诊断，不是完整的 HATCH 或 DIMENSION 标准样例。

预期退出 1，并提示圆的 OCS 未转换，HATCH、DIMENSION、RAY 的轮廓未参与检查。圆的 XY 投影仍可能参与计算，不能据此验证真实 OCS 几何。严格模式拦截警告不表示缺失语义已经实现。

## 有旧版本标识，不等于检查过几何

`moon run cli check testdata/ezdxf/Minimal_DXF_AC1009.dxf --strict`

外部最小文件可以读取，但没有可检查的二维轮廓，预期退出 1。扫描回归不证明该版本的所有实体均被读取或检查。

## 具体几何问题

`moon run cli check examples/issues.dxf`

预期退出 1，报告重复路径、开放轮廓及负半径。`examples/curves.dxf` 和几何测试另覆盖负 bulge 顺序及 S 形样条，曲线精度不能仅凭预览判断。

## 自动复核与来源

`node cli/smoke.cjs` 核对实际退出码和关键诊断。检查实现见 `check.mbt`，展开见 `expand.mbt`，完整范围见 `README.mbt.md`。

新增诊断输入由项目自建，采用 Apache-2.0；外部最小文件来源及 MIT 全文见 `THIRD_PARTY_NOTICES.md`。


## 非默认 OCS 的块引用

新增 examples/unsupported-insert-ocs.dxf，严格检查应以 1 退出。INSERT 的 OCS 不会在展开时丢失后静默忽略：整个引用及其子实体跳过，报告源句柄、图层、块名。嵌套引用同样处理，其余支持的同级实体仍保留。
