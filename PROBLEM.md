# Project Bootstrapper — PROBLEM

## Core problem
**Starting a production-grade AI app is days of repetitive boilerplate, redone inconsistently every time** — and the result usually isn't AI-agent-ready.

## Pains
| Pain | Mechanism | Cost |
|------|-----------|------|
| Repetitive setup | Auth, billing, DB, CI, Docker, observability wired by hand each time | Days lost per project |
| Inconsistency | Every project differs → hard to maintain/onboard | Drift, confusion |
| Not AI-ready | No CLAUDE.md/AGENTS.md/mcp.json/evals/guardrails → agents start blind | Poor AI-assisted dev from day one |
| Not production-grade | Basic starters lack security/observability/CI | Rework before launch |
| Reinventing decisions | Stack/architecture re-litigated each time | Decision fatigue |

## Why existing tools fall short
- `create-*` CLIs / Nx/Yeoman: basic or config-heavy; not AI-aware, not opinionated for production AI apps.
- v0/bolt/Lovable: generate apps from prompts but with quality/consistency gaps; not "production scaffold."
The gap: **production-grade AND AI-agent-ready out of the box**, opinionated yet configurable. (See COMPETITOR_ANALYSIS.md.)

## Root cause
Scaffolders optimized for "hello world," not "production AI app with agent context." The AI-readiness layer (agent files, evals, guardrails, MCP) is brand-new and unaddressed.

## Validation
The lab itself needs this 7×. Teams hand-roll the same boilerplate repeatedly. The rise of CLAUDE.md/AGENTS.md = demand for AI-ready repos.

## Success
A developer runs one command (or fills a brief) and gets a production-ready, secure, AI-agent-ready repo in minutes, consistent with proven golden paths.

## Honest scope
This is a real pain but **low willingness-to-pay standalone** — value is speed/consistency, mostly captured internally + as a ContextOS feature.
