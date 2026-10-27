// Self-authored parametric DXF models and independent references. No dxfkit calls.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const write=process.argv.includes('--write'),dir=__dirname;
function save(file,text){const target=path.join(dir,file);if(write){fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,text);}else assert.equal(fs.readFileSync(target,'utf8').replace(/\r\n?/g,'\n'),text,file);}
const tags=a=>a.map(x=>String(x)).join('\n')+'\n';
const section=(name,a)=>[0,'SECTION',2,name,...a,0,'ENDSEC'];
const header=[9,'$ACADVER',1,'AC1027',9,'$INSUNITS',70,4];
const drawing=(entities,extra=[])=>tags([...section('HEADER',header),...extra,...section('ENTITIES',entities),0,'EOF']);
const common=(kind,h,layer='CUT')=>[0,kind,5,h,100,'AcDbEntity',8,layer];
const poly=(h,pts,closed=true,layer='CUT',bulges=[])=>[...common('LWPOLYLINE',h,layer),100,'AcDbPolyline',90,pts.length,70,closed?1:0,...pts.flatMap((p,i)=>[10,p[0],20,p[1],...(bulges[i]?[42,bulges[i]]:[])])];
const circle=(h,x,y,r,layer='CUT',extra=[])=>[...common('CIRCLE',h,layer),100,'AcDbCircle',10,x,20,y,30,0,40,r,...extra];
const line=(h,a,b,layer='CUT')=>[...common('LINE',h,layer),100,'AcDbLine',10,a[0],20,a[1],30,0,11,b[0],21,b[1],31,0];
const rect=[[0,0],[100,0],[100,60],[0,60]];
const models=[];
function add(id,name,entities,truth,options={}){
  const file=`models/${id}-${name}.dxf`;save(file,drawing(entities,options.extra||[]));
  models.push({id,name,file,origin:'project-authored parametric fixture',unit:'mm',truth_source:'Explicit design coordinates and independent analytic formulas; not dxfkit output',cad_visual_confirmation:'not performed',external_cad_export_comparison:'not performed',tol:0.002,min_gap:options.gap||0,strict_exit:options.exit||0,required:options.required||[],forbidden:options.forbidden||[],truth});
}
add('01','rectangle',poly('101',rect),{vertices:rect,bounds:[0,0,100,60],width:100,height:60,edges:4,closed:true,area:6000});
const centers=[[10,10],[90,10],[90,50],[10,50]];
add('02','four-hole-plate',[...poly('201',rect),...centers.flatMap((c,i)=>circle(String(202+i),...c,3))],{vertices:rect,hole_centers:centers,radius:3,diameter:6,center_pair_distances:[80,Math.hypot(80,40),40,40,Math.hypot(80,40),80],nearest_outer_clearance:7},{gap:0.5});
const arcs=[{handle:'301',center:[30,30],radius:20,start_deg:300,sweep_deg:120,bounds:[40,30-10*Math.sqrt(3),50,30+10*Math.sqrt(3)]},{handle:'302',center:[80,30],radius:10,start_deg:90,sweep_deg:180,bounds:[70,20,80,40]}];
add('03','arcs',arcs.flatMap(a=>[...common('ARC',a.handle),100,'AcDbCircle',10,a.center[0],20,a.center[1],30,0,40,a.radius,100,'AcDbArc',50,a.start_deg,51,(a.start_deg+a.sweep_deg)%360]),{arcs,direction:'counter-clockwise in default XY plane'},{exit:1,required:['[轮廓闭合]']});
add('04','ellipse',[...common('ELLIPSE','401'),100,'AcDbEllipse',10,10,20,20,30,0,11,10,21,0,31,0,40,0.5,41,0,42,2*Math.PI],{center:[10,20],major_vector:[10,0],axis_ratio:0.5,major_diameter:20,minor_diameter:10,bounds:[0,15,20,25]});
add('05','bulge',poly('501',[[0,0],[20,0],[20,-10]],false,'CUT',[-1,0,0]),{vertices:[[0,0],[20,0],[20,-10]],bulges:[-1,0,0],arc_center:[10,0],arc_radius:10,arc_side:'above chord y=0',bounds:[0,-10,20,10]},{exit:1,required:['[轮廓闭合]']});
const controls=[[0,0],[0,40],[80,-40],[80,0]],knots=[0,0,0,0,1,1,1,1];
add('06','spline',[...common('SPLINE','601'),100,'AcDbSpline',70,0,71,3,72,8,73,4,...knots.flatMap(k=>[40,k]),...controls.flatMap(p=>[10,p[0],20,p[1],30,0])],{degree:3,knots,controls,formula:'x=80*(3*t^2-2*t^3); y=120*t*(1-t)*(1-2*t)',endpoints:[[0,0],[80,0]],reference:'references/06-spline.csv',reference_kind:'independent analytic Bernstein sampling, NOT an external CAD export'},{exit:1,required:['[轮廓闭合]']});
const blockPts=[[1,2],[11,2],[11,6],[1,6]];
const block=section('BLOCKS',[0,'BLOCK',5,'700',100,'AcDbEntity',8,'0',100,'AcDbBlockBegin',2,'B',70,0,10,1,20,2,30,0,3,'B',1,'',...poly('701',blockPts,true,'0'),0,'ENDBLK',5,'70F',100,'AcDbEntity',8,'0',100,'AcDbBlockEnd']);
const inserts=[{handle:'711',at:[20,10],scale:[2,1],angle:90,world:[[20,10],[20,30],[16,30],[16,10]]},{handle:'712',at:[80,10],scale:[1,0.5],angle:180,world:[[80,10],[70,10],[70,8],[80,8]]},{handle:'713',at:[120,30],scale:[0.5,2],angle:270,world:[[120,30],[120,25],[128,25],[128,30]]}];
add('07','block-inserts',inserts.flatMap(i=>[...common('INSERT',i.handle),100,'AcDbBlockReference',2,'B',10,i.at[0],20,i.at[1],30,0,41,i.scale[0],42,i.scale[1],43,1,50,i.angle]),{block_name:'B',block_base:[1,2],local_vertices:blockPts,inserts},{extra:block});
const layers=[{name:'CUT',color:7,flags:0},{name:'TEXT',color:2,flags:0},{name:'AUX-OFF',color:-3,flags:0},{name:'AUX-FROZEN',color:4,flags:1}];
const tables=section('TABLES',[0,'TABLE',2,'LAYER',70,layers.length,...layers.flatMap(l=>[0,'LAYER',100,'AcDbSymbolTableRecord',100,'AcDbLayerTableRecord',2,l.name,70,l.flags,62,l.color,6,'CONTINUOUS']),0,'ENDTAB']);
add('08','layers-and-text',[...poly('801',rect),...circle('802',50,30,5),...common('TEXT','803','TEXT'),100,'AcDbText',10,10,20,70,30,0,40,4,1,'DXFKIT',...line('804',[200,0],[210,0],'AUX-OFF'),...line('805',[200,20],[210,20],'AUX-FROZEN')],{layers,cut_outlines:2,text_entities:1,off_entities:1,frozen_entities:1,closed_cut:true},{extra:tables,exit:1,required:['[文字未转曲线]','文字尚未转换为轮廓，本工具不检查字形几何，请确认下游软件的文字处理方式。','AUX-OFF','AUX-FROZEN','本工具在部分几何检查中跳过该关闭/冻结图层，请确认下游软件的实际处理方式。','检查不完整'],forbidden:['[轮廓闭合]','机床不认字符串','不会被切','[重复切割]','[自相交]']});
add('09','intentional-errors',[...poly('901',[[0,0],[100,0],[100,60],[0,60],[0,0.1]],false),...line('902',[200,0],[210,0]),...line('903',[200,0],[210,0])],{opening:0.1,duplicate_pair:['902','903'],duplicate_length:10},{exit:1,required:['[轮廓闭合]','[重复切割]'],forbidden:['检查不完整','[自相交]','[退化几何]']});
const hatch=[...common('HATCH','A02'),100,'AcDbHatch',10,0,20,0,30,0,210,0,220,0,230,1,2,'SOLID',70,1,71,0,91,1,92,2,72,0,73,1,93,4,...[[20,20],[30,20],[30,30],[20,30]].flatMap(p=>[10,p[0],20,p[1]]),97,0,75,0,76,1,98,0];
add('10','coverage-boundaries',[...poly('A01',rect),...hatch,...circle('A03',150,30,5,'CUT',[210,0,220,0,230,-1])],{normal_rectangle:rect,unsupported_boundary:'HATCH',converted_ocs:{entity:'CIRCLE',normal:[0,0,-1],wcs_center:[-150,30],radius:5},expected_incomplete:true},{exit:1,required:['HATCH','检查不完整'],forbidden:['未转换 OCS']});

