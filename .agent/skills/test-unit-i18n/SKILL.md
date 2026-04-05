---
name: test-unit-i18n
description: Unit tests for the i18n helper layer (message lookup, namespace resolution, fallback rules). Use when validating translations.
metadata:
  owner: av-foundation
  kind: test-doc
---

# Unit tests: i18n helpers

## Scope
- Namespace resolution from JSON messages.
- Missing key fallback behavior.
- Locale switching logic.

## Testcases (examples)
- TC-I18N-01: `t('nav.home')` returns correct label for `vi`.
- TC-I18N-02: Missing key returns a readable fallback.
- TC-I18N-03: Locale switch uses new message map.

## Evidence
- Vitest assertions against known message fixtures.
