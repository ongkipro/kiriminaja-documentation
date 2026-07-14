# Security Policy

## Reporting a Vulnerability

This repository holds reference documentation and integration tooling for KiriminAja's public
developer API. It does **not** store API keys, credentials, authentication tokens, or private data.

If you discover a security concern related to this repository:

1. **Do not open a public issue.** Instead, contact the maintainer directly.
2. Describe the issue with as much detail as possible.
3. Allow reasonable time for review before disclosing publicly.

## What this repository does NOT contain

- ❌ No KiriminAja API keys (production or sandbox)
- ❌ No authentication credentials
- ❌ No private endpoint URLs
- ❌ No user data or personally identifiable information

## What this repository DOES contain

- ✅ Public API reference documentation
- ✅ Endpoint shapes and request/response examples
- ✅ Status code taxonomy
- ✅ A CLI and TypeScript client that read the API key from the environment at call time

## Key handling

- The API key is read from `KIRIMINAJA_SANDBOX_KEY` / `KIRIMINAJA_PRODUCTION_KEY` (or a local
  `.env`, which is git-ignored). It is never printed by the CLI or committed to the repository.
- `.env.example` is a template only — never commit a real `.env`.

## Contact

Maintainer: [ongki.pro](https://ongki.pro)

See also: [LICENSE](LICENSE)
