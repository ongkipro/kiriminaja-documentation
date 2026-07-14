---
description: Quote KiriminAja express shipping rates between two areas
argument-hint: <origin> <destination> [weight-grams] [courier]
---

Quote KiriminAja express shipping for: **$ARGUMENTS**

Steps:

1. If origin/destination are names (not numeric IDs), resolve them first with
   `node scripts/ka.mjs find "<name>"` and pick the matching area ID. See the `kiriminaja-coverage` skill.
2. Quote the rate:
   ```bash
   node scripts/ka.mjs rate --origin <origin_id> --dest <destination_id> --weight <grams|1000> --courier <code|all>
   ```
3. Present the options as a table sorted by price: courier, service type, cost, ETA.
4. Carry the `service` + `service_type` of the chosen option forward — the order payload must use
   the exact pair that was quoted.

Refer to the `kiriminaja-pricing` skill for field details. Never expose the API key.
