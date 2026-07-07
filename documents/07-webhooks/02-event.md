> Source: [developer.kiriminaja.com/docs/webhook/event — Webhook Payload Express](https://developer.kiriminaja.com/docs/webhook/event)

# Webhook Payload Express

Webhook payloads sent for express delivery events — AWB creation, shipping, cancellation, completion, and returns

Information

If our webhook endpoint is unavailable, use the Tracking API to pull shipment status directly. This ensures you stay updated even during outages.

## HTTP Headers

| Key | Value |
| --- | --- |
| Content-Type | application/json |
| Accept | application/json |
| User-Agent | KiriminAja-Push-Services |
| Authorization | Bearer {api_key} |

## Generic Payload Structure

| Parameter | Type | Description |
| --- | --- | --- |
| method | String | Event type identifier (e.g., processed_packages, shipped_packages) |
| data | Mixed | Event data — varies by event type. See each event below for its shape. |

## Events (Express)

### processed_packages — AWB Created

Information

We send two callback formats: short (order ID + AWB only) and complete (full details including payment and package info). The format is configurable per client.

#### Short Format

```
{ "method": "processed_packages", "data": [ { "order_id": "X", "awb": "Y", "sorting_code": "JOG-JOG1000-JKT2010" } ] }
```

#### Complete Format

```
{ "method": "processed_packages", "data": [ { "order_id": "(order_id)", "awb": "(awb)", "date": "2025-01-09T06:02:03.000000Z", "shipped_at": null, "finished_at": null, "returned_at": null, "rejected_at": null, "reason": null } ], "payment": { "payment_id": "(pid)", "amount": 11200, "status_code": 0, "qr_content": null, "pay_time": null }, "packages": [ { "awb": "(awb)", "order_id": "(order_id)", "service": "(courier)", "service_type": "(service_type)", "status": 105, "live_tracking_url": null, "poly_line": null, "origin": { "name": "(sender name)", "address": "(sender address)", "phone": "(sender phone)", "latitude": 0, "longitude": 0 }, "destination": { "name": "(recipient name)", "address": "(recipient address)", "phone": "(recipient phone)", "latitude": null, "longitude": null }, "driver": { "name": null, "phone": null, "image": null } } ] }
```

### shipped_packages — Package Picked Up

Information

The package has been picked up and is being transported by the courier.

```
{ "method": "shipped_packages", "data": [ { "order_id": "(order_id)", "awb": "(awb)", "date": "2025-01-09T06:02:03.000000Z", "shipped_at": "(shipped date)", "finished_at": null, "returned_at": null, "rejected_at": null, "reason": null } ], "payment": { "payment_id": "(pid)", "amount": 11200, "status_code": 0, "qr_content": null, "pay_time": null }, "packages": [ { "awb": "(awb)", "order_id": "(order_id)", "service": "(courier)", "service_type": "(service_type)", "status": 105, "live_tracking_url": null, "poly_line": null, "origin": { "name": "(sender name)", "address": "(sender address)", "phone": "(sender phone)", "latitude": 0, "longitude": 0 }, "destination": { "name": "(recipient name)", "address": "(recipient address)", "phone": "(recipient phone)", "latitude": null, "longitude": null }, "driver": { "name": null, "phone": null, "image": null } } ] }
```

### canceled_packages — Package Canceled

Information

The shipment has been canceled by the system or flagged by the 3PL.

```
{ "method": "canceled_packages", "data": [ { "order_id": "(order_id)", "awb": "(awb)", "date": "2025-01-09T06:02:03.000000Z", "shipped_at": null, "finished_at": null, "returned_at": null, "rejected_at": null, "reason": null } ], "payment": { "payment_id": "(pid)", "amount": 11200, "status_code": 0, "qr_content": null, "pay_time": null }, "packages": [ { "awb": "(awb)", "order_id": "(order_id)", "service": "(courier)", "service_type": "(service_type)", "status": 105, "live_tracking_url": null, "poly_line": null, "origin": { "name": "(sender name)", "address": "(sender address)", "phone": "(sender phone)", "latitude": 0, "longitude": 0 }, "destination": { "name": "(recipient name)", "address": "(recipient address)", "phone": "(recipient phone)", "latitude": null, "longitude": null }, "driver": { "name": null, "phone": null, "image": null } } ] }
```

### finished_packages — Package Delivered

Information

The shipment has been delivered to and received by the recipient.

```
{ "method": "finished_packages", "data": [ { "order_id": "(order_id)", "awb": "(awb)", "date": "2025-01-09T06:02:03.000000Z", "shipped_at": null, "finished_at": "(finished date)", "returned_at": null, "rejected_at": null, "reason": null } ], "payment": { "payment_id": "(pid)", "amount": 11200, "status_code": 0, "qr_content": null, "pay_time": null }, "packages": [ { "awb": "(awb)", "order_id": "(order_id)", "service": "(courier)", "service_type": "(service_type)", "status": 105, "live_tracking_url": null, "poly_line": null, "origin": { "name": "(sender name)", "address": "(sender address)", "phone": "(sender phone)", "latitude": 0, "longitude": 0 }, "destination": { "name": "(recipient name)", "address": "(recipient address)", "phone": "(recipient phone)", "latitude": null, "longitude": null }, "driver": { "name": null, "phone": null, "image": null } } ] }
```

### returned_packages — Package Returned (RTS)

Information

The package has been flagged for return. When returned_at is populated, the return to sender is complete.

```
{ "method": "returned_packages", "data": [ { "order_id": "(order_id)", "awb": "(awb)", "date": "2025-01-09T06:02:03.000000Z", "shipped_at": null, "finished_at": null, "returned_at": null, "rejected_at": null, "reason": null } ], "payment": { "payment_id": "(pid)", "amount": 11200, "status_code": 0, "qr_content": null, "pay_time": null }, "packages": [ { "awb": "(awb)", "order_id": "(order_id)", "service": "(courier)", "service_type": "(service_type)", "status": 105, "live_tracking_url": null, "poly_line": null, "origin": { "name": "(sender name)", "address": "(sender address)", "phone": "(sender phone)", "latitude": 0, "longitude": 0 }, "destination": { "name": "(recipient name)", "address": "(recipient address)", "phone": "(recipient phone)", "latitude": null, "longitude": null }, "driver": { "name": null, "phone": null, "image": null } } ] }
```

### return_finished_packages (Deprecated)

This event is deprecated. Use`returned_packages`instead.

```
{ "method": "return_finished_packages", "data": [ { "order_id": "OID-40592020", "date": "2021-03-31 00:00:00" }, { "order_id": "OID-40592021", "date": "2021-03-31 00:00:00" } ] }
```
