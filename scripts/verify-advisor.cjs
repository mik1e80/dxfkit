// Incremental validation for the advisor changes; explicitly not the full release suite.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process');
const {root,profile,environment,source}=require('./environment.cjs');
const allowDirty=process.argv.includes('--allow-dirty'),fresh=process.argv.includes('--fresh');
if(fresh)for(const folder of ['_build','.mooncakes'])assert(!fs.existsSync(path.join(root,folder)),`--fresh needs no ${folder}`);
const toolchain=environment(),revision=source();assert(!revision.dirty||allowDirty,'Use a clean commit, or explicitly --allow-dirty');
process.env.DXFKIT_VALIDATION_PROFILE='targeted-advisor';
const steps=[];
function execute(command,args){console.log('> '+command+' '+args.join(' '));const r=spawnSync(command,args,{cwd:root,stdio:'inherit',timeout:180000});if(r.error)throw r.error;steps.push({command:[command,...args],exit_code:r.status});assert.equal(r.status,0,'Targeted validation failed');}
try{
  if(fresh)execute('moon',['update']);
  execute('moon',['test','r2_spline_wbtest.mbt','advisor_boundary_wbtest.mbt','tables_wbtest.mbt','entity_wbtest.mbt','expand_wbtest.mbt','geometry_accuracy_wbtest.mbt','geometry_regression_wbtest.mbt','preview_wbtest.mbt','checker_accuracy_wbtest.mbt','--target','wasm','--deny-warn']);
  for(const script of ['scripts/verify-corpus-records.cjs','examples/advisor-boundaries/verify.cjs','examples/independent-fields/verify.cjs','examples/model-validation/verify.cjs','scripts/verify-submission-evidence.cjs','scripts/verify-submission-docs.cjs'])execute('node',[script]);
  execute('node',['scripts/build-web.cjs',...(allowDirty?['--allow-dirty']:[])]);
  execute('node',['web/smoke.cjs']);
  fs.writeFileSync(path.join(root,'_build/reproduction.json'),JSON.stringify({passed:true,validation_profile:'targeted-advisor',full_suite_run:false,submission_ref:profile.submission_ref,source_commit:revision.commit,source_dirty:revision.dirty,module:profile.module,version:profile.version,toolchain,steps},null,2)+'\n');
  execute('node',['scripts/prepare-site.cjs',...(allowDirty?['--allow-dirty']:[])]);
  console.log('Targeted advisor validation PASSED; full suite was not run');
}catch(error){fs.mkdirSync(path.join(root,'_build'),{recursive:true});fs.writeFileSync(path.join(root,'_build/reproduction.json'),JSON.stringify({passed:false,validation_profile:'targeted-advisor',full_suite_run:false,source_commit:revision.commit,steps,error:error.message},null,2)+'\n');throw error;}
