## Context

The repo is a Next.js 16 App Router scaffold with design-system reference components and no agents, pipeline, or API routes. Requirements in `docs/requirements.md` define shared types (`CheckResult`, `PipelineResult`, `IterationRecord`) and mandate Zod validation (TC-STACK-06), Jest coverage for `lib/` (TC-STACK-07), and a framework-free `lib/` layer (TC-ARCH-03). Capability `01-foundation` is Phase 0 of the MVP plan—everything else imports from here.

**OpenSpec slug:** the change folder is `openspec/changes/foundation`; the MVP capability slug is `01-foundation`. They refer to the same change.

## Goals / Non-Goals

**Goals:**

- Establish `lib/` as the single source of shared schemas and validation parsers
- Prove `lib/` has no React/Next/DOM imports via TypeScript and lint boundaries
- Configure Jest so `npm test` runs on a clean checkout with at least one passing `lib/` test
- Scaffold empty `agents/`, `pipeline/`, `evals/`, and `app/api/` directories for later capabilities
- Prepare evals path: `evals/` directory + `evals/runs.jsonl` in `.gitignore`
- Ensure `npm run lint && npm run typecheck && npm test && npm run build` succeeds (NFR-DX-01)

**Non-Goals:**

- Implementing Maker, Checker, or pipeline runner logic (capabilities 02–04)
- UI components or API route handlers with business logic (capabilities 05–08)
- Multipart PDF upload validation schemas (capability 06 — foundation defines JSON paste path only)
- Stream progress/error chunk schemas (capability 08 — foundation defines final `PipelineResult` body only)
- Jest coverage thresholds (deferred until `agents/`, `pipeline/`, and `lib/` have substantive code; stub `collectCoverageFrom` only)
- Writing to `evals/runs.jsonl` (capability 10)
- Vercel deploy or production hardening (capability 11)

## Decisions

### 1. Schema module layout

**Decision:** Split schemas into focused files under `lib/schemas/` with a barrel `lib/schemas/index.ts`.

| File | Exports |
| ---- | ------- |
| `check-result.ts` | `scoreSchema`, `checkResultSchema`, `CheckResult` |
| `pipeline.ts` | `iterationRecordSchema`, `pipelineResultSchema`, `IterationRecord`, `PipelineResult` |
| `api.ts` | `cvParseRequestSchema`, `jobFetchRequestSchema`, `pipelineRunRequestSchema`, and matching response schemas |

**Rationale:** Matches FR-CHECKER-02, FR-PIPE-04/05, and FR-JOB-05 field shapes. Small files keep imports narrow for later capabilities.

**Alternatives considered:** Single `schemas.ts` — rejected; grows unwieldy as API shapes expand in 06–08.

### 1b. Shared score bounds

**Decision:** Export `scoreSchema` (`z.number().min(0).max(10)`) from `check-result.ts` and reuse it in `iterationRecordSchema.score` and `pipelineResultSchema.finalScore`.

**Rationale:** Checker scores are always 0–10 (FR-CHECKER-02); UI badge thresholds depend on the same range (FR-RESULTS-03). A single schema prevents drift between Checker output and pipeline records.

### 1c. CV parse JSON shape

**Decision:** Foundation defines `cvParseRequestSchema` as `{ cvText: string }` (non-empty, max 32 KB) for the paste/JSON path. Multipart PDF upload validation is owned by capability 06.

**Rationale:** Capability 06 uses multipart for PDF and JSON for paste; one canonical text field name (`cvText`) matches the pipeline run request and client state.

### 2. Validation layer

**Decision:** `lib/validation/` exports:

- `safeParse*` helpers returning `{ success: true, data } | { success: false, error: ZodError }` for client forms and routes that surface field errors
- `parseOrThrow*` helpers that throw `ZodError` on failure for server route handlers

**Rationale:** API routes and client forms share the same Zod definitions; thin wrappers avoid duplicating error handling patterns.

### 3. Framework-free `lib/` enforcement

**Decision:** Rely on TypeScript module resolution (no `react`/`next` in `lib/` imports) plus an ESLint rule or a Jest boundary test that asserts `lib/**/*.ts` does not import forbidden packages.

**Rationale:** TC-ARCH-03 requires 100% Jest unit-testability without React test renderer for `lib/`.

**Alternatives considered:** Separate `tsconfig.lib.json` excluding DOM libs — deferred; current approach is sufficient for MVP.

### 4. Jest configuration

**Decision:** Use `jest` with `ts-jest` (or `@swc/jest` if faster on Windows) targeting Node environment for `lib/`, `agents/`, and `pipeline/` tests. Path alias `@/*` mapped in `jest.config.ts` to match `tsconfig.json`. Configure `collectCoverageFrom` for `lib/`, `agents/`, `pipeline/` without enforcing thresholds in this change.

**Rationale:** TC-STACK-07 requires Jest; Node env avoids jsdom overhead for pure `lib/` tests in this change. Coverage thresholds apply once those directories contain code.

**Note:** RTL setup for UI tests is added in capability 05 when components ship.

### 5. Directory scaffolding

**Decision:** Create placeholder `.gitkeep` or minimal `index.ts` exports in `agents/` and `pipeline/` only if needed for TypeScript path resolution; prefer empty dirs with `.gitkeep` to avoid premature exports.

**Rationale:** FR-MAKER-05 and FR-CHECKER-05 are already accepted—scaffolding must not create cross-imports between maker/checker.

### 6. Evals preparation

**Decision:** Create `evals/.gitkeep` and add `evals/runs.jsonl` to root `.gitignore`.

**Rationale:** TC-DATA-01 / FR-EVALS-03 partial fulfillment; full append logic is capability 10.

### 7. Dependencies

**Decision:** Add `zod` (^3.x) as production dependency. Add `jest`, `@types/jest`, `ts-jest` as devDependencies.

**Rationale:** Zod is used at runtime in API routes and potentially client validation; Jest is dev-only.

## Risks / Trade-offs

| Risk | Mitigation |
| ---- | ---------- |
| Jest + Next.js 16 module resolution conflicts | Use `moduleNameMapper` for `@/*`; exclude `.next/` from test roots |
| `lib/` accidentally imports React via shared utils | Boundary test scans `lib/` imports; code review in apply phase |
| Schema drift vs requirements when agents land | Spec ties field names to requirement IDs; types exported from single source |
| Windows CI speed for NFR-DX-01 | Keep test count minimal in foundation; smoke test only |

## Migration Plan

Greenfield—no migration. On merge:

1. Run `npm install`
2. Verify `npm run lint && npm run typecheck && npm test && npm run build`
3. Update `docs/current-state.md` to mark `01-foundation` (`openspec/changes/foundation`) as implemented

Rollback: revert the change branch; no data migration.

## Open Questions

- None blocking. Model ID default (`google/gemini-2.0-flash`) is documented in requirements but not needed until capability 02.
