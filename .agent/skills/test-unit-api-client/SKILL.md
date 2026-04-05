---
name: test-unit-api-client
description: Unit tests for the API client (base URL, headers, error handling, timeouts). Use when validating network logic without a browser.
metadata:
  owner: av-foundation
  kind: test-doc
---

# Unit tests: API client

## Scope
- Base URL composition.
- Locale header injection.
- Error handling for non-2xx responses.
- Timeout/abort behavior.

## Testcases (examples)
- TC-API-01: Default base URL is `VITE_API_URL`.
- TC-API-02: `Accept-Language` header is set for localized client.
- TC-API-03: Non-OK response throws structured error.
- TC-API-04: Timeout triggers abort error.

## Evidence
- Vitest assertions with mocked fetch.
