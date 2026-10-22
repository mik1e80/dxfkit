const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'../..'),write=process.argv.includes('--write');
const draw=body=>'0\nSECTION\n2\nENTITIES\n'+body+'0\nENDSEC\n0\nEOF\n';
const spline=(flag,weights='')=>'0\nSPLINE\n70\n'+flag+'\n71\n2\n72\n6\n73\n3\n40\n0\n40\n0\n40\n0\n40\n1\n40\n1\n40\n1\n'+weights+'10\n0\n20\n0\n10\n1\n20\n2\n10\n2\n20\n0\n';
const rect=extra=>'0\nLWPOLYLINE\n90\n4\n70\n1\n'+extra+'10\n0\n20\n0\n10\n2\n20\n0\n10\n2\n20\n1\n10\n0\n20\n1\n';
const missing='0\nSECTION\n2\nBLOCKS\n0\nBLOCK\n2\nA\n10\n0\n20\n0\n0\nCIRCLE\n10\n0\n20\n0\n40\n1\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n0\nINSERT\n2\nA\n10\n0\n20\n0\n0\nENDSEC\n0\nEOF\n';
const cubic=fs.readFileSync(path.join(root,'examples/model-validation/models/06-spline.dxf'),'utf8').replace(/\r\n?/g,'\n');
const cases=[
  {id:'missing-degree',text:cubic.replace('71\n3\n',''),reason:'缺少次数（71）',outlines:0},
  {id:'degree-zero',text:cubic.replace('71\n3\n','71\n0\n'),reason:'样条次数',outlines:0},
  {id:'degree-too-high',text:cubic.replace('71\n3\n','71\n33\n'),reason:'样条次数',outlines:0},
  {id:'explicit-cubic-control',text:cubic,outlines:1,exit:1,complete:true},
  {id:'closed-spline',text:draw(spline(1)),reason:'闭合或周期',outlines:0},
  {id:'periodic-spline',text:draw(spline(2)),reason:'闭合或周期',outlines:0},
  {id:'partial-weights',text:draw(spline(4,'41\n2\n')),reason:'权重数量',outlines:0},
  {id:'extra-weights',text:draw(spline(4,'41\n1\n41\n2\n41\n1\n41\n1\n')),reason:'权重数量',outlines:0},
  {id:'missing-endblk',text:missing,reason:'缺少 ENDBLK',outlines:1},
  {id:'ellipse-ratio',text:draw('0\nELLIPSE\n10\n0\n20\n0\n11\n3\n21\n0\n40\n1.2\n'),reason:'短长轴比',outlines:0},
  {id:'constant-width',text:draw(rect('43\n5\n')),reason:'仅检查中心线',outlines:1},
  {id:'vertex-width',text:draw(rect('40\n2\n')),reason:'仅检查中心线',outlines:1},
  {id:'thickness',text:draw(rect('39\n1\n')),reason:'仅检查中心线',outlines:1},
  {id:'zero-width-control',text:draw(rect('43\n0\n40\n0\n41\n0\n39\n0\n')),outlines:1,exit:0},
];
function save(file,text){const p=path.join(__dirname,file);if(write){fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,text);}else assert.equal(fs.readFileSync(p,'utf8').replace(/\r\n?/g,'\n'),text,file);}
function run(args){const r=spawnSync('moon',['run','cli',...args],{cwd:root,encoding:'utf8',timeout:60000});assert(r.status===0||r.status===1,r.stdout+r.stderr);return {exit:r.status,text:r.stdout.replace(/\r\n?/g,'\n')};}
let results=[];
for(const c of cases){
  const file='examples/advisor-boundaries/models/'+c.id+'.dxf';save('models/'+c.id+'.dxf',c.text);
  const args=['check',file,'--strict','--tol','0.01'],r=run(args),s=run(['svg',file,'--tol','0.01']);assert.equal(r.exit,c.exit??1,r.text);assert.equal(s.exit,0);
  assert.equal([...s.text.matchAll(/<(?:polygon|polyline)\b/g)].length,c.outlines);
  if(c.reason){assert(r.text.includes(c.reason));assert(r.text.includes('检查不完整'));assert(!r.text.includes('[轮廓闭合]'));}
  else if(c.complete){assert(!r.text.includes('检查不完整'));assert(r.text.includes('[轮廓闭合]'));}
  else {assert(!r.text.includes('检查不完整'));assert(!/^\[/m.test(r.text));}
  save('actual/'+c.id+'.txt',r.text);save('actual/'+c.id+'.svg',s.text);
  results.push({id:c.id,command:['moon','run','cli',...args],expected:{strict_exit:c.exit??1,outlines:c.outlines,reason:c.reason??null},actual:{strict_exit:r.exit,outlines:c.outlines,report:r.text},passed:true});console.log('PASS boundary '+c.id);
}
save('results.json',JSON.stringify({base_commit:'a5d747f19f8297040a924af38334b7d4e66a75f9',scope:'Advisor boundaries plus r2 explicit-degree cases; suite alone is not full regression',passed:results.length,total:cases.length,cases:results},null,2)+'\n');
console.log(`${results.length}/${cases.length} boundary CLI cases passed`);
