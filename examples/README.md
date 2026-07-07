# Community TypeScript Client

Server-only, zero-dependency TypeScript client for the KiriminAja API.

> ⚠️ **Community-maintained.** Not an official KiriminAja SDK. For official SDKs, see [github.com/kiriminaja](https://github.com/kiriminaja).

## Usage

```ts
import { KiriminAjaClient } from "./kiriminaja-client";

const ka = new KiriminAjaClient({
  apiKey: process.env.KA_API_KEY!,
  env: "sandbox", // or "production"
});

// Address lookup
const provinces = await ka.address.provinces();
const cities = await ka.address.cities(5);

// Rate quoting
const rates = await ka.pricing.express({
  origin_id: 1,
  destination_id: 2,
  courier: "all",
  weight: 1000,
});

// Create shipment
const order = await ka.order.express.create({ /* payload */ });

// Track
const tracking = await ka.order.express.track("ORDER-123");

// Courier list
const couriers = await ka.courier.list();
```

## API coverage

| Service | Methods | Status |
|---|---|---|
| Address | provinces, cities, districts, subDistricts, searchByName | ✅ |
| Pricing | express, instant | ✅ |
| Order Express | create, track, cancel | ✅ |
| Order Instant | create, track, cancel | ✅ |
| Pickup | schedules | ✅ |
| Webhook | register | ✅ |
| Payment | getPayment, creditBalance, validatePin | ✅ |
| Utilities | courier list/group/detail/preference | ✅ |

## Auth

API key passed as `Bearer` token in the `Authorization` header. Get a key from the [Sandbox Dashboard](https://sandbox.kiriminaja.com/).

## Environment

| Env | Base URL |
|---|---|
| `sandbox` | `https://tdev.kiriminaja.com` |
| `production` | `https://client.kiriminaja.com` |

Override via `baseUrl` in the constructor.

## TypeScript types

The client returns `ApiResponse<T>` — a generic wrapper matching KiriminAja's response shape. For stricter typing, extend the response types to match your use case.
