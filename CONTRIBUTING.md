# Contributing

This is a community-maintained integration toolkit and reference for the KiriminAja shipping API.
Contributions to the tooling, client, and examples are welcome.

## What you can contribute

- **Corrections:** if reference content is factually wrong, [open an issue](https://github.com/ongkipro/kiriminaja-documentation/issues).
- **CLI & client:** `scripts/ka.mjs` and `examples/kiriminaja-client.ts` are community-maintained.
  PRs for better typing, error handling, or additional endpoints are welcome.
- **Plugin:** improvements to the skills, commands, and subagent under `skills/`, `commands/`, and
  `agents/`.
- **Smoke tests:** `scripts/smoke.sh` can be extended with more endpoint coverage.
- **Integration examples:** framework-specific guides (Next.js, Astro, Hono, Laravel).

## Reference pages

- `documents/01..10-*/` mirror the published developer portal. Keep edits faithful to the live API;
  when the upstream API changes, update the affected page and note it in the changelog.
- `documents/00-INDEX.md` is the navigation map — keep it in sync with the actual pages.

## Repository conventions

- The API key is server-side only. It is read from the environment; never hardcode or commit it.
- Reference pages preserve KiriminAja's own terms (`KiriminAja`, `KA Credit`, etc.) as-is.
- One logical change per commit, with a clear message.
- Keep `spec/openapi.yaml` aligned with verified endpoints when you extend it.

## Code style

- TypeScript: strict mode, no `any` (use `unknown`), descriptive types.
- Shell scripts: `set -euo pipefail`, POSIX-compatible where possible.
- Markdown: one H1 per file, trailing newline, fenced code blocks with a language tag.
