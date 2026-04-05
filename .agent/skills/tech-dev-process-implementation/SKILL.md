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
## 2026-04-05 22:24
### Shipped
- Added a baseline-host probe to `scripts/test-runner.mjs` so the runner skips the live UAT crawl and reuses the newest archived baseline manifest/snapshots when the old site is unreachable.
- Kept compare pointed at the resolved baseline reference and surfaced the source in the run report with `baseline source: archive:20260406-0355` when the archive fallback is used.
- Updated the dated test plan visual-parity note to explicitly mention archived-baseline fallback when the live crawl host is down.

### Deployed
- GH Pages URL: https://dangkhoaow.github.io/av-foundation-frontend-web/
- Commit/branch: not deployed yet (local changes)

### Testable now
- `VISUAL_ENABLED=true TEST_RUNNER_POST_VISUAL_COOLDOWN_MS=0 VISUAL_LOCALES=vi VISUAL_MAX_ARTISTS=1 VISUAL_MAX_ARTWORKS=1 VISUAL_MAX_EVENTS=1 VISUAL_MAX_NEWS=1 npm run test:runner`
- The runner now bypasses the dead baseline host and enters compare immediately with the archived reference instead of waiting through the full live crawl.

### Not implemented yet
- The long archived compare pass was stopped after verifying the fallback path, so the full visual diff report still needs a complete run if you want the latest comparison artifacts.
- The manifest crawl still retries slow CloudFront 504s before it can build the dated manifest.

### Risks / blockers
- The API crawl for manifest generation is still slow and occasionally stalls on repeated 504s.
- The compare routes still surface the known collection and artists diffs when the full archive-backed run is allowed to finish.
## 2026-04-05 21:57
### Shipped
- Switched artwork, artist, news, and event detail API fetches to fail fast with `maxAttempts: 1` and `timeoutMs: 20_000` so detail pages stop hanging on the default retry path.
- Tightened `scripts/route-manifest.mjs` detail ready selectors to the loaded content containers and updated `tests/e2e/visual-regression.spec.ts` to poll for ready/error states in the browser instead of relying on a one-shot ready wait.
- Verified the visual runner now surfaces collection index and collection detail failures as explicit `.collection-page__empty--error` and `.collection-detail-error` states against the archived baseline manifest.

### Deployed
- GH Pages URL: https://dangkhoaow.github.io/av-foundation-frontend-web/
- Commit/branch: not deployed yet (local changes)

### Testable now
- `VISUAL_ENABLED=true E2E_BASE_URL=http://localhost:5174/av-foundation-frontend-web/ VISUAL_MANIFEST_PATH=/tmp/visual-manifest-patched.json VISUAL_SNAPSHOT_DIR=.agent/skills/test-runner/visual/20260405-2344/baseline/snapshots PLAYWRIGHT_OUTPUT_DIR=/tmp/av-web-collection-index-check PLAYWRIGHT_HTML_OUTPUT=/tmp/av-web-collection-index-report npx playwright test tests/e2e/visual-regression.spec.ts --workers=1 --project=desktop -g "collectionIndex @visual vi /vi/collection"`
- `VISUAL_ENABLED=true E2E_BASE_URL=http://localhost:5174/av-foundation-frontend-web/ VISUAL_MANIFEST_PATH=/tmp/visual-manifest-patched.json VISUAL_SNAPSHOT_DIR=.agent/skills/test-runner/visual/20260405-2344/baseline/snapshots PLAYWRIGHT_OUTPUT_DIR=/tmp/av-web-collection-detail-check-2 PLAYWRIGHT_HTML_OUTPUT=/tmp/av-web-collection-detail-report-2 npx playwright test tests/e2e/visual-regression.spec.ts --workers=1 -g "collectionDetail @visual vi /vi/collection/27929697-e7cb-4d1d-828f-2b7fe83debc6"`
- The visual runner now catches late error states on collection routes instead of snapshotting the loading shell.

### Not implemented yet
- The live baseline crawl against `http://av-foundation-frontend-uat.us-east-1.elasticbeanstalk.com/` is still blocked by connection timeouts.
- The runner still does not auto-fallback to archived baseline manifests/snapshots when the live baseline host is unreachable.

