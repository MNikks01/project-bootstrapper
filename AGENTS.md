# AGENTS.md — Project Bootstrapper

Standard agent-instructions file. Claude-specific: [CLAUDE.md](./CLAUDE.md). Architecture: [AGENT_DESIGN.md](./AGENT_DESIGN.md).

## Project
Generates production-grade, AI-agent-ready repos (CLI + web). Spec-first (D-011). Mostly deterministic.

## Setup
```bash
pnpm install
pnpm dev                 # web + api
# CLI:
pnpm --filter cli build && node apps/cli/dist/index.js new ai-saas --name myapp
```

## Conventions
- TS everywhere; Turborepo+pnpm. Templates are versioned repos; engine = Handlebars/EJS + ts-morph.
- Generated repos include CLAUDE.md/AGENTS.md/mcp.json/llms.txt + CI + Docker + observability + guardrails + eval skeleton.
- Secrets env-only (never committed). LLM (customization) via `packages/llm` (D-003).

## Build & test
`pnpm test` · `pnpm test:templates` (**every template must build + pass tests**) · `pnpm lint && pnpm typecheck`.

## Rules of engagement
1. Templates are source of truth; AI customization bounded + validated.
2. Secrets never committed.
3. Output must be production-grade + AI-ready.
4. Template build-test gate must pass.
5. Update specs on change; don't over-build.

## Where things live
Arch: [ARCHITECTURE.md](./ARCHITECTURE.md) · API/CLI: [API_DESIGN.md](./API_DESIGN.md) · Work: [TASKS.md](./TASKS.md)/[SPRINTS.md](./SPRINTS.md) · Safety: [SECURITY.md](./SECURITY.md)/[GUARDRAILS.md](./GUARDRAILS.md).

## MCP
Generates MCP-ready scaffolds (mcp.json + server stub from #3 patterns); optionally exposes `scaffold_project` as an MCP tool. See [mcp.json](./mcp.json), [MCP.md](./MCP.md).
