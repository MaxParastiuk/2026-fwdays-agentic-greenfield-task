# Capability: Evals logging

**OpenSpec slug:** `10-evals-logging`  
**Depends on:** `04-pipeline`  
**Blocks:** — (should complete before 11)

## Purpose

Append one privacy-safe JSONL record per completed run for offline inspection.

## Requirements covered

| ID | Summary |
| -- | ------- |
| FR-EVALS-01 | One append-only line per completed run in `evals/runs.jsonl` |
| FR-EVALS-02 | `timestamp`, `iterationCount`, `finalScore`, `gaps`, `modelId`, `durationMs`—no raw CV/job text |
| FR-EVALS-03 | Gitignored; never exposed via API or static routes |
| FR-PIPE-06 | Write failures swallowed; pipeline still succeeds |
| TC-DATA-01 | Storage policy |

Also: BC-PRIVACY-02.

## Scope

### In scope

- `lib/evals/logger.ts` or similar (framework-free)
- Hook at end of `runPipeline` success path
- Ensure no route serves `evals/`
- Unit test: logger throw does not fail pipeline

### Out of scope

- Dashboard/analytics over JSONL (out of MVP scope)

## Acceptance criteria

1. After successful run, one new line in `evals/runs.jsonl`.
2. Record JSON contains only allowed fields; no `cv` or `jobText` keys.
3. `evals/runs.jsonl` in `.gitignore`.
4. `GET /evals/runs.jsonl` returns 404 (or no static mapping).
5. Mocked `fs.appendFile` failure still returns `PipelineResult` to caller.

## OpenSpec artifacts

- **Specs:** `specs/evals/spec.md`

## Notes

Small capability—can be implemented quickly once 04 is done; sequenced after 09
so the happy path is proven first.
