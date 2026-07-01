# Capability: Checker agent

**OpenSpec slug:** `03-checker-agent`  
**Depends on:** `01-foundation`  
**Blocks:** `04-pipeline`

## Purpose

Score a cover letter against the CV and job posting; return structured gaps for
the Maker to address on the next iteration.

## Requirements covered

| ID | Summary |
| -- | ------- |
| FR-CHECKER-01 | `checkCoverLetter(cv, jobText, letter)` in `agents/checker.ts` |
| FR-CHECKER-02 | `CheckResult`: `{ score, gaps, rationale }` Zod schema |
| FR-CHECKER-03 | Model returns JSON only; parse + validate |
| FR-CHECKER-04 | Zod failure → score 0, continue loop; dev-only console log |
| FR-CHECKER-05 | No imports from `maker.ts` or `pipeline/runner.ts` (accepted) |

Also: TC-STACK-06, NFR-SEC-01, TC-STACK-03.

## Scope

### In scope

- `agents/checker.ts` with JSON-mode prompt
- `CheckResult` schema in `lib/` (if not already in 01)
- Unit tests: valid JSON, invalid JSON → score 0 behavior

### Out of scope

- Loop exit logic (04)
- UI display of gaps (09)

## Acceptance criteria

1. Valid model JSON parses to `CheckResult` with `score` in 0–10.
2. Malformed output yields `{ score: 0, gaps: [], rationale: '' }` (or equivalent safe default) without throwing.
3. In `NODE_ENV=development`, invalid parse logs once to server console.
4. No imports of `maker` or `pipeline`.

## OpenSpec artifacts

- **Specs:** `specs/checker-agent/spec.md`

## Parallel work

Can run in parallel with `02-maker-agent`.
