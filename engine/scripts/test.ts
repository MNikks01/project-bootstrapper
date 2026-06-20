// Tests for the Project Bootstrapper engine — feature toggles drive the output.
import { buildScaffold, kebab } from "../src/index.ts";

let fails = 0;
function ok(cond: boolean, label: string) {
  console.log(`${cond ? "✓" : "✗"} ${label}`);
  if (!cond) fails++;
}

ok(kebab("Acme AI!") === "acme-ai", "kebab cases the name");

// Full AI SaaS
const full = buildScaffold({ name: "Acme AI", template: "ai-saas", features: { auth: true, billing: true, rag: true, mcp: true, docker: true, ci: true } });
const fp = full.files;
ok(["package.json", "tsconfig.json", ".gitignore", ".env.example", "README.md", "CLAUDE.md", "AGENTS.md"].every((f) => f in fp), "always emits base files");
ok("src/app/page.tsx" in fp && !("src/index.ts" in fp), "ai-saas entry is src/app/page.tsx");
ok("src/billing/stripe.ts" in fp && "src/rag/index.ts" in fp && "src/auth/index.ts" in fp, "feature modules emitted when on");
ok("mcp.json" in fp && "src/mcp/server.ts" in fp, "mcp files when mcp on");
ok("Dockerfile" in fp && "docker-compose.yml" in fp && ".github/workflows/ci.yml" in fp, "docker + ci files when on");

const pkg = JSON.parse(fp["package.json"]);
ok("next" in pkg.dependencies && "stripe" in pkg.dependencies && "@modelcontextprotocol/sdk" in pkg.dependencies, "deps reflect features");
ok(fp[".env.example"].includes("STRIPE_SECRET_KEY") && fp[".env.example"].includes("DATABASE_URL"), "env reflects billing + db");
ok(fp["docker-compose.yml"].includes("pgvector"), "compose includes pgvector db when rag/auth/billing on");
ok(fp["CLAUDE.md"].includes("integer cents") && fp["CLAUDE.md"].includes("auth-scoped"), "CLAUDE.md reflects billing + auth conventions");

// Minimal: no features
const min = buildScaffold({ name: "Plain App", template: "ai-saas", features: {} });
const mp = min.files;
ok(!("mcp.json" in mp) && !("src/billing/stripe.ts" in mp) && !("Dockerfile" in mp), "no feature files when toggles off");
const minPkg = JSON.parse(mp["package.json"]);
ok(!("stripe" in minPkg.dependencies) && !("@modelcontextprotocol/sdk" in minPkg.dependencies), "no feature deps when off");
ok(mp[".env.example"].includes("No secrets required"), "env note when no secrets needed");

// node-service template
const svc = buildScaffold({ name: "worker", template: "node-service", features: { ci: true } });
ok("src/index.ts" in svc.files && !("src/app/page.tsx" in svc.files), "node-service entry is src/index.ts");
ok(!("next" in JSON.parse(svc.files["package.json"]).dependencies), "node-service has no next dep");

console.log(fails === 0 ? "\n✅ Project Bootstrapper engine: all tests passed" : `\n❌ ${fails} failed`);
process.exit(fails === 0 ? 0 : 1);
