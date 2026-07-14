---
description: Build and create a KiriminAja express shipment
argument-hint: [path/to/order.json]
---

Create a KiriminAja express shipment.

- If a JSON file path is given in **$ARGUMENTS**, validate it against the payload rules in the
  `kiriminaja-order` skill, then create it:
  ```bash
  node scripts/ka.mjs order --file $ARGUMENTS
  ```
- If no file is given, help assemble the payload first: resolve areas (`kiriminaja-coverage`),
  quote the rate (`kiriminaja-pricing`) to fill `shipping_cost`/`service`/`service_type`, then
  write `order.json` and create it.

Before creating, check:
- `payment_method: "credit"` requires a 6-digit `pin` and enough KA Credit balance, and only for
  non-COD (`cod: 0`). COD and KA Credit cannot be combined.
- Sender `latitude`/`longitude` are present if a courier needs them (Lion, Pos Indonesia).
- `destination_address` and sender `address` are at least 10 characters.

After creation, record `pickup_number` and each `kj_order_id`; the `awb` arrives later via webhook.
