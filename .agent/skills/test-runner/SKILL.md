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
- Optional reference URL: `https://d3te863nebxng5.cloudfront.net/`.

## Execution steps
1. Read the latest plan file under:
   - `.agent/skills/test-testing-plan/plans/test-plan-yyyymmdd-hhmm.md`
2. Run Playwright tests against GH Pages URL.
3. Capture:
   - Browser console logs
   - Network requests/responses to `/api/public/*`
   - Screenshots + traces
4. (Optional) Run the same scenarios against the reference URL and capture diffs.
5. Write a dated run report:
   - `.agent/skills/test-runner/runs/test-run-yyyymmdd-hhmm.md`
6. Write a dated issue list:
   - `.agent/skills/test-runner/issues/issues-yyyymmdd-hhmm.md`
7. File or update GitHub issues:
   - CI: use GitHub API or `gh` with `GITHUB_TOKEN`
   - Cursor run: use GitHub MCP (`user-github`)

## Run report format (example)
```
# Test Run YYYY-MM-DD HH:MM
## Plan used
- test-plan-yyyymmdd-hhmm.md

## Results
- TC-01: PASS
- TC-02: FAIL (see issue #12)

## Evidence
- traces/...
- screenshots/...
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
