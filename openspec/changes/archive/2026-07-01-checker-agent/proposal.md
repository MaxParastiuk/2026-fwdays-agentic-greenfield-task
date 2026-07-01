## Why

The pipeline loop (capability 04) needs a Checker agent that scores a cover letter against the CV and job posting, returning structured gaps for the Maker to fix on the next iteration. Foundation (`01-foundation`) already delivers `CheckResult` in `lib/`; Maker (`02-maker-agent`) is archived. This is the second agent capability and unblocks pipeline orchestration.

## What Changes

- Add `agents/checker.ts` exporting `checkCoverLetter(cv, jobText, letter): Promise<CheckResult>` (FR-CHECKER-01)
- Prompt the model to respond with JSON only matching `CheckResult`; parse and validate with existing Zod schema (FR-CHECKER-02, FR-CHECKER-03)
- On Zod validation failure, return a safe default `{ score: 0, gaps: [], rationale: '' }` without throwing; log failure to server console only when `NODE_ENV=development` (FR-CHECKER-04)
- Enforce module boundary: no imports from `agents/maker.ts` or `pipeline/runner.ts` (FR-CHECKER-05, TC-ARCH-01)
- Reuse `agents/model-config.ts` for Gateway model ID (same `MODEL_ID` override as Maker)
- Add Jest unit tests with mocked `generateText` (valid JSON, invalid JSON, malformed output); optional integration test gated on Gateway credentials
- Extend `agents/import-boundary.test.ts` to cover `checker.ts`

## Capabilities

### New Capabilities

- `checker-agent`: Cover letter scoring agent — `checkCoverLetter`, JSON-mode prompt, `CheckResult` validation, graceful parse failure, and unit tests (FR-CHECKER-01 … FR-CHECKER-05)

### Modified Capabilities

- _(none — `CheckResult` schema already defined in `lib/` spec; Checker consumes it without changing requirements)_

## Impact

- **New files:** `agents/checker.ts`, `agents/checker-prompt.ts`, `agents/checker.test.ts`, optional `agents/checker.integration.test.ts`
- **Modified files:** `agents/model-config.ts` (shared `getCheckerModelId` or alias), `agents/import-boundary.test.ts`
- **Dependencies:** Reuses existing `ai` package from Maker; imports `CheckResult` / `safeParseCheckResult` from `lib/`
- **Environment:** Same Gateway auth as Maker (`MODEL_ID`, `AI_GATEWAY_API_KEY` or `VERCEL_OIDC_TOKEN`)
- **Blocks:** `04-pipeline` imports Checker for the Maker → Checker loop
- **Parallel:** Shipped independently of Maker; no cross-imports between agent modules
