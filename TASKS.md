# Project Bootstrapper — TASKS

Maps to [USER_STORIES.md](./USER_STORIES.md)/[SPRINTS.md](./SPRINTS.md). DoD: typed · template builds + tests pass · secrets-safe · spec updated.

## E1 — Foundation
- [ ] Monorepo/CI; CLI scaffold (commander); auth/org (light); Stripe (cheap Pro)

## E2 — Template engine + first template
- [ ] Template engine (Handlebars/EJS + file ops + ts-morph for edits)
- [ ] AI-SaaS template (Next.js+NestJS+Postgres+pgvector+Stripe+auth)
- [ ] Generate agent files (CLAUDE.md/AGENTS.md/mcp.json/llms.txt)
- [ ] Include CI + Dockerfile + observability + guardrails + eval skeleton
- [ ] Template build-test in CI (must compile + pass tests)

## E3 — Output
- [ ] CLI generate + download zip; init git
- [ ] Push-to-GitHub (Octokit, OAuth)
- [ ] Generated README/setup docs

## E4 — Web + customization (V1)
- [ ] Web wizard; feature toggles (auth/billing/rag/mcp/agents)
- [ ] NL-brief → config (LLM, structured, validated); bounded code customization
- [ ] Stack options (DB/payments/deploy)
- [ ] Teams + saved configs; template versioning

## E5 — Org/enterprise (V2/V3)
- [ ] Custom org templates + golden-path enforcement
- [ ] ContextOS "new project" integration (#1)
- [ ] Private template registry; enterprise standards/governance

## E6 — Launch
- [ ] OSS CLI + templates (open-core); docs; example outputs; PH/HN/build-in-public
