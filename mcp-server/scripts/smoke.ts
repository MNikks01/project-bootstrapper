// Drives the Project Bootstrapper MCP server over stdio JSON-RPC.
import { spawn } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const child = spawn("node", [resolve(here, "../src/server.ts")], { stdio: ["pipe", "pipe", "inherit"] });

let buf = "";
interface RpcMessage {
  jsonrpc?: string;
  id?: number;
  method?: string;
  params?: unknown;
  result?: { serverInfo?: { name?: string }; tools?: { name: string }[]; content?: { type: string; text: string }[]; [k: string]: unknown };
}
const pending = new Map<number, (m: RpcMessage) => void>();
child.stdout.on("data", (chunk) => {
  buf += chunk.toString();
  let nl: number;
  while ((nl = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, nl).trim();
    buf = buf.slice(nl + 1);
    if (!line) continue;
    let msg: RpcMessage;
    try { msg = JSON.parse(line) as RpcMessage; } catch { continue; }
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)!(msg); pending.delete(msg.id); }
  }
});
const send = (o: unknown) => child.stdin.write(JSON.stringify(o) + "\n");
const request = (id: number, method: string, params?: unknown) =>
  new Promise<RpcMessage>((res) => { pending.set(id, res); send({ jsonrpc: "2.0", id, method, params }); });
function assert(c: boolean, l: string) { if (!c) { console.error(`✗ ${l}`); child.kill(); process.exit(1); } console.log(`✓ ${l}`); }

const init = await request(1, "initialize", { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "smoke", version: "1.0.0" } });
assert(init.result?.serverInfo?.name === "project-bootstrapper", `initialize -> ${init.result?.serverInfo?.name}`);
send({ jsonrpc: "2.0", method: "notifications/initialized" });

const names = ((await request(2, "tools/list", {})).result?.tools ?? []).map((t) => t.name);
assert(["list_templates", "scaffold_project", "preview_file"].every((n) => names.includes(n)), `tools/list -> ${names.join(", ")}`);

const sp = await request(3, "tools/call", { name: "scaffold_project", arguments: { name: "Acme AI", template: "ai-saas", features: ["auth", "billing", "mcp", "ci"] } });
const spText = sp.result?.content?.[0]?.text ?? "";
assert(/mcp\.json/.test(spText) && /src\/billing\/stripe\.ts/.test(spText), "scaffold_project lists mcp.json + billing module");

const pf = await request(4, "tools/call", { name: "preview_file", arguments: { name: "Acme AI", template: "ai-saas", features: ["billing"], path: "package.json" } });
assert(/"stripe"/.test(pf.result?.content?.[0]?.text ?? ""), "preview_file package.json includes stripe dep");

child.kill();
console.log("\n✅ Project Bootstrapper MCP server works end-to-end over MCP.");
