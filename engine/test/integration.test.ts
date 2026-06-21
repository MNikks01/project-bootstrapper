import { test } from "node:test";
import assert from "node:assert/strict";
import { buildScaffold } from "../src/index.ts";

test("full ai-saas scaffold has every feature artifact", () => {
  const r = buildScaffold({ name: "Acme AI", template: "ai-saas", features: { auth: true, billing: true, rag: true, mcp: true, docker: true, ci: true } });
  for (const k of ["package.json", "tsconfig.json", ".gitignore", ".env.example", "README.md", "CLAUDE.md", "AGENTS.md", "src/app/page.tsx", "src/auth/index.ts", "src/billing/stripe.ts", "src/rag/index.ts", "mcp.json", "src/mcp/server.ts", "Dockerfile", "docker-compose.yml", ".github/workflows/ci.yml"]) {
    assert.ok(k in r.files, `missing ${k}`);
  }
  assert.equal(r.fileCount, 16);
  assert.match(r.files["docker-compose.yml"], /pgvector/);
  assert.match(r.files["CLAUDE.md"], /integer cents/);
});

test("minimal scaffold is just the base files", () => {
  const r = buildScaffold({ name: "Plain App", template: "ai-saas", features: {} });
  assert.equal(r.fileCount, 8);
  assert.ok(!("Dockerfile" in r.files));
});
