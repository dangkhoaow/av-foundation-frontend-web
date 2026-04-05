---
name: test-testing-plan
description: Generate a dated test plan scoped to implemented features. Use when preparing a test run to avoid testing unimplemented ACs.
metadata:
  owner: av-foundation
  kind: test-doc
---

# Test plan generator

## Inputs
- Epic plan file: `/Users/ktran/.cursor/plans/gh_pages_frontend_migration_9351a008.plan.md`
- Latest status: `.agent/skills/tech-dev-process-implementation/SKILL.md`

## Output
- Write a dated plan file under:
  - `.agent/skills/test-testing-plan/plans/test-plan-yyyymmdd-hhmm.md`

## Script
- `scripts/generate-test-plan.mjs` generates the dated plan file.

## Rules
- Include only ACs/testcases for features marked as implemented in `tech-dev-process-implementation`.
- Exclude any tests for features not yet implemented.
- Each testcase must have:
  - ID
  - Preconditions
  - Steps
  - Expected result
  - Evidence to capture (screenshot/trace/log)

## Output format (example)
```
# Test Plan YYYY-MM-DD HH:MM
## Scope
- Implemented items: ...

## Testcases
### TC-01: Locale routing
Preconditions: ...
Steps: ...
Expected: ...
Evidence: screenshot, console log
```
