import { test } from "node:test";
import assert from "node:assert/strict";
import { buildScaffold, kebab } from "../src/index.ts";

test("kebab cases names", () => {
  assert.equal(kebab("Acme AI!"), "acme-ai");
});

test("feature toggles drive dependencies + env + module files", () => {
  const f = buildScaffold({ name: "Acme", template: "ai-saas", features: { billing: true, mcp: true } });
  const pkg = JSON.parse(f.files["package.json"]);
  assert.ok("stripe" in pkg.dependencies);
  assert.ok("@modelcontextprotocol/sdk" in pkg.dependencies);
  assert.ok("src/billing/stripe.ts" in f.files);
  assert.ok("mcp.json" in f.files);
  assert.match(f.files[".env.example"], /STRIPE_SECRET_KEY/);
});

test("toggles off -> no feature deps or files", () => {
  const f = buildScaffold({ name: "Plain", template: "ai-saas", features: {} });
  const pkg = JSON.parse(f.files["package.json"]);
  assert.ok(!("stripe" in pkg.dependencies));
  assert.ok(!("mcp.json" in f.files));
  assert.match(f.files[".env.example"], /No secrets required/);
});

test("templates differ: ai-saas vs node-service entry + deps", () => {
  const saas = buildScaffold({ name: "x", template: "ai-saas", features: {} });
  assert.ok("src/app/page.tsx" in saas.files);
  const svc = buildScaffold({ name: "x", template: "node-service", features: {} });
  assert.ok("src/index.ts" in svc.files);
  assert.ok(!("next" in JSON.parse(svc.files["package.json"]).dependencies));
});
