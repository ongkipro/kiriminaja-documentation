> Source: [developer.kiriminaja.com/docs/coverage-area/sub-district — Subdistrict](https://developer.kiriminaja.com/docs/coverage-area/sub-district)

# Subdistrict

Retrieve the list of subdistricts supported by KiriminAja. Coverage for pickup and cashless delivery may change — we will keep you informed

**Endpoint**: `POST`

### Request

| Field | DataType | Nullable | Desc |
| --- | --- | --- | --- |
| kecamatan_id | int | false | District ID |

```
{ "kecamatan_id": 548 }
```

### Response

```
{ "status": true, "text": "Courier Loaded", "method": "get_kelurahan_from_kecamatan_id", "results": [ { "id": 31483, "kelurahan_name": "Bawuran", "kecamatan_id": 548 }, { "id": 31484, "kelurahan_name": "Pleret", "kecamatan_id": 548 }, { "id": 31485, "kelurahan_name": "Segoroyoso", "kecamatan_id": 548 }, { "id": 31486, "kelurahan_name": "Wonokromo", "kecamatan_id": 548 }, { "id": 31487, "kelurahan_name": "Wonolelo", "kecamatan_id": 548 } ] }
```
