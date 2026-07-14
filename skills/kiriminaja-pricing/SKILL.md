---
name: kiriminaja-pricing
description: Quote KiriminAja shipping cost — express (regular multi-courier) and instant (same-day, lat/long based). Use to compare courier rates before an order, or to show shipping options at checkout. Requires area IDs from the coverage skill.
---

# KiriminAja — pricing

Two rate models: **express** (regular, area-ID based) and **instant** (same-day, coordinate based).

## Express rate

`POST pricing/express`

| Field            | Type              | Notes                                             |
| ---------------- | ----------------- | ------------------------------------------------- |
| `origin_id`      | integer           | area ID (from coverage search)                    |
| `destination_id` | integer           | area ID (from coverage search)                    |
| `courier`        | string \| array   | `"all"` for every courier, or e.g. `["jne","jnt"]`|
| `weight`         | integer (grams)   | default 1000                                      |
| `item_value`     | integer (Rupiah)  | goods value; affects insurance                    |
| `insurance`      | integer           | `0` off, `1` on                                   |
| `COD_AMOUNT`     | integer           | include only for COD quotes                       |

```bash
node scripts/ka.mjs rate --origin 5788 --dest 3175 --weight 1500 --courier all --value 250000
```

`courier: "all"` returns a rate per courier/service so you can present the cheapest or fastest.
Each option echoes a `service` code (e.g. `jne`) and `service_type` (e.g. `REG23`) — carry both
straight into the order payload so the quoted price matches the booked price.

## Instant rate (same-day)

`POST pricing/instant` — uses coordinates, not area IDs.

```json
{
  "service": ["gosend", "grab"],
  "item_price": 250000,
  "origin": { "lat": -7.765, "long": 110.378, "address": "..." },
  "destination": { "lat": -7.801, "long": 110.364, "address": "..." },
  "weight": 1000,
  "vehicle": "motor",
  "timezone": "Asia/Jakarta"
}
```

`vehicle` is `motor` or `mobil`. Instant delivery is intra-city only.

## Notes

- Weight is in **grams**. Round up to the courier's next weight tier where relevant.
- Cache quotes briefly (per origin+destination+weight) to survive checkout retries, but never so
  long that a stale price is booked.
- The `service` + `service_type` you quote must be the ones you send to `order/express`.

Full field reference: `documents/04-pricing/`.
