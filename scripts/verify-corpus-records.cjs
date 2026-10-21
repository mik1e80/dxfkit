// Replay the real corpus tests and public-API audit, then check or refresh records.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { createHash } = require('node:crypto');
function differences(expected,actual,location='$',out=[]) {
  if(Object.is(expected,actual)) return out;
  if(expected&&actual&&typeof expected==='object'&&typeof actual==='object'&&Array.isArray(expected)===Array.isArray(actual)) {
    for(const key of [...new Set([...Object.keys(expected),...Object.keys(actual)])].sort())
      differences(expected[key],actual[key],`${location}.${key}`,out);
  } else out.push({path:location,expected,actual});
  return out;
}
const root = path.resolve(__dirname, '..');
const write = process.argv.includes('--write');
const hash = data => createHash('sha256').update(data).digest('hex');
const read = file => fs.readFileSync(path.join(root, file));
function moon(args, status = 0) {
  const child = spawnSync('moon', args, {cwd:root,encoding:'utf8',timeout:120000,maxBuffer:16*1024*1024});
  if (child.error) throw child.error;
  assert.equal(child.status,status,child.stdout+child.stderr);
  return child.stdout;
}
const tests = [
  {id:'R1',name:'语料里每个文件都能扫出 tag',scope:'all',meaning:'扫描产生 tag'},
  {id:'R2',name:'每个文件都以 EOF 结尾',scope:'all',meaning:'扫描结果以 EOF 结束'},
  {id:'R3',name:'扫出来的组码都是合理的非负数',scope:'all',meaning:'组码在 0–1071'},
  {id:'R4',name:'流式扫描与整份扫描逐 tag 等价',scope:'all',meaning:'4096/8191 字节分块与全量逐 tag 相同'},
  {id:'E1',name:'语料整体：实体解析的锚点',scope:'all',meaning:'汇总实体/解码数量及诊断锚点，不是逐字段真值'},
  {id:'E2',name:'语料里未解码的实体类型都在预期清单里',scope:'all',meaning:'未解码类型集合'},
  {id:'G0',name:'语料几何离散：支持曲线有点列，面实体只保留字段',scope:'all',meaning:'点列不变量、汇总数量和面实体降级；不是几何误差验证'},
  {id:'G1',name:'语料块展开：记录未支持的阵列实例',scope:'all',meaning:'展开记录总量和受限输入诊断；不是变换坐标真值'},
  {id:'C0',name:'语料加工检查：锚点',scope:'all',meaning:'报告汇总严重程度锚点，不是逐文件判定真值'},
  {id:'A1',name:'circle_radius_le_0：3016 行 → 1508 个 tag',scope:['circle_radius_le_0.dxf'],meaning:'扫描数量及无扫描警告'},
  {id:'A2',name:'Minimal_DXF_AC1009：35 字节的最小文件',scope:['Minimal_DXF_AC1009.dxf'],meaning:'四个 tag 的值与顺序'},
  {id:'A3',name:'带 HEADER 的 Minimal 文件能读出正确的版本号',scope:['Minimal_DXF_AC1006.dxf','Minimal_DXF_AC1021.dxf'],meaning:'HEADER 版本字段'},
  {id:'A4',name:'没有 HEADER 段的最小文件：不该崩，也不能假装知道版本',scope:['Minimal_DXF_AC1009.dxf'],meaning:'版本缺失与 CP1252 回退'},
  {id:'A5',name:'circle.dxf 声明的是 CP1252 但实际是 UTF-8',scope:['circle_radius_le_0.dxf'],meaning:'扫描编码选择 UTF-8'},
];
const testSource = read('conformance/corpus_wbtest.mbt').toString();
for (const test of tests) assert(testSource.includes(`test "${test.name}"`),`missing test evidence ${test.id}`);
const testOutput = moon(['test','conformance','--target','wasm','--frozen','--deny-warn']);
assert.match(testOutput,/Total tests: 14, passed: 14, failed: 0/);
const emptyOutput = moon(['run','cli','--target','wasm','--frozen','--deny-warn','--',
  'check','testdata/ezdxf/Minimal_DXF_AC1009.dxf','--strict'],1);
