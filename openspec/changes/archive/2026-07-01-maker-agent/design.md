## Context

Foundation is archived: `lib/` schemas, Jest harness, and empty `agents/` directory exist. The MVP plan places Maker as Phase 1 (capability `02-maker-agent`), parallel with Checker. The pipeline runner (04) will call `makeCoverLetter` with optional gap feedback from Checker output; this change delivers only the Maker module and tests.

**OpenSpec slug:** change folder `openspec/changes/maker-agent`; MVP capability slug `02-maker-agent`.

**Constraints:** NFR-SEC-01 (Gateway auth only, no `NEXT_PUBLIC_*` keys), TC-STACK-03 (`ai` + Gateway), TC-ARCH-01 (no checker import), TC-ARCH-02 (LLM usage server-side via API/pipeline, not client components).

## Goals / Non-Goals

**Goals:**

- Implement `makeCoverLetter(cv, jobText, feedback?)` in `agents/maker.ts` per FR-MAKER-01 … FR-MAKER-05
- Use `generateText` from `ai` with Gateway model IDs and `MODEL_ID` override
- Separate prompt construction for initial draft vs revision (feedback gaps)
- Export resolved model ID for downstream attribution
- Unit tests with mocked `generateText`; optional integration test gated on credentials
- Add agent import-boundary test mirroring `lib/import-boundary.test.ts`

**Non-Goals:**

- Checker agent (`03-checker-agent`)
- Pipeline loop (`04-pipeline`)
- API route or streaming (`08-pipeline-api`)
- Client UI or env exposure
- Evals logging (`10-evals-logging`)
- Input validation of `cv`/`jobText` length (owned by `lib/schemas` and API layer; Maker assumes non-empty strings from caller)

## Decisions

### 1. File layout

**Decision:** `agents/maker.ts` (public API), `agents/maker-prompt.ts` (prompt builders), `agents/model-config.ts` (model ID resolution), `agents/maker.test.ts`.

**Rationale:** Keeps prompt text testable without mocking the full agent; model config shared if Checker later mirrors the pattern.

**Alternatives considered:** Inline prompts in `maker.ts` — rejected; harder to assert feedback injection in tests.

### 2. Dependency injection for tests

**Decision:** Export `makeCoverLetter` as the default implementation. For tests, either:

- `jest.mock('ai', () => ({ generateText: jest.fn() }))`, or
- accept an optional `deps?: { generateText }` parameter on an internal `makeCoverLetterWith(deps)` used by tests

Prefer module mock of `ai` to keep the public API as `makeCoverLetter(cv, jobText, feedback?)` per FR-MAKER-01.

**Rationale:** Matches capability brief acceptance criteria (assert via mock/spy).

### 3. Prompt structure

**Decision:** System message defines role (professional cover letter writer), constraints (plain text, ≤400 words, no placeholders, no markdown). User message contains labeled sections: `CV`, `JOB POSTING`, and optionally `REVISION INSTRUCTIONS` listing numbered gaps from `feedback`.

**Rationale:** FR-MAKER-02 requires explicit revision instructions; numbered list is easy to assert in unit tests.

### 4. Model configuration

**Decision:** `getMakerModelId()` reads `process.env.MODEL_ID ?? 'google/gemini-2.0-flash'`. Pass to `generateText({ model: getMakerModelId(), ... })`.

**Rationale:** FR-MAKER-03 and BC-BRAND-02; same default as requirements.md.

### 5. AI SDK and Gateway

**Decision:** Add `ai` package. Use `generateText` with Gateway model string — no custom `baseURL` when deploying on Vercel (OIDC). Local dev uses `AI_GATEWAY_API_KEY` from `vercel env pull` per NFR-SEC-01.

**Rationale:** TC-STACK-03; aligns with Checker capability (03) for consistency.

**Note:** Maker lives in `agents/`, not `lib/`, so importing `ai` does not violate TC-ARCH-03. Ensure no `"use client"` file imports `agents/maker.ts`.

### 6. Error handling

**Decision:** Do not catch Gateway/LLM errors inside Maker; let them propagate to the pipeline/API layer (FR-RESULTS-06 fatal handling in capability 08/09).

**Rationale:** Single responsibility; runner owns abort semantics.

### 7. Output normalization

**Decision:** `return result.text.trim()`. If `result.text` is empty after trim, throw an error with a clear message so the pipeline treats it as fatal.

**Rationale:** Prevents silent empty letters in the loop.

### 8. Boundary testing

**Decision:** Extend or add `agents/import-boundary.test.ts` asserting `maker.ts` does not import `checker` or `pipeline/runner`.

**Rationale:** FR-MAKER-05 is already `accepted`; automated guard prevents regressions.

## Risks / Trade-offs

| Risk | Mitigation |
| ---- | ---------- |
| `ai` package increases install size | Only imported from server-side `agents/` and API/pipeline paths |
| Model ignores 400-word limit | Prompt instruction + Checker scores length in later iterations; no hard truncate in MVP |
| Live integration tests fail in CI without keys | Gate with `describe.skipIf(!hasGatewayCredentials)` |
| Accidental client import of Maker | ESLint or boundary test in apply phase; pipeline/API only entry points |

## Migration Plan

Greenfield module addition:

1. `npm install ai`
2. Implement `agents/maker.ts` and tests
3. Run `npm run lint && npm run typecheck && npm test && npm run build`
4. Update `docs/current-state.md` when archived

Rollback: revert branch; no data migration.

## Open Questions

- None blocking. Checker (03) should use the same `model-config` pattern or duplicate minimally — coordinate during parallel apply to avoid drift (optional shared `agents/model-config.ts` owned by Maker, imported by Checker in 03).
