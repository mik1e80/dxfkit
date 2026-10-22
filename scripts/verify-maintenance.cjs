// Lightweight format/API gate; no test suite, asset build, deployment or publication.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process'),{createHash}=require('node:crypto');
const {root,environment,source}=require('./environment.cjs');
const snapshot=path.join(root,'pkg.generated.mbti');
const lf=s=>s.replace(/\r\n?/g,'\n');
const toolchain=environment(),revision=source(),steps=[];
const result={passed:false,validation_profile:'maintenance',full_suite_run:false,source_commit:revision.commit,source_dirty:revision.dirty,toolchain,steps};
function execute(args){console.log('> moon '+args.join(' '));const r=spawnSync('moon',args,{cwd:root,stdio:'inherit',timeout:120000});if(r.error)throw r.error;steps.push({command:['moon',...args],exit_code:r.status});assert.equal(r.status,0,'Maintenance step failed');}
try{
 assert(fs.existsSync(snapshot),'Missing committed core API snapshot; generate and review moon info first');
 const expected=lf(fs.readFileSync(snapshot,'utf8'));
 execute(['fmt','--check']);
 execute(['info','--frozen']);
 const actual=lf(fs.readFileSync(snapshot,'utf8'));
 assert.equal(actual,expected,'Public API changed: review git diff -- pkg.generated.mbti and document compatibility before committing the new snapshot');
 result.api_sha256=createHash('sha256').update(actual).digest('hex');result.passed=true;
 console.log('PASS: formatter and committed core public API snapshot; no full tests run');
}catch(error){result.error=error.message;throw error;}
finally{fs.mkdirSync(path.join(root,'_build'),{recursive:true});fs.writeFileSync(path.join(root,'_build/maintenance.json'),JSON.stringify(result,null,2)+'\n');}
