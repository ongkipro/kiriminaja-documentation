> Source: [developer.kiriminaja.com/docs/order/express — Create Express Package](https://developer.kiriminaja.com/docs/order/express)

# Create Express Package

Create a regular (Express) shipping order through KiriminAja MitraAPI with KA Credit payment support.

**Endpoint**: `POST`

This endpoint is used to create Express shipping order requests (pickup or drop-off) to various 3PLs integrated with KiriminAja. Version v6.2 supports payment via KA Credit as an alternative to non-COD payment gateways.

> Disclaimer: The APIs for Pos Indonesia, RPX, and Paxel are available separately. Contact the technical team for more information.

> KA Credit Note: When making a payment using KA Credit (payment_method: "credit"), make sure your KA Credit balance is at least equal to the total shipping_cost in the request. If your balance is insufficient, the request will be rejected.

## Order Flow (Sequence)

```
sequenceDiagram participant c as Client participant kaj as KiriminAja participant pg as Payment participant pl as 3PL c->>kaj: Create Package (COD or NonCOD) Note over c,kaj: Saat membayar dengan KA Credit,<br/>pastikan saldo Anda minimal<br/>sama dengan shipping_cost. kaj-->>pg: Create Non-COD Payment (jika perlu) pg-->>kaj: Confirm Payment (jika non-COD) kaj->>kaj: Queue Request AWB kaj->>pl: Create AWB Note over kaj,pl: Pickup/Drop-Off & COD/NonCOD pl->>kaj: Confirm AWB Created kaj->>c: Webhook AWB Confirmed
```

## Request Parameters

### Top-Level Payload (Sender Details)

| Field | Data Type | Nullable | Description |
| --- | --- | --- | --- |
| address | string (min:10, max:200) | false | Sender's full address |
| name | string (min:1, max:50) | false | Sender's name |
| phone | string (min:9, max:13) | false | Sender's phone number. Must be in the format 08... or 62... |
| kecamatan_id | integer | false | Sender's subdistrict ID |
| kelurahan_id | integer | false | Sender's village ID (for carriers that support sub-districts) |
| zipcode | string (max:5) | true | Sender's ZIP code |
| latitude | numeric | true | Pickup coordinates. Required for Lion & Pos Indonesia |
| longitude | numeric | true | Pickup coordinates. Required for Lion & Pos Indonesia |
| platform_name | string | true | App name for notifications (default: mitra) |
| schedule | string (YYYY-MM-DD HH:mm:ss) | false | Estimated time the package will be ready. Enter any time if all packages are drop-offs |
| payment_method | enum (credit, qris) | true | v6.2 NEW Payment method. Enter "credit" to pay with KA Credit. Default: va |
| pin | string (6 digits) | true | v6.2 NEW KA Credit account PIN. Required when payment_method = "credit" |
| packages | array (min: 1 object) | false | See the Packages Object structure |

### Packages Object

| Field | Data Type | Nullable | Description |
| --- | --- | --- | --- |
| order_id | string (max:20) | false | Partner-side order ID. Must use a string prefix (e.g., FEB-1782355684238) |
| destination_name | string (max:50) | false | Recipient's name |
| destination_phone | string (min:9, max:13) | false | Recipient's phone number. Must be in the format 08... or 62... |
| destination_address | string (min:10, max:255) | false | Recipient's full address (minimum 10 characters to avoid "Bad Address" detection) |
| destination_province_id | integer | true | Recipient's province ID |
| destination_county_id | integer | true | Recipient's county/city ID |
| destination_subdistrict_id | integer | false | Recipient's subdistrict ID |
| destination_village_id | integer | true | Recipient's village ID |
| destination_zipcode | string (max:5) | true | Recipient's ZIP code |
| weight | integer (min:1) | false | Package weight in grams |
| width | integer (min:1) | false | Package width in cm |
| length | integer (min:1) | false | Package length in cm |
| height | integer (min:1) | false | Package height in cm |
| qty | integer | true | Number of items in the package (default 1 if empty) |
| item_name | string (max:255) | false | Name of the package contents |
| item_value | integer (min:1000) | false | Total value of the goods (Rupiah) |
| shipping_cost | integer | false | Shipping rate (see Shipping Price API). When payment_method = "credit", this is the amount that will be debited from the KA Credit balance |
| service | string | false | Shipping carrier code (e.g., jne, jnt, sicepat, posindonesia) |
| service_type | string | false | Service type (e.g., REG23, EZ, CTC, OKE) |
| package_type_id | integer | false | Package type (default 7, or 9 for regular packages in v6.2). See https://bit.ly/package_type_id |
| insurance_amount | numeric | true | See Terms & Conditions |
| add_cost | integer | true | Additional cost (default 0) |
| cod | integer | false | COD value. Set to 0 for non-COD packages. Cannot be combined with payment_method = "credit" |
| drop | boolean | true | true = drop-off / cashless, false = pickup |
| note | string (max:50) | true | Special notes for the courier |

> Rules for combining payment_method and cod: payment_method = "credit" applies only to non-COD packages (cod: 0). For COD packages, the system will automatically use the COD settlement scheme; the payment_method field is ignored.

## Request Example (KA Credit)

```
{ "address": "Kiriminaja Head, Jalan Palagan No 32", "name": "Toko Sumber Rejeki", "phone": "6281234567890", "kecamatan_id": 5788, "kelurahan_id": 31554, "zipcode": "55581", "latitude": -7.765, "longitude": 110.378, "platform_name": "MitraAPI", "payment_method": "credit", "pin": "123456", "schedule": "2026-06-25 10:00:00", "packages": [ { "order_id": "FEB-1782355684238", "destination_name": "Lita Ang", "destination_phone": "6281567948619", "destination_address": "Surabaya Baru, Bandar Surabaya, Lampung Tengah, Lampung, 34159", "destination_provinsi_id": 18, "destination_kabupaten_id": 225, "destination_kecamatan_id": 3175, "destination_zipcode": "34159", "weight": 1000, "width": 30, "height": 15, "length": 20, "shipping_cost": 64000, "service": "jne", "service_type": "REG23", "insurance_amount": 0, "add_cost": 0, "cod": 0, "item_name": "Sepatu", "item_value": 250000, "package_type_id": 9, "drop": false, "note": "Sepatu bagus." } ] }
```

## Success Response

```
{ "status": true, "text": "Request pickup berhasil", "method": "request_pickup", "payment_status": "paid", "payment_method": "credit", "credit_balance_after": 1936000, "qr_url": null, "details": [ { "order_id": "FEB-1782355684238", "kj_order_id": "OKAFEB178235568", "awb": null, "service": "jne", "service_type": "REG23" } ], "pickup_number": "EPR-1782355684" }
```

### Response Parameters

| Field | Data Type | Description |
| --- | --- | --- |
| status | boolean | true if the request was successfully received |
| text | string | Descriptive message |
| method | string | Name of the method called |
| payment_status | enum (paid, unpaid, pending) | Payment status. paid when KA Credit directly deducts the balance |
| payment_method | enum (credit, va, cash) | Payment method used |
| credit_balance_after | integer | v6.2 NEW Remaining KA Credit balance after deduction. Only appears when payment_method = "credit" |
| qr_url | string \| null | Payment QR URL (for non-COD via VA/QRIS). null when using KA Credit |
| details[].order_id | string | Partner-side order ID (echo) |
| details[].kj_order_id | string | KiriminAja internal order ID |
| details[].awb | string \| null | AWB. null initially — will be sent via webhook after AWB is confirmed |
| details[].service | string | Shipping carrier used |
| details[].service_type | string | Service type |
| pickup_number | string | Pickup number |

## Error Response

### Saldo KA Credit tidak mencukupi

```
{ "status": false, "code": 4002, "text": "Saldo KA Credit tidak mencukupi. Saldo saat ini Rp1.500. Total kebutuhan Rp64.000.", "method": "request_pickup" }
```

### PIN tidak valid

```
{ "status": false, "code": 4001, "text": "PIN KA Credit tidak valid.", "method": "request_pickup" }
```

### COD digabung dengan KA Credit

```
{ "status": false, "code": 4003, "text": "Paket COD tidak dapat dibayar dengan KA Credit.", "method": "request_pickup" }
```

### Validasi field umum

```
{ "status": false, "code": 422, "text": "The destination kecamatan id field is required.", "method": "request_pickup" }
```
