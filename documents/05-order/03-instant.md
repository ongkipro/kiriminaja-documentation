> Source: [developer.kiriminaja.com/docs/order/instant — Create Instant Package](https://developer.kiriminaja.com/docs/order/instant)

# Create Instant Package

Place an instant (same-day) delivery order via GoSend, GrabExpress, or Borzo with KA Credit payment support.

**Endpoint**: `POST`

This endpoint is used to create instant / same-day shipping orders using GoSend, GrabExpress, or Borzo couriers, and to receive the AWB number. Version v6.2 introduces KA Credit payment support, a destination structure as a nested object, and multi-item support with metadata.

> KA Credit Note: When using payment_method: "credit", ensure your KA Credit balance is at least equal to the shipping_cost of the package. If the balance is insufficient, the request will be rejected before the AWB is generated.

## Order Flow (Sequence)

```
sequenceDiagram participant c as Client participant kaj as KiriminAja participant pg as Payment participant pl as 3PL (GoSend / Grab / Borzo) c->>kaj: Create Instant Package Note over c,kaj: payment_method: "credit"<br/>memerlukan saldo cukup kaj->>kaj: Validasi PIN & saldo KA Credit kaj-->>pg: Create Non-COD Payment (jika non-credit) pg-->>kaj: Confirm Payment kaj->>pl: Create Booking pl->>kaj: AWB & Polyline kaj->>c: Response AWB + Tracking pl-->>kaj: Driver Assigned (async) kaj-->>c: Webhook Driver Update
```

## Request Parameters

### Top-Level Payload (Sender Details)

| Field | Data Type | Nullable | Description |
| --- | --- | --- | --- |
| address | string (min:10, max:200) | false | Pickup address |
| address_note | string (max:100) | true | Additional notes on the pickup address (e.g., "In front of Oren's House") |
| name | string (min:1, max:50) | false | Sender's name |
| phone | string (min:9, max:13) | false | Sender's phone number. Must be in the format 08... or 62... |
| latitude | numeric | false | Latitude of pickup location |
| longitude | numeric | false | Longitude of pickup location |
| zipcode | string (max:5) | true | Pickup ZIP code |
| payment_method | enum (credit, va, cash) | true | v6.2 NEW Payment method. Enter "credit" for KA Credit. Default: va |
| pin | string (6 digits) | true | v6.2 NEW KA Credit account PIN. Required when payment_method = "credit" |
| packages | array (min: 1 object) | false | See Package Object structure |

### Package Object

| Field | Data Type | Nullable | Description |
| --- | --- | --- | --- |
| order_id | string (max:30) | false | Partner-side order ID. Must include a prefix |
| destination | object | false | Recipient details. See the Destination Object structure |
| service | enum (gosend, grab_express, borzo) | false | Instant courier code |
| service_type | string | false | Service type from the pricing response (e.g., instant, same_day, bike, car) |
| vehicle | enum (motorcycle, car) | false | Courier vehicle. Validated against each courier's supported capacity |
| package_type_id | integer | false | Package type (default 7) |
| shipping_cost | integer | false | Shipping rate from the pricing response. This amount will be debited from the KA Credit |
| insurance_type | enum (none, basic, premium) | true | v6.2 NEW Insurance type. basic follows the courier's default coverage; premium is optional with an additional fee. Default: none |
| description | string (max:255) | true | General package description / notes for the carrier |
| items | array (min:1 object) | false | v6.2 NEW List of items in the package. See Items Object |

### Destination Object

| Field | Data Type | Nullable | Description |
| --- | --- | --- | --- |
| name | string (max:50) | false | Recipient's name |
| phone | string (min:9, max:13) | false | Recipient's phone number |
| latitude | numeric | false | Latitude of delivery location |
| longitude | numeric | false | Longitude of the delivery point |
| address | string (min:10, max:255) | false | Recipient's full address |
| address_note | string (max:100) | true | Recipient's address note (e.g., "Building A, 5th Floor") |

### Items Object

| Field | Data Type | Nullable | Description |
| --- | --- | --- | --- |
| name | string (max:100) | false | Item name |
| description | string (max:255) | true | Item description |
| price | integer (min:1000) | false | Item price per unit (Rupiah). Used as the basis for insurance coverage (see insurance notes for each courier) |
| weight | integer (min:1) | false | Weight per unit in grams |
| qty | integer (min:1) | true | Quantity. Default 1 |
| metadata | object | true | Free-form metadata from the partner. See Metadata Object |

### Metadata Object (opsional)

| Field | Data Type | Nullable | Description |
| --- | --- | --- | --- |
| sku | string (max:50) | true | Product SKU from the partner |
| variant_label | string (max:100) | true | Product variant label |

> Insurance Note: Coverage limits and insurance terms are determined by the selected courier. For details (coverage limits, exclusion list, claim window), see the internal document Instant Courier — Shipping Insurance Scheme.

## Request Example (KA Credit)

```
{ "address": "House of KKK", "address_note": "Depan Rumah Oren", "name": "House of kk", "phone": "628126870021", "latitude": -6.229512799999999, "longitude": 106.9059138, "zipcode": "13430", "payment_method": "credit", "pin": "123456", "packages": [ { "order_id": "FEB-2374823799", "destination": { "name": "John Doe", "phone": "081234567890", "latitude": -6.2088, "longitude": 106.8456, "address": "Jl. Sudirman No. 123, Jakarta Pusat", "address_note": "Gedung A Lantai 5" }, "service": "gosend", "service_type": "instant", "vehicle": "motor", "package_type_id": 7, "shipping_cost": 30500, "insurance_type": "basic", "description": "ini desc", "items": [ { "name": "Smartphone", "description": "Samsung Galaxy S24 Ultra", "price": 5000000, "weight": 80, "qty": 2, "metadata": { "sku": "xx-1", "variant_label": "x-1-2" } } ] } ] }
```

## Success Response

```
{ "status": true, "text": "success", "code": 0, "method": "instant_request_pickup", "result": { "payment": { "payment_id": "PID-1736406074", "payment_method": "credit", "amount": 30500, "credit_balance_after": 1969500, "status_code": "Pembayaran berhasil", "qr_content": null, "pay_time": "2026-06-25 10:01:14" }, "packages": [ { "awb": "GK-11-3177494", "order_id": "FEB-2374823799", "service": "gosend", "service_type": "instant", "vehicle": "motor", "insurance_type": "basic", "status": 105, "live_track_url": null, "poly_line": "db}n@{`l`TyAYp@yDhAaIt@yEd@wBTwAx@{FbAaGRgBf@_CjA}H?IoMoBeEi@...", "origin": { "name": "House of kk", "address": "House of KKK", "phone": "628126870021", "lat_long": "-6.2295127999999,106.9059138" }, "destination": { "name": "John Doe", "address": "Jl. Sudirman No. 123, Jakarta Pusat", "phone": "081234567890", "lat_long": "-6.2088,106.8456" }, "driver": { "name": null, "phone": null, "image": null } } ] } }
```

### Key Response Fields

| Field | Data Type | Description |
| --- | --- | --- |
| status | boolean | true if successful |
| result.payment.payment_id | string | Unique payment ID (e.g., PID-1736406074) |
| result.payment.payment_method | enum | Payment method used |
| result.payment.amount | integer | Amount charged, equal to shipping_cost |
| result.payment.credit_balance_after | integer | v6.2 NEW Remaining KA Credit balance after deduction. Appears only when payment_method = "credit" |
| result.payment.status_code | string | Payment status (e.g., "Payment successful") |
| result.payment.qr_content | string \| null | QR code content for non-credit payments. null for KA Credit |
| result.payment.pay_time | string \| null | Time the payment was successful |
| result.packages[].awb | string | AWB number from the courier (e.g., GK-11-3177494 for GoSend) |
| result.packages[].order_id | string | Echoes the order_id from the request |
| result.packages[].status | integer | Numeric order status code |
| result.packages[].insurance_type | enum | Echoes the active insurance type for this package |
| result.packages[].poly_line | string | Encoded polyline of the route to be displayed on the map |
| result.packages[].live_track_url | string \| null | Live tracking URL. null until a driver is assigned |
| result.packages[].driver | object | Driver details. All fields are null until assignment is complete |

## Error Response

### Saldo KA Credit tidak mencukupi

```
{ "status": false, "code": 4002, "text": "Saldo KA Credit tidak mencukupi. Saldo saat ini Rp10.000. Total kebutuhan Rp30.500.", "method": "instant_request_pickup" }
```

### PIN tidak valid

```
{ "status": false, "code": 4001, "text": "PIN KA Credit tidak valid.", "method": "instant_request_pickup" }
```

### Item melebihi cap asuransi kurir

```
{ "status": false, "code": 4101, "text": "Total nilai barang melebihi cap pertanggungan untuk service grab_express tipe car (Rp3.000.000).", "method": "instant_request_pickup" }
```

### Validasi field umum

```
{ "status": false, "code": 422, "text": "The destination.latitude field is required.", "method": "instant_request_pickup" }
```
