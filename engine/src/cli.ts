#!/usr/bin/env node
// bootstrap <name> [--template ai-saas|node-service|mcp-server]
//                  [--features auth,billing,rag,mcp,docker,ci] [-o <dir>] [--stdout]
import { resolve } from "node:path";
import { buildScaffold, kebab } from "./index.ts";
import { writeFiles } from "./write.ts";
import type { Features, Template } from "./types.ts";

const argv = process.argv.slice(2);
function flag(name: string): string | undefined {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
}

const name = argv.find((a) => !a.startsWith("-") && argv[argv.indexOf(a) - 1] !== "--template" && argv[argv.indexOf(a) - 1] !== "--features" && argv[argv.indexOf(a) - 1] !== "-o");
if (!name || argv.includes("-h") || argv.includes("--help")) {
  console.log("Usage: bootstrap <name> [--template ai-saas|node-service|mcp-server] [--features auth,billing,rag,mcp,docker,ci] [-o dir] [--stdout]");
  process.exit(name ? 0 : 1);
}

const template = (flag("--template") ?? "ai-saas") as Template;
const featureList = (flag("--features") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const features: Features = {};
for (const f of featureList) (features as Record<string, boolean>)[f] = true;

const result = buildScaffold({ name, template, features });

if (argv.includes("--stdout")) {
  console.log(JSON.stringify(result, null, 2));
} else {
  const out = resolve(flag("-o") ?? `./${kebab(name)}`);
  await writeFiles(out, result.files);
  console.error(`✓ ${result.fileCount} files -> ${out}  (template: ${result.template}, features: ${result.features.join(", ") || "none"})`);
}
