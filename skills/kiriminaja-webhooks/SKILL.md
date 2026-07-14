---
name: kiriminaja-webhooks
description: Register and handle KiriminAja status webhooks — the primary channel for AWB assignment and delivery-status updates (express and instant). Use when building the callback endpoint that receives shipment events, or registering the callback URL.
---

# KiriminAja — webhooks

Webhooks are the primary way to learn a shipment's `awb` and every subsequent status change.
Treat polling as a fallback, not the main path.

## Register the callback URL

`POST webhook/setup` with `{ url }`:

```bash
node scripts/ka.mjs webhook-setup --url https://yourapp.com/api/kiriminaja/webhook
```

The URL must be publicly reachable over HTTPS and return `2xx` quickly.

## Payloads

- `webhook/event` — express shipment events.
- `webhook/event-instant` — instant shipment events.

Each event carries the order identity (`order_id` / `kj_order_id`), the current status `code`
(see `kiriminaja-tracking`), the assigned `awb`, and a timestamp. Requests arrive with header
`User-Agent: KiriminAja-Push-Services`.

## Handler checklist

1. **Respond fast, process async.** Return `200` immediately; enqueue the payload and update your
   order record in the background. Slow handlers get retried and can pile up.
2. **Be idempotent.** The same event may arrive more than once — key on `kj_order_id` + `code` +
   timestamp so a replay is a no-op.
3. **Capture the AWB.** The first meaningful express event is usually the `awb` assignment — save
   it and surface it to the customer.
4. **Map the code**, don't hardcode a single "delivered" check — reuse the mapping in
   `kiriminaja-tracking`.
5. **Verify origin.** Restrict by source and, if you set up a shared secret/signature with the
   provider, validate it before trusting the body.

Full reference: `documents/07-webhooks/`.