function reference(id,curves){
  let csv='curve,t,x,y\n';let paths=[];
  for(const [name,formula,closed]of curves){let pts=[];for(let i=0;i<=2048;i++){const t=i/2048,[x,y]=formula(t);csv+=`${name},${t},${x},${y}\n`;pts.push([x,y]);}paths.push({name,closed,points:pts});}
  save(`references/${id}.csv`,csv);
  const points=paths.flatMap(x=>x.points),xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),x=Math.min(...xs)-2,y=Math.min(...ys)-2,w=Math.max(...xs)-x+2,h=Math.max(...ys)-y+2;
  save(`references/${id}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${-y-h} ${w} ${h}"><g transform="scale(1,-1)" fill="none" stroke="#087e83" stroke-width="0.15">${paths.map(p=>`<polyline points="${p.points.map(p=>p.join(',')).join(' ')}"/>`).join('')}</g></svg>\n`);
}
reference('03-arcs',arcs.map(a=>[a.handle,t=>{const angle=(a.start_deg+a.sweep_deg*t)*Math.PI/180;return [a.center[0]+a.radius*Math.cos(angle),a.center[1]+a.radius*Math.sin(angle)];},false]));
reference('04-ellipse',[['401',t=>[10+10*Math.cos(2*Math.PI*t),20+5*Math.sin(2*Math.PI*t)],true]]);
reference('05-bulge',[['501',t=>[10-10*Math.cos(Math.PI*t),10*Math.sin(Math.PI*t)],false]]);
reference('06-spline',[['601',t=>[80*(3*t*t-2*t*t*t),120*t*(1-t)*(1-2*t)],false]]);
save('expected.json',JSON.stringify({schema:1,created_on:'2026-10-22',units:'millimeters declared; no conversion performed',geometric_abs_epsilon:1e-9,curve_distance_limit:0.002000001,reference_samples:2049,models},null,2)+'\n');
console.log(`PASS: ${models.length} parametric models and 4 independent reference sets${write?' saved':' match saved inputs'}`);
