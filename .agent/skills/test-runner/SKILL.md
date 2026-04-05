---
name: test-runner
description: Execute the scoped test plan against the deployed GitHub Pages site, collect evidence, and file/update GitHub issues for failures. Use after each deployment or fix.
metadata:
  owner: av-foundation
  kind: test-doc
---

# Test runner (public URL)

## Inputs
- Latest test plan from `test-testing-plan`.
- GH Pages URL: `https://dangkhoaow.github.io/av-foundation-frontend-web/`.
- Optional baseline URL: `http://av-foundation-frontend-uat.us-east-1.elasticbeanstalk.com/`.

## Visual baseline + diff flow
- When `VISUAL_ENABLED=true`, the runner:
  1. Generates a route manifest from the public APIs.
  2. Runs `@visual` tests against the baseline URL and writes screenshots into `.agent/skills/test-runner/visual/<timestamp>/baseline/`.
  3. Runs the same `@visual` tests against GH Pages and stores diffs in `.agent/skills/test-runner/visual/<timestamp>/compare/`.
  4. Runs the non-visual functional E2E pass against GH Pages.
- The visual spec reads `VISUAL_MANIFEST_PATH` and compares desktop + mobile projects.
- Common env vars:
  - `VISUAL_ENABLED`
  - `BASELINE_BASE_URL`
  - `E2E_BASE_URL`
  - `VISUAL_API_URL`
  - `VISUAL_LOCALES`
  - `VISUAL_MAX_ARTISTS`
  - `VISUAL_MAX_ARTWORKS`
  - `VISUAL_MAX_EVENTS`
  - `VISUAL_MAX_NEWS`
  - `VISUAL_MAX_DIFF_PIXEL_RATIO`
  - `VISUAL_MANIFEST_PATH`
  - `VISUAL_SNAPSHOT_DIR`
  - `PLAYWRIGHT_OUTPUT_DIR`
  - `PLAYWRIGHT_JSON_OUTPUT`
  - `PLAYWRIGHT_HTML_OUTPUT`

## Execution steps
1. Read the latest plan file under:
   - `.agent/skills/test-testing-plan/plans/test-plan-yyyymmdd-hhmm.md`
2. If visual mode is enabled, generate the manifest and run the baseline visual pass first.
3. Run the compare visual pass against GH Pages.
4. Run the functional E2E pass against GH Pages.
5. Capture:
   - Browser console logs
   - Network requests/responses to `/api/public/*`
   - Screenshots + traces
6. Write a dated run report:
   - `.agent/skills/test-runner/runs/test-run-yyyymmdd-hhmm.md`
7. Write a dated issue list:
   - `.agent/skills/test-runner/issues/issues-yyyymmdd-hhmm.md`
8. File or update GitHub issues:
   - CI: use GitHub API or `gh` with `GITHUB_TOKEN`
   - Cursor run: use GitHub MCP (`user-github`)

## Run report format (example)
```
# Test Run YYYY-MM-DD HH:MM
## Plan used
- test-plan-yyyymmdd-hhmm.md

## Configuration
- Baseline URL: ...
- Compare URL: ...
- Visual manifest: ...

## Results
- Visual baseline: PASS
- Visual compare: FAIL (see issue #12)
- Functional E2E: PASS

## Evidence
- visual/<timestamp>/baseline/...
- visual/<timestamp>/compare/...
- console logs attached
```

## Issue list format (example)
```
# Issues YYYY-MM-DD HH:MM
- Title: News detail page fails to load
  Severity: high
  Steps: ...
  Expected: ...
  Actual: ...
  Evidence: trace link, screenshot path
```
