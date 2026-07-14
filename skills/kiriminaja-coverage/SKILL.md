---
name: kiriminaja-coverage
description: Resolve Indonesian addresses to KiriminAja area IDs — province, city (kabupaten), district (kecamatan), sub-district (kelurahan) — by ID drill-down or keyword search. Use before quoting a rate or creating a shipment, since those need numeric area IDs, not names.
---

# KiriminAja — coverage area

Rates and orders require numeric area IDs, never plain names. Resolve them first, then cache
the result (these tables change rarely).

## Endpoints

All are `POST` under the base URL, Bearer-authenticated.

| Endpoint                               | Body                          | Returns                     |
| -------------------------------------- | ----------------------------- | --------------------------- |
| `coverage-area/province`               | `{}`                          | provinces + `provinsi_id`   |
| `coverage-area/city`                   | `{ provinsi_id }`             | cities + `kabupaten_id`     |
| `coverage-area/district`               | `{ kabupaten_id }`            | districts + `kecamatan_id`  |
| `coverage-area/sub-district`           | `{ kecamatan_id }`            | sub-districts + `kelurahan_id` |
| `coverage-area/district-by-name`       | `{ keyword }`                 | matching districts          |
| `coverage-area/subdistrict-by-name`    | `{ keyword }`                 | matching sub-districts      |

## Two resolution strategies

**Keyword search (fastest for checkout).** When the customer types a location, search directly:

```bash
node scripts/ka.mjs find "Bandar Surabaya"
node scripts/ka.mjs find-sub "Palagan"
```

The returned district/sub-district ID is the `destination_id` used for pricing.

**Cascading drill-down (for dependent dropdowns).** province → city → district → sub-district:

```bash
node scripts/ka.mjs provinces
node scripts/ka.mjs cities 18
node scripts/ka.mjs districts 225
node scripts/ka.mjs subdistricts 3175
```

## Notes

- Normalise user input (trim, collapse whitespace, case-fold) before searching.
- Some couriers require the sub-district (`kelurahan_id`); others only the district
  (`kecamatan_id`). Resolve to sub-district when you can, so any courier works.
- Cache each level. A province list rarely changes; refetch on a slow schedule, not per request.

Full field reference: `documents/02-coverage-area/`.
