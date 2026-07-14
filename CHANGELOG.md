# Changelog

All notable changes to this project.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [0.1.0] — 2026-07-07

### Added

- **Claude Code plugin** — installable via the bundled marketplace
  (`.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`):
  - Skills: `kiriminaja` (router) plus `coverage`, `pricing`, `order`, `tracking`, `webhooks`,
    and `payment`.
  - Slash commands: `/ka-rate`, `/ka-track`, `/ka-order`, `/ka-coverage`, `/ka-couriers`,
    `/ka-webhook`.
  - Subagent: `kiriminaja-integrator` for end-to-end integration work.
- **CLI** — `scripts/ka.mjs`, a zero-dependency client (coverage lookup, rate quoting, order
  create/track/void, courier list, KA Credit balance, webhook registration).
- **TypeScript client** — `examples/kiriminaja-client.ts`, server-only, covering every endpoint.
- **Reference documentation** — 34 pages across 10 sections under `documents/`, with an index at
  `documents/00-INDEX.md`.
- **OpenAPI 3.1 spec** stub (`spec/openapi.yaml`), banner, `.env.example`, and MIT `LICENSE`.
