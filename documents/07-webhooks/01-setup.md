> Source: [developer.kiriminaja.com/docs/webhook/setup — Register Callback](https://developer.kiriminaja.com/docs/webhook/setup)

# Register Callback

The callback address must have a valid A or AAAA record. We will reject any URL that is not accessible.

**Endpoint**: `POST`It is recommended not to modify the callback endpoint without giving prior information.

## Request

| Parameter | Type | Description |
| --- | --- | --- |
| url | String | Your endpoint callback (full URL) |

```
{ "url": "https://kiriminaja.com/webhook-test" }
```

## Response

```
{ "status": true, "method": "set_callback", "text": "Callback di set ke https://kiriminaja.com/webhook-test" }
```

## Throttling

Ensure that your callback endpoint can handle a high volume of requests. If your endpoint is slow or unresponsive, it may result in missed notifications. We recommend implementing a retry mechanism and logging for debugging purposes.

## Limitations

We only allow one callback URL per account. If you want to change the callback URL, you need to set a new callback URL using this endpoint. The previous callback URL will be replaced with the new one. If you want to integrate multiple callback URLs, you can use a proxy server to forward the request to multiple endpoints.

Pickup Schedule We provide two shipping methods, namely pickup and drop-off. If you are interested in using our pickup service, then read this documentation for a good implementationWebhook Payload Express Webhook payloads sent for express delivery events — AWB creation, shipping, cancellation, completion, and returns
