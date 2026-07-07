# KiriminAja Reference Docs — Index

> Source: https://developer.kiriminaja.com/ — captured **2026-07-07** for reference / learning only. Last update 2026.

Total: 34 pages across 10 sections. All markdown files extracted from rendered HTML (Nuxt-served).

## Sections

| # | Section | Pages | Coverage |
|---|---|---|---|
| 01 | **Get Started** | 1/1 | `01-introduction.md` ✅. The `/integration` page is JS-only and was not extractable via headless Chrome within reasonable time — visit the URL directly. |
| 02 | **Coverage Area** | 7/7 | province, city, district, sub-district, district-by-name, subdistrict-by-name, coverage-area overview ✅ |
| 03 | **Important Notes** | 3/3 | service-list, status-mapping, shipping-label ✅ |
| 04 | **Pricing** | 2/2 | express, instant ✅ |
| 05 | **Order** | 7/7 | express, insurance-cod-nb, instant, tracking, tracking-instant, void, void-instant ✅ |
| 06 | **Pickup Delivery** | 1/1 | schedule ✅ |
| 07 | **Webhooks** | 3/3 | setup, event, event-instant ✅ |
| 08 | **Payment** | 3/3 | payment, ka-credit, pin-validation ✅ |
| 09 | **Utilities** | 5/5 | courier-list, courier-group-list, courier-detail, set-preference, sdk-availability ✅ |
| 10 | **Deprecated API** | 2/2 | express (v6.1), instant (v4) ✅ |

> **34/34** Markdown files present. Raw rendered HTML also kept in `_raw/` for fidelity (delete before push if size is a concern).

## Quick reference

### Endpoint shapes (collected)

- **Coverage Area** — `/coverage-area/{province,city,district,sub-district}` lookup by ID; keyword search by name.
- **Order** — POST `/order/express` (v6.2 supports `payment_method: "credit"` for KA Credit), GET `/order/tracking`, POST `/order/void`.
- **Pricing** — GET `/pricing/express`, GET `/pricing/instant` with origin + destination + weight.
- **Webhooks** — POST `/webhook/setup` register; payloads `/webhook/event` (express) + `/webhook/event-instant` (instant).
- **Payment** — POST `/payment` returns QRIS token; `/payment/ka-credit` balance; `/payment/pin-validation` 6-digit PIN.
- **Status mapping** — `/important-notes/status-mapping` (canonical).

### Required headers

```
Authorization: Bearer {api_key}
Accept: application/json
Content-Type: application/json
```

### Environments

| Env | Base URL |
|---|---|
| Sandbox | `https://tdev.kiriminaja.com` |
| Production | `https://client.kiriminaja.com` |

### Auth

API key acquired by registering at the Sandbox dashboard, waiting for approval, then copying from **Integrasi** section.

## How to use this folder

### Optional cleanup before pushing to GitHub

```bash
# remove raw HTML (the .md files are the primary deliverable)
rm -rf documents/_raw/
```

### Before-commit sanity

```bash
# Quick visual check that all MDs have content
for f in documents/**/*.md; do
  size=$(wc -c < "$f")
  if [ "$size" -lt 200 ]; then echo "thin: $f ($size B)"; fi
done
```


This is **reference material only**. Treat each page as:
- A pointer to what questions Kirinin's API needs to answer.
- A pattern to learn from (status codes, validation rules, payload shapes).

When implementing Kirinin's own API:
- ❌ Don't copy wording verbatim into Kirinin's docs.
- ❌ Don't copy their request payload field names if you have a better name.
- ✅ Use the **structure** (sections, ordering, "Endpoint / Request / Response / Status Code" rhythm).
- ✅ Use the **status code taxonomy** as inspiration — adapt for your needs.

## Regenerating this doc

If you want to re-scrape (e.g. KiriminAja docs evolved):

```bash
# Update URL list at /tmp/kirimin-urls.txt (corrected real slugs)
# Then:
node /tmp/scrape-final.cjs   # fetches raw HTML (parallel, 4 contexts)
node /tmp/extract-md-v2.cjs  # converts to markdown
```

Both scripts require `playwright-core` installed at `/tmp/node_modules/playwright-core` and system Google Chrome at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.
