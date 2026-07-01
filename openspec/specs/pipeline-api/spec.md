# pipeline-api Specification

## Purpose

Expose the Maker–Checker pipeline over HTTP with AI SDK streaming progress, validated request bodies, and a documented stream protocol for the results UI (capability `08-pipeline-api`).

## Requirements

### Requirement: Pipeline run API endpoint

The application SHALL expose `POST /api/pipeline/run` accepting a JSON body `{ cvText: string, jobText: string }` validated by `pipelineRunRequestSchema` before invoking `runPipeline` (FR-JOB-05, TC-ARCH-02).

#### Scenario: Valid body starts pipeline

- **WHEN** `POST /api/pipeline/run` receives a body that passes `pipelineRunRequestSchema`
- **THEN** the server starts `runPipeline(cvText, jobText)` and returns a streaming HTTP response

#### Scenario: Invalid body returns 400

- **WHEN** the request body fails `pipelineRunRequestSchema` (e.g. empty `cvText` or text over 32 KB)
- **THEN** the route returns HTTP 400 with a structured error and does not invoke `runPipeline`

#### Scenario: Route is server-only

- **WHEN** static analysis or import-boundary checks inspect client components and `lib/hooks/`
- **THEN** no file marked `"use client"` imports from the `ai` package

### Requirement: Progress streaming via AI SDK

While `runPipeline` executes, the API SHALL stream human-readable progress to the client using Vercel AI SDK streaming primitives from the `ai` package (`streamText` or equivalent UI message stream helpers per TC-STACK-03). Each pipeline iteration SHALL emit at least two progress messages: “Iteration N: writing…” before the Maker call and “Iteration N: checking…” before the Checker call, where N is the 1-based iteration number (FR-RESULTS-05).

#### Scenario: Progress lines per iteration

- **WHEN** `runPipeline` runs one full iteration with `onProgress` wired to the stream
- **THEN** the client receives a progress message containing “Iteration 1: writing…” followed by a progress message containing “Iteration 1: checking…”

#### Scenario: Multiple iterations stream in order

- **WHEN** the pipeline runs three iterations
- **THEN** the client receives at least six progress messages in iteration order (writing then checking for each iteration)

#### Scenario: Progress uses onProgress hook

- **WHEN** the route handler executes the pipeline
- **THEN** it passes `onProgress` to `runPipeline` and maps `{ phase: 'writing', iteration }` and `{ phase: 'checking', iteration }` to the required message strings

### Requirement: Stream event protocol

The stream SHALL use typed events documented for downstream UI consumption. Event kinds SHALL include at minimum: `progress` (message string), `result` (`PipelineResult`), and `error` (fatal message string). The final successful stream SHALL include exactly one `result` event after all progress events.

#### Scenario: Successful run ends with result event

- **WHEN** `runPipeline` resolves successfully
- **THEN** the stream emits a `result` event whose payload satisfies `pipelineResultSchema` and then closes

#### Scenario: Progress events precede result

- **WHEN** a run completes successfully after two iterations
- **THEN** all `progress` events are delivered before the `result` event

### Requirement: Fatal error stream termination

If `runPipeline` rejects due to a fatal failure (network error, AI Gateway or upstream LLM error, or other unrecoverable server fault), the stream SHALL emit an `error` event and close. It SHALL NOT emit a `result` event or partial `PipelineResult` (FR-RESULTS-06).

#### Scenario: Maker failure yields error event only

- **WHEN** `makeCoverLetter` throws during the run
- **THEN** the stream emits an `error` event and does not emit `result`

#### Scenario: Checker safe default is not fatal

- **WHEN** Checker returns the score-0 safe default without throwing
- **THEN** the pipeline continues per iteration rules and may still complete with a `result` event

### Requirement: Client pipeline run orchestration

The home page SHALL invoke `POST /api/pipeline/run` when the visitor clicks the enabled “Generate cover letter” control, passing the current validated `cvText` and `jobText`. A client hook or helper SHALL consume the stream without importing the `ai` package in `"use client"` modules (TC-ARCH-02).

#### Scenario: Run button triggers API call

- **WHEN** the visitor clicks the enabled run button with valid `cvText` and `jobText`
- **THEN** the client sends `POST /api/pipeline/run` with those fields in the JSON body

#### Scenario: Run button remains no-op when disabled

- **WHEN** the run button is disabled per `pipelineRunRequestSchema`
- **THEN** clicking it does not call the pipeline API

#### Scenario: Client parser handles stream events

- **WHEN** the streaming response is received
- **THEN** client-side code in `lib/` (not `ai`) parses progress, result, and error events and updates run state accordingly

### Requirement: Pipeline API module boundary

Pipeline API orchestration helpers in `lib/pipeline/` SHALL be framework-free (no `next/*`, no `react`). The route handler in `app/api/pipeline/run/` SHALL be the HTTP entry point and MAY import `ai` streaming utilities and `pipeline/runner` (TC-ARCH-03).

#### Scenario: lib pipeline helpers are framework-free

- **WHEN** import-boundary tests inspect `lib/pipeline/`
- **THEN** no imports resolve to `next/*` or `react`

### Requirement: Pipeline API tests

The pipeline API layer SHALL have automated tests that mock `runPipeline` (or the handle-run helper) without calling the live AI Gateway (NFR-DX-01).

#### Scenario: Validation failure tested

- **WHEN** tests send an invalid request body to the run handler
- **THEN** they assert HTTP 400 and that `runPipeline` was not called

#### Scenario: Successful run tested with mocks

- **WHEN** tests mock `runPipeline` to resolve with a valid `PipelineResult`
- **THEN** they assert the response stream includes progress and result events
