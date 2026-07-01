## 1. Schema

- [x] 1.1 Add `evalRunRecordSchema` and `EvalRunRecord` type in `lib/schemas/eval-run.ts` with fields: `timestamp`, `iterationCount`, `finalScore`, `gaps`, `modelId`, `durationMs`
- [x] 1.2 Export from `lib/schemas/index.ts` and add `safeParseEvalRunRecord` (or reuse pattern) in `lib/validation` if needed

## 2. Eval logger module

- [x] 2.1 Create `lib/evals/logger.ts` with `EVALS_RUNS_PATH` constant (`evals/runs.jsonl`)
- [x] 2.2 Implement `buildEvalRunRecord(result: PipelineResult, durationMs: number): EvalRunRecord` — map `iterations.length` to `iterationCount`, omit letter/CV/job fields
- [x] 2.3 Implement `appendEvalRun(record: EvalRunRecord)` — `mkdir` `evals/` recursive, validate schema, `appendFile` with `JSON.stringify(record) + '\n'`
- [x] 2.4 Export `createEvalLogger(durationMs: number)` or equivalent factory returning `EvalLogger` for `runPipeline`

## 3. Pipeline API wiring

- [x] 3.1 In `lib/pipeline/handle-run.ts`, record start time before `runPipelineFn`
- [x] 3.2 Pass `evalLogger` that calls `appendEvalRun(buildEvalRunRecord(result, durationMs))` on successful completion
- [x] 3.3 Confirm failed runs (catch block) do not invoke eval logger

## 4. Tests

- [x] 4.1 Add `lib/evals/logger.test.ts` — `buildEvalRunRecord` produces valid schema; no forbidden keys
- [x] 4.2 Test `appendEvalRun` calls `appendFile` with single-line JSON (mock `fs/promises`)
- [x] 4.3 Test `appendEvalRun` swallows `appendFile` throw (does not rethrow)
- [x] 4.4 Add `lib/pipeline/handle-run.test.ts` case (or extend existing) — successful run passes `evalLogger` that appends once
- [x] 4.5 Re-run existing `pipeline/runner.test.ts` evalLogger throw test (should still pass)

## 5. Privacy and storage verification

- [x] 5.1 Confirm `evals/runs.jsonl` remains in `.gitignore`
- [x] 5.2 Verify no `public/evals/` or `app/evals/` route serves the file (manual or doc note in validation)

## 6. Validation gate

- [x] 6.1 Run `npm run lint && npm run typecheck && npm test && npm run build`
- [x] 6.2 Update `docs/current-state.md` — mark `10-evals-logging` in progress; note manual smoke step (one run → line in `evals/runs.jsonl`)
