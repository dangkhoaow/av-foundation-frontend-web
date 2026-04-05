---
name: tech-dev-process-implementation
description: Living implementation log for the GH Pages frontend. Update at the end of every implementation turn with shipped changes, deployment status, testability, and next steps.
metadata:
  owner: av-foundation
  kind: tech-doc
---

# Implementation status (update every turn)

## Update rules
- Update this file **after every implementation turn**.
- Keep entries short, factual, and time-stamped.
- Track what is deployed to GH Pages and what remains.

## Template (append newest on top)
```
## YYYY-MM-DD HH:MM
### Shipped
- ...

### Deployed
- GH Pages URL: https://dangkhoaow.github.io/av-foundation-frontend-web/
- Commit/branch: ...

### Testable now
- ACs/testcases now safe to run:
  - ...

### Not implemented yet
- ...

### Risks / blockers
- ...
```

## Current status
## 2026-04-05 13:32
### Shipped
- CI build now defaults `VITE_API_URL` and `VITE_IMAGE_BASE_URL` to the CloudFront backend if secrets are missing.

### Deployed
- GH Pages URL: https://dangkhoaow.github.io/av-foundation-frontend-web/
- Commit/branch: not deployed yet (local changes)

### Testable now
- GH Pages build uses CloudFront API without requiring secrets.

### Not implemented yet
- None (requires repo secrets for full API + issues automation).

### Risks / blockers
- If backend URL changes, update secrets or workflow defaults.
- GH Pages availability delays can cause E2E wait step to timeout.
- Issue posting requires `issues: write` permission and valid token.

## 2026-04-05 13:31
### Shipped
- Updated plan todo statuses to reflect completed skill, unit, and E2E items.

### Deployed
- GH Pages URL: https://dangkhoaow.github.io/av-foundation-frontend-web/
- Commit/branch: not deployed yet (local changes)

### Testable now
- Plan file reflects current implementation status.

### Not implemented yet
- None (requires repo secrets for full API + issues automation).

### Risks / blockers
- Missing `VITE_API_URL` limits prerender to static routes only.
- GH Pages availability delays can cause E2E wait step to timeout.
- Issue posting requires `issues: write` permission and valid token.

## 2026-04-05 13:29
### Shipped
- Test plan generator script at `.agent/skills/test-testing-plan/scripts/generate-test-plan.mjs`.
- CI test job runs unit tests, waits for GH Pages, then runs `test:runner` and uploads artifacts.
- Ignored generated test artifacts in `.gitignore`.
- README updated with test plan generation step.

### Deployed
- GH Pages URL: https://dangkhoaow.github.io/av-foundation-frontend-web/
- Commit/branch: not deployed yet (local changes)

### Testable now
- Generate scoped plan via `node .agent/skills/test-testing-plan/scripts/generate-test-plan.mjs`.
- CI can run post-deploy unit + E2E tests with run reports and issue lists.

### Not implemented yet
- None (requires repo secrets for full API + issues automation).

### Risks / blockers
- Missing `VITE_API_URL` limits prerender to static routes only.
- GH Pages availability delays can cause E2E wait step to timeout.
- Issue posting requires `issues: write` permission and valid token.

## 2026-04-05 13:25
### Shipped
- Prerender now skips API fetch when `VITE_API_URL` is unset or local in CI.
- Added fallback to static routes when API is unavailable.
- Documented prerender env toggles in `README.md`.

### Deployed
- GH Pages URL: https://dangkhoaow.github.io/av-foundation-frontend-web/
- Commit/branch: not deployed yet (local changes)

### Testable now
- `npm run build` completes without backend API connectivity when `PRERENDER_SKIP_API=true`.

### Not implemented yet
- Issue auto-posting in test runner (requires token + wiring).
- Dated test-plan generation output (no plan file generated yet).

### Risks / blockers
- `VITE_API_URL` must be set for CI prerender to reach backend and build dynamic routes.
- Playwright browsers must be installed before E2E runs.

## 2026-04-05 13:21
### Shipped
- Added `av-foundation-frontend-web/README.md` documenting skills-first philosophy and project context.

### Deployed
- GH Pages URL: https://dangkhoaow.github.io/av-foundation-frontend-web/
- Commit/branch: not deployed yet (local changes)

### Testable now
- Documentation is aligned with skills system and current scripts.

### Not implemented yet
- Issue auto-posting in test runner (requires token + wiring).
- Dated test-plan generation output (no plan file generated yet).

### Risks / blockers
- `VITE_API_URL` must be set for CI prerender to reach backend.
- Playwright browsers must be installed before E2E runs.

## 2026-04-05 13:11
### Shipped
- Vite + React Router scaffold with copied UI/assets.
- Locale router with modal overlay support for collection detail.
- Custom i18n provider + Next alias shims for `next-intl`, `next/link`, `next/navigation`, `next/image`, `next/font`.
- API-driven events/news detail pages and list pages.
- Build-time prerender + sitemap generator script.
- GH Pages workflow + `.nojekyll`.
- Unit + E2E test scaffolding, Playwright config, and test runner script.

### Deployed
- GH Pages URL: https://dangkhoaow.github.io/av-foundation-frontend-web/
- Commit/branch: not deployed yet (local changes)

### Testable now
- Locale routing + homepage rendering.
- Collection/artist/news/event list + detail flows against backend.
- Playwright E2E suites via `npm run test:e2e`.
- Prerender + sitemap via `npm run build`.

### Not implemented yet
- Issue auto-posting in test runner (requires token + wiring).
- Dated test-plan generation output (no plan file generated yet).

### Risks / blockers
- `VITE_API_URL` must be set for CI prerender to reach backend.
- Playwright browsers must be installed before E2E runs.
