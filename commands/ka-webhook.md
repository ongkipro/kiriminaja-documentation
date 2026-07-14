---
description: Register a KiriminAja webhook or scaffold a handler
argument-hint: [callback_url]
---

Set up KiriminAja status webhooks.

- If a URL is given in **$ARGUMENTS**, register it:
  ```bash
  node scripts/ka.mjs webhook-setup --url $ARGUMENTS
  ```
- If asked to build the receiver, scaffold an HTTPS endpoint that:
  1. returns `200` immediately and processes the payload asynchronously,
  2. is idempotent on `kj_order_id` + status `code` + timestamp,
  3. captures the `awb` on assignment,
  4. maps the status `code` via the `kiriminaja-tracking` skill,
  5. verifies the request origin before trusting the body.

See the `kiriminaja-webhooks` skill for payload shape and header details.
