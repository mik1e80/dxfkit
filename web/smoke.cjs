// 执行MoonBit编译产物与页面逻辑。最小DOM只验证行为，不验证布局。
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
class Element {
  constructor() { this.textContent=''; this.innerHTML=''; this.value='0'; this.events=new Map(); this.classList={add(){},remove(){}}; }
  addEventListener(name, fn) { this.events.set(name,fn); }
  replaceChildren() { this.textContent=''; this.innerHTML=''; }
  click() {}
}
const nodes = new Map();
const document = { body:new Element(),getElementById(id){ if(!nodes.has(id)) nodes.set(id,new Element()); return nodes.get(id); } };
const context = vm.createContext({console,document,location:{search:''},TextEncoder,TextDecoder,Uint8Array,
  btoa:s=>Buffer.from(s,'binary').toString('base64')});
vm.runInContext(fs.readFileSync(path.join(__dirname,'dist/web.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'app.js'),'utf8'),context);
let analysisCalls=0;
const actualAnalyze=context.analyze;
context.analyze=(...args)=>{analysisCalls++;return actualAnalyze(...args);};
// The page must use one combined call, never the legacy multi-parse path.
context.check=()=>{throw new Error('page called legacy check');};
context.svg=()=>{throw new Error('page called legacy svg');};
context.svg_error=()=>{throw new Error('page called legacy svg_error');};
const input = name => fs.readFileSync(path.join(__dirname,'../examples',name)).toString('base64');
const report = document.getElementById('report');
const gap = document.getElementById('min-gap');
gap.value='0.5';
context.runCheck(input('plate.dxf'),'plate.dxf');
assert.equal(analysisCalls,1);
assert.match(report.textContent,/致命 0 · 警告 0/);
assert.match(report.textContent,/毫米/);
assert.match(report.textContent,/不构成可加工保证/);
assert.match(document.getElementById('preview').innerHTML,/<svg/);
gap.value='8'; gap.events.get('change')();
assert.match(report.textContent,/最小间隙/);
gap.value=''; gap.events.get('change')();
assert.match(report.textContent,/非负有限数字/);
gap.value='0'; gap.events.get('change')();
assert.match(report.textContent,/致命 0 · 警告 0/);
context.runCheck(input('issues.dxf'),'issues.dxf');
assert.match(report.textContent,/重复切割/);
assert.match(report.textContent,/严重问题/);
const empty = Buffer.from('0\nSECTION\n2\nENTITIES\n0\nENDSEC\n0\nEOF\n').toString('base64');
// Restore compatibility APIs for their separate public-interface checks below.
vm.runInContext(fs.readFileSync(path.join(__dirname,'dist/web.js'),'utf8'),context);
assert.match(context.check(empty,0),/没有可检查的二维轮廓/);
const svg = context.svg(input('curves.dxf'),0.01);
const lines = [...svg.matchAll(/<polyline points="([^"]*)"/g)].map(m=>m[1].trim().split(/\s+/).map(v=>v.split(',').map(Number)));
assert.equal(lines.length,2);
assert.deepEqual(lines[0].at(-1),[2,0]);
assert(lines[1].some(([x,y])=>Math.abs(y)>0.2),'S形样条不能画成直线');
assert.match(context.check(input('unsupported-insert-ocs.dxf'),0),/未转换 OCS/);
assert(!context.svg(input('unsupported-insert-ocs.dxf'),0.05).includes('<polyline'));
gap.value='0';
nodes.get('sample-normal').events.get('click')();
assert.match(report.textContent,/致命 0 · 警告 0/);
assert.match(report.textContent,/毫米/);
nodes.get('sample-coverage').events.get('click')();
assert.match(report.textContent,/3DFACE 实体的轮廓未参与检查/);
assert(!report.textContent.includes('[自相交]'));
assert.match(document.getElementById('preview').innerHTML,/<polygon/);
nodes.get('sample').events.get('click')();
assert.match(report.textContent,/严重问题/);
context.runCheck(input('completeness-mixed.dxf'),'completeness-mixed.dxf');
assert.match(report.textContent,/检查不完整/);
assert.match(report.textContent,/SPLINE 控制点/);
assert.match(report.textContent,/未转换 OCS/);
assert(!report.textContent.includes('没有可检查的二维轮廓'));
assert.match(document.getElementById('preview').innerHTML,/<polygon/);
console.log('网页回归通过：单位、净距、输入校验、覆盖报告及负bulge/S形曲线。');
