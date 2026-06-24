// Deterministic scaffold generation: ScaffoldSpec -> a complete, runnable project as a
// file map. A template provides the working base (real source + deps + scripts); optional
// features layer coherent add-ons (auth/billing/rag/mcp/docker/ci). Zero-network.

import type { Features, ScaffoldResult, ScaffoldSpec } from "./types.ts";
import { buildTemplate, type Runtime, type TemplateBuild } from "./templates.ts";

export function kebab(s: string): string {
  return s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "app";
}

function enabledFeatures(f: Features): string[] {
  return Object.entries(f).filter(([, on]) => on).map(([k]) => k);
}

const devPort = (t: TemplateBuild): number => t.port ?? (t.runtime === "vite" ? 5173 : 3000);

// ---------------------------------------------------------------------------
// Feature add-on files (real, importable modules — not TODO stubs)
// ---------------------------------------------------------------------------
const AUTH_TS = [
  `// Bearer-token auth. Set AUTH_TOKEN in the env; clients send "Authorization: Bearer <token>".`,
  `export function isAuthorized(authorizationHeader: string | undefined): boolean {`,
  `  const expected = process.env.AUTH_TOKEN;`,
  `  if (!expected) return true; // no token configured -> open (dev convenience)`,
  `  return authorizationHeader === \`Bearer \${expected}\`;`,
  `}`,
].join("\n");

const BILLING_TS = [
  `import Stripe from "stripe";`,
  ``,
  `// Stripe is null until STRIPE_SECRET_KEY is set, so the app still runs without keys.`,
  `export const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;`,
  ``,
  `export async function createCheckout(priceId = process.env.STRIPE_PRICE_ID) {`,
  `  if (!stripe || !priceId) throw new Error("Stripe not configured (STRIPE_SECRET_KEY + STRIPE_PRICE_ID)");`,
  `  return stripe.checkout.sessions.create({`,
  `    mode: "subscription",`,
  `    line_items: [{ price: priceId, quantity: 1 }],`,
  `    success_url: "http://localhost:3000/success",`,
  `    cancel_url: "http://localhost:3000/cancel",`,
  `  });`,
  `}`,
].join("\n");

const RAG_TS = [
  `// Minimal in-memory retrieval (keyword overlap). Works with zero setup; swap for`,
  `// Postgres + pgvector + real embeddings in production.`,
  `export interface Doc { id: string; text: string }`,
  `const docs: Doc[] = [];`,
  `const toks = (s: string): string[] => s.toLowerCase().match(/[a-z0-9]+/g) ?? [];`,
  ``,
  `export function index(doc: Doc): void { docs.push(doc); }`,
  ``,
  `export function retrieve(query: string, k = 3): Doc[] {`,
  `  const q = new Set(toks(query));`,
  `  return docs`,
  `    .map((d) => ({ d, score: toks(d.text).filter((t) => q.has(t)).length }))`,
  `    .filter((x) => x.score > 0)`,
  `    .sort((a, b) => b.score - a.score)`,
  `    .slice(0, k)`,
  `    .map((x) => x.d);`,
  `}`,
].join("\n");

function mcpFeature(name: string): string {
  return [
    `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";`,
    `import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";`,
    `import { z } from "zod";`,
    ``,
    `const server = new McpServer({ name: ${JSON.stringify(name + "-mcp")}, version: "0.1.0" });`,
    `server.tool("ping", "Health check.", {}, async () => ({ content: [{ type: "text", text: "pong" }] }));`,
    `server.tool("echo", "Echo text.", { text: z.string() }, async ({ text }) => ({ content: [{ type: "text", text }] }));`,
    `await server.connect(new StdioServerTransport());`,
  ].join("\n");
}

function dockerfile(t: TemplateBuild): string {
  const port = devPort(t);
  const buildStep = t.runtime === "next" || t.runtime === "vite" ? "RUN npm run build" : "";
  const cmd = t.runtime === "vite" ? `CMD ["npm","run","preview","--","--host","--port","${port}"]` : `CMD ["npm","start"]`;
  return ["FROM node:22-slim", "WORKDIR /app", "COPY package*.json ./", "RUN npm install", "COPY . .", buildStep, `EXPOSE ${port}`, cmd]
    .filter(Boolean)
    .join("\n") + "\n";
}

function compose(t: TemplateBuild, f: Features): string {
  const lines = ["services:", "  app:", "    build: .", "    ports:", `      - "${devPort(t)}:${devPort(t)}"`, "    env_file: .env"];
  if (f.rag || f.billing) {
    lines.push("  db:", "    image: pgvector/pgvector:pg16", "    environment:", "      POSTGRES_PASSWORD: postgres", "    ports:", '      - "5432:5432"');
  }
  return lines.join("\n") + "\n";
}

function ci(t: TemplateBuild, hasTest: boolean): string {
  const steps = ["      - uses: actions/checkout@v4", "      - uses: actions/setup-node@v4", "        with: { node-version: 22 }", "      - run: npm install"];
  if (t.runtime === "next" || t.runtime === "vite") steps.push("      - run: npm run build");
  else if (t.scripts.typecheck) steps.push("      - run: npm run typecheck");
  if (hasTest) steps.push("      - run: npm test");
  return ["name: CI", "on: [push, pull_request]", "jobs:", "  build:", "    runs-on: ubuntu-latest", "    steps:", ...steps].join("\n") + "\n";
}

