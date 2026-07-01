## Context

Foundation is archived: `CheckResult` schema and `safeParseCheckResult` live in `lib/`. Maker (`02-maker-agent`) is archived with `agents/maker.ts`, `agents/model-config.ts`, and import-boundary tests. The MVP plan places Checker as Phase 1 (capability `03-checker-agent`), parallel with Maker. The pipeline runner (04) will call `checkCoverLetter` after each Maker draft and pass `gaps` back to Maker when score < 8.0; this change delivers only the Checker module and tests.

**OpenSpec slug:** change folder `openspec/changes/checker-agent`; MVP capability slug `03-checker-agent`.

**Constraints:** NFR-SEC-01 (Gateway auth only), TC-STACK-03 (`ai` + Gateway), TC-ARCH-01 (no maker import), TC-ARCH-02 (LLM server-side only), TC-STACK-06 (Zod validation via existing `lib/` helpers).

## Goals / Non-Goals

**Goals:**

- Implement `checkCoverLetter(cv, jobText, letter): Promise<CheckResult>` in `agents/checker.ts` per FR-CHECKER-01 … FR-CHECKER-05
- Use `generateText` from `ai` with Gateway model IDs (reuse `model-config.ts`)
- JSON-only prompt; parse model text with `safeParseCheckResult` from `lib/validation`
- Graceful degradation on parse/validation failure: `{ score: 0, gaps: [], rationale: '' }` without throwing (FR-CHECKER-04)
- Dev-only `console.error` (or equivalent) when validation fails
- Unit tests with mocked `generateText`; optional integration test gated on credentials
- Extend import-boundary test for `checker.ts`

**Non-Goals:**

- Pipeline loop exit logic or score threshold (04)
- UI display of gaps or score (09)
- Changes to `CheckResult` schema in `lib/` (already complete in 01)
- Maker agent changes
- Evals logging

## Decisions

### 1. File layout

**Decision:** `agents/checker.ts` (public API), `agents/checker-prompt.ts` (prompt builders), `agents/checker.test.ts`.

**Rationale:** Mirrors Maker layout; prompt JSON schema instructions are testable in isolation.

**Alternatives considered:** Single file — rejected; prompt assertions are clearer in a dedicated module.

### 2. Model configuration

**Decision:** Add `getCheckerModelId()` to `agents/model-config.ts` as an alias of the same `MODEL_ID ?? DEFAULT_MODEL_ID` logic (or export a shared `getModelId()` used by both agents).

**Rationale:** Checker and Maker use the same Gateway default per requirements; pipeline attribution may show one model ID for both in MVP.

### 3. JSON extraction and validation

**Decision:** Prompt requires raw JSON only (no markdown fences). After `generateText`, trim `result.text`, attempt `JSON.parse`, then `safeParseCheckResult(parsed)`. If `JSON.parse` throws or `safeParse` returns `success: false`, return `INVALID_CHECK_RESULT` constant `{ score: 0, gaps: [], rationale: '' }`.

**Rationale:** FR-CHECKER-03 and FR-CHECKER-04; pipeline continues on score 0. Optional: strip leading ```json fences if model disobeys — document as best-effort in apply phase if tests show models often wrap JSON.

**Alternatives considered:** `generateObject` from AI SDK — rejected for MVP to keep explicit JSON prompt + Zod path per capability brief.

### 4. Dev-only logging

**Decision:** On validation failure, if `process.env.NODE_ENV === 'development'`, log once with `console.error` including a short message and optionally the raw model text (truncated). No logging in production/test `NODE_ENV`.

**Rationale:** FR-CHECKER-04 explicitly scopes logging to development.

### 5. Error handling for LLM failures

**Decision:** Do not catch Gateway/network errors inside Checker; let them propagate to pipeline/API (fatal per FR-RESULTS-06). Only parse/validation failures are recoverable.

**Rationale:** Symmetric with Maker; runner owns abort vs continue semantics.

### 6. Prompt content

**Decision:** System message defines role (cover letter evaluator). User message contains labeled `CV`, `JOB POSTING`, `COVER LETTER` sections. System instructs: respond with a single JSON object matching `{ "score": number 0-10, "gaps": string[], "rationale": string }` — no other text.

**Rationale:** FR-CHECKER-02/03; gaps feed Maker revision instructions in 04.

### 7. Boundary testing

**Decision:** Add `checker.ts` case to `agents/import-boundary.test.ts` forbidding imports of `maker` and `pipeline/runner`.

**Rationale:** FR-CHECKER-05 is `accepted`; automated guard prevents regressions.

### 8. Dependency injection for tests

**Decision:** Use `jest.mock('ai')` for unit tests; public API remains `checkCoverLetter(cv, jobText, letter)` per FR-CHECKER-01.

**Rationale:** Matches Maker test pattern.

## Risks / Trade-offs

| Risk | Mitigation |
| ---- | ---------- |
| Model returns markdown-wrapped JSON | Trim fences in a small `extractJson(text)` helper if unit tests with realistic mocks need it |
| Model returns score outside 0–10 | Zod `scoreSchema` rejects → safe default score 0 |
| Model returns non-array `gaps` | Zod rejects entire object → safe default |
| Accidental client import of Checker | Boundary test + server-only usage from pipeline/API |
| Duplicate model-config accessors | Single `getModelId()` internal helper; `getCheckerModelId` / `getMakerModelId` as thin exports |

## Migration Plan

Greenfield module addition:

1. Implement `agents/checker.ts`, prompt module, and tests
2. Extend `model-config.ts` and import-boundary test
3. Run `npm run lint && npm run typecheck && npm test && npm run build`
4. Update `docs/current-state.md` when archived

Rollback: revert branch; no data migration.

## Open Questions

- None blocking. If `extractJson` fence-stripping is added, keep it minimal and covered by unit tests.
