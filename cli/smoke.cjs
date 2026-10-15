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
assert(fs.readFileSync(path.join(root,'examples/curves.dxf'),'utf8').includes('SPLINE'));
console.log('CLI回归通过：真实示例、警告门禁、参数、单位与流式入口。');
