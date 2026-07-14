---
description: Track a KiriminAja shipment and explain its status
argument-hint: <order_id | awb>
---

Track the KiriminAja shipment: **$ARGUMENTS**

1. Run the tracker (use `--order` for an order ID, `--awb` for a tracking number):
   ```bash
   node scripts/ka.mjs track --order $ARGUMENTS
   ```
2. Read the current status `code` and translate it using the taxonomy in the `kiriminaja-tracking`
   skill (Entry / Shipment / Final states).
3. Report: current human-readable status, whether it is a Final state, and the recommended action
   if it is an attention/return/problem code.
