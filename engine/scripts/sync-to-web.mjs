// Single source of truth = engine/src. web/lib/engine is a GENERATED copy with .ts import
// extensions stripped. CLI-only files (cli.ts, write.ts) are skipped — the web doesn't use them.
//   node engine/scripts/sync-to-web.mjs [--check]

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const srcRoot = resolve(here, "../src");
const destRoot = resolve(here, "../../web/lib/engine");
const SKIP = new Set(["cli.ts", "write.ts"]);
const files = (await readdir(srcRoot)).filter((f) => f.endsWith(".ts") && !SKIP.has(f));

const transform = (rel, content) =>
  `// GENERATED from engine/src/${rel} — DO NOT EDIT.\n// Source of truth: engine/src. Regenerate: node engine/scripts/sync-to-web.mjs\n\n` +
  content.replace(/from "(\.\.?\/[^"]+?)\.ts"/g, 'from "$1"');

const check = process.argv.includes("--check");
let drift = 0;
for (const rel of files) {
  const generated = transform(rel, await readFile(join(srcRoot, rel), "utf8"));
  const destPath = join(destRoot, rel);
  if (check) {
    let existing = "";
    try { existing = await readFile(destPath, "utf8"); } catch {}
    if (existing !== generated) { drift++; console.log(`✗ out of sync: web/lib/engine/${rel}`); }
  } else {
    await mkdir(destRoot, { recursive: true });
    await writeFile(destPath, generated, "utf8");
    console.log(`✓ web/lib/engine/${rel}`);
  }
}
if (check) { console.log(drift === 0 ? "\n✅ engine copy in sync." : `\n❌ ${drift} out of sync`); process.exit(drift === 0 ? 0 : 1); }
console.log(`\n✅ synced ${files.length} files to web/lib/engine`);
