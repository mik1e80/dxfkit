// Lightweight checks only: document targets, current API wording, About data and PDF envelope.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const docs=['README.md','README.mbt.md','docs/submission.md','docs/resubmission-evidence.md','docs/verification-guide.md','docs/delivery-verification.md','docs/review-cases.md','examples/model-validation/README.md','examples/model-validation/SUMMARY.md','docs/r2-submission-20261022.md'];
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
