// Copy only the consumer project outside the checkout, then use dxfkit as a module.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const root = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
function option(name, fallback) {
  const i = args.indexOf(name);
  if (i < 0) return fallback;
  assert(args[i + 1], `${name} needs a value`);
  return args[i + 1];
}
const target = option('--target', 'wasm');
assert(['wasm', 'native'].includes(target), 'file example supports wasm or native');
const reportPath = option('--report', null);
const example = path.join(root, 'examples/consumer');
const temporaryRoot = fs.realpathSync(os.tmpdir());
const work = fs.mkdtempSync(path.join(temporaryRoot, 'dxfkit-consumer-'));
const results = [];
try {
  fs.cpSync(example, work, {
    recursive: true,
    filter: source => !path.relative(example, source).split(path.sep)
      .some(part => ['_build', '.mooncakes', '.git'].includes(part)),
  });
  // The sample contains application code and fixtures, no dxfkit source files.
  const files = fs.readdirSync(work).sort();
  assert(files.includes('moon.mod'));
  assert(!files.includes('entity.mbt'));
  assert(!files.includes('web'));
  const library = root.replaceAll('\\', '/');
  fs.writeFileSync(path.join(work, 'moon.work'),
    `members = [".", ${JSON.stringify(library)}]\n`);
  function run(id, command, expectedStatus, expectedPatterns, absentPatterns = []) {
    const child = spawnSync('moon', command, {
      cwd: work, encoding: 'utf8', timeout: 120000,
    });
    if (child.error) throw child.error;
    const output = child.stdout + child.stderr;
    let failure;
    try {
      assert.equal(child.status, expectedStatus, output);
      for (const pattern of expectedPatterns) assert.match(output, pattern);
      for (const pattern of absentPatterns) assert.doesNotMatch(output, pattern);
    } catch (error) { failure = error.message; }
    results.push({ id, expectedStatus, actualStatus: child.status,
      expectedPatterns: expectedPatterns.map(String), output,
      passed: !failure, ...(failure ? { failure } : {}) });
    console.log(`${failure ? 'FAIL' : 'PASS'} ${target} ${id}`);
    return !failure;
  }
  if (run('external-module-check', ['check', '--target', target, '--deny-warn'], 0, [])) {
    const command = ['run', '.', '--target', target, '--frozen', '--deny-warn', '--'];
    run('read-extract-discretize-check', [...command, 'fixtures/normal.dxf', '--strict'], 0,
      [/ENTITIES=1/, /CIRCLE center=10,20 radius=2/,
        /LOCAL_OUTLINE vertices=32 closed=true/, /LOCAL_FIRST=12,20/, /WORLD_OUTLINES=1/,
        /INCOMPLETE=false/, /致命 0.*警告 0/], [/DISCRETIZATION_ERROR/]);
    run('partial-input-default', [...command, 'fixtures/incomplete.dxf'], 0,
      [/ENTITIES=2/, /WORLD_OUTLINES=1/, /INCOMPLETE=true/, /检查不完整/, /RAY.*轮廓未参与检查/]);
    run('partial-input-strict', [...command, 'fixtures/incomplete.dxf', '--strict'], 1,
      [/WORLD_OUTLINES=1/, /INCOMPLETE=true/, /检查不完整/]);
    run('checked-discretization-error', [...command, 'fixtures/discretization-error.dxf', '--strict'], 1,
      [/DISCRETIZATION_ERROR:.*4096/, /INCOMPLETE=true/, /检查不完整/]);
    run('read-error', [...command, 'fixtures/does-not-exist.dxf'], 2, [/READ_ERROR/]);
    run('argument-error', command, 2, [/Usage:/]);
    run('solid-entity-aware-outline', [...command, 'fixtures/solid.dxf', '--strict'], 0,
      [/ENTITY kind=SOLID/, /LOCAL_OUTLINE vertices=4 closed=true/, /LOCAL_FIRST=0,0/,
        /WORLD_OUTLINES=1/, /INCOMPLETE=false/, /致命 0.*警告 0/], [/DISCRETIZATION_ERROR/]);
  }
  const result = {
    suite: 'dxfkit-external-consumer', target,
    example_sha256: createHash('sha256')
      .update(fs.readFileSync(path.join(example, 'main.mbt'))).digest('hex'),
    copied_files: files, library_source: 'local moon.work member',
    passed: results.filter(r => r.passed).length, total: 8, cases: results,
  };
  if (reportPath) fs.writeFileSync(path.resolve(reportPath), JSON.stringify(result, null, 2) + '\n');
  console.log(`${result.passed}/${result.total} external consumer cases passed`);
  if (result.passed !== result.total) process.exitCode = 1;
} finally {
  // Delete only the exact temporary directory created by mkdtemp above.
  const resolved = path.resolve(work);
  assert(path.dirname(resolved) === temporaryRoot && path.basename(resolved).startsWith('dxfkit-consumer-'));
  fs.rmSync(resolved, { recursive: true, force: true });
}
