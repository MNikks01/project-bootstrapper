# Project Bootstrapper — AI ARCHITECTURE

Minimal AI use. Builds on AI_STACK_GUIDE.md.

## Where AI is used (V1+)
- **NL-brief → config:** an LLM turns "a SaaS for X with RAG" into a template + feature config (structured output).
- **Light code customization:** LLM tailors names, models, a few stub files to the brief — bounded edits on top of deterministic templates (templates do the heavy lifting; AI personalizes).
- **README/docs generation:** project-specific docs from config.

## Models & cost
Claude via abstraction (D-003); cheap models suffice (Sonnet/Haiku); low volume → negligible cost; cache by brief hash. Generation core is deterministic (templates), so AI failures degrade gracefully to the default template.

## Reliability
AI customization is opt-in and bounded — never the source of truth for the scaffold (templates are). Output always compiles + passes generated tests (validated post-gen). No autonomous agents.

## Evals
Small golden set: briefs → expected config/features; LLM-as-judge on config correctness; functional check that generated repos build. Reuses `packages/evals`.

## No RAG
Not a retrieval product. See [RAG.md](./RAG.md).
