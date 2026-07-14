---
name: kiriminaja
description: Integrate the KiriminAja Indonesian multi-courier shipping API. Use when working with shipping rates, creating or tracking shipments, resolving coverage areas (province/city/district/sub-district), scheduling pickups, handling shipping webhooks, or KA Credit / QRIS payment for KiriminAja. Entry point that routes to the coverage, pricing, order, tracking, webhooks, and payment skills.
---

# KiriminAja integration

KiriminAja is an Indonesian logistics aggregator: one API for multi-courier rates, shipment
creation, pickup scheduling, and tracking across 15+ couriers (JNE, SiCepat, J&T, AnterAja,
Ninja, Lion Parcel, IDExpress, SAP, Pos Indonesia, and more).

## Golden rules

1. **The API key is server-side only.** Never ship it to a browser or embed it in client code.
   Call KiriminAja from a backend route, function, worker, or the bundled CLI.
2. **Cache GET lookups.** Coverage-area and courier lists change rarely — cache them (5 min+).
3. **Shipment creation is asynchronous.** `POST /order/express` returns a `pickup_number`
   immediately; the `awb` (tracking number) arrives later via webhook. Fall back to polling
   `/order/tracking` with backoff.
4. **Two different "origin" IDs exist.** Rate quoting uses an area `_id` from coverage search;
   pickup scheduling uses a separate pickup-address `_id`. Do not mix them.

## Auth and environments

Every request carries a Bearer token:

```
Authorization: Bearer {api_key}
Accept: application/json
Content-Type: application/json
```

| Env        | Base URL                          |
| ---------- | --------------------------------- |
| Sandbox    | `https://tdev.kiriminaja.com`     |
| Production | `https://client.kiriminaja.com`   |

Get a key by registering at <https://sandbox.kiriminaja.com/>, waiting for approval, then
copying it from the **Integrasi** section. Responses are JSON with a top-level
`status: true | false` field.

## Two ways to call the API

**From the terminal or a script** — the bundled zero-dependency CLI:

```bash
export KIRIMINAJA_SANDBOX_KEY=your_key   # or put it in .env
node scripts/ka.mjs provinces
node scripts/ka.mjs find "Palagan"
node scripts/ka.mjs rate --origin 5788 --dest 3175 --weight 1000 --courier all
node scripts/ka.mjs track --order FEB-1782355684238
node scripts/ka.mjs help
```

**From your own code** — the TypeScript client in `examples/kiriminaja-client.ts`:

```ts
import { KiriminAjaClient } from "./examples/kiriminaja-client";
const ka = new KiriminAjaClient({ apiKey: process.env.KIRIMINAJA_SANDBOX_KEY! });
const rates = await ka.pricing.express({ origin_id: 5788, destination_id: 3175, weight: 1000 });
```

## Route to the right task

| Goal                                       | Skill / doc                              |
| ------------------------------------------ | ---------------------------------------- |
| Resolve an address to an area ID           | `kiriminaja-coverage`                    |
| Quote shipping cost                        | `kiriminaja-pricing`                     |
| Create or cancel a shipment                | `kiriminaja-order`                       |
| Track a shipment / read status codes       | `kiriminaja-tracking`                    |
| Receive real-time status callbacks         | `kiriminaja-webhooks`                    |
| KA Credit balance, QRIS, PIN               | `kiriminaja-payment`                     |
| Full endpoint reference                    | `documents/00-INDEX.md`                  |

## Typical checkout → fulfilment flow

1. Resolve destination via `coverage-area/district-by-name` → keep the `destination_id`.
2. Quote with `pricing/express` (`courier: "all"` for a multi-courier comparison).
3. Create the shipment with `order/express` from a queue/job. Store `pickup_number` + `kj_order_id`.
4. Receive the `awb` via webhook (or poll `order/tracking` with backoff).
5. Map status codes to your own order states — see `kiriminaja-tracking`.
