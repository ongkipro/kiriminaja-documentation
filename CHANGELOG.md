# Changelog

All notable changes to this reference documentation repository.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2026-07-07] — Initial Capture & Setup

### Added

- **Captured 34 pages** from `developer.kiriminaja.com` across 10 sections:
  - 01 Get Started (auth, environments, quick-start)
  - 02 Coverage Area (province, city, district, sub-district, keyword search)
  - 03 Important Notes (status codes, service list, shipping label)
  - 04 Pricing (express, instant rate quoting)
  - 05 Order (create, track, cancel — express + instant)
  - 06 Pickup Delivery (schedule management)
  - 07 Webhooks (callback registration, event payloads)
  - 08 Payment (QRIS, KA Credit, PIN validation)
  - 09 Utilities (courier list/group/detail, preferences, SDK availability)
  - 10 Deprecated API (legacy v6.1 express, v4 instant)
- **Documentation index** (`documents/00-INDEX.md`) with endpoint summary
- **README.md** with 16 sections: architecture diagrams, endpoint table, docs index, where to implement, quick start, important notes
- **AGENTS.md**: 8 hard rules + capture conventions
- **Banner SVG** (`assets/kiriminaja-banner.svg`)
- **OpenAPI 3.1 placeholder** (`spec/openapi.yaml`)
- Project files: `.gitignore`, `.env.example`, `LICENSE` (MIT)

### Technical Notes

- All pages rendered via Playwright + headless Chrome (Nuxt SPA site)
- Post-processed: source URL fix, garbage removal, heading dedup, footer strip
- Raw HTML backups excluded from git via `.gitignore` (`documents/_raw/`)
- 42 tracked files, ~125 KB total
