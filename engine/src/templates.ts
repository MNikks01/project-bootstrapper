// Complete, runnable project templates. Each returns a TemplateBuild: real source
// files plus the dependency/script/tsconfig metadata needed to run after `npm install`.
// generate.ts assembles base files + a template + optional feature add-ons.
//
// The goal: pick a template, get a complete working codebase (boots / builds / serves).
// Features are the small, opt-in room for customization.

import type { ScaffoldSpec, Template } from "./types.ts";

export type Runtime = "next" | "vite" | "node";

export interface TemplateBuild {
  runtime: Runtime;
  port?: number;
  deps: Record<string, string>;
  devDeps: Record<string, string>;
  scripts: Record<string, string>;
  env: string[];
  files: Record<string, string>; // excludes package.json (assembled by generate.ts)
}

const TS_DEV = { typescript: "^5.6.0", "@types/node": "^22.0.0" };
const TSX_DEV = { ...TS_DEV, tsx: "^4.19.0" };

// Node templates run via tsx (and node --test), which want explicit .ts import
// extensions; tsc accepts those only with allowImportingTsExtensions + noEmit.
function nodeTsconfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022", module: "ESNext", moduleResolution: "Bundler",
        strict: true, esModuleInterop: true, skipLibCheck: true,
        allowImportingTsExtensions: true, noEmit: true, resolveJsonModule: true,
      },
      include: ["src", "test"],
    },
    null, 2,
  );
}

// ---------------------------------------------------------------------------
// express-api — a complete REST API (health + in-memory CRUD + error handling)
// ---------------------------------------------------------------------------
function expressApi(name: string): TemplateBuild {
  return {
    runtime: "node", port: 3000,
    deps: { express: "^4.21.0" },
    devDeps: { ...TSX_DEV, "@types/express": "^4.17.21" },
    scripts: {
      dev: "tsx watch src/index.ts", start: "tsx src/index.ts",
      typecheck: "tsc --noEmit", test: "node --test",
    },
    env: ["PORT=3000"],
    files: {
      "tsconfig.json": nodeTsconfig(),
      "src/index.ts": [
        `import { createApp } from "./app.ts";`,
        ``,
        `const port = Number(process.env.PORT) || 3000;`,
        `createApp().listen(port, () => console.log(\`${name} listening on http://localhost:\${port}\`));`,
      ].join("\n"),
      "src/app.ts": [
        `import express, { type Express } from "express";`,
        `import { items } from "./routes/items.ts";`,
        `import { errorHandler } from "./middleware/error.ts";`,
        ``,
        `export function createApp(): Express {`,
        `  const app = express();`,
        `  app.use(express.json());`,
        `  app.get("/health", (_req, res) => res.json({ status: "ok", service: ${JSON.stringify(name)} }));`,
        `  app.use("/items", items);`,
        `  app.use(errorHandler);`,
        `  return app;`,
        `}`,
      ].join("\n"),
      "src/lib/store.ts": [
        `// Tiny in-memory store. Swap for a real DB (Postgres/Drizzle) in production.`,
        `import { randomUUID } from "node:crypto";`,
        ``,
        `export interface Item { id: string; name: string; createdAt: string }`,
        ``,
        `const items = new Map<string, Item>();`,
        ``,
        `export const store = {`,
        `  list: (): Item[] => [...items.values()],`,
        `  get: (id: string): Item | undefined => items.get(id),`,
        `  create: (name: string): Item => {`,
        `    const item: Item = { id: randomUUID(), name, createdAt: new Date().toISOString() };`,
        `    items.set(item.id, item);`,
        `    return item;`,
        `  },`,
        `  update: (id: string, name: string): Item | undefined => {`,
        `    const item = items.get(id);`,
        `    if (!item) return undefined;`,
        `    item.name = name;`,
        `    return item;`,
        `  },`,
        `  remove: (id: string): boolean => items.delete(id),`,
        `};`,
      ].join("\n"),
      "src/routes/items.ts": [
        `import { Router } from "express";`,
        `import { store } from "../lib/store.ts";`,
        ``,
        `export const items = Router();`,
        ``,
        `items.get("/", (_req, res) => res.json(store.list()));`,
        `items.get("/:id", (req, res) => {`,
        `  const item = store.get(req.params.id);`,
        `  if (!item) return res.status(404).json({ error: "not found" });`,
        `  res.json(item);`,
        `});`,
        `items.post("/", (req, res) => {`,
        `  const name = (req.body?.name ?? "").toString().trim();`,
        `  if (!name) return res.status(400).json({ error: "name is required" });`,
        `  res.status(201).json(store.create(name));`,
        `});`,
        `items.put("/:id", (req, res) => {`,
        `  const updated = store.update(req.params.id, (req.body?.name ?? "").toString());`,
        `  if (!updated) return res.status(404).json({ error: "not found" });`,
        `  res.json(updated);`,
        `});`,
        `items.delete("/:id", (req, res) => {`,
        `  res.status(store.remove(req.params.id) ? 204 : 404).end();`,
        `});`,
      ].join("\n"),
      "src/middleware/error.ts": [
        `import type { NextFunction, Request, Response } from "express";`,
        ``,
        `// Centralized error handler — keeps routes clean and responses consistent.`,
        `export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {`,
        `  console.error(err);`,
        `  res.status(500).json({ error: "internal_error" });`,
        `}`,
      ].join("\n"),
      "test/store.test.ts": [
        `import { test } from "node:test";`,
        `import assert from "node:assert/strict";`,
        `import { store } from "../src/lib/store.ts";`,
        ``,
        `test("store: create / get / update / remove", () => {`,
        `  const a = store.create("alpha");`,
        `  assert.equal(store.get(a.id)?.name, "alpha");`,
        `  store.update(a.id, "beta");`,
        `  assert.equal(store.get(a.id)?.name, "beta");`,
        `  assert.ok(store.remove(a.id));`,
        `  assert.equal(store.get(a.id), undefined);`,
        `});`,
      ].join("\n"),
    },
  };
}

