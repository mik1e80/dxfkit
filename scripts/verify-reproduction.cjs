const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const {root,profile,run,environment,source}=require('./environment.cjs');
const allowDirty=process.argv.includes('--allow-dirty');
process.env.DXFKIT_VALIDATION_PROFILE='full';
if(process.argv.includes('--fresh')) for(const dir of ['_build','.mooncakes'])
  assert(!fs.existsSync(path.join(root,dir)),`--fresh requires no ${dir}`);
const actual=environment();
const revision=source();
assert(!revision.dirty||allowDirty,'Start from a clean commit; development runs may use --allow-dirty');
const steps=[];
function execute(command,args) {
  console.log(`> ${command} ${args.join(' ')}`);
  const child=spawnSync(command,args,{cwd:root,stdio:'inherit',timeout:300000});
  if(child.error) throw child.error;
  steps.push({command:[command,...args],exit_code:child.status});
  assert.equal(child.status,0,'Reproduction step failed');
}
const dirtyArgs=allowDirty?['--allow-dirty']:[];
try {
  execute('moon',['update']);
  execute('node',['scripts/verify-maintenance.cjs']);
  execute('moon',['check','--target','all','--deny-warn']);
  const tree=JSON.parse(run('moon',['tree','--json']));
  assert.equal(tree.modules[tree.root].name,profile.module);
  assert.equal(tree.modules[tree.root].version,profile.version);
  const dependencies=Object.fromEntries(tree.modules.filter(m=>m.source.kind==='registry').map(m=>[m.name,m.version]));
  assert.deepEqual(dependencies,profile.dependencies,'Resolved dependencies differ from profile');
  execute('moon',['build','--frozen','--deny-warn']);
  for(const target of ['wasm','js','native','wasm-gc']) execute('moon',['test','--target',target,'--frozen','--deny-warn']);
  for(const script of ['scripts/verify-corpus-records.cjs','scripts/verify-test-sensitivity.cjs','cli/smoke.cjs']) execute('node',[script]);
  execute('node',['scripts/verify-consumer.cjs']);
  execute('node',['scripts/verify-consumer.cjs','--target','native']);
  execute('node',['scripts/verify-submission-evidence.cjs']);
  execute('node',['examples/model-validation/generate-models.cjs']);
  execute('node',['examples/model-validation/verify.cjs']);
  execute('node',['examples/advisor-boundaries/verify.cjs']);
  execute('node',['examples/independent-fields/verify.cjs']);
  execute('node',['scripts/verify-submission-docs.cjs']);
  execute('node',['scripts/build-web.cjs',...dirtyArgs]);
  for(const script of ['web/smoke.cjs','scripts/verify-delivery.cjs','scripts/verify-completeness.cjs','scripts/verify-review-cases.cjs']) execute('node',[script]);
  fs.writeFileSync(path.join(root,'_build/reproduction.json'),JSON.stringify({
    passed:true,validation_profile:'full',full_suite_run:true,submission_ref:profile.submission_ref,source_commit:revision.commit,source_dirty:revision.dirty,module:profile.module,version:profile.version,
    toolchain:actual,dependencies,steps},null,2)+'\n');
  execute('node',['scripts/prepare-site.cjs',...dirtyArgs]);
  console.log(`Reproduction PASSED: ${revision.commit}`);
} catch(error) {
  fs.mkdirSync(path.join(root,'_build'),{recursive:true});
  fs.writeFileSync(path.join(root,'_build/reproduction.json'),JSON.stringify({passed:false,source_commit:revision.commit,steps,error:error.message},null,2)+'\n');
  throw error;
}
