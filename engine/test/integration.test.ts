import { test } from "node:test";
import assert from "node:assert/strict";
import { buildScaffold } from "../src/index.ts";

test("full next-app scaffold has base + every feature artifact", () => {
  const r = buildScaffold({
    name: "Acme AI",
    template: "next-app",
    features: { auth: true, billing: true, rag: true, mcp: true, docker: true, ci: true },
  });
  for (const k of [
    "package.json", "tsconfig.json", ".gitignore", ".env.example", "README.md", "CLAUDE.md", "AGENTS.md",
    "src/app/page.tsx", "src/app/layout.tsx", "src/app/api/health/route.ts", "next.config.ts",
    "src/auth.ts", "src/billing.ts", "src/rag.ts", "src/mcp-server.ts", "mcp.json",
    "Dockerfile", "docker-compose.yml", ".github/workflows/ci.yml",
  ]) {
    assert.ok(k in r.files, `missing ${k}`);
  }
  assert.match(r.files["docker-compose.yml"], /pgvector/);
  assert.match(r.files["CLAUDE.md"], /integer cents/);
  assert.match(r.files[".env.example"], /STRIPE_SECRET_KEY/);
});

test("express-api minimal is a complete, testable service", () => {
  const r = buildScaffold({ name: "Orders API", template: "express-api", features: {} });
  for (const k of ["src/index.ts", "src/app.ts", "src/routes/items.ts", "src/lib/store.ts", "src/middleware/error.ts", "test/store.test.ts"]) {
    assert.ok(k in r.files, `missing ${k}`);
  }
  const pkg = JSON.parse(r.files["package.json"]);
  assert.match(pkg.scripts.dev, /tsx watch/);
  assert.equal(pkg.scripts.test, "node --test");
  assert.match(r.files[".env.example"], /PORT=3000/);
});

test("ci includes npm test when the template ships tests", () => {
  const r = buildScaffold({ name: "x", template: "express-api", features: { ci: true } });
  assert.match(r.files[".github/workflows/ci.yml"], /npm test/);
});
