// One horizontal DXF paragraph, with explicit, caller-owned TrueType faces.
import { readFile, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const [prefix, direction, text, ...paths] = process.argv.slice(2);
if (!prefix || !["auto", "ltr", "rtl"].includes(direction) || text === undefined ||
    !text.isWellFormed() || text.length > 8192 || /[\r\n\u2028\u2029]/u.test(text) ||
    paths.length === 0 || paths.length > 8) {
  throw new Error("Usage: node shape-paragraph.mjs <npm prefix> <auto|ltr|rtl> <one paragraph> <primary.ttf> [fallback.ttf ...]");
}
const require = createRequire(resolve(prefix, "package.json"));
const hb = await import(pathToFileURL(require.resolve("harfbuzzjs")));
const unicode = require("unicode-properties");
const bidi = require("bidi-js")();
const fonts = await Promise.all(paths.map(async (path) => {
  if ((await stat(path)).size > 32 * 1024 * 1024) throw new Error("Font exceeds 32 MiB");
  const face = new hb.Face(new hb.Blob(await readFile(path)), 0);
  const font = new hb.Font(face);
  font.setScale(face.upem, face.upem);
  return font;
}));

// bidi-js indexes UTF-16. Feed it one code unit per scalar, substituting
// non-BMP values by BMP representatives of the same bidi class. HarfBuzz
// still receives the original string, including supplementary characters.
const scalarIndex = new Map();
const bidiClassSample = {
  L: "A", R: "\u05D0", AL: "\u0627", EN: "1", AN: "\u0661", ES: "+",
  ET: "$", CS: ",", NSM: "\u0301", BN: "\u00AD", WS: " ", ON: "!",
};
let analysis = "";
let offset = 0;
for (const char of text) {
  scalarIndex.set(offset, analysis.length);
  offset += char.length;
  if (char.length === 1) analysis += char;
  else {
    const kind = bidi.getBidiCharTypeName(char);
    const sample = bidiClassSample[kind];
    if (!sample || bidi.getBidiCharTypeName(sample) !== kind) {
      throw new Error(`Unsupported supplementary bidi class ${kind}`);
    }
    analysis += sample;
  }
}
const levels = bidi.getEmbeddingLevels(analysis, direction === "auto" ? undefined : direction);
const visual = [];
bidi.getReorderedIndices(analysis, levels).forEach((original, index) => { visual[original] = index; });
const common = new Set(["Common", "Inherited", "Unknown"]);
const segmenter = new Intl.Segmenter("und", { granularity: "grapheme" });
const clusters = Array.from(segmenter.segment(text), ({ segment, index }) => {
  const script = Array.from(segment, c => unicode.getScript(c.codePointAt(0)))
    .find(s => !common.has(s));
  const scalar = scalarIndex.get(index);
  return { start: index, end: index + segment.length, segment, script,
    level: levels.levels[scalar], visual: visual[scalar] };
});

// Adopt neighbouring scripts only within the same resolved embedding level.
for (const direction of [1, -1]) {
  let last;
  let level;
  for (let i = direction === 1 ? 0 : clusters.length - 1; i >= 0 && i < clusters.length; i += direction) {
    const cluster = clusters[i];
    if (level !== cluster.level) last = undefined;
    cluster.script ??= last;
    last = cluster.script;
    level = cluster.level;
  }
}

const isSelector = cp => (cp >= 0xFE00 && cp <= 0xFE0F) || (cp >= 0xE0100 && cp <= 0xE01EF);
const ignorable = /\p{Default_Ignorable_Code_Point}/u;
function supported(cluster, font) {
  const chars = [...cluster.segment];
  return chars.every((ch, i) => {
    const cp = ch.codePointAt(0);
    const next = chars[i + 1]?.codePointAt(0);
    if (isSelector(next)) return Boolean(font.variationGlyph(cp, next));
    if (ignorable.test(ch)) return true;
    const mirrored = cluster.level & 1 ? bidi.getMirroredCharacter(ch) : null;
    return Boolean(font.nominalGlyph(cp) || (mirrored && font.nominalGlyph(mirrored.codePointAt(0))));
  });
}

const spans = [];
for (let i = 0; i < clusters.length;) {
  let end = i + 1;
  while (end < clusters.length && clusters[end].level === clusters[i].level &&
      clusters[end].script === clusters[i].script) end++;
  const item = clusters.slice(i, end);
  const whole = fonts.findIndex(font => item.every(c => supported(c, font)));
  for (const c of item) {
    const face = whole >= 0 ? whole : fonts.findIndex(font => supported(c, font));
    if (face < 0) throw new Error(`No font covers the grapheme at UTF-16 offset ${c.start}`);
    const last = spans.at(-1);
    if (last && last.end === c.start && last.font === face && last.level === c.level && last.script === c.script) {
      last.end = c.end;
      last.visual = Math.min(last.visual, c.visual);
    } else {
      spans.push({ font: face, start: c.start, end: c.end, level: c.level, script: c.script, visual: c.visual });
    }
  }
  i = end;
}

spans.sort((a, b) => a.visual - b.visual);
const output = spans.flatMap(({ font, start, end, level }) => {
  const buffer = new hb.Buffer();
  // Preserve nearby joining context without copying the whole paragraph for every run.
  let before = Math.max(0, start - 16);
  let after = Math.min(text.length, end + 16);
  if (before > 0 && /[\uDC00-\uDFFF]/u.test(text[before])) before--;
  if (after < text.length && /[\uDC00-\uDFFF]/u.test(text[after])) after++;
  buffer.addText(text.slice(before, after), start - before, end - start);
  buffer.setDirection(level & 1 ? hb.Direction.RTL : hb.Direction.LTR);
  buffer.setFlags(hb.BufferFlag.REMOVE_DEFAULT_IGNORABLES);
  buffer.guessSegmentProperties();
  hb.shape(fonts[font], buffer);
  const glyphs = buffer.getGlyphInfosAndPositions().map(g => ({
    glyph_id: g.codepoint,
    x_advance: g.xAdvance, y_advance: g.yAdvance, x_offset: g.xOffset, y_offset: g.yOffset,
  }));
  if (glyphs.some(g => !g.glyph_id || Object.values(g).some(v => !Number.isFinite(v)))) {
    throw new Error(`Shaping reported a missing or invalid glyph at UTF-16 offset ${start}`);
  }
  return glyphs.length ? [{ font, start, end, level, glyphs }] : [];
});
console.log(JSON.stringify(output));
