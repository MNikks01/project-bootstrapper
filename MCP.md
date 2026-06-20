# Project Bootstrapper — MCP

Protocol basics: MCP_GUIDE.md.

## Strategy
Two roles: (1) **generate MCP-ready scaffolds** — every template includes `mcp.json` + an optional MCP-server skeleton (reusing #3 patterns) so new projects are agent-connectable from day one; (2) optionally expose the bootstrapper itself as an MCP server (`scaffold_project(brief)`) so an agent can bootstrap projects.

## Generated MCP-readiness
Templates ship with: `mcp.json` template, a starter MCP server stub (if the "mcp" feature is toggled), and agent-context files referencing it. This makes "AI-agent-ready out of the box" concrete.

## Bootstrapper-as-MCP-server (optional)
`scaffold_project(template, config|brief)` → repo. Fun growth demo; lets agents create projects.

## Integration with the lab
Reuses MCP Server Generator (#3) templates for the generated MCP stubs; integrates into ContextOS (#1) as the "new project" flow. See [mcp.json](./mcp.json).
