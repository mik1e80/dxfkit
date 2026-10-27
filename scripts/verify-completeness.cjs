// Check partial inputs through the same compiled library used by the page.
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
const source = fs.readFileSync(bundle, 'utf8');
const context = vm.createContext({ console, TextEncoder, TextDecoder, Uint8Array });
vm.runInContext(source, context);
const normal = '0\nCIRCLE\n5\nGOOD\n10\n100\n20\n100\n40\n1\n';
function drawing(body) {
  return `0\nSECTION\n2\nENTITIES\n${normal}${body}0\nENDSEC\n0\nEOF\n`;
}
function withNormal(file) {
  return fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n')
    .replace('2\nENTITIES\n', `2\nENTITIES\n${normal}`);
}
const cases = [
  { id:'unsupported', text:drawing('0\nRAY\n10\n0\n20\n0\n11\n1\n21\n0\n'), reason:/RAY.*轮廓未参与检查/, incomplete:true },
  { id:'tilted-wcs', text:drawing('0\nCIRCLE\n10\n0\n20\n0\n40\n2\n210\n1\n230\n0\n'), reason:/已转换 WCS/, incomplete:true },
  { id:'lost-lwpolyline', text:withNormal('examples/regressions/lwpolyline-missing-y.dxf'), reason:/LWPOLYLINE.*顶点/, incomplete:true },
  { id:'lost-polyline', text:withNormal('examples/regressions/polyline-missing-y.dxf'), reason:/POLYLINE.*顶点/, incomplete:true },
  { id:'failed-discretization', text:drawing('0\nSPLINE\n71\n3\n10\n0\n20\n0\n'), reason:/SPLINE.*未能离散/, incomplete:true },
  { id:'lost-spline-control', text:drawing('0\nSPLINE\n71\n1\n40\n0\n40\n0\n40\n1\n40\n1\n10\n0\n20\n0\n10\n1\n10\n2\n20\n0\n'), reason:/SPLINE.*控制点.*缺少/, incomplete:true },
  { id:'insert-ocs', text:withNormal('examples/regressions/insert-unsupported-ocs.dxf'), reason:/AB.*已转换 WCS/, incomplete:true },
  { id:'resource-limit', text:drawing('0\nCIRCLE\n10\n0\n20\n0\n40\n1e10\n'), reason:/4096/, incomplete:true },
  { id:'supported-only', text:drawing(''), reason:/警告 0/, incomplete:false },
  { id:'geometric-warning-only', text:drawing('0\nLINE\n10\n0\n20\n0\n11\n2\n21\n0\n'), reason:/轮廓闭合/, incomplete:false },
];
const results = cases.map(test => {
  const data = Buffer.from(test.text).toString('base64');
  const report = context.check(data, 0);
  const svg = context.svg(data, 0.05);
  const polygons = [...svg.matchAll(/<polygon\b[^>]*points="([^"]*)"/g)]
    .map(m => m[1].trim().split(/\s+/).map(p => p.split(',').map(Number)));
  const normalVisible = polygons.some(points => points.length > 3 &&
    points.every(([x,y]) => x >= 99 && x <= 101 && y >= 99 && y <= 101));
  const actual = { incomplete:report.includes('检查不完整'), reasonPresent:test.reason.test(report), normalVisible, report };
  let failure;
  try {
    assert.equal(actual.incomplete, test.incomplete);
    assert(actual.reasonPresent);
    assert(actual.normalVisible, 'supported sibling contour must remain visible');
  } catch(error) { failure = error.message; }
  return { id:test.id, expected:{incomplete:test.incomplete,normalVisible:true}, actual,
    passed:!failure, ...(failure ? {failure} : {}) };
});
const result = { suite:'dxfkit-check-completeness',
  bundle_sha256:createHash('sha256').update(source).digest('hex'),
  passed:results.filter(r => r.passed).length,total:results.length,cases:results };
if (reportPath) fs.writeFileSync(reportPath, JSON.stringify(result,null,2)+'\n');
for(const test of results) console.log(`${test.passed?'PASS':'FAIL'} ${test.id}`);
console.log(`${result.passed}/${result.total} completeness cases passed`);
if(result.passed !== result.total) process.exitCode=1;
