## Why

Every later capability (agents, pipeline, API routes, UI) depends on shared Zod schemas, a framework-free `lib/` layer, and a Jest test harness. Without this foundation, parallel work on Maker/Checker agents and the app shell would diverge on types, validation, and import boundaries—creating rework and violating accepted architecture constraints (TC-ARCH-03, TC-STACK-06, TC-STACK-07).

This is the first capability in the MVP sequence; nothing user-visible ships here, but it unblocks all subsequent OpenSpec changes.

## What Changes

- Add `lib/schemas/` with Zod schemas and inferred TypeScript types: `CheckResult`, `PipelineResult`, `IterationRecord`, and API request/response shapes for CV parse, job fetch, and pipeline run
- Add `lib/validation/` with shared parsers reused by API routes and client forms
- Scaffold directory layout: `agents/`, `pipeline/`, `lib/`, `evals/` (empty), `app/api/` (placeholder structure only)
- Configure Jest with test utilities and at least one `lib/` smoke unit test
- Add `evals/runs.jsonl` to `.gitignore` (full logging implemented in capability 10)
- Add npm scripts: `test`, `test:watch`, `typecheck`, and verify `lint && typecheck && test && build` completes under NFR-DX-01 target (<90s)
- Add `zod` as a runtime dependency; add Jest, `@types/jest`, `ts-jest` (or equivalent) as dev dependencies

## Capabilities

### New Capabilities

- `lib`: Shared Zod schemas, inferred types, validation helpers, and framework-free conventions for `lib/` (TC-ARCH-03, TC-STACK-06, TC-STACK-07, NFR-DX-01, partial TC-DATA-01)

### Modified Capabilities

- _(none — no existing specs in `openspec/specs/` yet)_

## Impact

- **New directories:** `lib/schemas/`, `lib/validation/`, `agents/`, `pipeline/`, `evals/`, `app/api/`
- **Dependencies:** `zod`; Jest toolchain in devDependencies
- **Config:** `jest.config.ts`, possible `tsconfig` path alias usage (`@/lib/*`)
- **Scripts:** `package.json` gains `test`, `test:watch`, and `typecheck`
- **Git:** `.gitignore` entry for `evals/runs.jsonl`
- **Blocks:** All capabilities 02–11 import from this layer; no agent or UI implementation in this change
