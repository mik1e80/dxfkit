// Check real browser output and file/strict-policy behavior for the review cases.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),vm=require('node:vm');
const assert=require('node:assert/strict'),{spawnSync}=require('node:child_process'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'web/dist/web.js'),'utf8');
const context=vm.createContext({console,TextEncoder,TextDecoder,Uint8Array});
vm.runInContext(source,context);
const drawing=body=>'0\nSECTION\n2\nENTITIES\n'+body+'0\nENDSEC\n0\nEOF\n';
const normal='0\nCIRCLE\n10\n100\n20\n100\n40\n1\n';
const face=(kind,tail='13\n2\n23\n1\n',extra='')=>'0\n'+kind+'\n10\n0\n20\n0\n11\n2\n21\n0\n12\n0\n22\n1\n'+tail+extra;
const rectangle=(x,y,w,h)=>drawing('0\nLWPOLYLINE\n90\n4\n70\n1\n10\n'+x+'\n20\n'+y+'\n10\n'+(x+w)+'\n20\n'+y+'\n10\n'+(x+w)+'\n20\n'+(y+h)+'\n10\n'+x+'\n20\n'+(y+h)+'\n');
const nested=outerOCS=>'0\nSECTION\n2\nBLOCKS\n0\nBLOCK\n2\nA\n10\n0\n20\n0\n0\nINSERT\n2\nB\n5\nINNER\n10\n0\n20\n0\n230\n-1\n'+normal+'0\nENDBLK\n0\nBLOCK\n2\nB\n10\n0\n20\n0\n0\nCIRCLE\n10\n0\n20\n0\n40\n2\n0\nENDBLK\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n0\nINSERT\n2\nA\n5\nOUTER\n10\n0\n20\n0\n'+(outerOCS?'230\n-1\n':'')+'0\nENDSEC\n0\nEOF\n';
function outlines(svg){return [...svg.matchAll(/<(?:polygon|polyline)\b[^>]*points="([^"]*)"/g)].map(m=>m[1].trim().split(/\s+/).map(p=>p.split(',').map(Number)));}
const cases=[];
for(const kind of ['SOLID','TRACE'])cases.push({id:kind+'-rectangle',text:drawing(face(kind)),status:0,points:[[0,0],[2,0],[2,1],[0,1]],clean:true});
cases.push({id:'SOLID-triangle',text:drawing(face('SOLID','13\n0\n23\n1\n')),status:0,points:[[0,0],[2,0],[0,1]],clean:true});
cases.push({id:'3DFACE-metadata',text:drawing(face('3DFACE')),status:1,count:0,reason:/3DFACE.*轮廓未参与检查/});
cases.push({id:'outer-INSERT-OCS',text:nested(true),status:1,count:0,reason:/OUTER.*未转换 OCS/});
cases.push({id:'nested-INSERT-OCS',text:nested(false),status:1,count:1,reason:/INNER.*未转换 OCS/});
for(const [id,body]of [
  ['lost-LWPOLYLINE','0\nLWPOLYLINE\n90\n3\n10\n0\n20\n0\n10\n1\n10\n2\n20\n0\n'],
  ['lost-POLYLINE','0\nPOLYLINE\n70\n0\n0\nVERTEX\n10\n0\n20\n0\n0\nVERTEX\n10\n1\n0\nVERTEX\n10\n2\n20\n0\n0\nSEQEND\n'],
  ['count-mismatch','0\nLWPOLYLINE\n90\n4\n70\n1\n10\n0\n20\n0\n10\n2\n20\n0\n10\n0\n20\n1\n']])
  cases.push({id,text:drawing(normal+body),status:1,count:id==='count-mismatch'?2:1,reason:id==='count-mismatch'?/顶点数/:/顶点/});
cases.push({id:'large-coordinate-rectangle',text:rectangle(300000,7,2,1),status:0,points:[[300000,7],[300002,7],[300002,8],[300000,8]],width:2,height:1,clean:true});
cases.push({id:'micro-coordinate-rectangle',text:rectangle(1e-9,2e-9,4e-9,3e-9),status:0,points:[[1e-9,2e-9],[5e-9,2e-9],[5e-9,5e-9],[1e-9,5e-9]],width:4e-9,height:3e-9,clean:true,tol:1e-12});
const temp=fs.realpathSync(os.tmpdir()),work=fs.mkdtempSync(path.join(temp,'dxfkit-review-'));
const results=[];
try{
  for(const c of cases){
    let actual;
    try{
      const data=Buffer.from(c.text).toString('base64');
      const polygons=outlines(context.svg(data,c.tol||0.001));
      const report=context.check(data,0);
      const file=path.join(work,c.id+'.dxf');fs.writeFileSync(file,c.text);
      const child=spawnSync('moon',['run','cli','check',file,'--strict','--tol',String(c.tol||0.001)],{cwd:root,encoding:'utf8',timeout:60000});
      if(child.error)throw child.error;
      actual={outlines:polygons.length,report,strict_exit:child.status};
      assert.equal(child.status,c.status,child.stdout+child.stderr);
      if(c.points){
        assert.equal(polygons.length,1);assert.equal(polygons[0].length,c.points.length);
        actual.points=polygons[0];
        for(let i=0;i<c.points.length;i++)for(let k=0;k<2;k++)assert(Math.abs(polygons[0][i][k]-c.points[i][k])<=(c.tol||1e-12));
      }
      if(c.width){const xs=polygons[0].map(p=>p[0]),ys=polygons[0].map(p=>p[1]);actual.width=Math.max(...xs)-Math.min(...xs);actual.height=Math.max(...ys)-Math.min(...ys);assert(Math.abs(actual.width-c.width)<=(c.tol||1e-12));assert(Math.abs(actual.height-c.height)<=(c.tol||1e-12));}
      if(c.count!==undefined)assert.equal(polygons.length,c.count);
      if(c.reason){assert.match(report,c.reason);assert.match(report,/检查不完整/);assert.match(child.stdout+child.stderr,/检查不完整/);}
      if(c.clean){assert(!report.includes('检查不完整'));assert(!report.includes('[自相交]'));assert(!report.includes('零长度'));}
      results.push({id:c.id,input_dxf:c.text,expected:{strict_exit:c.status,points:c.points,outlines:c.count,width:c.width,height:c.height,
        svg_tolerance:c.tol||0.001,cli_tolerance:c.tol||0.001,web_check_tolerance:0.05,diagnostic_pattern:c.reason?.source},actual,passed:true});
      console.log('PASS '+c.id);
    }catch(e){results.push({id:c.id,input_dxf:c.text,actual,passed:false,error:e.message});console.log('FAIL '+c.id+': '+e.message);}
  }
}finally{assert(path.dirname(path.resolve(work))===temp&&path.basename(work).startsWith('dxfkit-review-'));fs.rmSync(work,{recursive:true,force:true});}
const report={suite:'dxfkit-review-cases',checked_on:'2026-10-22',platform:process.platform,node:process.versions.node,
  bundle_sha256:createHash('sha256').update(source).digest('hex'),passed:results.filter(r=>r.passed).length,total:results.length,cases:results};
const index=process.argv.indexOf('--report');if(index>=0){assert(process.argv[index+1]);fs.writeFileSync(path.resolve(process.argv[index+1]),JSON.stringify(report,null,2)+'\n');}
console.log(`${report.passed}/${report.total} review cases passed`);if(report.passed!==report.total)process.exitCode=1;
