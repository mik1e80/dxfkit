// Exercise the actual browser bundle with six minimal DXF files.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const root = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
function option(name, fallback) {
  const i = args.indexOf(name);
  if (i < 0) return fallback;
  if (!args[i + 1]) throw new Error(`${name} needs a path`);
  return path.resolve(args[i + 1]);
}
const bundle = option('--bundle', path.join(root, 'web/dist/web.js'));
const reportPath = option('--report', null);
const context = vm.createContext({ console, TextEncoder, TextDecoder, Uint8Array });
const bundleSource = fs.readFileSync(bundle, 'utf8');
vm.runInContext(bundleSource, context, { filename: bundle });
function input(file) {
  return fs.readFileSync(path.join(root, 'examples/regressions', file)).toString('base64');
}
function points(svg) {
  return [...svg.matchAll(/<(?:polyline|polygon)\b[^>]*points="([^"]*)"/g)]
    .map(m => m[1].trim().split(/\s+/).map(p => p.split(',').map(Number)));
}
const cases = [
  { id: 'C1', file: 'ellipse-offset.dxf', expected: { firstPoint: [12, 20] },
    observe: data => ({ firstPoint: points(context.svg(data, 0.01))[0]?.[0] }),
    verify: actual => assert.deepEqual(actual.firstPoint, [12, 20]) },
  { id: 'C2', file: 'svg-coordinate-range.dxf',
    expected: { points: [[-300000, 1e-9], [300010, 2e-9]] },
    observe: data => ({ points: points(context.svg(data, 0.01))[0] }),
    verify: actual => assert.deepEqual(actual.points, [[-300000, 1e-9], [300010, 2e-9]]) },
  { id: 'C3', file: 'lwpolyline-missing-y.dxf',
    expected: { outlines: 0, diagnostic: 'LWPOLYLINE vertex missing Y' },
    observe: data => ({ outlines: points(context.svg(data, 0.05)).length,
      report: context.check(data, 0) }),
    verify: actual => { assert.equal(actual.outlines, 0);
      assert.match(actual.report, /LWPOLYLINE.*顶点.*Y/);
      assert.match(actual.report, /LWPOLYLINE 实体的轮廓未参与检查/); } },
  { id: 'C4', file: 'polyline-missing-y.dxf',
    expected: { outlines: 0, diagnostic: 'POLYLINE vertex missing X/Y' },
    observe: data => ({ outlines: points(context.svg(data, 0.05)).length,
      report: context.check(data, 0) }),
    verify: actual => { assert.equal(actual.outlines, 0);
      assert.match(actual.report, /POLYLINE.*顶点.*X\/Y/);
      assert.match(actual.report, /POLYLINE 实体的轮廓未参与检查/); } },
  { id: 'C5', file: 'face-metadata-only.dxf',
    expected: { outlines: 2, uncheckedKinds: ['3DFACE'], selfIntersection: false },
    observe: data => ({ outlines: points(context.svg(data, 0.05)).length,
      boundaries: points(context.svg(data, 0.05)),
      report: context.check(data, 0) }),
    verify: actual => { assert.equal(actual.outlines, 2);
      for (const boundary of actual.boundaries) assert.deepEqual(boundary,[[0,0],[2,0],[2,1],[0,1]]);
      assert(actual.report.includes('3DFACE 实体的轮廓未参与检查'));
      for (const kind of ['SOLID', 'TRACE']) {
        assert(!actual.report.includes(`${kind} 实体的轮廓未参与检查`));
      }
      assert(!actual.report.includes('[自相交]')); } },
  { id: 'C6', file: 'insert-unsupported-ocs.dxf',
    expected: { outlines: 0, diagnosticIdentity: ['已转换 WCS', 'AB', 'CUT', 'PART'] },
    observe: data => ({ outlines: points(context.svg(data, 0.05)).length,
      report: context.check(data, 0) }),
    verify: actual => { assert.equal(actual.outlines, 0);
      for (const identity of ['已转换 WCS', 'AB', 'CUT', 'PART']) assert(actual.report.includes(identity)); } },
];
const results = cases.map(test => {
  let actual;
  try {
    actual = test.observe(input(test.file));
    test.verify(actual);
    return { id: test.id, file: test.file, expected: test.expected, actual, passed: true };
  } catch (error) {
    return { id: test.id, file: test.file, expected: test.expected, actual,
      passed: false, failure: error.message };
  }
});
const report = { suite: 'dxfkit-frozen-delivery',
  bundle_sha256: createHash('sha256').update(bundleSource).digest('hex'),
  passed: results.filter(r => r.passed).length,
  total: results.length, cases: results };
if (reportPath) fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
for (const result of results) console.log(`${result.id} ${result.passed ? 'PASS' : 'FAIL'} ${result.file}`);
console.log(`${report.passed}/${report.total} delivery cases passed`);
if (report.passed !== report.total) process.exitCode = 1;
