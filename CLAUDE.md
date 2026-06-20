# CLAUDE.md — Project Bootstrapper

Spec-first (D-011). Generates production-grade, AI-agent-ready repos. Project #5; a small tool / future ContextOS (#1) feature.

## Golden rules
1. Respect DECISION_LOG.md (D-003 Claude+abstraction; D-005 TS; D-006 monorepo; D-007 open-core).
2. **Deterministic templates are the source of truth**; AI customization is bounded + validated (must compile).
3. **Secrets never committed** — env-only + .gitignore + CI scanning in generated repos.
4. Generated repos must be **production-grade + AI-agent-ready** (CLAUDE.md/AGENTS.md/mcp.json/llms.txt + CI + Docker + observability + guardrails + eval skeleton).
5. Every template must build + pass its tests (CI gate).
6. Don't over-build — it's a feature/funnel; graduate effort into ContextOS.

## Context to load
[README](./README.md) → [ARCHITECTURE](./ARCHITECTURE.md) → [FEATURES](./FEATURES.md) → [TECH_STACK](./TECH_STACK.md) → [TASKS](./TASKS.md) → [SPRINTS](./SPRINTS.md).

## Stack
Node CLI (commander) · Next.js+TS · NestJS · Handlebars/EJS + ts-morph · Claude via abstraction · Postgres (light) · Octokit · Stripe · Turborepo+pnpm.

## Commands (once code exists)
`bootstrap new ai-saas --name x` · `pnpm test` · `pnpm test:templates` (build every template).

## DoD
Typed · templates build + pass tests · secrets-safe output · spec updated.

## Don'ts
No committed secrets; no unbounded AI code-gen (templates lead); no over-investment in a commodity tool.
