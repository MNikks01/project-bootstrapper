# Project Bootstrapper — RISKS

| Type | Risk | L×I | Mitigation |
|------|------|-----|------------|
| Business | **No standalone monetization** (commodity) | H×M | Treat as feature/funnel; monetize via ContextOS + org templates; don't over-invest |
| Market | v0/bolt/create-* compete/commoditize | H×M | Differentiate on production + AI-readiness; stay free at core |
| Tech | Templates rot / break on dep updates | M×M | CI build-test every template; versioning; maintenance budget |
| Tech | Secrets leak into generated repos | L×H | Env-only + .gitignore + scanning (core promise) |
| Tech | AI customization produces broken code | M×M | Bounded edits + compile/test validation + fallback to default |
| Focus | Time sink vs. priority products | M×M | Build opportunistically; cap effort; graduate into #1 |

**Top risk:** monetization — solved by reframing as a ContextOS feature + funnel, not a company.
**Kill criteria:** if it doesn't drive ContextOS funnel or save meaningful internal time, keep it as a minimal OSS CLI and stop investing.