assert.match(emptyOutput,/没有可检查的二维轮廓/);
const raw = moon(['run','conformance','--target','wasm','--frozen','--deny-warn','--','--audit']);
const observations = raw.trim().split(/\r?\n/).map(line => JSON.parse(line));
const files = fs.readdirSync(path.join(root,'testdata/ezdxf')).filter(f => f.endsWith('.dxf')).sort();
assert.equal(files.length,47,'this record describes the original 47-file corpus');
assert.equal(observations.length,files.length);
const byName = new Map(observations.map(row => [row.file,row]));
assert.equal(byName.size,files.length);
const metadataKinds = ['3DFACE','SOLID','TRACE','HATCH','DIMENSION','TEXT','MTEXT','ATTRIB','ATTDEF'];
const cases = files.map(file => {
  const observed = byName.get(file);
  assert(observed,`missing observation ${file}`);
  assert(observed.read_ok && observed.eof_ok && observed.codes_ok,`reading regression ${file}`);
  assert.equal(observed.geometry_verified,false,'no file-specific geometry oracle exists');
  observed.entity_kinds.sort((a,b) => a.kind.localeCompare(b.kind));
  observed.expanded_kinds.sort((a,b) => a.kind.localeCompare(b.kind));
  const total = observed.entity_kinds.reduce((n,k) => n+k.total,0);
  const decoded = observed.entity_kinds.reduce((n,k) => n+k.decoded,0);
  const kinds = [...observed.entity_kinds,...observed.expanded_kinds];
  const unknown = [...new Set(kinds.filter(k => k.total>k.decoded).map(k => k.kind))].sort();
  const metadata = [...new Set(kinds.filter(k => metadataKinds.includes(k.kind)).map(k => k.kind))].sort();
  const limitations = [];
  if (!total) limitations.push('无顶层实体，解码不适用');
  if (unknown.length) limitations.push(`未解码 ${unknown.join('/')}`);
  if (metadata.length) limitations.push(`仅字段/元数据 ${metadata.join('/')}`);
  if (observed.findings.some(f => f.message.includes('OCS'))) limitations.push('非默认 OCS 未转换');
  if (observed.expansion_warnings.some(s => s.includes('INSERT 阵列'))) limitations.push('阵列其余实例未展开');
  if ([...observed.entity_warnings,...observed.expansion_warnings].some(s => s.includes('POLYLINE 标志'))) limitations.push('非普通二维 POLYLINE 未生成轮廓');
  if (file === 'xclip.dxf') limitations.push('未加载外部参照/未验证裁剪');
  if (file === 'images.dxf') limitations.push('外部图像未加载');
  limitations.push('缺少逐图纸独立几何真值');
  const participating = tests.filter(t => t.scope==='all'||t.scope.includes(file)).map(t => t.id);
  if(file==='Minimal_DXF_AC1009.dxf') participating.push('CLI1');
  return {
    file,bytes:read(`testdata/ezdxf/${file}`).length,sha256:hash(read(`testdata/ezdxf/${file}`)),
    source:{repository:'mozman/ezdxf',upstream_path:`examples_dxf/${file}`,upstream_commit:null,
      reference_url:`https://github.com/mozman/ezdxf/blob/master/examples_dxf/${file}`},
    reading:{status:'success',meaning:'字节读取及扫描不变量成立；不表示完整标准读取'},
    decoding:{status:total===0?'not-applicable':decoded===total?'all-observed-entities':'partial',
      observed:total,decoded,meaning:'is_decoded 字段输出计数，不是全字段语义认证'},
    geometry:{status:'not-independently-verified',verified_entities:0,
      reason:'仅执行离散/展开不变量及报告锚点，未建立本文件的独立坐标/误差基准'},
    participating_tests:participating,limitations,observed,
  };
});
const sourceFiles = [...fs.readdirSync(root).filter(f => f.endsWith('.mbt') && !f.endsWith('test.mbt')),
  'moon.mod','conformance/audit.mbt','conformance/main.mbt','conformance/corpus.mbt',
  'conformance/corpus_wbtest.mbt','cli/smoke.cjs'];
