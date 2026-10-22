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
const assets=['web/index.html','web/style.css','web/app.js','web/dist/web.js','docs/submission.md',
  'COMPARISON.md','docs/ecosystem-sources.json','docs/review-cases.md',
  'docs/review-cases-before.json','docs/review-cases-results.json'];
const manifest={module:profile.module,version:profile.version,source_commit:revision.commit,source_dirty:revision.dirty,
  toolchain:actual,dependencies:profile.dependencies,
  sha256:Object.fromEntries(assets.map(f=>[f,createHash('sha256').update(fs.readFileSync(path.join(root,f))).digest('hex')]))};
fs.writeFileSync(path.join(root,'web/dist/release.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`Web built from ${revision.commit}; manifest: web/dist/release.json`);
