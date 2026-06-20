# Project Bootstrapper — OBSERVABILITY

Baseline: contextos/OBSERVABILITY.md. Light.

- **Metrics:** generations/day, by template, success rate, time-to-generate, GitHub-push success, AI-customization usage + cost; signups, free→paid (small), template popularity.
- **Logs:** structured (org/generation id, template, status); AI-customization logs; no secrets.
- **Traces:** OTel on the generation pipeline (resolve→customize→render→push).
- **Dashboards:** generation success/latency, popular templates, funnel.
- **Alerts:** generation failure spike, GitHub API errors, AI cost anomaly.
- **Quality:** generated repos must compile + pass generated tests (CI eval on templates); track template build-success.
- **SLO:** generate < 15s; output builds; minimal AI cost.
- The generated repos themselves ship with OTel pre-wired (the AI-ready/production-grade promise).
