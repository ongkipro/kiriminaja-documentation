# KiriminAja Reference Docs — Index

> Source: <https://developer.kiriminaja.com/> — reference for the public shipping API. Last reviewed **2026-07-07**.

34 pages across 10 sections.

## Sections

| # | Section | Pages | Coverage |
|---|---|---|---|
| 01 | **Get Started** | 1/1 | `01-introduction.md`. The `/integration` page is JS-only — visit the URL directly. |
| 02 | **Coverage Area** | 7/7 | province, city, district, sub-district, district-by-name, subdistrict-by-name, overview |
| 03 | **Important Notes** | 3/3 | service-list, status-mapping, shipping-label |
| 04 | **Pricing** | 2/2 | express, instant |
| 05 | **Order** | 7/7 | express, insurance-cod-nb, instant, tracking, tracking-instant, void, void-instant |
| 06 | **Pickup Delivery** | 1/1 | schedule |
| 07 | **Webhooks** | 3/3 | setup, event, event-instant |
| 08 | **Payment** | 3/3 | payment, ka-credit, pin-validation |
| 09 | **Utilities** | 5/5 | courier-list, courier-group-list, courier-detail, set-preference, sdk-availability |
| 10 | **Deprecated API** | 2/2 | express (v6.1), instant (v4) |

## Quick reference

### Endpoint shapes

- **Coverage Area** — `/coverage-area/{province,city,district,sub-district}` lookup by ID; keyword search by name.
- **Order** — POST `/order/express` (v6.2 supports `payment_method: "credit"` for KA Credit), GET `/order/tracking`, POST `/order/void`.
- **Pricing** — POST `/pricing/express`, POST `/pricing/instant` with origin + destination + weight.
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

Register at the [Sandbox dashboard](https://sandbox.kiriminaja.com/), wait for approval, then copy the key from the **Integrasi** section.

## Using this reference with the toolkit

- Try any endpoint from the terminal: `node scripts/ka.mjs <command>` (run `help` for the list).
- Call it from code with `examples/kiriminaja-client.ts`.
- Inside Claude Code, the `kiriminaja` skill routes to the per-topic guides.

Each page follows an **Endpoint / Request / Response / Status Code** rhythm — use the status-code
taxonomy in `03-important-notes/02-status-mapping.md` when mapping shipment states to your app.
