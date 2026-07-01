## 1. Types and constants

- [x] 1.1 Create `pipeline/types.ts` (or inline in runner) with `PipelineRunOptions`, `PipelineProgressEvent`, and `EvalLogger` types
- [x] 1.2 Define `SCORE_THRESHOLD = 8.0` and `MAX_ITERATIONS = 3` module constants

## 2. Pipeline runner

- [x] 2.1 Create `pipeline/runner.ts` exporting `runPipeline(cv, jobText, options?)`
- [x] 2.2 Implement iteration loop: Maker (no feedback on round 1) → Checker → append `IterationRecord`
- [x] 2.3 On `score < 8.0` and `iteration < 3`, call Maker with Checker `gaps` as `feedback` and continue
- [x] 2.4 Exit when `score >= 8.0` or after 3 iterations; set `finalLetter`, `finalScore`, `gaps` from last round
- [x] 2.5 Invoke optional `onProgress` before each Maker (`writing`) and Checker (`checking`) call with 1-based iteration
- [x] 2.6 Invoke optional `evalLogger` on success inside try/catch; swallow errors (dev log optional)
- [x] 2.7 Validate assembled result with `safeParsePipelineResult` before return; throw on validation failure
- [x] 2.8 Let Maker/Checker throws propagate (fatal); do not catch Gateway/network errors

## 3. Tests and boundaries

- [x] 3.1 Add `pipeline/runner.test.ts` with `jest.mock` for `@/agents/maker` and `@/agents/checker`
- [x] 3.2 Test score 9 on iteration 1 → exactly 1 Maker + 1 Checker call
- [x] 3.3 Test scores 5, 6, 7 across three iterations → 3 Maker calls, `finalScore` 7, `iterations.length` 3
- [x] 3.4 Test score 5 then 8 → 2 iterations, early stop, `finalScore` 8
- [x] 3.5 Test revision passes gaps: second Maker call receives gaps from first Checker
- [x] 3.6 Test throwing `evalLogger` still resolves `PipelineResult`
- [x] 3.7 Test Maker throw rejects `runPipeline` without partial result
- [x] 3.8 Test `onProgress` event order for two-iteration run
- [x] 3.9 Add `pipeline/import-boundary.test.ts` — runner imports only agents and `lib/`; agents do not import runner
- [x] 3.10 Test Checker throw rejects `runPipeline` without partial result
- [x] 3.11 Test score 0 on all iterations runs full loop (Checker parse-failure path)
- [x] 3.12 Assert returned `PipelineResult` satisfies `pipelineResultSchema` in runner tests

## 4. Validation gate

- [x] 4.1 Run `npm run lint && npm run typecheck && npm test && npm run build` and fix any failures
- [x] 4.2 Update `docs/current-state.md` to mark `04-pipeline` as in progress or implemented
