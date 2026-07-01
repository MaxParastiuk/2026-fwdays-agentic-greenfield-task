## Context

Foundation (`01-foundation`) archived `PipelineResult`, `IterationRecord`, and `pipelineResultSchema` in `lib/`. Maker (`02-maker-agent`) and Checker (`03-checker-agent`) are archived with `makeCoverLetter(cv, jobText, feedback?)` and `checkCoverLetter(cv, jobText, letter)` respectively. Import boundaries forbid agents from importing each other or the runner (TC-ARCH-01). The MVP plan places pipeline orchestration as Phase 2 (capability `04-pipeline`), blocking the pipeline API (08) and evals logging wire-up (10).

**OpenSpec slug:** change folder `openspec/changes/pipeline`; MVP capability slug `04-pipeline`.

**Constraints:** FR-PIPE-01 … FR-PIPE-06 (partial), existing Zod schemas in `lib/`, score threshold 8.0, max 3 iterations, fatal LLM/network errors propagate, Checker parse failures do not (FR-CHECKER-04).

## Goals / Non-Goals

**Goals:**

- Implement `runPipeline(cv, jobText): Promise<PipelineResult>` in `pipeline/runner.ts` per FR-PIPE-01 … FR-PIPE-05
- Loop: call Maker → Checker; if `score < 8.0` and `iteration < 3`, call Maker again with `gaps` as `feedback`
- Exit when `score ≥ 8.0` or after 3 iterations; `finalLetter` = last letter; `finalScore` and `gaps` from last Checker result
- Record each iteration in `iterations[]` with `iteration`, `letter`, `score`, `gaps`
- Optional `onProgress` callback for capability 08 (`writing` / `checking` per iteration)
- Optional `evalLogger` callback invoked on success; catch and swallow errors (FR-PIPE-06 partial)
- Unit tests with mocked agents covering acceptance criteria from `docs/capabilities/04-pipeline.md`
- Validate assembled `PipelineResult` with `safeParsePipelineResult` before return

**Non-Goals:**

- HTTP route, `streamText`, or SSE (08)
- JSONL file append implementation (10) — only the hook interface and error isolation
- UI, results display, CV/job input panels
- Changes to Maker or Checker agents
- Integration tests against live Gateway (optional, gated)

## Decisions

### 1. File layout

**Decision:** `pipeline/runner.ts` (public API + loop), `pipeline/runner.test.ts` (unit tests). Optional `pipeline/types.ts` for `PipelineProgressEvent` and `EvalLogger` types if they clutter the runner.

**Rationale:** Single orchestration module; mirrors `agents/` simplicity.

**Alternatives considered:** Split loop vs result builder — rejected; loop is ~80 lines.

### 2. Loop constants

**Decision:** `const SCORE_THRESHOLD = 8.0` and `const MAX_ITERATIONS = 3` as module-level constants (not env vars).

**Rationale:** Requirements fix threshold at 8.0 and cap at 3; no MVP need for configuration.

### 3. Iteration numbering

**Decision:** `iteration` in `IterationRecord` is 1-based (first Maker+Checker round = 1).

**Rationale:** Matches user-facing "Iteration N" in streaming (08) and results timeline (09).

### 4. Feedback to Maker

**Decision:** On revision, pass Checker `gaps` array directly as `makeCoverLetter(cv, jobText, gaps)` third argument. First iteration omits `feedback`.

**Rationale:** FR-PIPE-02 and FR-MAKER-02 already define gap-driven revision.

### 5. Exit and result assembly

**Decision:** After each Checker call, append `IterationRecord`. If `score >= 8.0`, break. If `iteration === MAX_ITERATIONS`, break. Set `finalLetter` to the letter from the last iteration, `finalScore` and `gaps` from the last Checker result.

**Rationale:** FR-PIPE-03 — sub-8 after three rounds still returns the last letter with `finalScore` e.g. 7.

### 6. Progress callback

**Decision:** `runPipeline` accepts optional `options?: { onProgress?: (event: PipelineProgressEvent) => void }`. Events: `{ phase: 'writing' | 'checking', iteration: number }` emitted immediately before each agent call.

**Rationale:** Capability 08 maps these to stream chunks without changing the core loop signature later.

**Alternatives considered:** Return async generator — rejected; `Promise<PipelineResult>` is the required contract (FR-PIPE-01).

### 7. Eval logger hook

**Decision:** Optional `evalLogger?: (result: PipelineResult) => Promise<void>` in options. After successful loop completion, if provided, `await evalLogger(result)` inside try/catch; log in development on failure; never throw to caller.

**Rationale:** FR-PIPE-06 partial; capability 10 implements `appendFile` to `evals/runs.jsonl`.

### 8. Error handling

**Decision:** Do not catch errors from `makeCoverLetter` or `checkCoverLetter` when they throw (Gateway/network). Let them propagate as fatal failures. Checker returning `{ score: 0, gaps: [] }` on parse failure is not an error — loop continues per FR-CHECKER-04.

**Rationale:** Aligns with requirements error taxonomy and FR-RESULTS-06.

### 9. Output validation

**Decision:** Before returning, run `safeParsePipelineResult(result)`; if validation fails, throw an internal error (programmer error — should not happen in production).

**Rationale:** Ensures contract with `lib/` schemas; catches assembly bugs in tests.

### 10. Dependency injection for tests

**Decision:** Export `runPipeline` with default imports of real agents. Tests use `jest.mock('@/agents/maker')` and `jest.mock('@/agents/checker')` to stub return values and assert call counts/order.

**Rationale:** Matches existing agent test pattern; no need for constructor injection in MVP.

### 11. Module boundary

**Decision:** `pipeline/runner.ts` imports only `agents/maker`, `agents/checker`, and `lib/*`. Add `pipeline/import-boundary.test.ts` or extend agent boundary tests to assert runner does not import `app/`, `components/`, or client code.

**Rationale:** TC-ARCH-01, TC-ARCH-02 — orchestration stays server-side.

## Risks / Trade-offs

| Risk | Mitigation |
| ---- | ---------- |
| Infinite loop if threshold logic wrong | Hard cap at `MAX_ITERATIONS`; unit test asserts max 3 Maker calls |
| `gaps` empty on score 0 still triggers revision | Expected — Maker gets empty feedback; loop still bounded by iteration cap |
| Float comparison for score 8.0 | Use `score >= 8.0`; Zod `scoreSchema` already constrains range |
| Eval logger throws | try/catch swallows; test with throwing mock |
| Progress callback throws | Document as caller responsibility; API layer (08) wraps safely |

## Migration Plan

Greenfield module addition:

1. Implement `pipeline/runner.ts` and tests
2. Run `npm run lint && npm run typecheck && npm test && npm run build`
3. Update `docs/current-state.md` when implemented/archived

Rollback: revert branch; no data migration.

## Open Questions

- None blocking. Progress event shape may gain fields (e.g. `letter` preview) in 08 without breaking the hook.
