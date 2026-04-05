---
name: tech-seo-prerendering-and-sitemap
description: Guidance for build-time prerendering and sitemap generation in the Vite/React static site. Use when implementing SEO or validating the static build output.
metadata:
  owner: av-foundation
  kind: tech-doc
---

# SEO: prerender + sitemap

## Goal
- Ensure HTML for key routes exists at build time (view-source).
- Provide `sitemap.xml` for search indexing.

## Prerender scope
- Static pages for both locales.
- All news slugs, event slugs, artist ids.
- Artwork detail routes by id/slug (apply cap if needed).

## Data sources for path lists
- Use public backend endpoints to fetch ids/slugs.
- If list payloads are too heavy, add `.../paths` endpoints.

## Output
- One HTML file per route in `dist/` (or `dist/client/` if using SSG tool).
- `sitemap.xml` generated during build and placed in output root.
- Optional `robots.txt` referencing sitemap URL.

## Validation checklist
- `curl <site>/sitemap.xml` returns locale + detail URLs.
- `view-source:<site>/<locale>/artists/<id>` contains title/meta.
