// Demo: scaffold a full AI SaaS, and a minimal node service. Zero-network.
import { buildScaffold } from "../src/index.ts";

const saas = buildScaffold({
  name: "Acme AI",
  template: "ai-saas",
  description: "An AI SaaS with auth, billing, RAG, and an MCP server.",
  features: { auth: true, billing: true, rag: true, mcp: true, docker: true, ci: true },
});

console.log(`\n▸ ${saas.name} (${saas.template}) — ${saas.fileCount} files, features: ${saas.features.join(", ")}`);
console.log("  files:\n" + Object.keys(saas.files).map((f) => `    - ${f}`).join("\n"));
console.log("\n  package.json dependencies:");
console.log("    " + Object.keys(JSON.parse(saas.files["package.json"]).dependencies).join(", "));
console.log("\n  .env.example:\n" + saas.files[".env.example"].split("\n").map((l) => "    " + l).join("\n"));

const svc = buildScaffold({ name: "billing worker", template: "node-service", features: { docker: true, ci: true } });
console.log(`\n▸ ${svc.name} (${svc.template}) — ${svc.fileCount} files, features: ${svc.features.join(", ") || "none"}`);
console.log("  files: " + Object.keys(svc.files).join(", "));

console.log("\n✅ Demo complete.\n");
