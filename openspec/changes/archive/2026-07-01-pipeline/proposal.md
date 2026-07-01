## Why

Maker (`02-maker-agent`) and Checker (`03-checker-agent`) are archived and unit-tested in isolation. The MVP needs a server-side orchestrator that wires them into the Maker → Checker revision loop (score threshold 8.0, max three iterations) and returns a structured `PipelineResult` for the pipeline API (08) and results UI (09). This is Phase 2 of the capability plan and the next blocking step after the agent core.

## What Changes

- Add `pipeline/runner.ts` exporting `runPipeline(cv, jobText): Promise<PipelineResult>` (FR-PIPE-01)
- Implement the iteration loop: Maker → Checker; if `score < 8.0` and `iteration < 3`, re-call Maker with gap feedback (FR-PIPE-02)
- Exit when `score ≥ 8.0` or after three iterations; `finalLetter` is the last letter produced (FR-PIPE-03)
- Build `PipelineResult` with `finalLetter`, `iterations[]`, `finalScore`, and `gaps` per existing Zod schemas (FR-PIPE-04, FR-PIPE-05)
- Accept an optional eval-logger callback; swallow write errors so logging never aborts the pipeline (FR-PIPE-06 partial — JSONL append deferred to capability 10)
- Optional `onProgress` callback hook for capability 08 streaming (design detail)
- Jest unit tests with mocked `makeCoverLetter` and `checkCoverLetter`: one-iteration success, three-iteration cap, early exit at score 8
- Import-boundary test: runner imports maker and checker only; agents do not import runner

## Capabilities

### New Capabilities

- `pipeline`: Maker → Checker orchestration loop, `runPipeline`, `PipelineResult` assembly, eval-logger error isolation, and unit tests (FR-PIPE-01 … FR-PIPE-05, FR-PIPE-06 partial)

### Modified Capabilities

- _(none — `PipelineResult` / `IterationRecord` schemas already defined in `lib/` spec; runner consumes them without changing requirements)_

## Impact

- **New files:** `pipeline/runner.ts`, `pipeline/runner.test.ts`, optional `pipeline/types.ts` for progress/eval hooks
- **Modified files:** `agents/import-boundary.test.ts` (if not already covering runner boundary)
- **Dependencies:** Imports `agents/maker.ts`, `agents/checker.ts`, and `lib/schemas` / `lib/validation` only (TC-ARCH-01)
- **Environment:** No new env vars; inherits Gateway auth from agents when integration tests run
- **Blocks:** `08-pipeline-api` (HTTP/streaming), `10-evals-logging` (JSONL wire-up to eval logger)
- **Out of scope:** HTTP routes, UI, evals file I/O implementation, changes to Maker/Checker agents
