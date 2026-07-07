> Source: [developer.kiriminaja.com/docs/coverage-area/district-by-name — District by Keyword](https://developer.kiriminaja.com/docs/coverage-area/district-by-name)

# District by Keyword

Search for districts by name keyword. Requests are rate-limited — excessive calls will temporarily suspend your API access

**Endpoint**: `POST`Is recommended to use this endpoint only for searching districts by name keyword. For searching subdistricts, please use theSubdistrict by Keywordendpoint.

### Request

| Field | DataType | Nullable | Desc |
| --- | --- | --- | --- |
| search | string(min: 3) | false | Name of district keyword |

```
{ "search": "Ngemplak" }
```

### Response

| Field | DataType | Desc |
| --- | --- | --- |
| status | boolean | Request status |
| text | string | Response message |
| method | string | API method name |
| data | array | List of matched districts |
| data[].id | integer | District ID |
| data[].text | string | Full district name with city and province |

```
{ "status": true, "text": "Success", "method": "get_address_by_name", "data": [ { "id": 1251, "text": "Ngemplak, Kabupaten Boyolali, Jawa Tengah" }, { "id": 5789, "text": "Ngemplak, Kabupaten Sleman, DI Yogyakarta" } ] }
```
