import { test } from "node:test";
import assert from "node:assert/strict";
import { buildScaffold, kebab, TEMPLATES } from "../src/index.ts";
import type { Template } from "../src/index.ts";

const pkgOf = (r: { files: Record<string, string> }) => JSON.parse(r.files["package.json"]);

test("kebab cases names", () => {
  assert.equal(kebab("Acme AI!"), "acme-ai");
});

test("each template produces its runtime dependency", () => {
  const wants: Record<Template, (p: { dependencies: Record<string, string>; devDependencies: Record<string, string> }) => boolean> = {
    "next-app": (p) => "next" in p.dependencies,
    "express-api": (p) => "express" in p.dependencies,
    "fastify-api": (p) => "fastify" in p.dependencies,
    "react-vite": (p) => "react" in p.dependencies && "vite" in p.devDependencies,
    "node-cli": (p) => "tsx" in p.devDependencies && Object.keys(p.dependencies).length === 0,
    "mcp-server": (p) => "@modelcontextprotocol/sdk" in p.dependencies,
    "ai-saas": (p) => "next" in p.dependencies, // alias
    "node-service": (p) => "express" in p.dependencies, // alias
  };
  for (const t of TEMPLATES) {
    const r = buildScaffold({ name: "x", template: t, features: {} });
    assert.ok(wants[t](pkgOf(r)), `template ${t} missing its runtime dep`);
  }
});

test("templates are complete & runnable (key source files present)", () => {
  assert.ok("src/app/page.tsx" in buildScaffold({ name: "x", template: "next-app", features: {} }).files);
  const ex = buildScaffold({ name: "x", template: "express-api", features: {} });
  assert.ok("src/app.ts" in ex.files && "src/routes/items.ts" in ex.files && "test/store.test.ts" in ex.files);
  assert.ok("src/server.ts" in buildScaffold({ name: "x", template: "mcp-server", features: {} }).files);
  assert.ok("index.html" in buildScaffold({ name: "x", template: "react-vite", features: {} }).files);
});

test("feature toggles add deps, env, and modules", () => {
  const r = buildScaffold({ name: "Acme", template: "next-app", features: { billing: true, mcp: true } });
  const pkg = pkgOf(r);
  assert.ok("stripe" in pkg.dependencies);
  assert.ok("@modelcontextprotocol/sdk" in pkg.dependencies);
  assert.ok("src/billing.ts" in r.files);
  assert.ok("src/mcp-server.ts" in r.files && "mcp.json" in r.files);
  assert.match(r.files[".env.example"], /STRIPE_SECRET_KEY/);
});

test("toggles off -> no feature deps or files", () => {
  const r = buildScaffold({ name: "Plain", template: "next-app", features: {} });
  assert.ok(!("stripe" in pkgOf(r).dependencies));
  assert.ok(!("mcp.json" in r.files));
});

test("default no-env template reports no env required", () => {
  const r = buildScaffold({ name: "Plain", template: "next-app", features: {} });
  assert.match(r.files[".env.example"], /No environment variables required/);
});
