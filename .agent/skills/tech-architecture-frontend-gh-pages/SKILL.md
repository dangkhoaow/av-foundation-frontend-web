---
name: tech-architecture-frontend-gh-pages
description: Architecture guidance for the GitHub Pages static frontend (routing, base path, assets, build output). Use when implementing or reviewing the Vite/React migration.
metadata:
  owner: av-foundation
  kind: tech-doc
---

# GH Pages frontend architecture

## Hosting constraints
- GitHub Pages is static: no server-side rendering at runtime.
- Must serve from repository base path: `/av-foundation-frontend-web/`.
- All routes must resolve to static HTML or use SPA fallback.

## Routing strategy
- React Router with `/:locale` prefix.
- Default route `/` redirects to `/vi`.
- Modal overlay for artwork detail uses background location pattern.

## Data strategy
- Client fetches from backend public APIs over HTTPS.
- No API proxy rewrites.
- Use environment variables: `VITE_API_URL`, `VITE_IMAGE_BASE_URL`.

## Asset strategy
- Use `<img>` for images (no `next/image`).
- Keep `public/` assets identical to original repo.
- Add `.nojekyll` to avoid `_`-prefixed asset issues.

## Build output
- Vite builds to `dist/` (or `dist/client/` if using SSG tool).
- CI deploys the static output folder to GitHub Pages.
