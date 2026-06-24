// Project Bootstrapper engine — turn a spec (template + features) into a complete,
// production-ready, AI-agent-ready project as a file map. Deterministic + zero-network.

export { buildScaffold, kebab } from "./generate.ts";
export { TEMPLATES, buildTemplate } from "./templates.ts";
export type { TemplateBuild, Runtime } from "./templates.ts";
export type { ScaffoldSpec, ScaffoldResult, Template, Features } from "./types.ts";
