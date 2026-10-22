// Targeted model validation through public MoonBit API and actual CLI, not a full test run.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process'),{createHash}=require('node:crypto');
const {root,environment,source}=require('../../scripts/environment.cjs');
const dir=__dirname,write=process.argv.includes('--write'),spec=require('./expected.json');
const lf=s=>s.replace(/\r\n?/g,'\n'),hash=s=>createHash('sha256').update(s).digest('hex');
const rounded=x=>JSON.parse(JSON.stringify(x,(_k,v)=>typeof v==='number'?Number(v.toPrecision(12)):v));
function save(file,text){const p=path.join(dir,file);if(write){fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,text);}else assert.equal(lf(fs.readFileSync(p,'utf8')),text,`Saved result differs: ${file}; investigate before updating`);return file;}
function run(args){const r=spawnSync('moon',args,{cwd:root,encoding:'utf8',timeout:60000});if(r.error)throw r.error;assert(r.status===0||r.status===1,r.stdout+r.stderr);return {exit:r.status,stdout:lf(r.stdout)};}
function near(a,b,e=1e-9){assert(Number.isFinite(a)&&Math.abs(a-b)<=e,`${a} expected ${b} +/- ${e}`);}
function vector(a,b,e=1e-9){assert.equal(a.length,b.length);a.forEach((n,i)=>near(n,b[i],e));}
function box(points){return [Math.min(...points.map(p=>p[0])),Math.min(...points.map(p=>p[1])),Math.max(...points.map(p=>p[0])),Math.max(...points.map(p=>p[1]))];}
function area(points){return points.reduce((s,p,i)=>{const q=points[(i+1)%points.length];return s+p[0]*q[1]-p[1]*q[0];},0)/2;}
function distance(p,points,closed){let best=Infinity;for(let i=0;i<points.length-(closed?0:1);i++){const a=points[i],b=points[(i+1)%points.length],dx=b[0]-a[0],dy=b[1]-a[1],den=dx*dx+dy*dy,t=den?Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/den)):0;best=Math.min(best,Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy));}return best;}
function parse(text){
  const data={entities:[],fields:{},outlines:[],bounds:{}};let current;
  for(const line of text.trim().split('\n')){const [tag,...v]=line.split('|');
    if(tag==='UNIT')data.unit=v[0];
    else if(tag==='ENTITY')data.entities.push({handle:v[0],kind:v[1],layer:v[2]});
    else if(tag==='BOUNDS')data.bounds[v[0]]=v.slice(1).map(Number);
    else if(tag==='OUTLINE'){current={handle:v[0],layer:v[1],closed:v[2]==='true',count:+v[3],points:[]};data.outlines.push(current);}
    else if(tag==='POINT'){assert(current);current.points.push(v.map(Number));}
    else if(tag==='INCOMPLETE')data.incomplete=v[0]==='true';
    else if(tag==='EXPANSION_WARNING')(data.warnings??=[]).push(v[0]);
    else {const h=v[0];data.fields[h]??={};(data.fields[h][tag]??=[]).push(v.slice(1));}
  }
  for(const o of data.outlines){assert.equal(o.points.length,o.count);assert(o.points.every(p=>p.every(Number.isFinite)));}
  return data;
}
function field(data,h,kind){assert(data.fields[h]?.[kind],`${h}: missing ${kind}`);return data.fields[h][kind][0].map(Number);}
function curve(data,handle,referenceFile,select=p=>p){
  const outline=data.outlines.find(o=>o.handle===handle);assert(outline);
  const reference=lf(fs.readFileSync(path.join(dir,'references',referenceFile),'utf8')).trim().split('\n').slice(1).map(l=>l.split(',')).filter(v=>v[0]===handle).map(v=>v.slice(2).map(Number));
  assert.equal(reference.length,2049);
  const points=select(outline.points);
  const forward=Math.max(...reference.map(p=>distance(p,points,outline.closed)));
  const reverse=Math.max(...points.map(p=>distance(p,reference,false)));
  assert(forward<=spec.curve_distance_limit&&reverse<=spec.curve_distance_limit,`curve ${handle}: ${forward}/${reverse}`);
  return {samples:reference.length,reference_to_output_max:forward,output_to_reference_polyline_max:reverse,limit:spec.curve_distance_limit};
}
const toolchain=environment(),revision=source(),results=[];
for(const m of spec.models){
  const input='examples/model-validation/'+m.file;
  const command=['run','examples/model-validation/runner',input];
  const probe=run(command);assert.equal(probe.exit,0);const data=parse(probe.stdout);assert.equal(data.unit,'毫米');
  const checkCommand=['run','cli','check',input,'--tol',String(m.tol),'--min-gap',String(m.min_gap),'--strict'];
  const report=run(checkCommand),svgCommand=['run','cli','svg',input,'--tol',String(m.tol)],svg=run(svgCommand);
  assert.equal(report.exit,m.strict_exit,report.stdout);assert.equal(svg.exit,0);assert(svg.stdout.startsWith('<svg'));
  const svgOutlines=[...svg.stdout.matchAll(/<(polygon|polyline)\b[^>]*points="([^"]*)"/g)].map(x=>({closed:x[1]==='polygon',points:x[2].trim().split(/\s+/).map(p=>p.split(',').map(Number))}));
  assert.equal(svgOutlines.length,data.outlines.length);
  data.outlines.forEach((o,i)=>{assert.equal(svgOutlines[i].closed,o.closed);assert.equal(svgOutlines[i].points.length,o.points.length);o.points.forEach((p,j)=>vector(svgOutlines[i].points[j],p));});
  for(const s of m.required)assert(report.stdout.includes(s),`${m.id}: missing ${s}\n${report.stdout}`);
  for(const s of m.forbidden)assert(!report.stdout.includes(s),`${m.id}: unexpected ${s}`);
  assert(!report.stdout.includes('机床不认字符串')&&!report.stdout.includes('不会被切'));
  let metrics={};const t=m.truth;
  if(m.id==='01'||m.id==='02'){
    const o=data.outlines[0];assert(o.closed);assert.equal(o.points.length,4);o.points.forEach((p,i)=>vector(p,t.vertices[i]));vector(box(o.points),[0,0,100,60]);near(area(o.points),6000);
    metrics={bounds:box(o.points),width:100,height:60,edges:4,area:area(o.points)};
    assert(!/^\[/m.test(report.stdout),'normal plate must have no findings');assert(!data.incomplete);
  }
  let probes=[];
  if(m.id==='02'){
    const circles=data.entities.filter(e=>e.kind==='CIRCLE');assert.equal(circles.length,4);
    const centers=circles.map((e,i)=>{const c=field(data,e.handle,'CIRCLE');vector(c,[...t.hole_centers[i],t.radius]);return c.slice(0,2);});
    let distances=[];for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)distances.push(Math.hypot(centers[i][0]-centers[j][0],centers[i][1]-centers[j][1]));vector(distances,t.center_pair_distances);
    let maxRadiusError=0;circles.forEach((c,i)=>{const o=data.outlines.find(o=>o.handle===c.handle);assert(o.closed);for(const p of o.points)maxRadiusError=Math.max(maxRadiusError,Math.abs(Math.hypot(p[0]-centers[i][0],p[1]-centers[i][1])-3));});assert(maxRadiusError<=1e-9);
    const gapCommand=['run','cli','check',input,'--tol','0.002','--min-gap','8','--strict'],gap=run(gapCommand);assert.equal(gap.exit,1);assert(gap.stdout.includes('[最小间隙]')&&gap.stdout.includes('4 对实体')&&gap.stdout.includes('折线最小距离 7（'));
    probes.push({command:['moon',...gapCommand],exit:gap.exit,report:save('actual/02-gap-8.txt',gap.stdout)});
    metrics={...metrics,centers,radius:3,diameter:6,center_pair_distances:distances,max_radius_error:maxRadiusError,analytic_outer_clearance:7,clearance_thresholds:{0.5:'no finding',8:'4 pairs, minimum 7'}};
  }
  if(m.id==='03'){
    metrics.arcs=t.arcs.map(a=>{const f=field(data,a.handle,'ARC');vector(f.slice(0,3),[...a.center,a.radius]);near(f[3],a.start_deg*Math.PI/180);near(f[4],((a.start_deg+a.sweep_deg)%360)*Math.PI/180);vector(data.bounds[a.handle],a.bounds);
      const o=data.outlines.find(o=>o.handle===a.handle);assert(!o.closed);let sweep=0,maxRadiusError=0;
      o.points.forEach((p,i)=>{maxRadiusError=Math.max(maxRadiusError,Math.abs(Math.hypot(p[0]-a.center[0],p[1]-a.center[1])-a.radius));if(i){const q=o.points[i-1],u=Math.atan2(q[1]-a.center[1],q[0]-a.center[0]),v=Math.atan2(p[1]-a.center[1],p[0]-a.center[0]);let d=v-u;if(d< -Math.PI)d+=2*Math.PI;assert(d>0&&d<Math.PI);sweep+=d;}});
      assert(maxRadiusError<=1e-9);near(sweep,a.sweep_deg*Math.PI/180);
      const reference=fs.readFileSync(path.join(dir,'references/03-arcs.csv'),'utf8').trim().split('\n').slice(1).map(l=>l.split(',')).filter(v=>v[0]===a.handle);vector(o.points[0],reference[0].slice(2).map(Number));vector(o.points.at(-1),reference.at(-1).slice(2).map(Number));
      return {handle:a.handle,decoded:f,bounds:data.bounds[a.handle],start:o.points[0],end:o.points.at(-1),ccw_sweep_radians:sweep,max_radius_error:maxRadiusError,...curve(data,a.handle,'03-arcs.csv')};});
  }
  if(m.id==='04'){
    const f=field(data,'401','ELLIPSE');vector(f.slice(0,5),[...t.center,...t.major_vector,t.axis_ratio]);vector(data.bounds['401'],t.bounds);
    const o=data.outlines[0];assert(o.closed);let equationError=Math.max(...o.points.map(p=>Math.abs(((p[0]-10)/10)**2+((p[1]-20)/5)**2-1)));assert(equationError<=1e-9);
    metrics={center:f.slice(0,2),major_vector:f.slice(2,4),axis_ratio:f[4],major_diameter:20,minor_diameter:10,bounds:data.bounds['401'],max_equation_error:equationError,...curve(data,'401','04-ellipse.csv')};
  }
  if(m.id==='05'){
    const vertices=data.fields['501'].VERTEX.map(v=>v.map(Number));assert.equal(vertices.length,3);vertices.forEach((v,i)=>vector(v,[...t.vertices[i],t.bulges[i]]));vector(data.bounds['501'],t.bounds);
    const o=data.outlines[0];assert(!o.closed);vector(o.points[0],[0,0]);vector(o.points.at(-2),[20,0]);vector(o.points.at(-1),[20,-10]);const arc=o.points.slice(0,-1);assert(arc.every(p=>p[1]>=-1e-9));assert(Math.max(...arc.map(p=>p[1]))>9.99);
    metrics={vertices,bounds:data.bounds['501'],arc_side:'above chord y=0',...curve(data,'501','05-bulge.csv',pts=>pts.slice(0,-1))};
  }
  if(m.id==='06'){
    const f=field(data,'601','SPLINE');vector(f.slice(0,3),[3,8,4]);vector(data.fields['601'].KNOT.map(v=>+v[0]),t.knots);data.fields['601'].CONTROL.forEach((p,i)=>vector(p.map(Number),[...t.controls[i],0]));
    const o=data.outlines[0];vector(o.points[0],t.endpoints[0]);vector(o.points.at(-1),t.endpoints[1]);assert(Math.max(...o.points.map(p=>p[1]))>11.5&&Math.min(...o.points.map(p=>p[1]))< -11.5);
    metrics={degree:3,knots:t.knots,control_points:t.controls,endpoints:[o.points[0],o.points.at(-1)],reference_kind:t.reference_kind,...curve(data,'601','06-spline.csv')};
  }
  if(m.id==='07'){
    assert.equal(data.outlines.length,3);metrics.placements=t.inserts.map((i,n)=>{const raw=data.fields[i.handle].INSERT[0];assert.equal(raw[0],'B');vector(raw.slice(1).map(Number),[...i.at,...i.scale,i.angle*Math.PI/180]);const o=data.outlines[n];assert(o.closed);assert.equal(o.layer,'CUT');assert.equal(o.points.length,4);o.points.forEach((p,j)=>vector(p,i.world[j]));const b=box(o.points);return {insert_handle:i.handle,world_vertices:o.points,bounds:b,width:b[2]-b[0],height:b[3]-b[1]};});assert(!data.incomplete);assert(!/^\[/m.test(report.stdout));
  }
  if(m.id==='08'){
    assert.equal(data.entities.length,5);assert.equal(data.outlines.filter(o=>o.layer==='CUT').length,2);assert(data.outlines.filter(o=>o.layer==='CUT').every(o=>o.closed));assert(data.incomplete);
    const findings=report.stdout.split('\n').filter(l=>l.startsWith('['));assert.equal(findings.filter(l=>l.includes('[文字未转曲线]')).length,1);assert.equal(findings.filter(l=>l.includes('[提示] [图层]')).length,2);
    metrics={entity_layers:data.entities.map(e=>({handle:e.handle,layer:e.layer})),cut_outlines:2,cut_closed:true,text_findings:1,off_frozen_info_findings:2,closure_findings:0};
  }
  if(m.id==='09'){
    assert(!data.outlines[0].closed);near(Math.hypot(data.outlines[0].points[0][0]-data.outlines[0].points.at(-1)[0],data.outlines[0].points[0][1]-data.outlines[0].points.at(-1)[1]),0.1);vector(data.outlines[1].points[0],data.outlines[2].points[0]);vector(data.outlines[1].points[1],data.outlines[2].points[1]);assert(report.stdout.includes('共 10 长度'));assert(!data.incomplete);
    metrics={actual_opening:0.1,duplicate_handles:['902','903'],overlap_length:10,diagnostic_categories:['轮廓闭合','重复切割']};
  }
  if(m.id==='10'){assert(data.incomplete);assert(data.entities.some(e=>e.kind==='HATCH'));assert(data.entities.some(e=>e.handle==='A03'&&e.kind==='CIRCLE'));assert(data.outlines.some(o=>o.handle==='A01'));metrics={incomplete:true,unexamined:['HATCH boundary','CIRCLE non-default OCS'],normal_rectangle_retained:true};}
  const prefix='actual/'+m.id;
  results.push({id:m.id,model:m.file,input_sha256_lf:hash(lf(fs.readFileSync(path.join(dir,m.file),'utf8'))),commands:[['moon',...command],['moon',...checkCommand],['moon',...svgCommand]],expected:{strict_exit:m.strict_exit,required:m.required,forbidden:m.forbidden},actual:{strict_exit:report.exit,incomplete:data.incomplete,entity_count:data.entities.length,outline_count:data.outlines.length,findings:report.stdout.split('\n').filter(l=>l.startsWith('[')),metrics:rounded(metrics)},probes,
    artifacts:{public_api:save(prefix+'-public-api.txt',probe.stdout),report:save(prefix+'-report.txt',report.stdout),svg:save(prefix+'-preview.svg',svg.stdout)},passed:true});
  console.log('PASS model '+m.id+' '+m.name);
}
const result={schema:1,checked_on:'2026-10-22',submission_ref:require('../../reproduction.json').submission_ref,source_identity:'Final tag resolves source SHA; _build/model-validation.json records actual executing HEAD and dirty state',provenance:'10 project-authored parametric fixtures; no external CAD visual confirmation or external spline export was performed',toolchain_profile:require('../../reproduction.json'),passed:results.length,total:spec.models.length,models:results};
save('results.json',JSON.stringify(result,null,2)+'\n');
const tiles=results.map((r,i)=>{
  const svg=fs.readFileSync(path.join(dir,r.artifacts.svg),'utf8'),view=svg.match(/viewBox="([^"]+)"/)[1];
  const inner=svg.replace(/^<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');
  const x=20+(i%5)*300,y=64+Math.floor(i/5)*242;
  return `<g><rect x="${x}" y="${y}" width="284" height="224" rx="8" fill="white" stroke="#d8e2eb"/><text x="${x+12}" y="${y+22}" font-size="14" fill="#16324b">${r.id} ${spec.models[i].name}</text><svg x="${x+12}" y="${y+32}" width="260" height="158" viewBox="${view}" preserveAspectRatio="xMidYMid meet">${inner}</svg><text x="${x+12}" y="${y+210}" font-size="12" fill="#526375">PASS / strict=${r.actual.strict_exit} / incomplete=${r.actual.incomplete}</text></g>`;
});
save('OVERVIEW.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="1520" height="560" viewBox="0 0 1520 560"><rect width="1520" height="560" fill="#f3f7fa"/><g font-family="sans-serif"><text x="32" y="35" font-size="22" fill="#16324b">DXFKit / 10 model validations / actual CLI previews</text>${tiles.join('')}</g></svg>\n`);
save('SUMMARY.md','# 十类模型测试总结\n\n核对日期：2026-10-22。'+results.length+'/'+spec.models.length+' 主模型通过逐项断言；这是项目自建模型，不是新增第三方图纸认证。所有测试均从实际 DXF 文件经公开库接口和 CLI 执行。\n\n| 模型 | 输入 | 实际 strict 退出码 | 检查不完整 | 报告 / SVG / 数据 |\n| --- | --- | --- | --- | --- |\n'+results.map(r=>`| ${r.id} | [${path.basename(r.model)}](${r.model}) | ${r.actual.strict_exit} | ${r.actual.incomplete} | [报告](${r.artifacts.report}) / [SVG](${r.artifacts.svg}) / [接口数据](${r.artifacts.public_api}) |`).join('\n')+'\n\n尺寸、字段、曲线双向采样误差、块坐标、预期和实际诊断见 [results.json](results.json)，人工指定的几何定义见 [expected.json](expected.json)。02 另保存阈值 8 的净距报警结果；0.5 时正常无发现。08 同时检出文字未转轮廓及两种图层状态提示，并断言关闭/冻结层未产生本工具的闭合告警。09 检出开口和重复线；10 明确标记检查不完整。\n\n05 未进行 CAD 软件目视确认；06 使用独立 Bernstein 解析采样，未进行外部 CAD 导出对照。这两项外部确认不能由 10/10 自动测试结果代替。47 个第三方文件的逐文件独立几何真值仍为 0/47。\n');
fs.mkdirSync(path.join(root,'_build'),{recursive:true});fs.writeFileSync(path.join(root,'_build/model-validation.json'),JSON.stringify({source_commit:revision.commit,source_dirty:revision.dirty,toolchain,...result},null,2)+'\n');
console.log(`${results.length}/${spec.models.length} model validations passed${write?' (saved)':''}`);