function gitignore(t: TemplateBuild): string {
  const base = ["node_modules/", "dist/", ".env", ".env.local", "*.log", ".DS_Store"];
  if (t.runtime === "next") base.push(".next/");
  return base.join("\n") + "\n";
}

function readme(spec: ScaffoldSpec, name: string, t: TemplateBuild): string {
  const feats = enabledFeatures(spec.features);
  const runCmd = t.scripts.dev ? "npm run dev" : "npm start";
  const url = `\n\nThen open http://localhost:${devPort(t)}`;
  return [
    `# ${name}`,
    "",
    spec.description ?? `A ${spec.template} project scaffolded by Project Bootstrapper — complete and ready to run.`,
    "",
    `**Template:** \`${spec.template}\`  ·  **Features:** ${feats.length ? feats.join(", ") : "none"}`,
    "",
    "## Run",
    "```bash",
    "npm install   # the bootstrapper runs this for you unless you passed --no-install",
    runCmd,
    "```" + (t.runtime === "node" ? "" : url),
    "",
    t.env.length ? "Copy `.env.example` to `.env` and fill in values.\n" : "",
    "This repo is AI-agent-ready — see `CLAUDE.md` and `AGENTS.md`.",
    "",
    "_Generated by Project Bootstrapper._",
  ].filter((l) => l !== "").join("\n");
}

function claudeMd(spec: ScaffoldSpec, name: string, t: TemplateBuild): string {
  const feats = enabledFeatures(spec.features);
  return [
    `# CLAUDE.md — ${name}`,
    "",
    "Guidance for AI coding agents in this repo (generated by Project Bootstrapper).",
    "",
    "## Stack",
    `- Template: **${spec.template}** (runtime: ${t.runtime})`,
    feats.length ? `- Features: ${feats.join(", ")}` : "- Features: none",
    `- Run: \`${t.scripts.dev ? "npm run dev" : "npm start"}\``,
    "",
    "## Conventions",
    "- TypeScript strict; small modules; secrets only from env (never commit them).",
    spec.features.billing ? "- Money as integer cents; verify Stripe webhook signatures." : "",
    spec.features.rag ? "- Ground answers in retrieved context; cite sources; don't invent APIs." : "",
    spec.features.auth ? "- Check authorization on protected routes; never leak across users." : "",
    "",
    "## Layout",
    "- `src/` — application code.",
    spec.features.mcp ? "- `src/mcp-server.ts` — MCP server (`npm run mcp`)." : "",
    spec.features.docker ? "- `Dockerfile`, `docker-compose.yml` — container + local infra." : "",
    spec.features.ci ? "- `.github/workflows/ci.yml` — CI." : "",
  ].filter(Boolean).join("\n");
}

function agentsMd(name: string): string {
  return [
    `# AGENTS.md — ${name}`,
    "",
    "Standard agent-instructions file (Cursor, Claude Code, Codex, etc.).",
    "",
    "- Follow the conventions in `CLAUDE.md`.",
    "- `npm install` then the run script before assuming something is broken.",
    "- Keep changes typed and small; never commit secrets.",
  ].join("\n");
}

export function buildScaffold(spec: ScaffoldSpec): ScaffoldResult {
  const name = kebab(spec.name);
  const t = buildTemplate(spec, name);
  const f = spec.features;

  const deps = { ...t.deps };
  const devDeps = { ...t.devDeps };
  const scripts = { ...t.scripts };
  const env = [...t.env];
  const files: Record<string, string> = { ...t.files };

  if (f.auth) {
    files["src/auth.ts"] = AUTH_TS;
    env.push("AUTH_TOKEN=");
  }
  if (f.billing) {
    files["src/billing.ts"] = BILLING_TS;
    deps.stripe = "^17.0.0";
    env.push("STRIPE_SECRET_KEY=", "STRIPE_PRICE_ID=", "STRIPE_WEBHOOK_SECRET=");
  }
  if (f.rag) {
    files["src/rag.ts"] = RAG_TS;
    env.push("# ANTHROPIC_API_KEY=   (optional — only needed if you swap in real embeddings)");
  }
  if (f.mcp && spec.template !== "mcp-server") {
    files["src/mcp-server.ts"] = mcpFeature(name);
    files["mcp.json"] = JSON.stringify({ mcpServers: { [name]: { command: "npx", args: ["tsx", "src/mcp-server.ts"] } } }, null, 2);
    deps["@modelcontextprotocol/sdk"] = "^1.0.0";
    deps.zod = "^3.23.0";
    if (!devDeps.tsx) devDeps.tsx = "^4.19.0";
    scripts.mcp = "tsx src/mcp-server.ts";
  }
  if (f.docker) {
    files["Dockerfile"] = dockerfile(t);
    files["docker-compose.yml"] = compose(t, f);
  }
  const hasTest = Boolean(scripts.test) || Object.keys(files).some((p) => p.includes(".test."));
  if (f.ci) files[".github/workflows/ci.yml"] = ci(t, hasTest);

  files["package.json"] =
    JSON.stringify({ name, version: "0.1.0", private: true, type: "module", scripts, dependencies: deps, devDependencies: devDeps }, null, 2) + "\n";
  files[".gitignore"] = gitignore(t);
  files[".env.example"] = env.length ? env.join("\n") + "\n" : "# No environment variables required\n";
  files["README.md"] = readme(spec, name, t);
  files["CLAUDE.md"] = claudeMd(spec, name, t);
  files["AGENTS.md"] = agentsMd(name);

  return { name, template: spec.template, files, fileCount: Object.keys(files).length, features: enabledFeatures(f) };
}

export type { Runtime };
