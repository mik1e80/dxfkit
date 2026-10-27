const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const {root,source}=require('./environment.cjs');
const revision=source();
const manifest=JSON.parse(fs.readFileSync(path.join(root,'web/dist/release.json'),'utf8'));
const verification=JSON.parse(fs.readFileSync(path.join(root,'_build/reproduction.json'),'utf8'));
const evidence=JSON.parse(fs.readFileSync(path.join(root,'_build/submission-evidence.json'),'utf8'));
const models=JSON.parse(fs.readFileSync(path.join(root,'_build/model-validation.json'),'utf8'));
assert(verification.passed&&verification.source_commit===revision.commit,'Verification must pass for this commit');
assert(['full','targeted-advisor','targeted-r12'].includes(verification.validation_profile),'Explicit validation profile required');
assert(manifest.validation_profile===verification.validation_profile,'Build/validation profile mismatch');
assert(evidence.source_commit===revision.commit&&evidence.passed===evidence.total&&evidence.total===10,'Submission evidence must pass for this commit');
assert(models.source_commit===revision.commit&&models.passed===10&&models.total===10,'Ten models must pass for this commit');
assert(manifest.source_commit===revision.commit,'Web manifest belongs to another commit');
assert(!revision.dirty||process.argv.includes('--allow-dirty'),'Cannot package an edited source tree');
for(const [file,digest] of Object.entries(manifest.sha256))
  assert.equal(createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex'),digest,`Asset changed: ${file}`);
const files={'web/index.html':'index.html','web/style.css':'style.css','web/app.js':'app.js',
  'web/dist/web.js':'dist/web.js','web/dist/release.json':'dist/release.json',
  'docs/submission.md':'docs/submission.md','COMPARISON.md':'COMPARISON.md',
  'docs/ecosystem-sources.json':'docs/ecosystem-sources.json',
  'LICENSE':'LICENSE','THIRD_PARTY_NOTICES.md':'THIRD_PARTY_NOTICES.md'};
// Keep the comparison's supporting documentation and consumer guide reachable.
for(const file of fs.readdirSync(path.join(root,'docs')))
  if(/\.(md|json)$/.test(file)&&fs.statSync(path.join(root,'docs',file)).isFile())
    files[`docs/${file}`]=`docs/${file}`;
files['examples/consumer/README.md']='examples/consumer/README.md';
// Only the allowlisted, hashed evidence directory is copied recursively in this release.
for(const file of fs.readdirSync(path.join(root,'docs/submission-evidence')))
  if(/\.(txt|svg|json)$/.test(file)&&fs.statSync(path.join(root,'docs/submission-evidence',file)).isFile())
    files[`docs/submission-evidence/${file}`]=`docs/submission-evidence/${file}`;
for(const file of Object.keys(manifest.sha256))
  if(file.startsWith('docs/submission-evidence/')) assert(files[file],`Evidence not packaged: ${file}`);
  else if(file.startsWith('examples/')) files[file]=file;
  else if(['README.md','README.mbt.md','output/pdf/dxfkit-submission-one-page.pdf'].includes(file)) files[file]=file;
for(const file of fs.readdirSync(path.join(root,'web/licenses'))) files[`web/licenses/${file}`]=`licenses/${file}`;
for(const [from,to] of Object.entries(files)) {
  const target=path.join(root,'_site',to);
  fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.copyFileSync(path.join(root,from),target);
}
fs.copyFileSync(path.join(root,'_build/reproduction.json'),path.join(root,'_site/verification.json'));
fs.copyFileSync(path.join(root,'_build/submission-evidence.json'),path.join(root,'_site/submission-evidence-verification.json'));
fs.copyFileSync(path.join(root,'_build/model-validation.json'),path.join(root,'_site/model-validation-verification.json'));
console.log(`Site packaged from verified commit ${revision.commit}`);
