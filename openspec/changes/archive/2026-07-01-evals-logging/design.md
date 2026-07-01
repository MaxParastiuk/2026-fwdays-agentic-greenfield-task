## Context

Foundation (01) created `evals/` and added `evals/runs.jsonl` to `.gitignore`. Pipeline (04) added `evalLogger?: EvalLogger` to `PipelineRunOptions` and error isolation in `runPipeline` — tests confirm a throwing callback does not abort the run. Pipeline API (08) calls `runPipeline` with progress streaming but does not yet pass `evalLogger`. Results display (09) is archived; the happy path is proven. This change implements the deferred file I/O and wires it through the API handler.

**Constraints:** FR-EVALS-01 … FR-EVALS-03, FR-PIPE-06, TC-DATA-01, BC-PRIVACY-02. Framework-free `lib/` only for logger logic. No new npm dependencies.

## Goals / Non-Goals

**Goals:**

- Append one validated JSON line per successful pipeline completion to `evals/runs.jsonl`
- Record only privacy-safe metadata (timestamp, iteration count, score, gaps, modelId, durationMs)
- Swallow write failures so pipeline and API behavior are unchanged
- Unit-test record shape, append behavior, and failure isolation

**Non-Goals:**

- Reading or querying JSONL from the UI or any HTTP endpoint
- Aggregate analytics, dashboards, or log rotation
- Logging failed runs or partial iterations
- Changing `PipelineResult` schema or API stream contract

## Decisions

### 1. Module layout: `lib/evals/logger.ts` + `lib/schemas/eval-run.ts`

**Choice:** Colocate Zod schema (`evalRunRecordSchema`, `EvalRunRecord`) in `lib/schemas/` alongside `PipelineResult`; implement `buildEvalRunRecord(result, durationMs)` and `appendEvalRun(record)` in `lib/evals/logger.ts`.

**Rationale:** Matches existing pattern (`lib/schemas`, `lib/validation`). Keeps pipeline runner free of `fs` imports.

**Alternative considered:** Put schema in `lib/evals/record.ts` — rejected to keep all Zod types discoverable under `lib/schemas`.

### 2. File path: `evals/runs.jsonl` at repo root

**Choice:** Resolve path relative to `process.cwd()` as `evals/runs.jsonl` (constant `EVALS_RUNS_PATH`).

**Rationale:** Matches MVP plan, product brief, and existing `.gitignore` entry. Works in local dev and Vercel serverless (writable `/tmp` not needed — Vercel allows writes to project dir during function lifetime; file is gitignored and not deployed as static asset).

**Alternative considered:** `/tmp/runs.jsonl` on Vercel — rejected because local dev and docs standardize on `evals/runs.jsonl`.

### 3. Directory creation: `mkdir` with `recursive: true` before append

**Choice:** Ensure `evals/` exists before first `appendFile`.

**Rationale:** Foundation may only have `.gitkeep`; avoids first-run failure. Errors still swallowed per FR-PIPE-06.

### 4. Duration measurement in `handlePipelineRun`

**Choice:** Record `Date.now()` before `runPipelineFn` and compute `durationMs` in the `evalLogger` closure passed to `runPipeline`.

**Rationale:** Duration covers full Maker–Checker loop including network; not duplicated inside runner. Runner stays agnostic of wall clock.

**Alternative considered:** Measure inside `runPipeline` — rejected to avoid changing runner signature.

### 5. Wire only the API path (not client)

**Choice:** Pass `evalLogger` from `lib/pipeline/handle-run.ts` only.

**Rationale:** Evals are server-side observability. Unit tests for `runPipeline` continue without file I/O unless they inject a mock logger.

### 6. Injectable `appendFile` for tests

**Choice:** Export `appendEvalRun` with optional dependency injection (default `fs/promises.appendFile`) or test via `jest.mock('fs/promises')`.

**Rationale:** Avoids writing real files in CI; matches existing pipeline test style.

### 7. No route changes for `/evals/*`

**Choice:** Rely on Next.js App Router default (no `public/evals/` or `app/evals/` route). Optionally add a one-line note in design/tasks to verify 404 — no middleware required.

**Rationale:** `evals/` is outside `public/` and `app/`; FR-EVALS-03 satisfied by structure.

## Risks / Trade-offs

- **[Serverless ephemeral filesystem]** → Eval file may not persist across Vercel invocations or cold starts. **Mitigation:** Acceptable for MVP offline dev inspection; documented in capability brief. Deploy hardening (11) can note limitation.

- **[Concurrent appends]** → Two simultaneous runs could interleave writes. **Mitigation:** MVP is single-user demo; append is one line per completion. No locking required.

- **[Large gaps arrays]** → Unlikely but could bloat JSONL. **Mitigation:** Gaps are Checker labels only (short strings); schema enforces string array.

- **[Silent failure in production]** → Write errors invisible to operators. **Mitigation:** Dev `console.error` already in runner; optional same in logger. NFR-OBS-01 deferred to deploy hardening.

## Migration Plan

1. Add `evalRunRecordSchema` and exports in `lib/schemas`
2. Implement `lib/evals/logger.ts` with build + append
3. Wire `evalLogger` in `handlePipelineRun` with duration
4. Add unit tests; run `npm test`
5. Manual smoke: one successful run → verify new line in `evals/runs.jsonl` (local only)
6. Archive change and sync specs to `openspec/specs/evals/spec.md`

No rollback complexity — removing the `evalLogger` argument restores prior behavior.

## Open Questions

- None blocking implementation. Vercel persistence expectations can be documented in `11-deploy-hardening` if needed.
