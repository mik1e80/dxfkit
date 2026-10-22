// Targeted verification of saved, unmodified exports. CAD tools are not needed to replay.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process'),{createHash}=require('node:crypto');
const {root,environment,source}=require('../../scripts/environment.cjs');
const dir=__dirname,write=process.argv.includes('--write');
const manifest=require('./provenance.json');
const lf=s=>s.replace(/\r\n?/g,'\n');
const hash=b=>createHash('sha256').update(b).digest('hex');
const near=(a,b,e=1e-8)=>assert(Number.isFinite(a)&&Math.abs(a-b)<=e,`${a} != ${b} +/- ${e}`);
function vector(a,b,e=1e-8){assert.equal(a.length,b.length);a.forEach((v,i)=>near(v,b[i],e));}
function bounds(points){return [Math.min(...points.map(p=>p[0])),Math.min(...points.map(p=>p[1])),Math.max(...points.map(p=>p[0])),Math.max(...points.map(p=>p[1]))];}
function rectangle(lines){
 assert.equal(lines.length,4);const endpoints=new Map();let perimeter=0,twiceArea=0;
 for(const o of lines){assert.equal(o.count,2);assert.equal(o.closed,false);const [a,b]=o.points;perimeter+=Math.hypot(a[0]-b[0],a[1]-b[1]);twiceArea+=a[0]*b[1]-a[1]*b[0];for(const p of o.points){const k=p.join(',');endpoints.set(k,(endpoints.get(k)||0)+1);}}
 assert.deepEqual([...endpoints.keys()].sort(),['0,0','0,60','100,0','100,60'].sort());assert([...endpoints.values()].every(n=>n===2));vector(bounds(lines.flatMap(o=>o.points)),[0,0,100,60]);near(perimeter,320);near(Math.abs(twiceArea)/2,6000);
 return {bounds:[0,0,100,60],connected_closed_boundary:true,individual_lines_closed:false,perimeter,area:Math.abs(twiceArea)/2};
}
function distance(p,points){let best=Infinity;for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy)));best=Math.min(best,Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy));}return best;}
function run(args){const r=spawnSync('moon',args,{cwd:root,encoding:'utf8',timeout:60000});if(r.error)throw r.error;assert(r.status===0||r.status===1,r.stdout+r.stderr);return {exit:r.status,stdout:lf(r.stdout)};}
function save(file,s){const p=path.join(dir,file);if(write){fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,s);}else assert.equal(lf(fs.readFileSync(p,'utf8')),s,`Saved output changed: ${file}`);return file;}
function parse(text){const d={entities:[],outlines:[],circles:[],ellipses:[],boxes:[]};let outline;
 for(const line of text.trim().split('\n')){const [tag,...v]=line.split('|');
  if(tag==='UNIT')d.unit=v[0];
  if(tag==='ENTITY')d.entities.push({handle:v[0],kind:v[1],layer:v[2]});
  if(tag==='CIRCLE')d.circles.push({handle:v[0],values:v.slice(1).map(Number)});
  if(tag==='ELLIPSE')d.ellipses.push({handle:v[0],values:v.slice(1).map(Number)});
  if(tag==='BOUNDS')d.boxes.push({handle:v[0],values:v.slice(1).map(Number)});
  if(tag==='OUTLINE'){outline={handle:v[0],closed:v[2]==='true',count:+v[3],points:[]};d.outlines.push(outline);}
  if(tag==='POINT'){assert(outline);outline.points.push(v.map(Number));}
  if(tag==='INCOMPLETE')d.incomplete=v[0]==='true';
 }
 for(const o of d.outlines){assert.equal(o.count,o.points.length);assert(o.points.every(p=>p.every(Number.isFinite)));}return d;
}
const toolchain=environment(),revision=source(),results=[];
for(const m of manifest.models){
 for(const file of [m.input,...m.sources]){assert.equal(hash(fs.readFileSync(path.join(dir,file))),manifest.files[file],`Input/source changed: ${file}`);}
 const input='examples/cad-exports/'+m.input;
 const apiCommand=['run','examples/model-validation/runner',input];
 const api=run(apiCommand);assert.equal(api.exit,0);const data=parse(api.stdout);assert.equal(data.incomplete,false);
 const reportCommand=['run','cli','check',input,'--tol','0.002','--strict'];
 const report=run(reportCommand);assert.equal(report.exit,0,report.stdout);assert(report.stdout.includes('（没有发现）'));assert(!report.stdout.includes('检查不完整'));
 const svgCommand=['run','cli','svg',input,'--tol','0.002'];const svg=run(svgCommand);assert.equal(svg.exit,0);
 const svgShapes=[...svg.stdout.matchAll(/<(polygon|polyline)\b[^>]*points="([^"]*)"/g)].map(v=>({closed:v[1]==='polygon',points:v[2].trim().split(/\s+/).map(p=>p.split(',').map(Number))}));
 assert.equal(svgShapes.length,data.outlines.length);data.outlines.forEach((o,i)=>{assert.equal(svgShapes[i].closed,o.closed);assert.equal(svgShapes[i].points.length,o.count);o.points.forEach((p,j)=>vector(svgShapes[i].points[j],p));});
 let metrics={declared_unit:data.unit,design_unit:'mm',entity_kinds:data.entities.map(e=>e.kind)};
 if(m.id==='01'){
  assert.equal(data.circles.length,4);assert.equal(data.outlines.length,8);assert.equal(data.unit,'毫米');
  const centers=data.circles.map(c=>c.values.slice(0,2)).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  centers.forEach((c,i)=>vector(c,[[10,10],[10,50],[90,10],[90,50]][i]));
  data.circles.forEach(c=>near(c.values[2],3));
  const holeHandles=new Set(data.circles.map(c=>c.handle)),outer=rectangle(data.outlines.filter(o=>!holeHandles.has(o.handle)));
  let radiusError=0;for(const c of data.circles){const o=data.outlines.find(o=>o.handle===c.handle);assert(o.closed);for(const p of o.points)radiusError=Math.max(radiusError,Math.abs(Math.hypot(p[0]-c.values[0],p[1]-c.values[1])-3));}assert(radiusError<1e-8);
  const distances=[];for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)distances.push(Math.hypot(centers[i][0]-centers[j][0],centers[i][1]-centers[j][1]));vector(distances.sort((a,b)=>a-b),[40,40,80,80,Math.hypot(80,40),Math.hypot(80,40)]);
  const occ=require('./freecad-export.json').models[0].occ_measurements;vector(occ[0].bounds,outer.bounds);near(occ[0].length,outer.perimeter);assert.equal(occ[0].closed,true);
  data.circles.forEach(c=>{const expected=occ.find(o=>Math.abs((o.bounds[0]+o.bounds[2])/2-c.values[0])<1e-8&&Math.abs((o.bounds[1]+o.bounds[3])/2-c.values[1])<1e-8);assert(expected);vector(data.boxes.find(b=>b.handle===c.handle).values,expected.bounds);near(expected.length,2*Math.PI*3);});
  metrics={...metrics,...outer,hole_centers:centers,radius:3,center_distances:distances,max_radius_error:radiusError,occ_bounds_and_length_match:true};
 }else if(m.id==='02'){
  assert.equal(data.ellipses.length,1);assert.equal(data.outlines.length,1);const e=data.ellipses[0];vector(e.values.slice(0,5),[10,20,10,0,0.5]);
  vector(data.boxes.find(b=>b.handle===e.handle).values,[0,15,20,25]);const o=data.outlines[0];assert.equal(data.unit,'毫米');
  // Native FreeCAD output uses 6.28318, not exact 2*pi: preserve this export fact.
  vector(e.values.slice(5),[0,6.28318]);assert.equal(o.closed,false);
  const error=Math.max(...o.points.map(p=>Math.abs(((p[0]-10)/10)**2+((p[1]-20)/5)**2-1)));assert(error<1e-8);
  const gap=Math.hypot(o.points[0][0]-o.points.at(-1)[0],o.points[0][1]-o.points.at(-1)[1]);assert(gap>0&&gap<0.002);
  const forward=Math.max(...Array.from({length:2049},(_,i)=>{const t=2*Math.PI*i/2048;return distance([10+10*Math.cos(t),20+5*Math.sin(t)],o.points);}));assert(forward<=0.002);
  vector(require('./freecad-export.json').models[1].occ_measurements[0].bounds,[0,15,20,25]);
  metrics={...metrics,center:[10,20],major_vector:[10,0],ratio:0.5,bounds:[0,15,20,25],max_ellipse_equation_error:error,native_end_parameter:e.values[6],outline_closed:o.closed,export_seam_gap:gap,analytic_reference_samples:2049,reference_to_outline_max:forward,distance_limit:0.002};
 }else{
  assert.equal(data.entities.length,4);assert(data.entities.every(e=>e.kind==='LINE'));assert.equal(data.outlines.length,4);
  metrics={...metrics,...rectangle(data.outlines)};assert.equal(data.unit,'未声明');
 }
 const stem=m.input.split('/').at(-1).replace('.dxf','');
 const outputs={api:save('actual/'+stem+'-api.txt',api.stdout),report:save('actual/'+stem+'-report.txt',report.stdout),svg:save('actual/'+stem+'.svg',svg.stdout)};
 results.push({id:m.id,application:m.application,input:m.input,input_sha256:manifest.files[m.input],strict_exit:report.exit,check_incomplete:data.incomplete,commands:[apiCommand,reportCommand,svgCommand].map(a=>['moon',...a]),metrics,outputs});
}
const stable={scope:'Three actual CAD exports from two applications; targeted verification only',passed:results.length,total:manifest.models.length,results};
save('results.json',JSON.stringify(stable,null,2)+'\n');
fs.mkdirSync(path.join(root,'_build'),{recursive:true});fs.writeFileSync(path.join(root,'_build/cad-exports.json'),JSON.stringify({...stable,source_commit:revision.commit,source_dirty:revision.dirty,toolchain},null,2)+'\n');
console.log(`${results.length}/${manifest.models.length} actual CAD exports passed (two exporter applications)`);
