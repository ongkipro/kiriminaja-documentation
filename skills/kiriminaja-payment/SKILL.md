---
name: kiriminaja-payment
description: Handle KiriminAja payment flows — KA Credit balance and PIN validation, and QRIS payment tokens. Use when paying for non-COD shipments with KA Credit or QRIS, checking balance before booking, or validating the 6-digit KA Credit PIN.
---

# KiriminAja — payment

Three flows: **KA Credit** (prepaid wallet), **QRIS** (dynamic QR), and COD settlement (handled
automatically at order time).

## KA Credit

- **Balance** — `POST payment/ka-credit`. Check before creating an order paid with
  `payment_method: "credit"`; the order is rejected if the balance is below total `shipping_cost`.

  ```bash
  node scripts/ka.mjs credit
  ```

- **PIN validation** — `POST payment/pin-validation` with a 6-digit `pin`. The same PIN is required
  in the order payload when paying with KA Credit.

After a KA Credit order, the create response returns `credit_balance_after` — reconcile it against
your own ledger.

## QRIS

`POST payment` returns a QRIS payment token / `qr_url` for a non-COD shipment. Present the QR to the
customer and wait for the paid status (via webhook) before treating the order as settled.

## Rules

- KA Credit is **non-COD only** and mutually exclusive with COD (see `kiriminaja-order`).
- Never log the PIN or the API key. Keep both server-side.
- Treat balance/QRIS reads as cache-unfriendly — they must be fresh at the moment of booking.

Full reference: `documents/08-payment/`.
