> Source: [developer.kiriminaja.com/docs/payment/pin-validation — PIN Validation](https://developer.kiriminaja.com/docs/payment/pin-validation)

# PIN Validation

Validate your PIN before making a request pickup using KA Credit

**Endpoint**: `POST`

PIN Validation is required before making a request pickup using KA Credit. The PIN is a 6-digit number that you can find in your KA Credit account. If you are a Term of Payment member, you can't use KA Credit as your payment options.

## Request

```
{ "pin": "123456" }
```

| Field | DataType | Nullable | Desc |
| --- | --- | --- | --- |
| pin | string | false | Your KA Credit PIN |

## Response

### Success

```
{ "status": true, "text": "Pin is valid", "data": { "valid": true, "attempt": 1, "max_attempt": 3, "lock_until": null } }
```

### Failed Attempt

```
{ "status": false, "text": "Unable to proceed, pin invalid", "data": { "valid": false, "attempt": 1, "max_attempt": 3, "lock_until": null } }
```

### Failed System

```
{ "status": false, "text": "Failed to validate pin" }
```

## Note

If you're team a Term of Payment member, you don't need to validate your PIN before making a request pickup using KA Credit.

KA Credit Get the available credit balance for your account, you need this api if you're not Term of Payment memberCourier List The list of couriers available in the KiriminAja API, staging and production may be the difference
