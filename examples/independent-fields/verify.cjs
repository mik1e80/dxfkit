const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'../..'),oracle=require('./ezdxf-fields.json'),write=process.argv.includes('--write'),results=[];
for(const file of oracle.files){
  assert.equal(createHash('sha256').update(fs.readFileSync(path.join(root,file.file))).digest('hex'),file.sha256);
  const run=spawnSync('moon',['run','examples/independent-fields/runner',file.file],{cwd:root,encoding:'utf8',timeout:60000});assert.equal(run.status,0,run.stdout+run.stderr);
  const rows=[];const byHandle=new Map();
  for(const line of run.stdout.trim().split(/\r?\n/)){const [kind,handle,...raw]=line.split('|');if(kind==='VERTEX'){const parent=byHandle.get(handle);assert(parent);(parent.vertices??=[]).push(raw.map(Number));continue;}
    const values=raw.map((v,i)=>kind==='INSERT'&&i===0?v:kind==='LWPOLYLINE'&&i===0?v==='true':Number(v));const row={kind,handle,values};rows.push(row);byHandle.set(handle,row);}
  assert.equal(rows.length,file.rows.length,file.file+': number of compared records');
  let maxAbs=0,compared=0;const differences=[];
  function compare(a,b,label){assert.equal(a.length,b.length,label);a.forEach((value,i)=>{if(typeof value!=='number'){assert.equal(value,b[i],label);return;}const diff=Math.abs(value-b[i]);assert(diff<=1e-9,`${label}[${i}] delta ${diff}`);maxAbs=Math.max(maxAbs,diff);compared++;differences.push({field:label+'['+i+']',dxfkit:value,ezdxf:b[i],absolute_difference:diff});});}
  for(const expected of file.rows){const actual=byHandle.get(expected.handle);assert(actual&&actual.kind===expected.kind,file.file+': '+expected.handle);compare(actual.values,expected.values,expected.kind+'/'+expected.handle);if(expected.vertices){assert.equal(actual.vertices?.length,expected.vertices.length);expected.vertices.forEach((v,i)=>compare(actual.vertices[i],v,expected.kind+'/'+expected.handle+'/vertex'+i));}}
  results.push({file:file.file,sha256:file.sha256,records:rows.length,numeric_fields:compared,max_absolute_difference:maxAbs,tolerance:1e-9,differences,passed:true});console.log('PASS independent fields '+file.file+' '+rows.length+' records');
}
const report=JSON.stringify({reference:'ezdxf 1.4.4',scope:oracle.scope,passed:results.length,total:oracle.files.length,files:results},null,2)+'\n';
if(write)fs.writeFileSync(path.join(__dirname,'results.json'),report);else assert.equal(fs.readFileSync(path.join(__dirname,'results.json'),'utf8').replace(/\r\n?/g,'\n'),report);
console.log(`${results.length}/${oracle.files.length} independent field comparisons passed`);
