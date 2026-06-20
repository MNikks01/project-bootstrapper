# Project Bootstrapper — API reference

_Generated from the source; see each subproject's README for usage._

## MCP server tools

Served over stdio JSON-RPC (`mcp-server/src/server.ts`).

| Tool | Description |
|------|-------------|
| `list_templates` | List available project templates and feature toggles.… |
| `scaffold_project` | Generate a complete, AI-agent-ready project scaffold. Returns the file list. Use preview_file to read any file.… |
| `preview_file` | Generate a scaffold and return the contents of one file (e.g. package.json, CLAUDE.md).… |

## Web HTTP API

Next.js route handlers under `web/app/api`.

| Endpoint | Methods |
|----------|---------|
| `/api/download` | POST |
| `/api/generate` | POST |

> All inputs are validated; errors return a JSON `{ error: { message } }` with an appropriate status. No secrets are logged. See `.github/SECURITY.md`.