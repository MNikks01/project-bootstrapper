# Project Bootstrapper — SECURITY

Baseline: contextos/SECURITY.md. Light surface (mostly stateless gen; little customer data stored).

- **RBAC:** Owner/Admin/Member for org templates/configs; scoped API keys.
- **Audit:** generation + template-change logs.
- **Secrets:** generated repos use env vars only — **secrets never committed** (core promise); GitHub tokens via OAuth in vault, never stored raw.
- **Encryption:** TLS; at-rest for DB; backups encrypted.
- **Generation sandbox:** any post-gen scripts run isolated; AI customization bounded + output-validated.
- **Generated-repo security:** templates are secure-by-default (auth, validation, .gitignore for secrets, dependency pinning, CI secret-scanning).
- **Data (D-010):** we don't store customer code (output → user's GitHub/zip); briefs not used to train models.
- **Compliance:** privacy/security page; SOC 2 only if it becomes an enterprise feature (likely via ContextOS instead).
- **Threats:** (1) secrets committed by templates → env-only + .gitignore + scan; (2) GitHub token misuse → scoped OAuth + vault; (3) malicious template/script → sandbox.
