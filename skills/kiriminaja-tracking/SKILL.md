---
name: kiriminaja-tracking
description: Track KiriminAja shipments and map the status-code taxonomy (Entry / Shipment / Final states, 50+ codes) to your own order states. Use when polling delivery status, building a tracking page, or deciding how to react to transit, attempt, return, and problem states.
---

# KiriminAja — tracking & status codes

## Track

- Express: `GET order/tracking` with `order_id` or `awb`.
- Instant: `GET order/tracking-instant` with `order_id`.

```bash
node scripts/ka.mjs track --order FEB-1782355684238
node scripts/ka.mjs track --awb JT1234567890
```

**Polling as fallback to webhooks:** use exponential backoff (e.g. 1m → 2m → 5m → 15m), and stop
once a Final state is reached. Webhooks are the primary signal; polling only covers gaps.

## Status taxonomy

Four families: **New → Transit → Attempt → Final**. Don't just check "delivered" — handle transit,
attempt, return, and problem states explicitly.

### Entry state (created, waiting for 3PL)

| Code | Meaning                                        |
| ---- | ---------------------------------------------- |
| 100  | New package created                            |
| 101  | Pickup requested                               |
| 102  | Validated by pickup officer                    |
| 103  | Picked up by driver                            |
| 104  | Received and validated at DC                   |
| 105  | Waiting for 3PL pickup / AWB assignment        |

### Shipment state (in transit / issues in flight)

| Code | Meaning                              | Code | Meaning                                  |
| ---- | ------------------------------------ | ---- | ---------------------------------------- |
| 106  | With courier / in transit            | 401  | Return information from DC                |
| 107  | Reported by driver                   | 402  | Arrived at warehouse                      |
| 110  | Pending direct pickup                | 403  | Return request initiated                  |
| 152  | Re-delivery / undelivery             | 404  | Courier requested for return to seller    |
| 210  | SOP violation / over SLA             | 405  | Return rejected by seller                 |
| 211  | Violation resolved                   | 406  | Return package breach                     |
| 301  | Recipient refused                    | 500  | Package has issues                        |
| 302  | Pickup canceled by seller            | 555  | Confiscated by Customs                    |
| 310  | Rejected — recipient did not order   | 701  | Package lost                              |
| 311  | Rejected — recipient won't pay       | 702  | Package damaged                           |
| 333  | Destroyed by courier                 | 901  | Problematic package pickup                |
| 350  | Pickup cancellation requested        | 902–905 | Warehouse / courier / return / data issues |

### Final state (process ended)

| Code | Meaning                          |
| ---- | -------------------------------- |
| 200  | Delivered to recipient           |
| 300  | Canceled by client               |
| 333  | Destroyed by courier             |
| 400  | Successfully returned            |
| 500  | Has issues                       |
| 555  | Confiscated by Customs           |
| 703  | Lost claim resolved              |
| 704  | Damaged claim resolved           |

## Suggested mapping to your order states

| Your state   | Codes                                   |
| ------------ | --------------------------------------- |
| `processing` | 100–105                                 |
| `in_transit` | 106, 107, 110, 152                      |
| `attention`  | 210, 301, 310, 311, 350, 500, 901–905   |
| `returning`  | 401–406                                 |
| `delivered`  | 200                                     |
| `canceled`   | 300, 302, 333                           |
| `returned`   | 400                                     |
| `lost`       | 701, 703                                |
| `damaged`    | 702, 704                                |

Full reference: `documents/03-important-notes/02-status-mapping.md`.
