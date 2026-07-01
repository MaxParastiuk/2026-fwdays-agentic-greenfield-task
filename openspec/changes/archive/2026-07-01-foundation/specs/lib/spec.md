## ADDED Requirements

### Requirement: Framework-free lib layer

The `lib/` directory MUST contain only Node-safe modules. No file under `lib/` SHALL import `next/*`, `react`, `react-dom`, or browser-only globals.

#### Scenario: TypeScript compiles lib without framework imports

- **WHEN** `tsc --noEmit` runs on the project
- **THEN** all modules under `lib/` compile without errors and without importing Next.js or React packages

#### Scenario: Lib boundary test passes

- **WHEN** `npm test` runs the lib import-boundary test
- **THEN** no forbidden import patterns are detected in `lib/**/*.ts`

### Requirement: Shared score schema

The system SHALL export a reusable Zod schema `scoreSchema` representing a Checker-derived score: number, 0–10 inclusive. `checkResultSchema`, `iterationRecordSchema`, and `pipelineResultSchema` MUST use `scoreSchema` for all score fields so pipeline and Checker types stay aligned (FR-CHECKER-02, FR-RESULTS-03).

### Requirement: CheckResult schema

The system SHALL define a Zod schema `checkResultSchema` exporting inferred type `CheckResult` with fields: `score` (`scoreSchema`), `gaps` (array of strings), `rationale` (string).

#### Scenario: Valid check result parses

- **WHEN** `{ score: 8.5, gaps: ["missing metric"], rationale: "Strong match" }` is parsed with `checkResultSchema`
- **THEN** parsing succeeds and the inferred type matches the parsed value

#### Scenario: Score out of range fails

- **WHEN** `{ score: 11, gaps: [], rationale: "x" }` is parsed with `checkResultSchema`
- **THEN** parsing fails with a Zod validation error

#### Scenario: Negative score fails

- **WHEN** `{ score: -1, gaps: [], rationale: "x" }` is parsed with `checkResultSchema`
- **THEN** parsing fails with a Zod validation error

### Requirement: Pipeline result schemas

The system SHALL define Zod schemas for `IterationRecord` and `PipelineResult` per FR-PIPE-04 and FR-PIPE-05.

`iterationRecordSchema` fields: `iteration` (positive integer), `letter` (string), `score` (`scoreSchema`), `gaps` (string array).

`pipelineResultSchema` fields: `finalLetter` (string), `iterations` (array of iteration records), `finalScore` (`scoreSchema`), `gaps` (string array).

#### Scenario: Valid pipeline result parses

- **WHEN** a complete `PipelineResult` object with one iteration record is parsed with `pipelineResultSchema`
- **THEN** parsing succeeds and types are inferred without `any`

#### Scenario: Empty iterations array is valid

- **WHEN** `pipelineResultSchema` parses a result with `iterations: []`
- **THEN** parsing succeeds (runner may populate later; schema allows empty for testing)

#### Scenario: Out-of-range finalScore fails

- **WHEN** `pipelineResultSchema` parses a result with `finalScore: 11`
- **THEN** parsing fails with a Zod validation error on `finalScore`

### Requirement: API request and response schemas

The system SHALL define Zod schemas for shared API payloads used by later capabilities:

- CV parse paste request (`cvParseRequestSchema`): `{ cvText: string }` — non-empty, max 32 KB (FR-CV-06). Multipart PDF upload validation is owned by capability `06-cv-upload`, not this schema.
- CV parse response (`cvParseResponseSchema`): `{ cvText: string }`
- Job fetch request (`jobFetchRequestSchema`): `{ url: string }` — valid URL (`z.string().url()`), max 2048 characters
- Job fetch response (`jobFetchResponseSchema`): `{ jobText: string }`
- Pipeline run request (`pipelineRunRequestSchema`): `{ cvText: string, jobText: string }` with both strings non-empty and max 32 KB each (FR-CV-06, FR-JOB-06)
- Pipeline run response: matches `pipelineResultSchema` shape for the final JSON body (stream progress/error chunk types are defined in capability `08-pipeline-api`)

