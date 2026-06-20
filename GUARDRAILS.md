# Project Bootstrapper — GUARDRAILS

Framework: contextos/GUARDRAILS.md.

- **Secrets never committed** — env-only, `.gitignore`, secret-scanning in generated CI (the core safety promise).
- **Generation sandbox** — post-gen scripts + any code execution isolated.
- **Bounded AI customization** — LLM edits are constrained + output validated (must compile); templates are the source of truth, AI only personalizes.
- **Output validation** — generated repo compiles + passes generated tests before "done".
- **Secure-by-default templates** — auth, input validation, dependency pinning, security headers, CI scanning baked in.
- **GitHub token scoping** — least privilege, vault-stored.
- **No autonomous agents** — deterministic workflow.
- Fail safe: AI failure → fall back to default template; invalid config → clear error.
