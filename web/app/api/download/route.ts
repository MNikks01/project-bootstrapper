import { buildScaffold } from "@/lib/engine/index";
import { zipFiles } from "@/lib/zip";
import type { Features, Template } from "@/lib/engine/types";

export const runtime = "nodejs";

const TEMPLATES = ["ai-saas", "node-service", "mcp-server"];

export async function POST(req: Request) {
  const { name, template, features } = await req
    .json()
    .catch(() => ({}) as { name?: string; template?: string; features?: string[] });
  if (!name || !template || !TEMPLATES.includes(template)) {
    return new Response(JSON.stringify({ error: "bad request" }), { status: 400 });
  }
  const f: Features = {};
  for (const x of features ?? []) (f as Record<string, boolean>)[x] = true;
  const result = buildScaffold({ name, template: template as Template, features: f });
  const zip = await zipFiles(result.name, result.files);
  return new Response(new Uint8Array(zip), {
    status: 200,
    headers: { "Content-Type": "application/zip", "Content-Disposition": `attachment; filename="${result.name}.zip"` },
  });
}
