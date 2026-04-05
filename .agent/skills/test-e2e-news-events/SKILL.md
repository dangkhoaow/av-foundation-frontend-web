---
name: test-e2e-news-events
description: E2E checks for news and events list/detail pages using real backend data. Use when validating content pages and SEO-critical routes.
metadata:
  owner: av-foundation
  kind: test-doc
---

# E2E: News and Events

## Preconditions
- Site deployed to `https://dangkhoaow.github.io/av-foundation-frontend-web/`.
- Backend public API reachable.

## Steps (News)
1. Open `/vi/news`.
2. Verify list loads via `/api/public/news`.
3. Open a news detail page by slug.
4. Confirm title/content render.

## Steps (Events)
1. Open `/vi/events`.
2. Verify list loads via `/api/public/events`.
3. Open an event detail page by slug.
4. Confirm title/content render.

## Expected
- Detail pages use real API data (no mock data).
- No console errors.

## Evidence
- Screenshots for list + detail pages.
- Playwright trace + network log.