// ---------------------------------------------------------------------------
// fastify-api — a complete Fastify REST API
// ---------------------------------------------------------------------------
function fastifyApi(name: string): TemplateBuild {
  return {
    runtime: "node", port: 3000,
    deps: { fastify: "^5.0.0" },
    devDeps: { ...TSX_DEV },
    scripts: { dev: "tsx watch src/index.ts", start: "tsx src/index.ts", typecheck: "tsc --noEmit" },
    env: ["PORT=3000"],
    files: {
      "tsconfig.json": nodeTsconfig(),
      "src/index.ts": [
        `import Fastify from "fastify";`,
        `import { items } from "./routes/items.ts";`,
        ``,
        `const app = Fastify({ logger: true });`,
        `app.get("/health", async () => ({ status: "ok", service: ${JSON.stringify(name)} }));`,
        `await app.register(items, { prefix: "/items" });`,
        ``,
        `const port = Number(process.env.PORT) || 3000;`,
        `app.listen({ port }).catch((e) => { app.log.error(e); process.exit(1); });`,
      ].join("\n"),
      "src/routes/items.ts": [
        `import type { FastifyInstance } from "fastify";`,
        `import { randomUUID } from "node:crypto";`,
        ``,
        `interface Item { id: string; name: string }`,
        `const store = new Map<string, Item>();`,
        ``,
        `// Fastify plugin: in-memory items CRUD. Registered under /items in index.ts.`,
        `export async function items(app: FastifyInstance): Promise<void> {`,
        `  app.get("/", async () => [...store.values()]);`,
        `  app.post<{ Body: { name?: string } }>("/", async (req, reply) => {`,
        `    const name = (req.body?.name ?? "").trim();`,
        `    if (!name) return reply.code(400).send({ error: "name is required" });`,
        `    const item: Item = { id: randomUUID(), name };`,
        `    store.set(item.id, item);`,
        `    return reply.code(201).send(item);`,
        `  });`,
        `  app.get<{ Params: { id: string } }>("/:id", async (req, reply) => {`,
        `    const item = store.get(req.params.id);`,
        `    return item ?? reply.code(404).send({ error: "not found" });`,
        `  });`,
        `  app.delete<{ Params: { id: string } }>("/:id", async (req, reply) =>`,
        `    reply.code(store.delete(req.params.id) ? 204 : 404).send());`,
        `}`,
      ].join("\n"),
    },
  };
}

