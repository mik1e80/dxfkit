(async function(){
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
let workerMode='normal';
const workers=[],timers=[],readers=[];
class FileReader {
  constructor(){this.readyState=0;readers.push(this);}
  readAsArrayBuffer(){this.readyState=1;}
  abort(){this.readyState=2;if(this.onabort)this.onabort();}
}
class Worker {
  constructor(){
    this.terminated=false;workers.push(this);
    const owner=this;
    this.scope=vm.createContext({console,Uint8Array,ArrayBuffer,JSON,TextEncoder,TextDecoder,
      btoa:s=>Buffer.from(s,'binary').toString('base64'),
      self:{postMessage:data=>queueMicrotask(()=>{if(!owner.terminated&&owner.onmessage)owner.onmessage({data});})},
      importScripts:()=>{vm.runInContext(fs.readFileSync(path.join(__dirname,'dist/web.js'),'utf8'),owner.scope);
        const impl=owner.scope.analyze;owner.scope.analyze=(...args)=>{analysisCalls++;return impl(...args);};}
    });
    vm.runInContext(fs.readFileSync(path.join(__dirname,'worker.js'),'utf8'),this.scope);
  }
  postMessage(data){
    this.lastMessage=data;
    if(workerMode==='hold')return;
    if(workerMode==='malformed'){queueMicrotask(()=>this.onmessage({data:{id:data.id,result:{report:4}}}));return;}
    if(workerMode==='error'){queueMicrotask(()=>this.onerror());return;}
    queueMicrotask(()=>{if(!this.terminated)this.scope.self.onmessage({data});});
  }
  terminate(){this.terminated=true;}
}
const context = vm.createContext({console,document,location:{search:''},TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,Worker,FileReader,
  setTimeout:fn=>{const task={fn,cleared:false};timers.push(task);return task;},clearTimeout:task=>{task.cleared=true;},
  btoa:s=>Buffer.from(s,'binary').toString('base64')});
vm.runInContext(fs.readFileSync(path.join(__dirname,'dist/web.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'app.js'),'utf8'),context);
let analysisCalls=0;
// The page must use one combined call, never the legacy multi-parse path.
context.check=()=>{throw new Error('page called legacy check');};
context.svg=()=>{throw new Error('page called legacy svg');};
context.svg_error=()=>{throw new Error('page called legacy svg_error');};
const input = name => fs.readFileSync(path.join(__dirname,'../examples',name)).toString('base64');
const report = document.getElementById('report');
const gap = document.getElementById('min-gap');
gap.value='0.5';
await context.runCheck(input('plate.dxf'),'plate.dxf');
assert.equal(analysisCalls,1, report.textContent);
assert.match(report.textContent,/致命 0 · 警告 0/);
assert.match(report.textContent,/毫米/);
assert.match(report.textContent,/不构成可加工保证/);
assert.match(document.getElementById('preview').innerHTML,/<svg/);
gap.value='8'; await gap.events.get('change')();
assert.match(report.textContent,/最小间隙/);
gap.value=''; await gap.events.get('change')();
assert.match(report.textContent,/非负有限数字/);
gap.value='0'; await gap.events.get('change')();
assert.match(report.textContent,/致命 0 · 警告 0/);
await context.runCheck(input('issues.dxf'),'issues.dxf');
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
assert.match(context.check(input('unsupported-insert-ocs.dxf'),0),/已转换 WCS/);
assert(!context.svg(input('unsupported-insert-ocs.dxf'),0.05).includes('<polyline'));
gap.value='0';
await nodes.get('sample-normal').events.get('click')();
assert.match(report.textContent,/致命 0 · 警告 0/);
assert.match(report.textContent,/毫米/);
await nodes.get('sample-coverage').events.get('click')();
assert.match(report.textContent,/3DFACE 实体的轮廓未参与检查/);
assert(!report.textContent.includes('[自相交]'));
assert.match(document.getElementById('preview').innerHTML,/<polygon/);
await nodes.get('sample').events.get('click')();
assert.match(report.textContent,/严重问题/);
await context.runCheck(input('completeness-mixed.dxf'),'completeness-mixed.dxf');
assert.match(report.textContent,/检查不完整/);
assert.match(report.textContent,/SPLINE 控制点/);
// Negative-Z OCS is now converted and remains in the XY plane.
assert(!report.textContent.includes('未转换 OCS'));
assert(!report.textContent.includes('没有可检查的二维轮廓'));
assert.match(document.getElementById('preview').innerHTML,/<polygon/);
const missingDegree=fs.readFileSync(path.join(__dirname,'../examples/advisor-boundaries/models/missing-degree.dxf')).toString('base64');
const missingResult=JSON.parse(context.analyze(missingDegree,0,0.01));
assert.match(missingResult.report,/缺少次数（71）/);
assert.match(missingResult.report,/检查不完整/);
assert(!missingResult.report.includes('[轮廓闭合]'));
assert(!missingResult.svg.includes('<polyline'));
console.log('网页回归通过：单位、净距、覆盖、曲线和缺失 SPLINE 次数诊断。');
workerMode='malformed';await context.runCheck(input('plate.dxf'),'bad-result');
assert.match(report.textContent,/无效结果/);
workerMode='error';await context.runCheck(input('plate.dxf'),'failed-worker');
assert.match(report.textContent,/后台检查失败/);
context.readFile({size:17*1024*1024,name:'large.dxf'});
assert.equal(readers.length,0);assert.match(report.textContent,/16 MiB/);
workerMode='hold';
const first=context.runCheck(input('plate.dxf'),'old');
const stale=workers.at(-1);
const second=context.runCheck(input('issues.dxf'),'new');
await first;assert(stale.terminated);
stale.onmessage({data:{id:stale.lastMessage.id,result:{report:'STALE',svg:'',error:'',unit:''}}});
assert(!report.textContent.includes('STALE'));
timers.at(-1).fn();await second;
assert.match(report.textContent,/超过15秒/);assert(workers.at(-1).terminated);
const cancel=context.runCheck(input('plate.dxf'),'cancel');
nodes.get('cancel').events.get('click')();await cancel;
assert.match(report.textContent,/已取消/);
workerMode='normal';
context.readFile({size:5,name:'first.dxf'});const oldReader=readers.at(-1);
context.readFile({size:5,name:'second.dxf'});assert.equal(oldReader.readyState,2);
const reader=readers.at(-1);
const bytes=fs.readFileSync(path.join(__dirname,'../examples/plate.dxf'));
reader.result=bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);
reader.readyState=2;reader.onload();
await new Promise(resolve=>setImmediate(resolve));
assert.match(report.textContent,/致命 0 · 警告 0/);
assert(timers.every(t=>t.cleared));
console.log('Worker防护通过：后台真实编译产物、大小限制、超时终止、取消、过期结果和读取竞争。');

})().catch(error=>{console.error(error);process.exitCode=1;});
