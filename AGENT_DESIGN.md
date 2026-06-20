# Project Bootstrapper — AGENT DESIGN

General patterns: AGENT_GUIDE.md. This is a **deterministic generation workflow**, not an agentic product.

## The pipeline is a workflow
Resolve template → (optional) LLM customize → render → post-process → output. The only LLM step is a single bounded customization call, not an autonomous loop. Correct: reliability + predictability matter for scaffolding.

## Optional agent surfaces
- **Brief-interpreter (V1):** a single structured LLM call (not an agent) mapping NL brief → config.
- **Setup assistant (Future):** read-only helper answering "how do I configure X?" (RAG over docs).

## What it generates for agents
The real "agent design" here is producing repos that AI agents work well in: CLAUDE.md/AGENTS.md/mcp.json/llms.txt + eval + guardrail skeletons pre-wired, so the *next* developer's agents start fully contexted. This is the product's AI-readiness value.

## Guardrails
Generation sandboxed if running any post-gen scripts; secrets never committed; LLM customization bounded + validated (output must compile). See [GUARDRAILS.md](./GUARDRAILS.md).
