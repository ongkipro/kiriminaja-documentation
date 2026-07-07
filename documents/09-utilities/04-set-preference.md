> Source: [developer.kiriminaja.com/docs/others/set-preference — Set Courier Preference](https://developer.kiriminaja.com/docs/others/set-preference)

# Set Courier Preference

This API is talking about how we show your 3pl preference on api, less to open then less response time

**Endpoint**: `POST`Information

Expedition preference only available for express delivery option

## Set Preference (Express)

### Request

| Field | DataType | Nullable | Desc |
| --- | --- | --- | --- |
| services | array | true | Fill null to reset all settings |

NB: Use empty json to reset settings

```
{ "services": ["jne", "jnt", "sicepat"] }
```

### Response

```
{ "status": true, "text": "Success to set", "method": "set_whitelist_services" }
```

| Param | DataType | Remark |
| --- | --- | --- |
| status | Boolean | Request result status |
| text | String | Response message |
| method | String | API method name (set_whitelist_services) |
