# Architecture — Project Bootstrapper

Turn a spec (template + feature toggles) into a complete project file map (code + CLAUDE.md/AGENTS.md/mcp.json + CI + Docker). CLI + web.

**Shape:** a pure-TypeScript **engine** (`engine/src`, zero-network, zero-dep) wrapped by thin adapters: engine/ (engine), engine/src/cli.ts (CLI), mcp-server/ (MCP server), web/ (Next.js app).

- **Engine = single source of truth.** Surfaces never duplicate logic; they call the engine.
- Generated copies (e.g. `web/lib/engine`) are produced by a sync script and kept in lock-step (drift-checked in CI).
- Real external services (LLM, embeddings, Stripe, Postgres/pgvector, OTel) are swapped in behind interfaces/env; nothing is required to run the dev/test path.

Key modules: `types`, `generate`, `write`, `cli`.

See the root `ARCHITECTURE.md` for the full product/scale design.
