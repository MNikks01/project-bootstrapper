# API contracts — Project Bootstrapper

_Derived from source. See root `API.md` and each subproject README._

## MCP tools
- `list_templates`
- `scaffold_project`
- `preview_file`

## Web HTTP API
- `POST /api/download`
- `POST /api/generate`

## CLI
- `engine/src/cli.ts` — see `engine/README.md` for flags.

> Inputs are validated; errors return `{ error: { message } }` with an appropriate status.
