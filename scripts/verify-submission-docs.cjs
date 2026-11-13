// Lightweight checks only: document targets, current API wording, About data and PDF envelope.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const docs=['docs/advisor-20261113.md','examples/r12-validation/LICENSE.md','SECURITY.md','CONTRIBUTING.md','docs/security-20261107.md','README.md','README.mbt.md','COMPARISON.md','docs/submission.md','docs/resubmission-evidence.md','docs/verification-guide.md','docs/delivery-verification.md','docs/review-cases.md','docs/r12-profile.md','docs/resubmission-20261027.md','docs/review-response.md','examples/r12-validation/README.md','examples/r12-validation/EXTERNAL.md','examples/model-validation/README.md','examples/model-validation/SUMMARY.md','docs/r2-submission-20261022.md'];
let links=0;
for(const file of docs){
  const text=fs.readFileSync(path.join(root,file),'utf8');
  for(const m of text.matchAll(/\]\(([^)]+)\)/g)){
    const target=m[1].split('#')[0];
    if(!target||/^[a-z]+:/i.test(target))continue;
    assert(fs.existsSync(path.resolve(root,path.dirname(file),target)),`${file}: missing ${target}`);links++;
  }
}
const api=fs.readFileSync(path.join(root,'README.mbt.md'),'utf8');
assert(api.includes('裸 `Geometry::Face`'));
assert(api.includes('`Entity::flatten_checked(tol)`'));
assert(!api.includes('Face 的 flatten / checked 结果为 Empty'));
const readme=fs.readFileSync(path.join(root,'README.md'),'utf8');
const profile=require('../reproduction.json');
const proposal=fs.readFileSync(path.join(root,'docs/submission.md'),'utf8');
assert(proposal.trimEnd().split(/\r?\n/).length<=30,'Keep the main-contest Markdown brief within 30 lines');
assert(readme.includes(profile.version)&&proposal.includes(profile.version),'Current candidate version must be explicit');
assert(proposal.includes('未发布')&&proposal.includes('targeted-r12'));
assert(!proposal.includes('阵列只展开首实例')&&!proposal.includes('非默认 OCS 引用整体跳过'));
assert(readme.indexOf('## 快速运行')<readme.indexOf('## 验证与开发'));
assert(readme.indexOf('## 审阅与申报材料')>readme.indexOf('## 快速运行'));
const about=JSON.parse(fs.readFileSync(path.join(root,'.github/repository-about.json'),'utf8'));
assert(about.description.length>0&&about.description.length<=350);
assert.equal(about.homepage,'https://mik1e80.github.io/dxfkit/');
assert(about.topics.length<=20&&new Set(about.topics).size===about.topics.length);
assert(about.topics.every(t=>/^[a-z0-9][a-z0-9-]{0,49}$/.test(t)));
const pdf=fs.readFileSync(path.join(root,'output/pdf/dxfkit-submission-one-page.pdf'));
assert(pdf.subarray(0,5).toString()==='%PDF-'&&pdf.length>10000);
assert.equal([...pdf.toString('latin1').matchAll(/\/Type\s*\/Page\b/g)].length,1,'Expected one PDF page object; also inspect with pypdf and render');
console.log(`PASS: ${docs.length} documents, ${links} local links, Face API wording, About fields and one-page PDF envelope`);
const capabilities=JSON.parse(fs.readFileSync(path.join(root,'docs/capabilities.json'),'utf8'));
assert.equal(capabilities.schema,'dxfkit-capabilities-v1');
assert(capabilities.version.startsWith(profile.version));
const kinds=new Set();
for(const row of capabilities.entities){
 assert.equal(typeof row.r12,'boolean');
 for(const field of ['raw','fields','geometry','check'])assert.equal(typeof row[field],'string');
 for(const kind of row.kinds){assert(!kinds.has(kind));kinds.add(kind);}
}
for(const kind of ['LINE','INSERT','ATTRIB','SHAPE','SPLINE'])assert(kinds.has(kind));
assert(fs.existsSync(path.join(root,'web/worker.js')));
const sha256=bytes=>require('node:crypto').createHash('sha256').update(bytes).digest('hex');
const external=JSON.parse(fs.readFileSync(path.join(root,'testdata/ezdxf/MANIFEST.json'),'utf8'));
const own=JSON.parse(fs.readFileSync(path.join(root,'examples/r12-validation/provenance.json'),'utf8'));
const externalFiles=fs.readdirSync(path.join(root,'testdata/ezdxf')).filter(f=>f.endsWith('.dxf')).sort();
assert.deepEqual(external.files.map(f=>f.local_file).sort(),externalFiles);
assert.equal(external.files.length,47);
for(const entry of external.files){
 assert.equal(entry.upstream_commit,null);assert.equal(entry.upstream_blob_sha,null);
 assert.equal(entry.license,'MIT');
 assert.equal(entry.local_sha256,sha256(fs.readFileSync(path.join(root,'testdata/ezdxf',entry.local_file))));
}
assert.equal(own.license,'Apache-2.0');
const ownFiles=fs.readdirSync(path.join(root,'examples/r12-validation/models')).filter(f=>f.endsWith('.dxf')).map(f=>'models/'+f).sort();
assert.deepEqual(own.models.map(f=>f.file).sort(),ownFiles);assert.equal(ownFiles.length,6);
for(const entry of own.models){
 const bytes=fs.readFileSync(path.join(root,'examples/r12-validation',entry.file));
 assert.equal(entry.sha256,sha256(bytes));assert.equal(entry.license,'Apache-2.0');
 assert(bytes.toString('ascii').includes('AC1009'));
}
console.log('PASS: 47 external and 6 project-authored provenance entries, paths, licenses and raw SHA-256');