### Risks / blockers
- The backend is still timing out on collection and detail fetches in this environment, so the visual checks will continue to flag those routes until the upstream data is reachable.
- Full end-to-end baseline capture still needs either the live UAT site or an automated archive fallback path.
## 2026-04-05 21:30
### Shipped
- Regenerated the scoped test plan at `.agent/skills/test-testing-plan/plans/test-plan-20260406-0354.md` and added an explicit visual-parity note for cached baseline comparisons.
- Ran the cached-baseline visual compare against `.agent/skills/test-runner/visual/20260405-2344/baseline/snapshots` to keep testing moving while the live UAT baseline host is unavailable.

### Deployed
- GH Pages URL: https://dangkhoaow.github.io/av-foundation-frontend-web/
- Commit/branch: not deployed yet (local changes)

### Testable now
- Cached visual comparison against the last complete baseline snapshot archive.
- The compare run now catches the collection and artists regressions instead of letting the readiness checks fail silently.

### Not implemented yet
- The live baseline crawl against `http://av-foundation-frontend-uat.us-east-1.elasticbeanstalk.com/` is still blocked by connection timeouts.
- The runner does not yet auto-fallback to archived baseline manifests/snapshots when the live baseline host is unreachable.

### Risks / blockers
- The cached-baseline compare still reports 12 failures, concentrated on `collection` and `artists` routes in both locales and viewports.
- The upstream baseline host remains unreachable from this environment, so a fresh crawl-based baseline capture is not currently possible.

## 2026-04-05 20:45
### Shipped
- Replaced the list-page locator race in `tests/e2e/collection.spec.ts`, `tests/e2e/artists.spec.ts`, and `tests/e2e/news-events.spec.ts` with browser-side polling so each spec branches on the first visible state without leaving a hanging wait behind.
- Added explicit error selectors for collection and artists to `scripts/route-manifest.mjs` so baseline comparison can fail fast on broken list states.

### Deployed
- GH Pages URL: https://dangkhoaow.github.io/av-foundation-frontend-web/
- Commit/branch: not deployed yet (local changes)

### Testable now
- `VISUAL_ENABLED=true E2E_BASE_URL=http://localhost:5174/av-foundation-frontend-web/ PLAYWRIGHT_OUTPUT_DIR=/tmp/av-web-list-check-visual-2 PLAYWRIGHT_HTML_OUTPUT=/tmp/av-web-list-report-visual-2 npx playwright test tests/e2e/collection.spec.ts tests/e2e/artists.spec.ts tests/e2e/news-events.spec.ts --workers=1`
- The list suite now passes in visual mode against the local app.

### Not implemented yet
- The full visual baseline/compare runner still needs a fresh pass with the latest polling fixes applied.

### Risks / blockers
- The upstream API is still flaky/slow, so the full runner can remain long-running even though the list-page waits are now stable.

## 2026-04-05 18:10
### Shipped
- Hardened the visual manifest crawl in `scripts/route-manifest.mjs` by requesting capped page sizes for capped runs, retrying 504/429 responses longer with exponential backoff, and falling back to empty lists instead of aborting the whole manifest when one list endpoint stays flaky.
- Added a cooldown before the functional phase in `scripts/test-runner.mjs` so the backend has a short recovery window after baseline/compare crawling.
- Increased the Playwright visual test timeout in `playwright.config.ts` to give the old baseline site more room during the crawl.
- Extended the slow functional waits in `tests/e2e/artists.spec.ts`, `tests/e2e/collection.spec.ts`, and `tests/e2e/news-events.spec.ts` so they tolerate the backend's longer recovery window.

### Deployed
- GH Pages URL: https://dangkhoaow.github.io/av-foundation-frontend-web/
- Commit/branch: not deployed yet (local changes)

### Testable now
- `VISUAL_ENABLED=true BASELINE_BASE_URL=http://av-foundation-frontend-uat.us-east-1.elasticbeanstalk.com/ E2E_BASE_URL=http://localhost:5174/av-foundation-frontend-web/ VISUAL_API_URL=https://d3te863nebxng5.cloudfront.net VISUAL_MAX_ARTISTS=1 VISUAL_MAX_ARTWORKS=1 VISUAL_MAX_EVENTS=1 VISUAL_MAX_NEWS=1 VISUAL_MAX_DIFF_PIXEL_RATIO=0.05 ISSUES_ENABLED=false npm run test:runner`
- The manifest crawl now reaches the visual phase more reliably instead of failing outright on a single 504.
- The artists, collection, and news/events functional specs now wait longer for their API-driven content before failing.

