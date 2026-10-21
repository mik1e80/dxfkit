const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const {root,source}=require('./environment.cjs');
const revision=source();
const manifest=JSON.parse(fs.readFileSync(path.join(root,'web/dist/release.json'),'utf8'));
const verification=JSON.parse(fs.readFileSync(path.join(root,'_build/reproduction.json'),'utf8'));
assert(verification.passed&&verification.source_commit===revision.commit,'Verification must pass for this commit');
assert(manifest.source_commit===revision.commit,'Web manifest belongs to another commit');
assert(!revision.dirty||process.argv.includes('--allow-dirty'),'Cannot package an edited source tree');
for(const [file,digest] of Object.entries(manifest.sha256))
  assert.equal(createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex'),digest,`Asset changed: ${file}`);
const files={'web/index.html':'index.html','web/style.css':'style.css','web/app.js':'app.js',
  'web/dist/web.js':'dist/web.js','web/dist/release.json':'dist/release.json',
  'docs/submission.md':'docs/submission.md','LICENSE':'LICENSE','THIRD_PARTY_NOTICES.md':'THIRD_PARTY_NOTICES.md'};
for(const file of fs.readdirSync(path.join(root,'web/licenses'))) files[`web/licenses/${file}`]=`licenses/${file}`;
for(const [from,to] of Object.entries(files)) {
  const target=path.join(root,'_site',to);
  fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.copyFileSync(path.join(root,from),target);
}
fs.copyFileSync(path.join(root,'_build/reproduction.json'),path.join(root,'_site/verification.json'));
console.log(`Site packaged from verified commit ${revision.commit}`);
