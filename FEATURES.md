# Project Bootstrapper — FEATURES

## MVP
| # | Feature |
|---|---------|
| M1 | CLI (`bootstrap <template>`) |
| M2 | Curated templates (AI SaaS starter: Next.js + NestJS + Postgres+pgvector + Stripe + auth) |
| M3 | **Agent-context files generated** (CLAUDE.md, AGENTS.md, mcp.json, llms.txt) |
| M4 | CI (GitHub Actions) + Dockerfile + docker-compose |
| M5 | Observability + guardrails + eval-harness skeleton pre-wired |
| M6 | Push to GitHub / download zip |
| M7 | Auth + billing (Free/Pro) for the web service |

## V1
| # | Feature |
|---|---------|
| V1-1 | Web UI wizard |
| V1-2 | Feature toggles (auth/billing/RAG/MCP/agents on-off) |
| V1-3 | **AI customization from NL brief** ("a SaaS for X with Y") |
| V1-4 | Multiple stacks/options (DB, payments, deploy target) |
| V1-5 | Teams + saved configs |
| V1-6 | Template versioning |

## V2
| # | Feature |
|---|---------|
| V2-1 | Custom org templates + golden-path enforcement |
| V2-2 | ContextOS integration ("new project" inside #1) |
| V2-3 | Post-gen guidance (next steps, agent-ready checklist) |
| V2-4 | More languages/frameworks |

## V3
Enterprise standards/governance; private template registry; compliance-ready scaffolds.

## Future
Auto-upgrade scaffolds (apply template updates to existing repos); marketplace of community templates; one-click deploy.

## Reuse note
Generated agent-context files reuse ContextOS (#1) formats; MCP config reuses #3 patterns; eval skeleton reuses `packages/evals`. This tool is largely *assembly* of the lab's own conventions → cheap to build.
