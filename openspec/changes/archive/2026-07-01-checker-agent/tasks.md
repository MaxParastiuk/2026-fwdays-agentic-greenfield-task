## 1. Model configuration

- [x] 1.1 Add `getCheckerModelId()` to `agents/model-config.ts` (shared `MODEL_ID` override with Maker)
- [x] 1.2 Add or extend unit test for Checker model ID default and `MODEL_ID` override

## 2. Prompt builders

- [x] 2.1 Create `agents/checker-prompt.ts` with `buildCheckerMessages(cv, jobText, letter)` returning system + user messages
- [x] 2.2 Ensure system prompt requires JSON-only output matching `{ score, gaps, rationale }` with score 0–10
- [x] 2.3 Ensure user message includes labeled `CV`, `JOB POSTING`, and `COVER LETTER` sections
- [x] 2.4 Add unit tests asserting JSON-only instruction is present and all three inputs appear in the user message

## 3. Checker agent

- [x] 3.1 Define `INVALID_CHECK_RESULT` constant `{ score: 0, gaps: [], rationale: '' }` in `agents/checker.ts`
- [x] 3.2 Implement `checkCoverLetter(cv, jobText, letter)` calling `generateText` with `getCheckerModelId()` and checker messages
- [x] 3.3 Parse model text with `JSON.parse` then `safeParseCheckResult` from `lib/validation`; return `INVALID_CHECK_RESULT` on failure without throwing
- [x] 3.4 On validation failure, log to `console.error` only when `NODE_ENV === 'development'`
- [x] 3.5 Re-export `getCheckerModelId` from `agents/checker.ts` for pipeline/UI attribution
- [x] 3.6 (Optional) Add small `extractJson(text)` helper to strip markdown code fences if needed for robustness

## 4. Tests and boundaries

- [x] 4.1 Add `agents/checker.test.ts` with `jest.mock('ai')` — valid JSON returns parsed `CheckResult`
- [x] 4.2 Add test for invalid JSON → `{ score: 0, gaps: [], rationale: '' }` without throw
- [x] 4.3 Add test for schema-invalid JSON (e.g. score 11) → safe default
- [x] 4.4 Add test asserting dev-only logging when `NODE_ENV=development` and validation fails
- [x] 4.5 Extend `agents/import-boundary.test.ts` — `checker.ts` does not import `maker` or `pipeline/runner`
- [x] 4.6 (Optional) Add `agents/checker.integration.test.ts` gated on `AI_GATEWAY_API_KEY` or `VERCEL_OIDC_TOKEN`

## 5. Validation gate

- [x] 5.1 Run `npm run lint && npm run typecheck && npm test && npm run build` and fix any failures
- [x] 5.2 Update `docs/current-state.md` to mark `03-checker-agent` as in progress or implemented
