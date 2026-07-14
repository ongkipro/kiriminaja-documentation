---
description: Resolve an Indonesian address to a KiriminAja area ID
argument-hint: <location name or keyword>
---

Resolve **$ARGUMENTS** to a KiriminAja area ID.

1. Search by name:
   ```bash
   node scripts/ka.mjs find "$ARGUMENTS"
   ```
   For a sub-district, use `find-sub` instead.
2. If several matches come back, list them with province/city context and ask which one is meant.
3. Return the numeric ID to use as `origin_id` / `destination_id` in a rate quote or order.

If a cascading lookup is needed (province → city → district → sub-district), use the
`provinces` / `cities` / `districts` / `subdistricts` commands. See the `kiriminaja-coverage` skill.
