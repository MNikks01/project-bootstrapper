#!/usr/bin/env node
// bootstrap <name> [--template <t>] [--features auth,billing,rag,mcp,docker,ci]
//                  [-o <dir>] [--no-install] [--no-git] [--stdout]
// Scaffolds a complete, runnable project and installs its dependencies for you.

import { resolve } from "node:path";
import { execSync } from "node:child_process";
import { buildScaffold, kebab, TEMPLATES } from "./index.ts";
import { writeFiles } from "./write.ts";
import type { Features, Template } from "./types.ts";

const argv = process.argv.slice(2);
function flag(name: string): string | undefined {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
}
const has = (f: string): boolean => argv.includes(f);

const VALUE_FLAGS = new Set(["--template", "--features", "-o", "--out"]);
const name = argv.find((a, i) => !a.startsWith("-") && !VALUE_FLAGS.has(argv[i - 1] ?? ""));

const HELP = `bootstrap — scaffold a complete, runnable project (and install it)

Usage:
  bootstrap <name> [options]

Options:
  --template <t>     one of: ${TEMPLATES.join(", ")}   (default: next-app)
  --features <list>  comma-separated: auth,billing,rag,mcp,docker,ci
  -o, --out <dir>    output directory (default: ./<name>)
  --no-install       don't run npm install
  --no-git           don't run git init
  --stdout           print the file map as JSON (don't write to disk)
  -h, --help         show this help

Examples:
  bootstrap my-api --template express-api
  bootstrap my-app --template next-app --features auth,docker,ci
  bootstrap my-spa --template react-vite -o ./apps/web`;

if (!name || has("-h") || has("--help")) {
  console.log(HELP);
  process.exit(name ? 0 : 1);
}

const template = (flag("--template") ?? "next-app") as Template;
if (!TEMPLATES.includes(template)) {
  console.error(`✗ unknown template "${template}". Valid: ${TEMPLATES.join(", ")}`);
  process.exit(1);
}

const featureList = (flag("--features") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const features: Features = {};
for (const f of featureList) (features as Record<string, boolean>)[f] = true;

const result = buildScaffold({ name, template, features });

if (has("--stdout")) {
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

const out = resolve(flag("-o") ?? flag("--out") ?? `./${kebab(name)}`);
await writeFiles(out, result.files);
console.error(`✓ ${result.fileCount} files -> ${out}  (template: ${result.template}, features: ${result.features.join(", ") || "none"})`);

// Run git init + npm install for the user (the "just works" path).
if (!has("--no-git")) {
  try {
    execSync("git init -q", { cwd: out, stdio: "ignore" });
    console.error("✓ git initialized");
  } catch {
    /* git not installed — skip silently */
  }
}
if (!has("--no-install")) {
  console.error("• Installing dependencies (npm install)…");
  try {
    execSync("npm install", { cwd: out, stdio: "inherit" });
    console.error("✓ dependencies installed");
  } catch {
    console.error("! npm install failed — run it yourself in " + out);
  }
}

// Figure out the run command from the generated package.json.
const pkg = JSON.parse(result.files["package.json"]) as { scripts?: Record<string, string> };
const runCmd = pkg.scripts?.dev ? "npm run dev" : "npm start";
console.error(`\nNext:\n  cd ${out}\n  ${runCmd}`);
