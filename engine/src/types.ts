// Core types for the Project Bootstrapper engine. A ScaffoldSpec (template + features)
// deterministically produces a complete project as a file map (path -> contents).

export type Template =
  | "next-app"
  | "express-api"
  | "fastify-api"
  | "react-vite"
  | "node-cli"
  | "mcp-server"
  | "ai-saas" // alias -> next-app
  | "node-service"; // alias -> express-api

export interface Features {
  auth?: boolean; // Clerk-style auth scaffold
  billing?: boolean; // Stripe checkout + webhook
  rag?: boolean; // Postgres + pgvector + embeddings
  mcp?: boolean; // MCP server + mcp.json
  docker?: boolean; // Dockerfile + docker-compose
  ci?: boolean; // GitHub Actions
}

export interface ScaffoldSpec {
  name: string;
  template: Template;
  description?: string;
  features: Features;
}

export interface ScaffoldResult {
  name: string; // kebab-cased
  template: Template;
  files: Record<string, string>; // path -> contents
  fileCount: number;
  features: string[]; // enabled feature names
}