### Not implemented yet
- The latest full visual/functional pass after the timeout increase still needs a fresh verification run.
- Artist-detail visual diffs still need a baseline/acceptance decision once the crawl fully completes.

### Risks / blockers
- The upstream CloudFront API still returns intermittent 504s on list endpoints, so the full runner can still take a long time under load.
- The old baseline site can still be slow enough to hit navigation timeouts during the visual crawl.

## 2026-04-05 16:20
### Shipped
- Ran the full visual baseline/compare flow against the AV dev server on `http://localhost:5174/av-foundation-frontend-web/` with sequential Playwright workers to avoid the unrelated `5173` app collision.
- Fixed the mobile collection functional race by waiting for the artworks API response before navigating to `/vi/collection`.

### Deployed
- GH Pages URL: https://dangkhoaow.github.io/av-foundation-frontend-web/
- Commit/branch: not deployed yet (local changes)

### Testable now
- `E2E_BASE_URL=http://localhost:5174/av-foundation-frontend-web/ npx playwright test tests/e2e/collection.spec.ts`
- `VISUAL_ENABLED=true BASELINE_BASE_URL=http://av-foundation-frontend-uat.us-east-1.elasticbeanstalk.com/ E2E_BASE_URL=http://localhost:5174/av-foundation-frontend-web/ VISUAL_API_URL=https://d3te863nebxng5.cloudfront.net VISUAL_MAX_ARTISTS=1 VISUAL_MAX_ARTWORKS=1 VISUAL_MAX_EVENTS=1 VISUAL_MAX_NEWS=1 VISUAL_MAX_DIFF_PIXEL_RATIO=0.05 ISSUES_ENABLED=false npm run test:runner`
- The mobile collection functional spec now passes.

### Not implemented yet
- Artist-detail screenshots still differ from the old baseline on `vi`/`en` desktop and mobile because the AV site now renders the portrait image instead of the baseline placeholder.

### Risks / blockers
- The compare runner must use the AV server on port `5174`; `5173` is occupied by a different local app and causes false failures.
- The current compare report still shows four artist-detail diffs, which are tied to the now-correct portrait rendering and need a baseline/acceptance decision.

## 2026-04-05 15:35
### Shipped
- Removed stacked TanStack Query retries so the global `QueryProvider` now lets `ApiClient` handle retryable 429/timeouts.
- Cleared the explicit `retry`/`retryDelay` overrides from `ArtistsClient` and `CollectionClient` to reduce duplicate backend requests.

### Deployed
- GH Pages URL: https://dangkhoaow.github.io/av-foundation-frontend-web/
- Commit/branch: not deployed yet (local changes)

### Testable now
- `PLAYWRIGHT_OUTPUT_DIR=/tmp/... PLAYWRIGHT_HTML_OUTPUT=/tmp/... VISUAL_MANIFEST_PATH=.agent/skills/test-runner/visual/20260405-2214/manifests/visual-manifest-20260405-2214.json VISUAL_SNAPSHOT_DIR=.agent/skills/test-runner/visual/20260405-2214/baseline/snapshots E2E_BASE_URL=http://localhost:5173/av-foundation-frontend-web/ VISUAL_MAX_DIFF_PIXEL_RATIO=0.05 npx playwright test tests/e2e/visual-regression.spec.ts --project=mobile -g "collectionIndex @visual vi /vi/collection"`
- The mobile `vi /vi/collection` visual comparison now passes against the baseline snapshots.

### Not implemented yet
- Full-suite confirmation after retry cleanup is still pending because the parallel rerun is long-running and continues to surface unrelated route retries.

### Risks / blockers
- The broad parallel visual runner is still the main source of noisy retries under load.
- Other routes may still need a separate full rerun to confirm after the retry cleanup.

## 2026-04-05 15:18
### Shipped
- Restored backend-based image resolution for API image fields via `resolveImageUrl` in `src/lib/assets.ts`, while keeping `withBasePath` for frontend static assets.
- Added `src/lib/assets.test.ts` to cover backend media URLs, `/images/...` API paths, and frontend base-path assets separately.

### Deployed
- GH Pages URL: https://dangkhoaow.github.io/av-foundation-frontend-web/
- Commit/branch: not deployed yet (local changes)

