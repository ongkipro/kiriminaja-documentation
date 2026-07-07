# Contributing

This is a community-maintained reference documentation repository. The scraped documents in `documents/` are not intended for manual editing — they reflect the live content from developer.kiriminaja.com at the time of scraping.

## What you can contribute

- **Corrections:** if scraped content is factually wrong, [open an issue](https://github.com/ongkipro/kiriminaja-documentation/issues).
- **Client improvements:** the TypeScript client in `examples/` is community-maintained. PRs for better typing, error handling, or additional endpoints are welcome.
- **Smoke tests:** `scripts/smoke.sh` can be extended with more endpoint coverage.
- **Integration examples:** `src/` directory (when added) will host framework-specific integration guides.

## What NOT to edit

- `documents/01..10-*/` — scraped reference pages. If content is outdated, re-run the scrape process instead of hand-editing.
- `documents/00-INDEX.md` — may be updated to reflect new sections, but keep in sync with actual page contents.

## Scrape process

See the [How this was produced](README.md#how-this-was-produced) section in the README.

## Code style

- TypeScript: strict mode, no `any` (use `unknown`), descriptive types.
- Shell scripts: `set -euo pipefail`, POSIX-compatible where possible.
- Markdown: one H1 per file, trailing newline, fenced code blocks with language tag.
