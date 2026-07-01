# Capability: Maker agent

**OpenSpec slug:** `02-maker-agent`  
**Depends on:** `01-foundation`  
**Blocks:** `04-pipeline`

## Purpose

Generate a plain-text cover letter from CV + job posting text, optionally
revising when the Checker supplies gap feedback.

## Requirements covered

| ID | Summary |
| -- | ------- |
| FR-MAKER-01 | `makeCoverLetter(cv, jobText, feedback?)` in `agents/maker.ts` |
| FR-MAKER-02 | Iteration > 1 appends Checker gaps to prompt |
| FR-MAKER-03 | `generateText` via AI Gateway; default `google/gemini-2.0-flash`; `MODEL_ID` override |
| FR-MAKER-04 | Plain-text output; prompt enforces ≤ 400 words |
| FR-MAKER-05 | No imports from `checker.ts` or `pipeline/runner.ts` (accepted) |

Also: NFR-SEC-01, NFR-COST-01, TC-STACK-03, TC-ARCH-02 (LLM calls stay server-side).

## Scope

### In scope

- `agents/maker.ts` with prompt template(s)
- Unit tests with mocked `generateText`
- Optional integration test gated on `AI_GATEWAY_API_KEY` / OIDC

### Out of scope

- Checker logic (03)
- Loop orchestration (04)
- API route exposure (08)

## Acceptance criteria

1. First call returns a non-empty string without `feedback`.
2. Second call with `feedback: string[]` includes those gaps in the model prompt (assert via mock/spy).
3. Module graph: `maker.ts` does not import `checker` or `pipeline`.
4. `npm test` covers happy path and feedback path.

## OpenSpec artifacts

- **Specs:** `specs/maker-agent/spec.md`
- **Tasks:** implement function, prompts, tests

## Parallel work

Can run in parallel with `03-checker-agent` after foundation completes.
