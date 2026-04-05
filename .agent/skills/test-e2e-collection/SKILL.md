---
name: test-e2e-collection
description: E2E checks for collection list and artwork detail rendering. Use when validating artwork browsing flows.
metadata:
  owner: av-foundation
  kind: test-doc
---

# E2E: Collection and artwork detail

## Preconditions
- Site deployed to `https://dangkhoaow.github.io/av-foundation-frontend-web/`.
- Backend public API reachable.

## Steps
1. Open `/vi/collection`.
2. Wait for artworks to load (API call success).
3. Open first artwork detail (modal or full page).
4. Verify detail page shows title and artist.
5. Capture console + network logs.

## Expected
- Collection grid loads without errors.
- Artwork detail loads real data from `/api/public/artworks/:idOrSlug`.

## Evidence
- Screenshot of collection grid.
- Screenshot of artwork detail.
- Playwright trace + network log.