// ---------------------------------------------------------------------------
// next-app — a complete Next.js App Router app (page + layout + API route)
// ---------------------------------------------------------------------------
function nextApp(name: string): TemplateBuild {
  return {
    runtime: "next", port: 3000,
    deps: { next: "^16.0.0", react: "^19.0.0", "react-dom": "^19.0.0" },
    devDeps: { ...TS_DEV, "@types/react": "^19.0.0", "@types/react-dom": "^19.0.0" },
    scripts: { dev: "next dev", build: "next build", start: "next start" },
    env: [],
    files: {
      "next.config.ts": [`import type { NextConfig } from "next";`, ``, `const config: NextConfig = {};`, `export default config;`].join("\n"),
      "tsconfig.json": JSON.stringify(
        {
          compilerOptions: {
            target: "ES2022", lib: ["dom", "dom.iterable", "ES2022"], jsx: "preserve",
            module: "ESNext", moduleResolution: "Bundler", strict: true, noEmit: true,
            esModuleInterop: true, skipLibCheck: true, resolveJsonModule: true,
            allowJs: true, incremental: true, plugins: [{ name: "next" }],
            paths: { "@/*": ["./src/*"] },
          },
          include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
          exclude: ["node_modules"],
        },
        null, 2,
      ),
      "src/app/layout.tsx": [
        `import "./globals.css";`,
        `import type { Metadata } from "next";`,
        ``,
        `export const metadata: Metadata = { title: ${JSON.stringify(name)}, description: "Built with Project Bootstrapper" };`,
        ``,
        `export default function RootLayout({ children }: { children: React.ReactNode }) {`,
        `  return (`,
        `    <html lang="en">`,
        `      <body>{children}</body>`,
        `    </html>`,
        `  );`,
        `}`,
      ].join("\n"),
      "src/app/page.tsx": [
        `export default function Home() {`,
        `  return (`,
        `    <main style={{ maxWidth: 640, margin: "4rem auto", padding: "0 1rem", fontFamily: "system-ui" }}>`,
        `      <h1>${name}</h1>`,
        `      <p>Your Next.js app is running. Edit <code>src/app/page.tsx</code> to get started.</p>`,
        `      <p>API health check: <a href="/api/health">/api/health</a></p>`,
        `    </main>`,
        `  );`,
        `}`,
      ].join("\n"),
      "src/app/api/health/route.ts": [
        `import { NextResponse } from "next/server";`,
        ``,
        `export function GET() {`,
        `  return NextResponse.json({ status: "ok", service: ${JSON.stringify(name)} });`,
        `}`,
      ].join("\n"),
      "src/app/globals.css": [`* { box-sizing: border-box; }`, `body { margin: 0; }`, `a { color: #0070f3; }`].join("\n"),
    },
  };
}

// ---------------------------------------------------------------------------
// react-vite — a complete Vite + React + TS single-page app
// ---------------------------------------------------------------------------
function reactVite(name: string): TemplateBuild {
  return {
    runtime: "vite", port: 5173,
    deps: { react: "^19.0.0", "react-dom": "^19.0.0" },
    devDeps: { ...TS_DEV, vite: "^6.0.0", "@vitejs/plugin-react": "^4.3.0", "@types/react": "^19.0.0", "@types/react-dom": "^19.0.0" },
    scripts: { dev: "vite", build: "tsc && vite build", preview: "vite preview" },
    env: [],
    files: {
      "index.html": [
        `<!doctype html>`,
        `<html lang="en">`,
        `  <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${name}</title></head>`,
        `  <body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body>`,
        `</html>`,
      ].join("\n"),
      "vite.config.ts": [`import { defineConfig } from "vite";`, `import react from "@vitejs/plugin-react";`, ``, `export default defineConfig({ plugins: [react()] });`].join("\n"),
      "tsconfig.json": JSON.stringify(
        {
          compilerOptions: {
            target: "ES2022", lib: ["ES2022", "DOM", "DOM.Iterable"], module: "ESNext",
            moduleResolution: "Bundler", jsx: "react-jsx", strict: true, skipLibCheck: true,
            noEmit: true, esModuleInterop: true, allowImportingTsExtensions: true, types: ["vite/client"],
          },
          include: ["src"],
        },
        null, 2,
      ),
      "src/vite-env.d.ts": `/// <reference types="vite/client" />\n`,
      "src/main.tsx": [
        `import { StrictMode } from "react";`,
        `import { createRoot } from "react-dom/client";`,
        `import { App } from "./App.tsx";`,
        `import "./index.css";`,
        ``,
        `createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);`,
      ].join("\n"),
      "src/App.tsx": [
        `import { useState } from "react";`,
        ``,
        `export function App() {`,
        `  const [count, setCount] = useState(0);`,
        `  return (`,
        `    <main style={{ maxWidth: 640, margin: "4rem auto", fontFamily: "system-ui", textAlign: "center" }}>`,
        `      <h1>${name}</h1>`,
        `      <button onClick={() => setCount((c) => c + 1)}>count is {count}</button>`,
        `      <p>Edit <code>src/App.tsx</code> and save to hot-reload.</p>`,
        `    </main>`,
        `  );`,
        `}`,
      ].join("\n"),
      "src/index.css": [`body { margin: 0; }`, `button { font-size: 1rem; padding: 0.5rem 1rem; cursor: pointer; }`].join("\n"),
    },
  };
}

