# Project Bootstrapper — DEVOPS

Baseline: contextos/DEVOPS.md. Minimal infra.

- **Environments:** Local (Compose) · Preview · Staging · Prod (managed PaaS; no K8s needed — D-009).
- **CI/CD:** lint → typecheck → unit → **template build tests** (every template must compile + pass its tests) → e2e → deploy. The key gate: templates always produce working repos.
- **Template management:** templates are versioned repos; CI builds each on change; template upgrades versioned.
- **Generation:** stateless, cheap; sandbox for post-gen scripts.
- **Deployments:** standard canary; trivial scale.
- **Data ops:** light DB (templates/configs/history); standard backups.
- **Cost ops:** negligible (gen is cheap; AI customization minimal). 
- **Runbooks:** template build failure · GitHub API outage · AI-customization degradation (fall back to default).
