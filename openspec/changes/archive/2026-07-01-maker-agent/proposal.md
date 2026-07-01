## Why

The pipeline loop (capability 04) needs a Maker agent that turns CV + job posting text into a plain-text cover letter and can revise when the Checker supplies gap feedback. Foundation (`01-foundation`) delivered shared schemas and test harness; this is the first agent capability and unblocks pipeline orchestration and later API wiring.

## What Changes

- Add `agents/maker.ts` exporting `makeCoverLetter(cv, jobText, feedback?): Promise<string>` (FR-MAKER-01)
- Add prompt template(s) that produce plain-text cover letters with a 400-word maximum (FR-MAKER-04)
- When `feedback` is provided (iteration > 1), append Checker gap strings as explicit revision instructions in the prompt (FR-MAKER-02)
- Call Vercel AI SDK `generateText` routed through AI Gateway; default model `google/gemini-2.0-flash`, overridable via `MODEL_ID` (FR-MAKER-03, TC-STACK-03)
- Enforce module boundary: no imports from `agents/checker.ts` or `pipeline/runner.ts` (FR-MAKER-05, TC-ARCH-01)
- Add `ai` package as a runtime dependency
- Add Jest unit tests with mocked `generateText` (happy path + feedback path); optional integration test gated on `AI_GATEWAY_API_KEY` or OIDC
- Export model ID helper for reuse by pipeline/results UI (BC-BRAND-02 attribution in capability 09)

## Capabilities

### New Capabilities

- `maker-agent`: Cover letter generation agent — `makeCoverLetter`, prompts, AI Gateway integration, and unit tests (FR-MAKER-01 … FR-MAKER-05)

### Modified Capabilities

- _(none — `lib` schemas unchanged; Maker consumes string inputs only)_

## Impact

- **New files:** `agents/maker.ts`, `agents/maker.test.ts`, optional `agents/maker.integration.test.ts`, prompt module(s) under `agents/`
- **Dependencies:** `ai` (Vercel AI SDK) added to `package.json`
- **Environment:** `MODEL_ID` (optional), `AI_GATEWAY_API_KEY` or `VERCEL_OIDC_TOKEN` for live calls (NFR-SEC-01)
- **Blocks:** `04-pipeline` imports Maker; `08-pipeline-api` invokes pipeline which calls Maker server-side (TC-ARCH-02)
- **Parallel:** Can ship alongside `03-checker-agent` with no cross-imports
