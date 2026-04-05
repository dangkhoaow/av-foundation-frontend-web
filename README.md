# av-foundation-frontend-web 

## Overview
- Static GitHub Pages frontend for Art & Venture Foundation.
- UI + client logic mirrors `av-foundation-frontend` with no runtime SSR.
- Single source of truth is the skills system under `.agent/skills/`.
- All server-only behavior is exposed through public backend APIs.

## Key Components
- **Skills system**: `.agent/skills/`
  - `product-*` for baseline behavior + milestones.
  - `tech-*` for architecture, API specs, and implementation status.
  - `test-*` for test planning, unit tests, E2E tests, and runner flow.
- **Routing**: `src/routes/AppRoutes.tsx` (locale prefix + modal overlay).
- **i18n**: `src/i18n/LocaleProvider.tsx` with messages in `src/messages/*.json`.
- **Next.js shims**: `src/routing/` + aliases in `vite.config.ts` and `vitest.config.ts`.
- **API client**: `src/lib/api/*` with env in `src/config/env.ts`.
- **SEO build**: `scripts/prerender.mjs` generates static HTML + `sitemap.xml`.
- **Testing**: `vitest.config.ts`, `playwright.config.ts`, `scripts/test-runner.mjs`.

## Technical Details
### Skills-first philosophy
- Skills are the canonical documentation layer; update them before changing code.
- Always update `.agent/skills/tech-dev-process-implementation/SKILL.md` at the end of each implementation turn.
- Use `test-testing-plan` to scope tests only to implemented work.

### Build + deploy
- Vite base path is set to `/av-foundation-frontend-web/` in `vite.config.ts`.
- GitHub Pages workflow is in `.github/workflows/deploy.yml`.
- `.nojekyll` is required to avoid asset path issues.
- Reference guide: `DEPLOY_TO_GITHUB_PAGES.md`.

### SEO prerendering
- `npm run build` runs `scripts/prerender.mjs`.
- Prerender fetches public API slugs/ids and writes route HTML + `sitemap.xml`.
- Inputs: `VITE_API_URL`, `VITE_SITE_URL`, `PRERENDER_MAX_ARTWORKS`.

### Testing pipeline
- Unit tests: Vitest + jsdom (`npm run test:unit`).
- E2E tests: Playwright (`npm run test:e2e`).
- Test plan generation: `node .agent/skills/test-testing-plan/scripts/generate-test-plan.mjs`.
- Runner: `npm run test:runner` creates dated run reports and issues lists.
- Optional issue posting requires `ISSUES_ENABLED=true` and `GITHUB_TOKEN`.

### Security and constraints
- No server secrets in the frontend; all env vars must be `VITE_*`.
- Only public API endpoints are used (CORS-enabled backend).
- No runtime SSR on GitHub Pages; all SEO is build-time only.

### Updates
- 2026-04-05: Skills system, prerender pipeline, and CI/test runner added.

## Usage Examples
```ts
import { useLocale, useTranslations } from '@/i18n/LocaleProvider';

const locale = useLocale();
const t = useTranslations('nav');
// Locale-aware label for the header
const label = t('home');
```

```ts
import { withLocale } from '@/routing/locale';

const locale = 'vi';
// Ensure internal links include locale prefix
const link = withLocale('/news', locale);
```

```ts
import { artworksAPI } from '@/lib/api/artworks';

// Fetch a page of artworks for the collection view
const response = await artworksAPI.getAll(1, 12, { sortBy: 'createdAt', sortOrder: 'desc' });
```

## Integration Points
- **Backend public APIs**: `av-foundation-backend/app/api/public/README.md`.
- **Env vars**:
  - `VITE_API_URL`, `VITE_IMAGE_BASE_URL`, `VITE_SITE_URL`
  - `PRERENDER_MAX_ARTWORKS`, `PRERENDER_SKIP_API`, `PRERENDER_ALLOW_FAILURE`
  - `E2E_BASE_URL`
  - `ISSUES_ENABLED`, `GITHUB_TOKEN`, `GITHUB_REPOSITORY`
- **Artifacts**:
  - Plans: `.agent/skills/test-testing-plan/plans/test-plan-yyyymmdd-hhmm.md`
  - Runs: `.agent/skills/test-runner/runs/test-run-yyyymmdd-hhmm.md`
  - Issues: `.agent/skills/test-runner/issues/issues-yyyymmdd-hhmm.md`
