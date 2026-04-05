---
name: product-original-frontend-baseline
description: Baseline description of the original Next.js frontend behavior, routes, data sources, and SEO expectations. Use this skill when mapping parity requirements or validating that the static GitHub Pages build stays consistent with the original UI/logic.
metadata:
  owner: av-foundation
  kind: product-doc
---

# Product baseline: original Next.js frontend

## Purpose
- Capture the current behavior of `av-foundation-frontend` as the source of truth.
- Define what must remain consistent in the GitHub Pages migration.

## Route map (original)
- `/:locale` (home)
- `/:locale/collection` (collection list)
- `/:locale/collection/:artworkKey` (artwork detail; key is id or slug)
- `/:locale/collection/@modal/(.)[id]` (artwork modal overlay)
- `/:locale/artists` (artists list)
- `/:locale/artists/:id` (artist detail)
- `/:locale/events` (events list)
- `/:locale/events/:slug` (event detail)
- `/:locale/news` (news list)
- `/:locale/news/:slug` (news detail)
- `/:locale/knowledge`
- `/:locale/who-we-are`

## Locale behavior
- Locales: `vi`, `en`.
- URL locale prefix required in all routes.
- Language toggle updates path prefix.

## Data sources (public backend)
- `GET /api/public/homepage-config`
- `GET /api/public/featured-artworks`
- `GET /api/public/events` and `GET /api/public/events/:slug`
- `GET /api/public/news` and `GET /api/public/news/:slug`
- `GET /api/public/artists` and `GET /api/public/artists/:id`
- `GET /api/public/artworks` and `GET /api/public/artworks/:idOrSlug`
- Images via `/api/public/file/:fileId` (may return WebP)

## SEO expectations (original)
- Locale-specific metadata in layout + per-page metadata.
- Dynamic metadata for artist and artwork detail pages based on API data.
- `sitemap.xml` includes both locales + key routes.

## Next-only behavior to replace
- Locale middleware (`next-intl`).
- `next/image` optimization.
- App Router + intercepting modal routes.
- Server Component data fetching for SEO.

## Non-negotiables for parity
- No mock data in detail pages.
- Locale prefix in all internal links.
- UI layout and design tokens unchanged.