### Testable now
- `npm run test:unit -- src/lib/assets.test.ts src/lib/api/client.test.ts`
- `PLAYWRIGHT_OUTPUT_DIR=/tmp/... PLAYWRIGHT_HTML_OUTPUT=/tmp/... VISUAL_MANIFEST_PATH=.agent/skills/test-runner/visual/20260405-2214/manifests/visual-manifest-20260405-2214.json VISUAL_SNAPSHOT_DIR=.agent/skills/test-runner/visual/20260405-2214/baseline/snapshots E2E_BASE_URL=http://localhost:5173/av-foundation-frontend-web/ VISUAL_MAX_DIFF_PIXEL_RATIO=0.05 npx playwright test tests/e2e/visual-regression.spec.ts --project=desktop -g "artistsIndex @visual en /en/artists"`
- Same targeted Playwright command with `--project=mobile` also passes for `artistsIndex` and `collectionIndex` in both locales.
- `VISUAL_ENABLED=true ... npm run test:runner` still reports 6 compare failures in the full parallel run, but isolated artists/collection checks pass against the baseline snapshots.

### Not implemented yet
- Full-suite parallel visual stability on the remaining Vietnamese mobile compare paths.

### Risks / blockers
- The full `npm run test:runner` run still shows 6 compare failures under parallel execution, concentrated on `vi` mobile artists/collection and some ready-state flakiness on `en` routes.
- The same routes pass when rerun in isolation against the current baseline snapshots, so the remaining problem appears to be load/contention rather than deterministic rendering.

## 2026-04-05 14:48
### Shipped
- Added base-path-aware asset resolution via `withBasePath` and wired it into the `next/image` shim, card fallback images, and hardcoded `/images/...` references across route pages and client components.

### Deployed
- GH Pages URL: https://dangkhoaow.github.io/av-foundation-frontend-web/
- Commit/branch: not deployed yet (local changes)

### Testable now
- `VITE_API_URL=https://d3te863nebxng5.cloudfront.net VITE_IMAGE_BASE_URL=https://d3te863nebxng5.cloudfront.net/ npm run dev -- --port 5173`
- `VISUAL_ENABLED=true BASELINE_BASE_URL=http://av-foundation-frontend-uat.us-east-1.elasticbeanstalk.com/ E2E_BASE_URL=http://localhost:5173/av-foundation-frontend-web/ VISUAL_API_URL=https://d3te863nebxng5.cloudfront.net npm run test:runner`
- Latest run: `.agent/skills/test-runner/runs/test-run-20260405-2144.md` (functional E2E passed; remaining visual failures are artists/collection ready-state and detail-page error states)

### Not implemented yet
- Visual parity on artists/collection routes under the current public backend rate limit.
- GH Pages deployment with updated assets.

### Risks / blockers
- CloudFront public API returns 429s under the visual test load for artist/collection detail endpoints.
- The reference site still flakes on `/vi/artists` mobile ready-state during baseline capture.

## 2026-04-05 14:39
### Shipped
- Added base-path aware E2E navigation helpers using `E2E_BASE_URL`.
- Made E2E tests resilient to empty news/events datasets and API timing.
- Stabilized collection modal clicks with forced interaction.

### Deployed
- GH Pages URL: https://dangkhoaow.github.io/av-foundation-frontend-web/
- Commit/branch: not deployed yet (local changes)

### Testable now
- `E2E_BASE_URL=http://localhost:5173/av-foundation-frontend-web/ npm run test:runner`
- Latest run: `.agent/skills/test-runner/runs/test-run-20260405-1439.md` (all tests passed; news/events skipped due to empty data)

### Not implemented yet
- GH Pages deployment with updated routing + test adjustments.

### Risks / blockers
- News/events APIs currently return empty datasets, so detail tests skip.

## 2026-04-05 14:20
### Shipped
- Added router basename from Vite `BASE_URL` to respect GH Pages base path.
- Added router base diagnostics to help debug base path redirects.

### Deployed
- GH Pages URL: https://dangkhoaow.github.io/av-foundation-frontend-web/
- Commit/branch: not deployed yet (local changes)

### Testable now
- Local preview can validate base-path routing using `/av-foundation-frontend-web/`.

### Not implemented yet
- GH Pages deployment with updated router basename.

### Risks / blockers
- GH Pages still redirects to root until redeployed with basename fix.

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
