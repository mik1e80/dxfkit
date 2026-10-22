// 运行实际CLI验证示例、参数校验和退出码。
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname,'..');
function run(args,status,pattern) {
  const result = spawnSync('moon',['run','cli',...args],{cwd:root,encoding:'utf8',timeout:60000});
  if(result.error) throw result.error;
  const output = result.stdout + result.stderr;
  assert.equal(result.status,status,`${args.join(' ')}\n${output}`);
  if(pattern) assert.match(output,pattern);
  return output;
}
run(['check','examples/plate.dxf','--min-gap','0.5','--strict'],0,/不构成可加工保证/);
run(['check','examples/issues.dxf'],1,/重复切割/);
run(['check','examples/curves.dxf'],0,/轮廓闭合/);
run(['check','examples/curves.dxf','--strict'],1);
run(['check','examples/plate.dxf','--min-gap','8','--strict'],1,/最小间隙/);
run(['check','examples/plate.dxf','--tol','NaN'],2,/有限数字/);
run(['check','examples/plate.dxf','--tol','0'],2);
run(['check','examples/plate.dxf','--min-gap','-1'],2);
run(['check','examples/plate.dxf','--min-gap'],2,/缺少参数值/);
run(['svg','examples/plate.dxf','--tol','bad'],2);
run(['svg','examples/plate.dxf'],0,/<svg/);
run(['stats','examples/plate.dxf'],0,/警告 0 条/);
run(['check','testdata/ezdxf/Minimal_DXF_AC1009.dxf','--strict'],1,/没有可检查的二维轮廓/);
const coverage = run(['check','examples/coverage-limits.dxf','--strict'],1,/未转换 OCS/);
for (const kind of ['HATCH','DIMENSION','RAY']) {
  assert.match(coverage,new RegExp(`${kind} 实体的轮廓未参与检查`));
}
assert(fs.readFileSync(path.join(root,'examples/curves.dxf'),'utf8').includes('SPLINE'));
run(['check','examples/unsupported-insert-ocs.dxf','--strict'],1,/未转换 OCS/);
for (const file of ['lwpolyline-missing-y.dxf','polyline-missing-y.dxf']) {
  const report = run(['check',`examples/regressions/${file}`,'--strict'],1,/顶点/);
  assert.match(report,/轮廓未参与检查/);
}
const faces = run(['check','examples/regressions/face-metadata-only.dxf','--strict'],1,/3DFACE 实体的轮廓未参与检查/);
assert(!faces.includes('[自相交]'));
const ellipse = run(['svg','examples/regressions/ellipse-offset.dxf'],0,/<polygon/);
const firstEllipsePoint = ellipse.match(/points="([^"]*)"/)[1].trim().split(/\s+/)[0].split(',').map(Number);
assert.deepEqual(firstEllipsePoint,[12,20]);
const large = run(['svg','examples/regressions/svg-coordinate-range.dxf'],0,/<polyline/);
const largePoints = large.match(/points="([^"]*)"/)[1].trim().split(/\s+/).map(p=>p.split(',').map(Number));
assert.deepEqual(largePoints,[[-300000,1e-9],[300010,2e-9]]);
run(['check','examples/regressions/insert-unsupported-ocs.dxf','--strict'],1,/AB/);
const mixed = run(['check','examples/completeness-mixed.dxf'],0,/检查不完整/);
for (const marker of ['RAY 实体的轮廓未参与检查','未转换 OCS','LWPOLYLINE','POLYLINE','未能离散','SPLINE 控制点']) {
  assert(mixed.includes(marker),`mixed input lost diagnostic: ${marker}`);
}
assert(!mixed.includes('没有可检查的二维轮廓'),'normal circle must survive');
const mixedStrict = run(['check','examples/completeness-mixed.dxf','--strict'],1,/检查不完整/);
assert.match(mixedStrict,/致命 0 · 警告 [1-9]/);
const mixedSvg = run(['svg','examples/completeness-mixed.dxf'],0,/<polygon/);
const mixedPolygons = [...mixedSvg.matchAll(/<polygon\b[^>]*points="([^"]*)"/g)]
  .map(m=>m[1].trim().split(/\s+/).map(p=>p.split(',').map(Number)));
assert(mixedPolygons.some(points=>points.every(([x,y])=>x>=99&&x<=101&&y>=99&&y<=101)));
console.log('CLI回归通过：真实示例、警告门禁、参数、单位与流式入口。');
