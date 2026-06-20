# Project Bootstrapper — RAG

**Not a RAG product** (it generates scaffolds from templates). General method: RAG_GUIDE.md.

## Narrow uses
- Template search (embed templates → "find a template like X") — V2, trivial scale (pgvector).
- Docs assistant (RAG over our docs to help users configure) — optional.

It *generates* RAG-ready scaffolds (the eval/RAG skeleton in templates reuses codebase-intelligence/RAG.md patterns) but does not itself do runtime RAG. No RAG in MVP.
