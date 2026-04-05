---
name: test-e2e-artists
description: E2E checks for artists list and artist detail pages. Use when validating artist browsing flows.
metadata:
  owner: av-foundation
  kind: test-doc
---

# E2E: Artists

## Preconditions
- Site deployed to `https://dangkhoaow.github.io/av-foundation-frontend-web/`.
- Backend public API reachable.

## Steps
1. Open `/vi/artists`.
2. Verify artist cards load.
3. Open an artist detail page.
4. Confirm biography and tabs render.
5. Capture console + network logs.

## Expected
- Artist list loads via `/api/public/artists`.
- Artist detail loads via `/api/public/artists/:id`.
- No console errors.

## Evidence
- Screenshot of artists list.
- Screenshot of artist detail.
- Playwright trace + network log.
