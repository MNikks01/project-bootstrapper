# Project Bootstrapper — TECH STACK

Portfolio stack (D-003–D-009). Lightweight tool.

| Layer | Choice | Why |
|-------|--------|-----|
| CLI | Node + commander/oclif | Primary surface; devs live in terminals |
| Frontend | Next.js + TS + Tailwind + shadcn | Wizard UI |
| Backend | NestJS (TS) | Config → generation API |
| Template engine | Handlebars/EJS + ts-morph for code edits | Render template repos |
| AI (V1) | Claude via abstraction | NL-brief customization (D-003) |
| DB | PostgreSQL | Saved templates/configs (light) (D-004) |
| GitHub | Octokit | Create/push repos |
| Payments | Stripe (cheap Pro) | D-008 |
| Cloud/CI | Managed PaaS; GitHub Actions; Docker | D-009 |
| Monorepo | Turborepo + pnpm | Reuse lab conventions (D-006) |

## What it generates (the output stack)
The lab's golden path: Next.js + NestJS + Postgres+pgvector + Redis + Stripe + OTel + `packages/{llm,rag,mcp,evals}` skeletons + Docker + GitHub Actions + **CLAUDE.md/AGENTS.md/mcp.json/llms.txt** + guardrails + eval skeleton.

## Why
It's mostly assembling the lab's own conventions into templates — cheapest project to build. Templates are versioned repos; the engine is thin.
