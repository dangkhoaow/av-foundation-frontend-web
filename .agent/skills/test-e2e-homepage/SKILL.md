---
name: test-e2e-homepage
description: E2E checks for homepage rendering, locale navigation, and key sections. Use when validating top-level site entry.
metadata:
  owner: av-foundation
  kind: test-doc
---

# E2E: Homepage

## Preconditions
- Site deployed to `https://dangkhoaow.github.io/av-foundation-frontend-web/`.

## Steps
1. Open `/av-foundation-frontend-web/` and confirm redirect to `/vi`.
2. Verify header, sidebar, and hero section render.
3. Switch language to `en` and confirm URL prefix.
4. Capture console and network logs.

## Expected
- No console errors.
- Key sections visible.
- Language switch updates UI labels.

## Evidence
- Screenshot of home (vi/en).
- Playwright trace.
- Network log (calls to `/api/public/*`).
