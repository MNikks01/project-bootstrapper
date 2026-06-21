---
description: Publish Project Bootstrapper artifacts
---

This repo ships a CLI (`engine/src/cli.ts`).
- To publish to npm: set a public `name`/`version` + `bin` in the package, remove `"private": true`, then `npm publish --access public`.

> Only publish what's intended to be public; never publish secrets or `.env`.
