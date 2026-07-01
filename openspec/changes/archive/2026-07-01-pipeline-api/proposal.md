## Why

CV upload and job input are live with validated client state, and `runPipeline()` is unit-tested with a progress callback hook — but the run button is still a no-op and the header status stays idle. Capability `08-pipeline-api` is Phase 5 of the MVP plan and delivers the first end-to-end integration: visitors submit validated inputs, the server runs the Maker–Checker loop, and progress streams back to the UI before results rendering lands in 09.

## What Changes

- Add `POST /api/pipeline/run` accepting `{ cvText, jobText }` with server-side Zod validation (`pipelineRunRequestSchema`) and 400 responses for invalid bodies (FR-JOB-05, NFR-SEC-01)
- Invoke `runPipeline` from the route handler; feed `onProgress` events into a `streamText` response with human-readable lines: “Iteration N: writing…” and “Iteration N: checking…” (FR-RESULTS-05, TC-STACK-03, TC-ARCH-02)
- Define a documented stream protocol (progress chunks, final `PipelineResult` chunk, fatal error chunk) for capability 09 to consume
- Wire `HomePageClient` run button to call the API and track run lifecycle; lift pipeline status to connect `StatusIndicator` in the header (FR-SHELL-04)
- Add client hook or helper for consuming the stream without importing `ai` in `"use client"` modules (TC-ARCH-02)
- Unit/integration tests for the route with mocked `runPipeline`; client tests for status transitions where practical

## Capabilities

### New Capabilities

- `pipeline-api`: HTTP pipeline endpoint, `streamText` progress streaming, stream event schema, client run orchestration hook, header status wiring (FR-RESULTS-05, TC-ARCH-02, TC-STACK-03, NFR-SEC-01)

### Modified Capabilities

- `app-shell`: Header `StatusIndicator` reflects idle / running / complete / error based on active pipeline run state (FR-SHELL-04); implementation moves from static `idle` to client-driven state

## Impact

- **New files:** `app/api/pipeline/run/route.ts`; `lib/pipeline/` stream helpers and event types; `lib/hooks/use-pipeline-run.ts` (or equivalent client orchestration); optional `components/pipeline/` progress display stub for 09
- **Modified files:** `components/home/home-page-client.tsx` (run handler, status state); `components/app-shell/app-header.tsx` or shell layout (status prop wiring); `app/page.tsx` or layout if header must become client-aware
- **Existing contracts:** Reuses `pipelineRunRequestSchema`, `pipelineResultSchema`, `runPipeline` + `PipelineRunOptions.onProgress` from foundation/pipeline capabilities
- **Dependencies:** `ai` package used only in API route; no new npm packages expected
- **Blocks:** `09-results-display` (needs stream contract and final `PipelineResult`)
- **Out of scope:** Full results UI (09), evals JSONL append (10), deploy hardening (11)
