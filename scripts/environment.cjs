const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname,'..');
const profile = JSON.parse(fs.readFileSync(path.join(root,'reproduction.json'),'utf8'));
function run(command,args,trim=true) {
  const result = spawnSync(command,args,{cwd:root,encoding:'utf8',timeout:120000});
  if(result.error) throw result.error;
  assert.equal(result.status,0,result.stdout+result.stderr);
  return trim?result.stdout.trim():result.stdout;
}
function environment() {
  const versions = run('moon',['version','--all']);
  assert(versions.includes(`moon ${profile.moon_version} `),`Need moon ${profile.moon_version}; install release ${profile.moon_release}`);
  assert(versions.includes(`moonc ${profile.moonc_version} `),`Need moonc ${profile.moonc_version}`);
  assert(+process.versions.node.split('.')[0]>=profile.node_minimum_major,'Need Node.js 22+');
  return {release:profile.moon_release,moon:profile.moon_version,moonc:profile.moonc_version,node:process.versions.node,platform:process.platform};
}
function source() {
  const commit = run('git',['rev-parse','HEAD']);
  // The JS bundle is rebuilt from source; its generated diff is not a source edit.
  const changes = run('git',['status','--porcelain','--untracked-files=all'],false).split(/\r?\n/)
    .filter(Boolean).filter(line=>line.slice(3)!=='web/dist/web.js');
  return {commit,dirty:changes.length>0};
}
module.exports={root,profile,run,environment,source};
if(require.main===module) console.log(JSON.stringify({profile,actual:environment(),source:source()},null,2));
