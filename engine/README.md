# Project Bootstrapper — engine + CLI ✅

## Install & CLI

scaffold a production-ready, AI-agent-ready project. Requires Node ≥18.

```bash
npm i -g @mnikks01/bootstrap    # then run `bootstrap …`, or use npx without installing:
npx @mnikks01/bootstrap my-app --template ai-saas --features auth,billing,rag -o ./my-app
npx @mnikks01/bootstrap my-svc --template node-service --features docker,ci
npx @mnikks01/bootstrap --help
```


The core engine for project #5. Turn a spec (**template + feature toggles**) into a complete,
production-ready, **AI-agent-ready** project — code + `CLAUDE.md` / `AGENTS.md` / `mcp.json` +
CI + Docker — as a deterministic file map. Pure TypeScript, **Node 24 native TS, zero-network**.

## Status: engine + CLI built + tested (2026-06-21)
- ✅ **Templates** — `ai-saas` (Next.js), `node-service`, `mcp-server`.
- ✅ **Feature toggles** — `auth · billing · rag · mcp · docker · ci` drive dependencies, env vars, module files, infra, and the agent-context files.
- ✅ **Agent-ready** — generates `CLAUDE.md` / `AGENTS.md` (reflecting the chosen stack/features) and `mcp.json` + an MCP server stub.
- ✅ **CLI** — `bootstrap <name> --template ai-saas --features auth,billing,mcp,ci -o ./out`.
- ✅ **15/15 tests pass** (`scripts/test.ts`): base files always emitted; toggles add/remove deps, env vars, modules; templates differ correctly.

## Run it
```bash
node scripts/demo.ts                                              # scaffold an AI SaaS + a node service
node scripts/test.ts                                             # 15 assertions
node src/cli.ts "My App" --template ai-saas --features auth,mcp,ci -o ./my-app
```

## How feature toggles change output
| Feature | Adds |
|---|---|
| `auth` | `@clerk/nextjs` dep, `CLERK_*` env, `src/auth/index.ts`, auth convention in `CLAUDE.md` |
| `billing` | `stripe` dep, `STRIPE_*` env, `src/billing/stripe.ts`, "money as integer cents" rule |
| `rag` | `drizzle-orm`+`postgres`, `DATABASE_URL`+`ANTHROPIC_API_KEY`, `src/rag/index.ts`, pgvector in compose |
| `mcp` | `@modelcontextprotocol/sdk`+`zod`, `mcp.json`, `src/mcp/server.ts` |
| `docker` | `Dockerfile`, `docker-compose.yml` |
| `ci` | `.github/workflows/ci.yml` |

## Structure
```
src/
  types.ts      # ScaffoldSpec, Features, ScaffoldResult
  generate.ts   # buildScaffold() + all renderers (deterministic)
  write.ts      # write a file map to disk (CLI)
  cli.ts        # bootstrap <name> [--template] [--features] [-o]
  index.ts      # public API
scripts/
  demo.ts / test.ts
```

## Next
- **MCP server** (`scaffold_project` / `list_templates`) and **web UI** (pick template + features → download zip) — same pattern as the other projects.
- Optional **NL-brief AI customization** (gated on an LLM key) and **GitHub push**.

> Honest take (per the docs): scaffolding is commoditized — #5's real value is internal reuse across the lab + a ContextOS feature + a funnel/brand asset, not standalone revenue.
