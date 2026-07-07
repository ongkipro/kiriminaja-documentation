# AGENTS.md — KiriminAja Documentation Repository

> AI agents: read this before writing/changing anything in this repository.
> This file is the contract between human and AI.

---

## Identity

This repository is **reference documentation** for KiriminAja's public shipping API (developer.kiriminaja.com). It contains scraped, cleaned, and indexed API documentation — not source code for a product.

---

## Hard Rules

### 1. documents/ is immutable (except INDEX)
- `documents/01..10-*/` contain scraped reference pages. **Do not modify them.**
- If a document is wrong or incomplete, improve the scrape script and re-run.
- `documents/00-INDEX.md` is the only editable file in that directory.

### 2. Brand names stay as-is
- The scraped text references "KiriminAja," "KA Credit," etc. These are preserved as reference material.
- Do not rename or rebrand in the scraped content.

### 3. No API keys in this repo
- Never commit `.env` files. `.env.example` is a template only.
- API keys seen during scraping were redacted or not stored.
- See SECURITY.md for key handling.

### 4. This is not a product repo
- No source code for a shipping platform lives here.
- No SDK, no server, no routes.
- The `src/` and `scripts/` directories (when added) will contain **integration examples and tooling** — not a standalone product.

### 5. Spec is aspirational
- `spec/openapi.yaml` is a stub. It will be populated with verified KiriminAja schemas — not a new API.
- If a human verifies endpoints against the live API, update the spec.

### 6. README is the source of truth
- The README is the entry point for both humans and AI agents.
- Update it when: new pages scraped, errors fixed in scrape process, structure changes.

### 7. Commit granularly
- One commit per logical change: "scrape: update after upstream docs refresh," "fix: correct status code mapping," etc.
- Keep each commit small and reviewable.

### 8. When expanding integration guides
- If adding Next.js / Astro / Hono integration examples (in `src/`), follow the pattern established in `ongkipro/mengantar-documentation`:
  - Server-only API key (`import 'server-only'` or equivalent)
  - GET caching (5 min), POST no-store
  - Async shipment with queue + backoff tracking polling
  - Validation before API calls (address ≥ 10 chars, weight ≤ service limits, COD in courier range)

---

## Scraping conventions

When re-scraping developer.kiriminaja.com:

1. **Browser rendering is mandatory** — the site is Nuxt SPA; `curl` returns empty shells.
2. **URL slugs follow the sidebar pattern** — see `/tmp/kirimin-urls.txt`.
3. **Wait for content hydration** — `domcontentloaded` + `waitForFunction` (body text > 400 chars) + scroll trigger + `networkidle`.
4. **Post-process**: fix `about:blank` URLs, strip garbled title lines, deduplicate headings, strip footer nav text.
5. **Write scrapers in `/tmp/`** — they are not part of the repo.

---

## Reference URLs (public only)

- https://developer.kiriminaja.com/ — primary source
- https://github.com/kiriminaja — KiriminAja's GitHub org (SDKs, tools)
- https://kiriminaja.com — main site
- https://sandbox.kiriminaja.com/ — sandbox dashboard

---

## When in doubt

1. Check if the question is about **the reference content** → look in `documents/`.
2. Check if the question is about **how to integrate** → reference `AGENTS.md` rule 8.
3. Check if the question is about **the repo structure** → re-read this file.
4. If the content looks wrong, it was scraped faithfully from the live site. Do not edit; re-scrape.
