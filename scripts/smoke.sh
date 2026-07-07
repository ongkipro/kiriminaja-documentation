#!/usr/bin/env bash
# smoke.sh — Read-only smoke test for KiriminAja sandbox API.
#
# Usage:
#   export KA_API_KEY="your-sandbox-key"
#   bash scripts/smoke.sh
#
# Requires: curl, jq

set -euo pipefail

: "${KA_API_KEY:?Set KA_API_KEY env var — get one from https://sandbox.kiriminaja.com}"
BASE="https://tdev.kiriminaja.com"
PREFIX="$BASE/api/public/$KA_API_KEY"  # if using path-based auth; adjust for Bearer

AUTH_HEADER="Authorization: Bearer $KA_API_KEY"
CURL="curl -sS -H '$AUTH_HEADER' -H 'Accept: application/json' -H 'Content-Type: application/json'"

echo "=== KiriminAja Sandbox Smoke Test ==="
echo ""

# 1. Province list (lightweight, validates auth)
echo "[1/5] Province list..."
eval "$CURL -d '{}' \"$BASE/coverage-area/province\"" | jq -r '.status, .text' | paste -sd ' '
echo ""

# 2. District search
echo "[2/5] District search (keyword: jakarta)..."
eval "$CURL -d '{\"keyword\":\"jakarta\"}' \"$BASE/coverage-area/district-by-name\"" | jq -r '.status, (.datas // [] | length | tostring + " results")'
echo ""

# 3. Rate estimate
echo "[3/5] Rate estimate (origin=1, dest=2, weight=1000)..."
eval "$CURL -d '{\"origin_id\":1,\"destination_id\":2,\"courier\":\"all\",\"weight\":1000}' \"$BASE/pricing/express\"" | jq -r '.status, (.data // {} | keys | length | tostring + " couriers")'
echo ""

# 4. Courier list
echo "[4/5] Courier list..."
eval "$CURL -d '{}' \"$BASE/others/courier-list\"" | jq -r '.status, (.datas // [] | length | tostring + " couriers")'
echo ""

# 5. Credit balance (may fail if not top-up member)
echo "[5/5] Credit balance..."
eval "$CURL -d '{}' \"$BASE/payment/ka-credit\"" | jq -r '.status, .text'
echo ""

echo "---"
echo "Smoke test complete. See documents/ for full API reference."
