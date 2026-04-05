---
name: tech-backend-public-api-specs
description: Canonical public API contracts consumed by the GH Pages frontend. Use when implementing data fetching or writing tests that depend on backend responses.
metadata:
  owner: av-foundation
  kind: tech-doc
---

# Public API specs (backend)

## Reference docs
- `av-foundation-backend/app/api/public/README.md`
- `av-foundation-backend/app/api/public/artworks/README.md`
- `av-foundation-backend/app/api/public/artists/README.md`
- `av-foundation-backend/app/api/public/events/README.md`
- `av-foundation-backend/app/api/public/news/README.md`

## Endpoints used by frontend
- `GET /api/public/homepage-config`
- `GET /api/public/featured-artworks?locale=vi|en&limit=8`
- `GET /api/public/artworks?page&limit&sortBy&sortOrder&artistId`
- `GET /api/public/artworks/:idOrSlug`
  - Supports UUID **or** `slug` / `slugEn`.
- `GET /api/public/artists?page&limit&search`
- `GET /api/public/artists/:id`
- `GET /api/public/events?page&limit&sortBy&sortOrder`
- `GET /api/public/events/:slug`
- `GET /api/public/news?page&limit&sortBy&sortOrder`
- `GET /api/public/news/:slug`
- `GET /api/public/file/:fileId` (image/file streaming)

## Notes
- Public endpoints return CORS headers and are safe for browser use.
- Some list endpoints return `{ data: { data: [...], meta: {...} } }`.
- Detail endpoints return `{ data: {...} }`.
- Image URLs may be relative (use `VITE_IMAGE_BASE_URL` for absolute).
