> Source: [developer.kiriminaja.com/docs/coverage-area/province — Province](https://developer.kiriminaja.com/docs/coverage-area/province)

# Province

Retrieve the list of supported provinces. No manual mapping to individual couriers is required — we handle it for you

**Endpoint**: `POST`

## Response Sample

response.json

```
{ "status": true, "method": "provinsis", "text": "Berhasil", "datas": [ { "id": 1, "provinsi_name": "Bali" }, { "id": 2, "provinsi_name": "Bangka Belitung" } ] }
```

| Param | DataType | Remark |
| --- | --- | --- |
| status | Boolean | Request result status |
| method | String | API method name (provinsis) |
| text | String | Response message |
| datas | Array of Object | List of supported provinces |

### Datas Object

| Param | DataType | Remark |
| --- | --- | --- |
| id | Integer | Province ID |
| provinsi_name | String | Province name |
