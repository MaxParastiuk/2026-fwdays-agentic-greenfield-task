## Why

The Maker–Checker pipeline and API are complete, but completed runs leave no local observability trail. Capability `10-evals-logging` adds a privacy-safe, append-only JSONL log so developers can inspect iteration counts, scores, and gap labels offline without storing raw CV or job text. This satisfies FR-EVALS-01 through FR-EVALS-03, completes FR-PIPE-06 (wire the existing `evalLogger` hook to real persistence), and unblocks deploy hardening (11) with TC-DATA-01 in place.

## What Changes

- Add framework-free `lib/evals/logger.ts` that appends one JSON line per successful pipeline completion to `evals/runs.jsonl`
- Define `EvalRunRecord` Zod schema with allowed fields only: `timestamp`, `iterationCount`, `finalScore`, `gaps`, `modelId`, `durationMs` (no `cv`, `jobText`, or letter body)
- Wire `appendEvalRun` into `runPipeline` via the existing `evalLogger` option in `lib/pipeline/handle-run.ts` (server route path)
- Ensure write failures are swallowed: pipeline and API still return success; dev-only `console.error` on failure (FR-PIPE-06)
- Confirm `evals/runs.jsonl` remains in `.gitignore` and no route or static mapping serves `evals/` (FR-EVALS-03)
- Unit tests: logger builds valid records from `PipelineResult`; mocked `fs.appendFile` failure does not reject `runPipeline`; record schema rejects forbidden keys

## Capabilities

### New Capabilities

- `evals`: Append-only local JSONL logging for completed pipeline runs — privacy-safe record shape, gitignored storage, error isolation (FR-EVALS-01 … FR-EVALS-03, FR-PIPE-06, TC-DATA-01, BC-PRIVACY-02)

### Modified Capabilities

- `pipeline`: Promote FR-PIPE-06 from “partial” to fully specified — eval logger wired to real file append on success path (requirement text unchanged; implementation completes deferred work from capability 04)

## Impact

- **New files:** `lib/evals/logger.ts`, `lib/evals/record.ts` (or schema colocated in `lib/schemas/`), `lib/evals/logger.test.ts`
- **Modified files:** `lib/pipeline/handle-run.ts` (pass `evalLogger` with duration timing); optional `lib/schemas/index.ts` export for `EvalRunRecord`
- **Existing contracts:** `runPipeline` already accepts `evalLogger`; `PipelineResult` unchanged; no API response shape changes
- **Dependencies:** Node `fs/promises` only (server-side); no new npm packages
- **Blocks:** `11-deploy-hardening` (privacy/storage verification)
- **Out of scope:** JSONL dashboard, analytics aggregates, reading or exposing logs via HTTP
