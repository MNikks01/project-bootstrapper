// End-to-end web API proof for Project Bootstrapper. No browser, no keys.
const BASE = process.env.BASE || "http://localhost:3980";
const J = (p, b) => fetch(BASE + p, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(b) });

// 1) generate a full AI SaaS
let r = await J("/api/generate", { name: "Acme AI", template: "ai-saas", features: ["auth", "billing", "rag", "mcp", "docker", "ci"] });
let d = await r.json();
if (!r.ok) throw new Error("generate failed: " + JSON.stringify(d));
if (!("mcp.json" in d.files) || !("src/billing/stripe.ts" in d.files) || !(".github/workflows/ci.yml" in d.files))
  throw new Error("expected feature files missing");
if (!JSON.parse(d.files["package.json"]).dependencies.stripe) throw new Error("stripe dep missing");
console.log(`✓ /api/generate (full ai-saas) -> ${d.fileCount} files, features: ${d.features.join(", ")}`);

// 2) toggling features off removes files
r = await J("/api/generate", { name: "Plain", template: "ai-saas", features: [] });
d = await r.json();
if ("mcp.json" in d.files || "src/billing/stripe.ts" in d.files) throw new Error("feature files present when toggles off");
console.log(`✓ /api/generate (no features) -> ${d.fileCount} files, none of the feature modules`);

// 3) download zip
r = await J("/api/download", { name: "Acme AI", template: "ai-saas", features: ["mcp", "ci"] });
const buf = Buffer.from(await r.arrayBuffer());
if (buf.subarray(0, 2).toString() !== "PK") throw new Error("download is not a zip");
console.log(`✓ /api/download -> valid zip (${buf.length} bytes)`);

// 4) bad template -> 400
r = await J("/api/generate", { name: "x", template: "nope" });
if (r.status !== 400) throw new Error("expected 400 for bad template, got " + r.status);
console.log("✓ bad template -> 400");

console.log("\n✅ Project Bootstrapper web API end-to-end PASSED");
