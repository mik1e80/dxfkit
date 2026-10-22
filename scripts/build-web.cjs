const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const {root,profile,run,environment,source}=require('./environment.cjs');
const actual=environment();
const revision=source();
assert(!revision.dirty||process.argv.includes('--allow-dirty'),'Source edits present; commit them or explicitly use --allow-dirty for development');
console.log(run('moon',['build','--target','js','--release','--frozen','--deny-warn']));
fs.mkdirSync(path.join(root,'web/dist'),{recursive:true});
fs.copyFileSync(path.join(root,'_build/js/release/build/web/web.js'),path.join(root,'web/dist/web.js'));
function descendants(rel) {
  return fs.readdirSync(path.join(root,rel),{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name)).flatMap(e=>e.isDirectory()?descendants(rel+'/'+e.name):[rel+'/'+e.name]);
}
const assets=['web/index.html','web/style.css','web/app.js','web/dist/web.js','docs/submission.md',
  'README.md','README.mbt.md','docs/verification-guide.md','output/pdf/dxfkit-submission-one-page.pdf',
  ...descendants('examples/model-validation'),
  'COMPARISON.md','docs/ecosystem-sources.json','docs/review-cases.md',
  'docs/review-cases-before.json','docs/review-cases-results.json',
  'docs/entity-capabilities.md','docs/resubmission-evidence.md',
  'docs/independent-validation.md','docs/review-response.md',
  ...fs.readdirSync(path.join(root,'docs/submission-evidence')).sort().map(f=>'docs/submission-evidence/'+f),
  ...new Set(JSON.parse(fs.readFileSync(path.join(root,'docs/submission-evidence/results.json'),'utf8')).cases.map(c=>c.input))];
const manifest={module:profile.module,version:profile.version,source_commit:revision.commit,source_dirty:revision.dirty,
  toolchain:actual,dependencies:profile.dependencies,
  sha256:Object.fromEntries(assets.map(f=>[f,createHash('sha256').update(fs.readFileSync(path.join(root,f))).digest('hex')]))};
fs.writeFileSync(path.join(root,'web/dist/release.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`Web built from ${revision.commit}; manifest: web/dist/release.json`);
