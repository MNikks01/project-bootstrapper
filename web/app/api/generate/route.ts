import { NextResponse } from "next/server";
import { buildScaffold } from "@/lib/engine/index";
import type { Features, Template } from "@/lib/engine/types";

export const runtime = "nodejs";

const TEMPLATES = ["ai-saas", "node-service", "mcp-server"];

export async function POST(req: Request) {
  const { name, template, features } = await req
    .json()
    .catch(() => ({}) as { name?: string; template?: string; features?: string[] });
  if (!name || !template || !TEMPLATES.includes(template)) {
    return NextResponse.json({ error: { message: `Need name and template (${TEMPLATES.join("|")}).` } }, { status: 400 });
  }
  const f: Features = {};
  for (const x of features ?? []) (f as Record<string, boolean>)[x] = true;
  const result = buildScaffold({ name, template: template as Template, features: f });
  return NextResponse.json(result);
}
