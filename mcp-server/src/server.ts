#!/usr/bin/env node
// MCP server for Project Bootstrapper — generate AI-agent-ready project scaffolds from
// any MCP host. stdout is the MCP channel; status -> stderr.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { buildScaffold } from "../../engine/src/index.ts";
import type { Features } from "../../engine/src/types.ts";

const TEMPLATES = ["ai-saas", "node-service", "mcp-server"] as const;
const FEATURES = ["auth", "billing", "rag", "mcp", "docker", "ci"] as const;

function toFeatures(list?: string[]): Features {
  const f: Features = {};
  for (const x of list ?? []) (f as Record<string, boolean>)[x] = true;
  return f;
}

const server = new McpServer({ name: "project-bootstrapper", version: "0.1.0" });

server.tool("list_templates", "List available project templates and feature toggles.", {}, async () => ({
  content: [{ type: "text", text: `Templates: ${TEMPLATES.join(", ")}\nFeatures: ${FEATURES.join(", ")}` }],
}));

server.tool(
  "scaffold_project",
  "Generate a complete, AI-agent-ready project scaffold. Returns the file list. Use preview_file to read any file.",
  { name: z.string(), template: z.enum(TEMPLATES), features: z.array(z.enum(FEATURES)).optional() },
  async ({ name, template, features }) => {
    const r = buildScaffold({ name, template, features: toFeatures(features) });
    const text = `${r.name} (${r.template}) — ${r.fileCount} files [${r.features.join(", ") || "none"}]:\n` +
      Object.keys(r.files).map((p) => `- ${p}`).join("\n");
    return { content: [{ type: "text", text }] };
  },
);

server.tool(
  "preview_file",
  "Generate a scaffold and return the contents of one file (e.g. package.json, CLAUDE.md).",
  { name: z.string(), template: z.enum(TEMPLATES), features: z.array(z.enum(FEATURES)).optional(), path: z.string() },
  async ({ name, template, features, path }) => {
    const r = buildScaffold({ name, template, features: toFeatures(features) });
    return { content: [{ type: "text", text: r.files[path] ?? `No such file: ${path}` }] };
  },
);

await server.connect(new StdioServerTransport());
console.error("[project-bootstrapper-mcp] ready");
