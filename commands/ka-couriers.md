---
description: List KiriminAja couriers or show one courier's services
argument-hint: [courier_code]
---

Show KiriminAja courier availability.

- No argument → list every available courier:
  ```bash
  node scripts/ka.mjs couriers
  ```
- A courier code in **$ARGUMENTS** (e.g. `jne`, `sicepat`, `jnt`) → show its service detail:
  ```bash
  node scripts/ka.mjs courier $ARGUMENTS
  ```

Summarise the result as a table: courier, service code, service type, and any per-courier
requirement worth flagging (e.g. needs lat/long, or sub-district only).
