// Adapter example for a single pre-segmented, horizontal OpenType run.
import { readFile, stat } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const [modulePath, fontPath, text, direction, script, language] = process.argv.slice(2);
if (!modulePath || !fontPath || text === undefined || text.length > 65536 ||
    (direction && direction !== "ltr" && direction !== "rtl")) {
  throw new Error("Usage: node shape-harfbuzz.mjs <harfbuzzjs index.mjs> <font.ttf> <text> [ltr|rtl] [script] [language]");
}
if ((await stat(fontPath)).size > 32 * 1024 * 1024) throw new Error("Font exceeds 32 MiB");

const hb = await import(pathToFileURL(modulePath));
const face = new hb.Face(new hb.Blob(await readFile(fontPath)), 0);
const font = new hb.Font(face);
font.setScale(face.upem, face.upem);

const buffer = new hb.Buffer();
buffer.addText(text);
if (direction) buffer.setDirection(direction === "rtl" ? hb.Direction.RTL : hb.Direction.LTR);
if (script) buffer.setScript(script);
if (language) buffer.setLanguage(language);
buffer.guessSegmentProperties();
hb.shape(font, buffer);

const glyphs = buffer.getGlyphInfosAndPositions().map((g) => ({
  glyph_id: g.codepoint,
  x_advance: g.xAdvance,
  y_advance: g.yAdvance,
  x_offset: g.xOffset,
  y_offset: g.yOffset,
}));
if (glyphs.some((g) => g.glyph_id === 0 || Object.values(g).some((v) => !Number.isFinite(v)))) {
  throw new Error("Missing glyph or invalid position");
}
console.log(JSON.stringify(glyphs));