const report = {
  schema:'dxfkit-third-party-corpus-v1',
  provenance:{repository:'mozman/ezdxf',directory:'examples_dxf',license:'MIT',
    local_import_commit:'6f5d18250170d52921e9cc35cee583c045355ab5',upstream_commit:null,
    note:'首次收录未记录上游提交；master 来源链接可能变动，本地 SHA-256 标识实际被测字节，不代表已校验当前上游一致'},
  parameters:{target:'wasm',flatten_invariant_tol:0.01,expansion_and_check_tol:0.05,min_gap:0.0},
  tests:[...tests,{id:'CLI1',name:'空外部最小文件 strict 门禁',scope:['Minimal_DXF_AC1009.dxf'],
    source:'cli/smoke.cjs',meaning:'实际退出 1，报告无可检查轮廓'}],
  source_sha256_lf:Object.fromEntries(sourceFiles.sort().map(f =>
    [f,hash(read(f).toString().replaceAll('\r\n','\n'))])),
  summary:{files:cases.length,read_success:cases.length,
    observed_entities:cases.reduce((n,c)=>n+c.decoding.observed,0),
    decoded_entities:cases.reduce((n,c)=>n+c.decoding.decoded,0),
    independently_verified_geometry_files:0,
    incomplete_reports:cases.filter(c=>c.observed.incomplete).length,
    conformance_tests:{total:14,passed:14},cli_empty_input_exit:1},
  cases,
};
function escape(value) {return String(value).replaceAll('|','\\|').replaceAll('\n',' ');}
const lines = [
  '# 第三方 DXF 图纸逐文件验证记录','',
  '本表保留现有 47 个 ezdxf 文件，分别记录读取、实体解码输出和独立几何验证。**没有“兼容通过”这一统一结论。**', '',
  `实测读取 ${cases.length}/${cases.length}；顶层实体输出 ${report.summary.observed_entities}，其中 ${report.summary.decoded_entities} 个 is_decoded=true；${report.summary.incomplete_reports} 份检查报告标为不完整。`,
  '**独立几何真值验证：0/47。** 已运行离散、展开及检查不变量，不等于验证每张图纸的坐标、尺寸或完整语义。P0 的自建解析几何测试不能自动替代这些外部文件的真值。','',
  '## 来源与身份','',
  '来源：[mozman/ezdxf examples_dxf](https://github.com/mozman/ezdxf/tree/master/examples_dxf)，MIT；完整许可见[第三方声明](../THIRD_PARTY_NOTICES.md)。',
  '本仓库首次收录提交：[6f5d182](https://github.com/mik1e80/dxfkit/commit/6f5d18250170d52921e9cc35cee583c045355ab5)。未记录上游提交号，不能补猜。表中来源链接是历史文件路径引用，master 的文件可能移动或删除。',
  '本轮保留全部 DXF 字节；每个文件的大小、SHA-256、上游路径及实际诊断见[机器记录](corpus-validation.json)。DXF 哈希取原始字节，审计依赖的源码哈希规范化为 LF，以便跨平台复核。本地哈希标识被测文件，不是与当前上游逐字节一致的证明。','',
  '## 判读方式','',
  '- 读取“成功”：文件读取、tag、EOF、组码范围不变量成立，完整结构语义仍受限。扫描和结构警告分别保存在机器记录。',
  '- 解码“d/n”：ENTITIES 解码结果中 d 个提供字段、n 个实体外壳；Unknown 仍保留。全部可解码也不代表所有字段被实现，文字、面、填充和标注可能仅保留元数据。0/0 表示无顶层实体，不算解码通过。',
  '- 几何“未独立验证”：这些文件没有独立坐标/尺寸/误差真值。不把生成点列、预览、无警告或检查完整性状态当作几何验证。',
  '- 未覆盖列合并顶层和展开后类型；它列出已知限制，不构成完整 DXF 特性的穷尽清单。净距统一关闭，所有文件均未验证净距结论。','',
  '## 逐文件案例表','',
  '| 图纸 | 来源 | 读取 | 实体字段解码 d/n | 几何真值验证 | 实际测试 | 未覆盖/限制 |',
  '| --- | --- | --- | --- | --- | --- | --- |',
];
for(const c of cases) lines.push(`| [${c.file}](../testdata/ezdxf/${c.file}) | [ezdxf](${c.source.reference_url}) | 成功 | ${c.decoding.decoded}/${c.decoding.observed}${c.decoding.observed?'':'（不适用）'} | 未独立验证 | ${c.participating_tests.join(', ')} | ${escape(c.limitations.join('；'))} |`);
lines.push('', '## 实际参与的测试','',
  'R/E/G/C/A 项均由 [conformance/corpus_wbtest.mbt](../conformance/corpus_wbtest.mbt) 的真实测试执行；带“汇总”的测试不提供逐文件几何真值。', '',
  '| ID | 测试名称 | 实际断言范围 |','| --- | --- | --- |');
for(const t of report.tests) lines.push(`| ${t.id} | ${escape(t.name)} | ${escape(t.meaning)} |`);
lines.push('', '## 复现与更新','', '```sh',
  'moon run conformance -- --audit',
  'node scripts/verify-corpus-records.cjs',
  'node scripts/verify-corpus-records.cjs --write', '```','',
  '脚本先真实运行 14 条语料测试及 CLI1，再对 47 份文件生成 JSON 审计。默认只比较记录，结果或文件哈希变化会失败；--write 经人工审阅后更新两份记录。CI 执行默认复核。',
  '审计固定 tol=0.05、min_gap=0；旧离散不变量测试使用 tol=0.01。完整警告、展开记录类型及报告发现逐文件保存在 JSON。所有“未独立验证”保留，不会因为解码或离散成功自动升级。','');
const outputs = {'docs/corpus-validation.json':JSON.stringify(report,null,2)+'\n',
  'docs/corpus-validation.md':lines.join('\n')};
for(const [file,text] of Object.entries(outputs)) {
  if(write) fs.writeFileSync(path.join(root,file),text);
  else if(file.endsWith('.json')) {
    const changed=differences(JSON.parse(read(file)),JSON.parse(text));
    assert.equal(changed.length,0,`${file} differs: ${JSON.stringify(changed.slice(0,8))}`);
  } else assert(read(file).toString().replaceAll('\r\n','\n')===text,`${file} is stale; review and run --write`);
}
console.log(`47 corpus records ${write?'updated':'verified'}; 14 tests passed; geometry independently verified: 0/47`);
