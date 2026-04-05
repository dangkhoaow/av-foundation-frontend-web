---
name: product-migration-milestones
description: Defines migration epics, milestones, and acceptance criteria for the GitHub Pages frontend. Use this skill to scope test plans and validate progress against the agreed product requirements.
metadata:
  owner: av-foundation
  kind: product-doc
---

# Migration milestones and acceptance criteria

## Epic: Static frontend on GitHub Pages
### Milestone 1: Documentation and skill system
- Skills exist under `.agent/skills/` with `product-*`, `tech-*`, `test-*`.
- `tech-dev-process-implementation` is updated at the end of each implementation turn.

### Milestone 2: Functional parity (UI + data)
- All routes render in a static SPA/SSG environment.
- No mock data remains in news or event detail pages.
- All public API calls go directly to backend (no Next rewrites).

### Milestone 3: SEO parity
- Static HTML is generated for key routes (locales + detail pages).
- Per-route metadata (title, description, og tags) matches original intent.
- `sitemap.xml` includes both locales + dynamic detail routes.

### Milestone 4: QA and CI loop
- Unit tests cover API client, i18n helpers, routing helpers.
- E2E tests run against the public GH Pages URL.
- Failures file GitHub issues; fixes rerun and update issues.

## Acceptance criteria (AC)
- AC-01: Locale routing works for `vi` and `en` in all primary routes.
- AC-02: Home, Collection, Artists, Events, News, Knowledge, Who We Are render.
- AC-03: Detail pages load real data from backend public APIs.
- AC-04: Artwork detail supports both id and slug keys.
- AC-05: Public API calls function without mocks or hardcoded fallbacks.
- AC-06: Static HTML output exists for all required routes.
- AC-07: GH Pages deployment works with correct base path and assets.
- AC-08: Test runner produces dated reports and issues.
