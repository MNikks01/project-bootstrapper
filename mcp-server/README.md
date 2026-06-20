# Project Bootstrapper — MCP server

Exposes [`../engine`](../engine) over **MCP**, so any MCP host/agent can generate
production-ready, AI-agent-ready project scaffolds.

## Status: works end-to-end (verified over MCP, 2026-06-21)
- ✅ Tools: `list_templates`, `scaffold_project`, `preview_file`.
- ✅ Driven over real stdio JSON-RPC (`scripts/smoke.ts`).

## Tools
| Tool | Input | Returns |
|------|-------|---------|
| `list_templates` | — | available templates + feature toggles |
| `scaffold_project` | `{ name, template, features[]? }` | the generated file list |
| `preview_file` | `{ name, template, features[]?, path }` | contents of one generated file |

Templates: `ai-saas`, `node-service`, `mcp-server`. Features: `auth, billing, rag, mcp, docker, ci`.

## Run it
```bash
npm install
node src/server.ts     # speaks MCP over stdio
npm run smoke
```
Add to Claude Desktop via [`mcp.json`](./mcp.json) (absolute path to `src/server.ts`).
