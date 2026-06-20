# Project Bootstrapper — web app

The browser UI for [`../engine`](../engine): pick a **template + feature toggles**, preview the generated files, and **download the project as a zip**. Next.js 16 + Tailwind. No keys needed.

## Status: built + API-verified (2026-06-21)
- ✅ `next build` compiles + typechecks (engine synced into `lib/engine/`).
- ✅ `POST /api/generate` (spec → file map) and `POST /api/download` (spec → zip).
- ✅ End-to-end via `scripts/smoke-api.mjs`: full ai-saas → 16 files (mcp.json + billing + ci present, stripe dep present); no features → 8 files; zip downloads; bad template → 400.
- 🔲 Visual UI renders + wired — **verify locally** (`npm run dev`); not click-tested headlessly.

## Run it
```bash
npm install
npm run dev          # http://localhost:3000 — pick template + features, preview, download
# headless API proof:
npm run build
PORT=3980 npx next start &
BASE=http://localhost:3980 node scripts/smoke-api.mjs
```

## Structure
```
app/
  page.tsx              # template + feature picker, file-tree preview, download
  api/generate          # spec -> { files, fileCount, features }
  api/download          # spec -> zip
lib/
  engine/               # GENERATED from ../engine/src (sync-to-web.mjs)
  zip.ts                # file map -> zip
scripts/smoke-api.mjs   # end-to-end API proof
```

## Notes
- `lib/engine/` is generated — edit `../engine/src` and run `node ../engine/scripts/sync-to-web.mjs`.
- Optional production layer: NL-brief AI customization (gated on an LLM key) + GitHub push.
