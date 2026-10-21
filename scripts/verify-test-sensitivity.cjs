// Confirm the accuracy tests reject plausible wrong results, not just crashes.
// Mutations exist only in a temporary copy, never in the user's source tree.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const root = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const reportIndex = args.indexOf('--report');
const reportPath = reportIndex >= 0 ? args[reportIndex + 1] : null;
if (reportIndex >= 0) assert(reportPath, '--report needs a path');
const geometry = 'geometry_accuracy_wbtest.mbt';
const checker = 'checker_accuracy_wbtest.mbt';
const mutations = [
  { id: 'shift-all-outlines', file: 'flatten_checked.mbt', tests: [geometry],
    before: '  Ok(flat)',
    after: '  Ok(match flat { Outline(points~, closed~) => Outline(points=points.map(p => Vec2::new(p.x + 0.25, p.y)), closed~); other => other })' },
  { id: 'replace-spline-with-chord', file: 'flatten_checked.mbt', tests: [geometry],
    before: 'Ok(points) => Outline(points~, closed=false)',
    after: 'Ok(points) => Outline(points=[points[0], points[points.length()-1]], closed=false)' },
  { id: 'mirror-negative-bulge', file: 'entity.mbt', tests: [geometry],
    before: 'vertices[vertices.length() - 1].bulge = t.value.as_double()',
    after: 'vertices[vertices.length() - 1].bulge = t.value.as_double().abs()' },
  { id: 'disable-clearance-check', file: 'check.mbt', tests: [checker],
    before: 'if opt.min_gap <= 0.0 {',
    after: 'if opt.min_gap >= 0.0 {' },
  { id: 'warn-on-normal-contours', file: 'check.mbt', tests: [checker],
    before: '  check_crossings(exp.placed, tables, tol, findings)',
    after: '  check_crossings(exp.placed, tables, tol, findings)\n  findings.push({check:"自相交", severity:Warn, message:"injected false positive"})' },
  { id: 'inclusive-clearance-threshold', file: 'check.mbt', tests: [checker],
    before: 'if gap < opt.min_gap {',
    after: 'if gap <= opt.min_gap {' },
];
const tmp = fs.realpathSync(os.tmpdir());
const work = fs.mkdtempSync(path.join(tmp, 'dxfkit-sensitivity-'));
const files = fs.readdirSync(root).filter(f => f.endsWith('.mbt') || ['moon.mod', 'moon.pkg'].includes(f));
const results = [];
try {
  for (const file of files) fs.copyFileSync(path.join(root, file), path.join(work, file));
  for (const item of [{id:'unmodified-baseline',tests:[geometry,checker]}, ...mutations]) {
    if (item.file) {
      const source = fs.readFileSync(path.join(root, item.file), 'utf8');
      assert.equal(source.split(item.before).length, 2, `mutation anchor must be unique: ${item.id}`);
      fs.writeFileSync(path.join(work, item.file), source.replace(item.before, item.after));
    }
    const child = spawnSync('moon', ['test', ...item.tests, '--target', 'wasm-gc', '--deny-warn'], {
      cwd: work, encoding: 'utf8', timeout: 120000,
    });
    if (child.error) throw child.error;
    const output = child.stdout + child.stderr;
    const summary = /Total tests: (\d+), passed: (\d+), failed: (\d+)/.exec(output);
    const executed = summary ? { total:+summary[1], passed:+summary[2], failed:+summary[3] } : null;
    // A syntax/type failure does not count as detecting a semantic mutation.
    const passed = item.file
      ? child.status !== 0 && executed && executed.failed > 0
      : child.status === 0 && executed && executed.total === 17 && executed.failed === 0;
    results.push({id:item.id, expected:item.file ? 'compiled tests must fail' : '17 tests must pass',
      status:child.status, executed, passed:!!passed, output});
    console.log(`${passed ? 'PASS' : 'FAIL'} ${item.id}`);
    if (item.file) fs.copyFileSync(path.join(root, item.file), path.join(work, item.file));
  }
  const result = {suite:'dxfkit-test-sensitivity', target:'wasm-gc',
    test_sha256:Object.fromEntries([geometry,checker].map(f => [f,
      createHash('sha256').update(fs.readFileSync(path.join(root,f))).digest('hex')])),
    passed:results.filter(r => r.passed).length,total:results.length,cases:results};
  if(reportPath) fs.writeFileSync(path.resolve(reportPath),JSON.stringify(result,null,2)+'\n');
  console.log(`${result.passed}/${result.total} baseline/sensitivity checks passed`);
  if(result.passed !== result.total) process.exitCode=1;
} finally {
  const resolved = path.resolve(work);
  assert(path.dirname(resolved) === tmp && path.basename(resolved).startsWith('dxfkit-sensitivity-'));
  fs.rmSync(resolved,{recursive:true,force:true});
}
