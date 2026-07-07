.PHONY: help check clean

help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-16s\033[0m %s\n", $$1, $$2}'

check: ## Validate repo: broken links, file integrity, content quality
	@echo "=== Checking file count ==="
	@count=$$(find documents -name "*.md" ! -name "00-INDEX.md" | wc -l | tr -d ' '); \
	 if [ "$$count" -ne 34 ]; then echo "FAIL: expected 34 MD files, found $$count"; exit 1; fi; \
	 echo "  OK: $$count markdown files"
	@echo ""
	@echo "=== Checking source URLs ==="
	@if grep -rl "about:blank" documents/ > /dev/null 2>&1; then echo "FAIL: about:blank URLs found"; exit 1; fi; \
	 echo "  OK: no broken source URLs"
	@echo ""
	@echo "=== Checking code fences ==="
	@bash -c 'for f in documents/*/*.md; do count=$$(grep -F "\x60\x60\x60" "$$f" | wc -l | tr -d " "); if [ $$((count % 2)) -ne 0 ]; then echo "FAIL: $$f — odd fence count ($$count)"; exit 1; fi; done; echo "  OK: all code fences balanced"'
	@echo ""
	@echo "=== Checking duplicate headings ==="
	@bash -c 'for f in documents/*/*.md; do c=$$(grep -c "^# " "$$f"); if [ "$$c" -ne 1 ]; then echo "FAIL: $$f — $$c H1s (expected 1)"; exit 1; fi; done; echo "  OK: all files have exactly 1 H1"'
	@echo ""
	@echo "=== Checking file sizes ==="
	@bash -c 'for f in documents/*/*.md; do sz=$$(wc -c < "$$f" | tr -d " "); if [ "$$sz" -lt 500 ]; then echo "FAIL: $$f — $$sz bytes (min 500)"; exit 1; fi; done; echo "  OK: all files > 500 bytes"'
	@echo ""
	@echo "=== Checking trailing newlines ==="
	@bash -c 'for f in documents/*/*.md README.md AGENTS.md CHANGELOG.md SECURITY.md; do [ -f "$$f" ] || continue; if [ "$$(tail -c 1 "$$f" | xxd -p)" != "0a" ]; then echo "FAIL: $$f — no trailing newline"; exit 1; fi; done; echo "  OK: all files have trailing newlines"'
	@echo ""
	@echo "✅ All checks passed."

clean: ## Remove generated artifacts (raw HTML)
	@echo "Removing raw HTML backups..."
	@rm -rf documents/_raw/
	@echo "Done."