#### Scenario: Pipeline run request rejects empty CV

- **WHEN** `{ cvText: "", jobText: "Engineer role" }` is validated
- **THEN** validation fails with a field-level error on `cvText`

#### Scenario: Pipeline run request rejects oversized job text

- **WHEN** `jobText` exceeds 32 KB
- **THEN** validation fails with a field-level error on `jobText`

#### Scenario: Valid pipeline run request passes

- **WHEN** both `cvText` and `jobText` are non-empty strings within size limits
- **THEN** validation succeeds

#### Scenario: CV parse paste request rejects oversized text

- **WHEN** `cvText` exceeds 32 KB in `cvParseRequestSchema`
- **THEN** validation fails with a field-level error on `cvText`

#### Scenario: Job fetch request rejects invalid URL

- **WHEN** `{ url: "not-a-url" }` is validated with `jobFetchRequestSchema`
- **THEN** validation fails with a field-level error on `url`

### Requirement: Shared validation helpers

The `lib/validation/` module SHALL export reusable parse helpers that wrap the schemas from `lib/schemas/`:

- `safeParse`-style helpers returning `{ success: true, data } | { success: false, error: ZodError }` for client forms and routes that return field errors
- `parseOrThrow`-style helpers that throw `ZodError` on failure for server route handlers that map errors to HTTP 400

#### Scenario: Parse helper returns data on success

- **WHEN** a valid object is passed to a `parseCheckResult` (or equivalent) helper
- **THEN** the helper returns `{ success: true, data: CheckResult }`

#### Scenario: Parse helper returns errors on failure

- **WHEN** an invalid object is passed to the same helper
- **THEN** the helper returns `{ success: false, error }` with Zod error details

#### Scenario: Parse-or-throw helper throws on failure

- **WHEN** an invalid pipeline run request is passed to a `parseOrThrow` (or equivalent) helper
- **THEN** the helper throws a `ZodError`

### Requirement: Jest test harness

The project MUST configure Jest so `npm test` runs unit tests for `lib/` on a clean checkout. At least one test file under `lib/` MUST pass.

#### Scenario: Test command succeeds

- **WHEN** a developer runs `npm test` after `npm install` on a clean checkout
- **THEN** at least one `lib/` unit test passes with exit code 0

#### Scenario: Schema unit test covers CheckResult

- **WHEN** the CheckResult schema tests run
- **THEN** they assert both valid parsing and rejection of out-of-range scores

### Requirement: Project directory layout

The repository SHALL contain the following top-level directories for later capabilities: `agents/`, `pipeline/`, `lib/`, `evals/`, `app/api/`.

#### Scenario: Directories exist after foundation

- **WHEN** the foundation change is applied
- **THEN** `agents/`, `pipeline/`, `lib/`, `evals/`, and `app/api/` exist in the repo root

### Requirement: Evals path gitignored

The file `evals/runs.jsonl` MUST be listed in `.gitignore` and MUST NOT be committed. The `evals/` directory MAY exist empty.

#### Scenario: Gitignore entry present

- **WHEN** a developer inspects `.gitignore`
- **THEN** `evals/runs.jsonl` is listed

### Requirement: Developer validation script

The project MUST expose `typecheck` (`tsc --noEmit`) as an npm script and support running `npm run lint && npm run typecheck && npm test && npm run build` successfully after the foundation change (NFR-DX-01). Jest coverage thresholds for `agents/`, `pipeline/`, and `lib/` are deferred until those directories contain code (capabilities 02–04); foundation configures `collectCoverageFrom` only as a stub.

#### Scenario: Full validation passes

- **WHEN** a developer runs `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` in sequence on a clean checkout
- **THEN** all commands exit with code 0
