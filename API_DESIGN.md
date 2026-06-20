# Project Bootstrapper — API DESIGN

REST + CLI. Conventions per contextos/API_DESIGN.md.

## REST
```
GET    /v1/templates                       (built-in + org)
POST   /v1/generate         body:{template, config|brief}  -> {generation_id, preview}
GET    /v1/generations/:id  (status, file tree)
GET    /v1/generations/:id/download         (zip)
POST   /v1/generations/:id/push-to-github   body:{repo_name, private}
POST   /v1/templates        (org custom)     GET /v1/saved-configs   POST /v1/saved-configs
GET    /v1/billing/subscription   POST /v1/webhooks/stripe
```

## CLI
```bash
bootstrap list                                   # templates
bootstrap new ai-saas --name myapp --features rag,mcp,billing
bootstrap new --brief "a SaaS for invoice parsing with RAG"   # AI-customized
bootstrap push                                   # to GitHub
bootstrap login
```
CLI works offline for built-in templates (OSS core); online for AI customization, org templates, GitHub push.

## Errors
problem+json: `invalid-config` (422), `template-not-found` (404), `github-auth-required` (401).
