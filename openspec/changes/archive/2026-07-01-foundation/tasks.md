## 1. Dependencies and scripts

- [x] 1.1 Add `zod` to `dependencies` and Jest toolchain (`jest`, `@types/jest`, `ts-jest`) to `devDependencies`
- [x] 1.2 Add `test`, `test:watch`, and `typecheck` (`tsc --noEmit`) scripts to `package.json`
- [x] 1.3 Create `jest.config.ts` with `@/*` path mapping, Node test environment for `lib/`, and `collectCoverageFrom` stub for `lib/`, `agents/`, `pipeline/` (no coverage thresholds yet)

## 2. Directory scaffolding

- [x] 2.1 Create `agents/`, `pipeline/`, `evals/`, and `app/api/` directories (with `.gitkeep` where needed)
- [x] 2.2 Add `evals/runs.jsonl` to `.gitignore`

## 3. Zod schemas (`lib/schemas/`)

- [x] 3.1 Implement `lib/schemas/check-result.ts` with `scoreSchema` (0–10), `checkResultSchema`, and `CheckResult` type
- [x] 3.2 Implement `lib/schemas/pipeline.ts` with `iterationRecordSchema`, `pipelineResultSchema`, and inferred types; reuse `scoreSchema` for `score` and `finalScore`
- [x] 3.3 Implement `lib/schemas/api.ts` with `cvParseRequestSchema` (`cvText`, 32 KB cap), job fetch (`url` via `z.string().url().max(2048)`), and pipeline run request/response schemas
- [x] 3.4 Add `lib/schemas/index.ts` barrel exporting all schemas and types

## 4. Validation helpers (`lib/validation/`)

- [x] 4.1 Implement shared `safeParse` wrapper pattern in `lib/validation/parse.ts`
- [x] 4.2 Export typed `safeParse` helpers for CheckResult, PipelineResult, and API request bodies
- [x] 4.3 Export `parseOrThrow` helpers for server route handlers (e.g. `parsePipelineRunRequest`)
- [x] 4.4 Add `lib/validation/index.ts` barrel export

## 5. Tests

- [x] 5.1 Add `lib/schemas/check-result.test.ts` covering valid parse and out-of-range score rejection
- [x] 5.2 Add `lib/schemas/api.test.ts` covering pipeline run validation (empty CV, oversized job text), CV paste oversize, and invalid job URL
- [x] 5.3 Add `lib/schemas/pipeline.test.ts` covering out-of-range `finalScore` rejection
- [x] 5.4 Add `lib/import-boundary.test.ts` asserting no `next/*` or `react` imports under `lib/`

## 6. Validation gate

- [x] 6.1 Run `npm run lint && npm run typecheck && npm test && npm run build` and fix any failures
- [x] 6.2 Update `docs/current-state.md` to mark `01-foundation` (`openspec/changes/foundation`) as in progress or implemented
