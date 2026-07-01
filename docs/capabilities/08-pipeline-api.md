# Capability: Pipeline API & streaming

**OpenSpec slug:** `08-pipeline-api`  
**Depends on:** `04-pipeline`, `06-cv-upload`, `07-job-input`  
**Blocks:** `09-results-display`

## Purpose

Expose the pipeline over HTTP with `streamText` progress updates and wire header
status to running/done/error.

## Requirements covered

| ID | Summary |
| -- | ------- |
| FR-RESULTS-05 | Stream “Iteration N: writing…” / “Iteration N: checking…” |
| FR-SHELL-04 | Header status reflects run lifecycle |

Also: TC-ARCH-02, TC-STACK-03, FR-JOB-05 (server re-validation), NFR-SEC-01,
NFR-PERF-01 (baseline).

## Scope

### In scope

- `POST /api/pipeline/run` (or equivalent) accepting `{ cvText, jobText }`
- Server-side Zod validation
- Invoke `runPipeline` with progress events fed into `streamText`
- Stream protocol documented for 09 (chunk types: progress, result, error)
- Header `StatusIndicator` connected to client run state

### Out of scope

- Full results rendering (09)
- Evals JSONL (10)—pipeline may call no-op logger

## Acceptance criteria

1. Valid inputs start stream; client receives at least one progress line per iteration.
2. Successful run ends with serializable `PipelineResult` in stream or final chunk.
3. Fatal LLM/network error ends stream with error type; no partial result payload (FR-RESULTS-06 contract).
4. No `ai` package imports in `"use client"` files.
5. Invalid body returns 400 with field errors.

## OpenSpec artifacts

- **Specs:** `specs/pipeline-api/spec.md`
- **Design:** stream event schema, client hook API

## Notes

This is the **first end-to-end integration** milestone. Manual test with real AI
Gateway credentials after 02–04 are stable.
