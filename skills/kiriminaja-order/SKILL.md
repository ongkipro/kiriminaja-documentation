---
name: kiriminaja-order
description: Create and cancel KiriminAja shipments — express (regular) and instant (same-day), COD and non-COD, with VA / QRIS / KA Credit payment. Use when booking a shipment after a rate quote, or voiding one. Covers the v6.2 payload, payment rules, and per-courier field requirements.
---

# KiriminAja — orders

Booking a shipment is asynchronous: the create call returns a `pickup_number` right away, and the
`awb` (tracking number) is delivered later via webhook. Always create from a queue/job so a slow
courier never blocks the checkout response.

## Create express order

`POST order/express` (v6.2 — supports KA Credit).

**Top-level (sender):** `address` (min 10 chars), `name`, `phone` (`08…` or `62…`),
`kecamatan_id`, `kelurahan_id`, `zipcode`, `latitude`/`longitude` (required for Lion & Pos
Indonesia), `schedule` (`YYYY-MM-DD HH:mm:ss`), `payment_method` (`credit` | `qris`, default VA),
`pin` (6 digits, required when `payment_method: "credit"`), and a `packages[]` array.

**Each package:** `order_id` (string prefix, e.g. `FEB-1782355684238`), `destination_name`,
`destination_phone`, `destination_address` (min 10 chars), `destination_subdistrict_id`,
`weight` (grams), `width`/`length`/`height` (cm), `item_name`, `item_value` (min 1000),
`shipping_cost` (from the rate quote), `service` (e.g. `jne`), `service_type` (e.g. `REG23`),
`package_type_id` (9 for regular in v6.2), `cod` (0 for non-COD), `drop` (`true` = drop-off,
`false` = pickup).

Run it from a JSON file so the payload stays reviewable:

```bash
node scripts/ka.mjs order --file order.json
```

A successful response returns `pickup_number`, and `details[].kj_order_id` per package with
`awb: null` (filled in later by webhook).

## Payment rules (do not mix these up)

- `payment_method: "credit"` (KA Credit) applies **only** to non-COD packages (`cod: 0`). The
  request is rejected if the KA Credit balance is below the total `shipping_cost`.
- For COD packages the system uses the COD settlement scheme automatically; `payment_method` is
  ignored. **COD and KA Credit are mutually exclusive.**
- Non-COD without KA Credit falls back to VA / QRIS, and the response carries a `qr_url`.

Common error codes: `4001` invalid PIN · `4002` insufficient KA Credit · `4003` COD combined with
KA Credit · `422` field validation.

## Per-courier gotchas

- **Lion Parcel, Pos Indonesia** — require sender `latitude`/`longitude`.
- Sub-district-aware couriers need `kelurahan_id` / `destination_village_id`.
- Some couriers enforce **one batch per account** — parallel batches return `409 Conflict`.
  Serialise batch creation per account.

## Instant order

`POST order/instant` for same-day. Track with `order/tracking-instant`, cancel with
`order/void-instant` (`{ order_id }`).

## Cancel (void)

```bash
node scripts/ka.mjs void --awb JT1234567890 --reason "customer canceled"
```

Full field reference: `documents/05-order/`.
