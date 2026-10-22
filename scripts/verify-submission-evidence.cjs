// Replay real CLI output; independent analytic references never call library geometry helpers.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process'),{createHash}=require('node:crypto');
const {root,environment,source}=require('./environment.cjs');
const folder='docs/submission-evidence',write=process.argv.includes('--write');
const lf=s=>s.replace(/\r\n?/g,'\n');
const hash=s=>createHash('sha256').update(s).digest('hex');
const cases=[
  {id:'normal-plate',file:'examples/plate.dxf',gap:0.5,exit:0,polygons:5,required:['单位声明 毫米'],forbidden:['检查不完整','[最小间隙]','[重复切割]','[轮廓闭合]','[退化几何]','[自相交]']},
  {id:'problem-paths',file:'examples/issues.dxf',exit:1,required:['[警告] [重复切割]','[致命] [退化几何]','半径是负数（-1）'],forbidden:['检查不完整']},
  {id:'open-contour',file:'examples/evidence/open-contour.dxf',exit:1,required:['[警告] [轮廓闭合]','最宽的缝 10'],forbidden:['检查不完整','[重复切割]','[退化几何]']},
  {id:'insufficient-gap',file:'examples/plate.dxf',gap:8,exit:1,required:['[警告] [最小间隙]','4 对实体','折线最小距离 7（'],forbidden:['检查不完整','[自相交]','[重复切割]']},
  {id:'unsupported-and-ocs',file:'examples/coverage-limits.dxf',exit:1,required:['检查不完整','HATCH','DIMENSION','RAY','OCS']},
  {id:'damaged-vertices',file:'examples/completeness-mixed.dxf',exit:1,required:['检查不完整','LWPOLYLINE','POLYLINE','SPLINE','OCS','RAY'],polygons:2},
  {id:'array-first-only',file:'examples/evidence/array-limit.dxf',exit:1,required:['检查不完整','阵列暂只展开首个实例'],polygons:1},
  {id:'discretization-limit',file:'examples/consumer/fixtures/discretization-error.dxf',exit:1,required:['检查不完整','离散'],polygons:0},
  {id:'analytic-ellipse',file:'examples/evidence/analytic-ellipse.dxf',tol:0.002,exit:0,polygons:1,forbidden:['检查不完整','[自相交]']},
  {id:'analytic-cubic',file:'examples/evidence/analytic-cubic.dxf',tol:0.002,exit:1,polygons:1,required:['[轮廓闭合]'],forbidden:['检查不完整','[自相交]','[退化几何]']},
];
function cli(args){
  const r=spawnSync('moon',['run','cli',...args],{cwd:root,encoding:'utf8',timeout:60000});
  if(r.error)throw r.error;
  assert(r.status===0||r.status===1,r.stdout+r.stderr);
  return {exit:r.status,text:lf(r.stdout)};
}
function outlines(svg){return [...svg.matchAll(/<(polygon|polyline)\b[^>]*points="([^"]*)"/g)].map(m=>({closed:m[1]==='polygon',points:m[2].trim().split(/\s+/).map(p=>p.split(',').map(Number))}));}
function near(a,b,eps=1e-10){assert(Number.isFinite(a)&&Math.abs(a-b)<=eps,`${a} expected ${b} +/- ${eps}`);}
function distance(p,points,closed){
  let best=Infinity;
  for(let i=0;i<points.length-(closed?0:1);i++){
    const a=points[i],b=points[(i+1)%points.length],dx=b[0]-a[0],dy=b[1]-a[1];
    const len=dx*dx+dy*dy,t=len===0?0:Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/len));
    best=Math.min(best,Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy));
  }
  return best;
}
function curveMetric(outline,reference){
  const samples=Array.from({length:2049},(_,i)=>reference(i/2048));
  const forward=Math.max(...samples.map(p=>distance(p,outline.points,outline.closed)));
  const reverse=Math.max(...outline.points.map(p=>distance(p,samples,false)));
  assert(forward<=0.002+1e-9&&reverse<=0.002+1e-9,'analytic curve distance exceeds 0.002');
  return {samples:2049,reference_to_svg_max_distance:forward,svg_to_reference_polyline_max_distance:reverse,allowed_distance:0.002+1e-9};
}
// Display metrics use 12 significant digits; all assertions above use unrounded doubles.
const readable=x=>JSON.parse(JSON.stringify(x,(_k,v)=>typeof v==='number'?Number(v.toPrecision(12)):v));
function artifact(file,content){
  const target=path.join(root,folder,file);
  if(write){fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,content);}
  else assert.equal(lf(fs.readFileSync(target,'utf8')),content,`Saved artifact differs: ${file}; inspect before --write`);
  return `${folder}/${file}`;
}
const actualEnvironment=environment(),revision=source(),results=[];
for(const c of cases){
  const tol=c.tol||0.01;
  const checkArgs=['check',c.file,'--tol',String(tol),'--min-gap',String(c.gap||0),'--strict'];
  const svgArgs=['svg',c.file,'--tol',String(tol)];
  const report=cli(checkArgs),svg=cli(svgArgs);
  assert.equal(report.exit,c.exit,report.text);assert.equal(svg.exit,0);
  assert(svg.text.startsWith('<svg'),'SVG output must be actual SVG');
  for(const text of c.required||[])assert(report.text.includes(text),`${c.id}: missing ${text}\n${report.text}`);
  for(const text of c.forbidden||[])assert(!report.text.includes(text),`${c.id}: unexpected ${text}\n${report.text}`);
  const shapes=outlines(svg.text);
  if(c.polygons!==undefined)assert.equal(shapes.length,c.polygons,c.id);
  let metrics={};
  if(c.id==='normal-plate'){
    const outer=shapes[0];assert(outer.closed);
    assert.deepEqual(outer.points,[[0,0],[100,0],[100,60],[0,60]]);
    let area=0,perimeter=0;
    outer.points.forEach((a,i)=>{const b=outer.points[(i+1)%4];area+=a[0]*b[1]-b[0]*a[1];perimeter+=Math.hypot(a[0]-b[0],a[1]-b[1]);});
    near(area/2,6000);near(perimeter,320);
    let maxRadiusError=0,maxSagitta=0;
    const centers=[[10,10],[90,10],[90,50],[10,50]];
    for(let i=0;i<4;i++){
      const s=shapes[i+1],center=centers[i];assert(s.closed);
      s.points.forEach((p,j)=>{
        const q=s.points[(j+1)%s.points.length];
        maxRadiusError=Math.max(maxRadiusError,Math.abs(Math.hypot(p[0]-center[0],p[1]-center[1])-3));
        maxSagitta=Math.max(maxSagitta,3-Math.hypot((p[0]+q[0])/2-center[0],(p[1]+q[1])/2-center[1]));
      });
    }
    assert(maxRadiusError<=1e-10&&maxSagitta<=tol+1e-10);
    assert(!/^\[/m.test(report.text),'normal plate must have no findings');
    metrics={outer_width:100,outer_height:60,outer_area:area/2,outer_perimeter:perimeter,hole_centers:centers,hole_radius:3,hole_diameter:6,max_radius_error:maxRadiusError,max_chord_sagitta:maxSagitta,allowed_radius_error:1e-10,allowed_sagitta:tol+1e-10};
  }
  if(c.id==='analytic-ellipse'){
    const s=shapes[0];assert(s.closed);near(s.points[0][0],13);near(s.points[0][1],24);
    const equationError=Math.max(...s.points.map(p=>{
      const x=p[0]-10,y=p[1]-20,u=(3*x+4*y)/25,v=(-4*x+3*y)/12.5;
      return Math.abs(u*u+v*v-1);
    }));assert(equationError<=1e-10);
    metrics={...curveMetric(s,t=>{const a=2*Math.PI*t;return [10+3*Math.cos(a)-2*Math.sin(a),20+4*Math.cos(a)+1.5*Math.sin(a)];}),max_ellipse_equation_error:equationError,allowed_equation_error:1e-10};
  }
  if(c.id==='analytic-cubic'){
    assert(!shapes[0].closed);
    metrics=curveMetric(shapes[0],t=>[3*t*t-2*t*t*t,3*t*(1-t)*(1-2*t)]);
  }
  const input=lf(fs.readFileSync(path.join(root,c.file),'utf8'));
  if(c.id==='normal-plate'){
    assert(input.includes('$INSUNITS\n70\n4\n'));
    const layers=[...input.matchAll(/\n8\n([^\n]+)/g)].map(m=>m[1]);
    assert.deepEqual(layers,['CUT','CUT','CUT','CUT','CUT']);
    metrics.declared_unit='millimeters';metrics.entity_layers=layers;
  }
  results.push({id:c.id,input:c.file,input_sha256_lf:hash(input),commands:[['moon','run','cli',...checkArgs],['moon','run','cli',...svgArgs]],
    expected:{strict_exit:c.exit,required:c.required||[],forbidden:c.forbidden||[],outlines:c.polygons??null},
    actual:{strict_exit:report.exit,svg_exit:svg.exit,outlines:shapes.length,findings:report.text.split('\n').filter(l=>l.startsWith('[')),metrics:readable(metrics)},
    artifacts:{report:artifact(c.id+'.txt',report.text),svg:artifact(c.id+'.svg',svg.text)},passed:true});
  console.log('PASS evidence '+c.id);
}
const record={schema:1,checked_on:'2026-10-22',scope:'Self-authored targeted cases; not independent truth for the 47 third-party drawings',
  production_source_commit:'1a8185925e2c038039e6f57f32c69421e833d437',
  oracle:{kind:'independent Node analytic formulas; no production geometry helpers or ezdxf runtime',script:'scripts/verify-submission-evidence.cjs',script_sha256_lf:hash(lf(fs.readFileSync(__filename,'utf8'))),numeric_display_significant_digits:12},
  pinned_profile:JSON.parse(fs.readFileSync(path.join(root,'reproduction.json'),'utf8')),passed:results.length,total:cases.length,cases:results};
artifact('results.json',JSON.stringify(record,null,2)+'\n');
fs.mkdirSync(path.join(root,'_build'),{recursive:true});
fs.writeFileSync(path.join(root,'_build/submission-evidence.json'),JSON.stringify({source_commit:revision.commit,source_dirty:revision.dirty,toolchain:actualEnvironment,...record},null,2)+'\n');
console.log(`${results.length}/${cases.length} submission evidence cases passed${write?' (saved)':''}`);
