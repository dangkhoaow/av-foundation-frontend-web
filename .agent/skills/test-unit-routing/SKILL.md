---
name: test-unit-routing
description: Unit tests for routing helpers (locale prefix, slug construction, modal routing helpers). Use when validating URL logic.
metadata:
  owner: av-foundation
  kind: test-doc
---

# Unit tests: routing helpers

## Scope
- Locale prefixing for internal links.
- Default locale redirect logic.
- Artwork slug resolution (id vs slug).

## Testcases (examples)
- TC-ROUTE-01: `withLocale('/news','vi')` returns `/vi/news`.
- TC-ROUTE-02: Missing locale redirects to `/vi`.
- TC-ROUTE-03: Artwork key resolves to slug when available.

## Evidence
- Vitest assertions for pure functions.