// ---------------------------------------------------------------------------
// node-cli — a complete zero-dependency Node CLI starter
// ---------------------------------------------------------------------------
function nodeCli(name: string): TemplateBuild {
  return {
    runtime: "node",
    deps: {},
    devDeps: { ...TSX_DEV },
    scripts: { dev: "tsx src/cli.ts", start: "tsx src/cli.ts", typecheck: "tsc --noEmit" },
    env: [],
    files: {
      "tsconfig.json": nodeTsconfig(),
      "src/cli.ts": [
        `#!/usr/bin/env node`,
        `// ${name} — a small CLI. Add subcommands below.`,
        ``,
        `const [cmd, ...args] = process.argv.slice(2);`,
        ``,
        `const HELP = \`${name} — usage:`,
        `  ${name} hello [name]   greet someone`,
        `  ${name} --help         show this help\`;`,
        ``,
        `switch (cmd) {`,
        `  case "hello":`,
        `    console.log(\`Hello, \${args[0] ?? "world"}!\`);`,
        `    break;`,
        `  default:`,
        `    console.log(HELP);`,
        `    process.exit(cmd && cmd !== "--help" && cmd !== "-h" ? 1 : 0);`,
        `}`,
      ].join("\n"),
    },
  };
}

// ---------------------------------------------------------------------------
// mcp-server — a complete, runnable MCP server (stdio) with example tools
// ---------------------------------------------------------------------------
function mcpServer(name: string): TemplateBuild {
  return {
    runtime: "node",
    deps: { "@modelcontextprotocol/sdk": "^1.0.0", zod: "^3.23.0" },
    devDeps: { ...TSX_DEV },
    scripts: { dev: "tsx src/server.ts", start: "tsx src/server.ts", typecheck: "tsc --noEmit" },
    env: [],
    files: {
      "tsconfig.json": nodeTsconfig(),
      "mcp.json": JSON.stringify({ mcpServers: { [name]: { command: "npx", args: ["tsx", "src/server.ts"] } } }, null, 2),
      "src/server.ts": [
        `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";`,
        `import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";`,
        `import { z } from "zod";`,
        ``,
        `const server = new McpServer({ name: ${JSON.stringify(name)}, version: "0.1.0" });`,
        ``,
        `server.tool("ping", "Health check — returns pong.", {}, async () => ({`,
        `  content: [{ type: "text", text: "pong" }],`,
        `}));`,
        ``,
        `server.tool("echo", "Echo back the provided text.", { text: z.string() }, async ({ text }) => ({`,
        `  content: [{ type: "text", text }],`,
        `}));`,
        ``,
        `server.tool("add", "Add two numbers.", { a: z.number(), b: z.number() }, async ({ a, b }) => ({`,
        `  content: [{ type: "text", text: String(a + b) }],`,
        `}));`,
        ``,
        `await server.connect(new StdioServerTransport());`,
        `console.error(${JSON.stringify(name)} + " MCP server running on stdio");`,
      ].join("\n"),
    },
  };
}

const BUILDERS: Record<string, (name: string) => TemplateBuild> = {
  "next-app": nextApp,
  "ai-saas": nextApp, // alias
  "express-api": expressApi,
  "node-service": expressApi, // alias
  "fastify-api": fastifyApi,
  "react-vite": reactVite,
  "node-cli": nodeCli,
  "mcp-server": mcpServer,
};

export const TEMPLATES: Template[] = [
  "next-app", "express-api", "fastify-api", "react-vite", "node-cli", "mcp-server", "ai-saas", "node-service",
];

export function buildTemplate(spec: ScaffoldSpec, name: string): TemplateBuild {
  const builder = BUILDERS[spec.template] ?? expressApi;
  return builder(name);
}
