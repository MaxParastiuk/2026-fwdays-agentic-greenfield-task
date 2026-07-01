# evals Specification

## Purpose

Append-only local JSONL logging for completed pipeline runs — privacy-safe record shape, gitignored storage, and error isolation (capability `10-evals-logging`).

## ADDED Requirements

### Requirement: Append one JSONL record per completed run

Each successfully completed pipeline run SHALL append exactly one JSON line to `evals/runs.jsonl` using append-only semantics (never truncate or overwrite the file) (FR-EVALS-01).

#### Scenario: Successful run appends one line

- **WHEN** `runPipeline` resolves with a valid `PipelineResult` and eval logging is enabled
- **THEN** exactly one new line is appended to `evals/runs.jsonl`

#### Scenario: Failed run does not append

- **WHEN** `runPipeline` rejects (e.g. Maker or Gateway error)
- **THEN** no line is appended to `evals/runs.jsonl`

#### Scenario: File created on first write

- **WHEN** `evals/runs.jsonl` does not exist and a successful run completes
- **THEN** the file is created and contains one JSON line

### Requirement: Privacy-safe eval record shape

Each appended record SHALL be a single JSON object containing only: `timestamp` (ISO 8601 string), `iterationCount` (positive integer), `finalScore` (number), `gaps` (string array of Checker-derived labels), `modelId` (string), and `durationMs` (non-negative integer). The record MUST NOT include raw CV text, job posting text, cover letter body, or rationale fields (FR-EVALS-02, BC-PRIVACY-02).

#### Scenario: Record fields derived from PipelineResult

- **WHEN** eval logging runs after a successful pipeline with `iterations.length` of N, `finalScore` of S, `gaps` of G, and `modelId` of M
- **THEN** the appended JSON has `iterationCount: N`, `finalScore: S`, `gaps: G`, `modelId: M`, a valid ISO `timestamp`, and `durationMs` reflecting wall-clock run time

#### Scenario: No sensitive text keys

- **WHEN** any eval record is serialized
- **THEN** the JSON object has no keys named `cv`, `cvText`, `jobText`, `letter`, `finalLetter`, `rationale`, or similar raw-content fields

#### Scenario: Schema validation before write

- **WHEN** `appendEvalRun` is called with a `PipelineResult` and duration
- **THEN** the record is validated against `evalRunRecordSchema` before `fs.appendFile`

### Requirement: Gitignored local storage only

`evals/runs.jsonl` MUST be listed in `.gitignore` and MUST NOT be committed. The file MUST NOT be exposed via any API route, App Router page, or static asset mapping (FR-EVALS-03, TC-DATA-01).

#### Scenario: Gitignore entry present

- **WHEN** the repository root `.gitignore` is inspected
- **THEN** `evals/runs.jsonl` is listed

#### Scenario: No HTTP exposure

- **WHEN** a client requests `GET /evals/runs.jsonl` or any path under `/evals/`
- **THEN** the application returns 404 (or equivalent not-found) and does not serve file contents

### Requirement: Write failures do not affect pipeline success

Errors during eval file append (missing directory, disk full, permission denied) SHALL be caught and SHALL NOT reject `runPipeline`, change the API response, or surface to the visitor (FR-PIPE-06).

#### Scenario: Append failure still returns PipelineResult

- **WHEN** `fs.appendFile` throws during eval logging after a successful loop
- **THEN** `runPipeline` still resolves with the assembled `PipelineResult`

#### Scenario: API success unchanged on write failure

- **WHEN** eval append fails during `handlePipelineRun`
- **THEN** the stream still emits a `result` event with the full `PipelineResult`

#### Scenario: Dev-only error logging

- **WHEN** eval append fails and `NODE_ENV` is `development`
- **THEN** the failure is logged to `console.error` without exposing details to the client

### Requirement: Framework-free eval logger module

Eval logging logic SHALL live in `lib/evals/` (or equivalent under `lib/`) with no imports from `next/*`, `react`, or `"use client"` modules (TC-ARCH-02, TC-STACK-01).

#### Scenario: Logger module boundary

- **WHEN** static analysis inspects `lib/evals/logger.ts`
- **THEN** imports resolve only to Node built-ins, `lib/schemas`, and other `lib/` modules

#### Scenario: Injectable file operations for tests

- **WHEN** unit tests run against the eval logger
- **THEN** file append can be mocked without touching the real `evals/runs.jsonl`

### Requirement: Pipeline API wires eval logging

`handlePipelineRun` SHALL pass an `evalLogger` to `runPipeline` that records duration and invokes `appendEvalRun` on every successful completion (FR-EVALS-01).

#### Scenario: API run triggers append

- **WHEN** `POST /api/pipeline/run` completes a successful pipeline
- **THEN** `appendEvalRun` is invoked once with the final `PipelineResult` and measured `durationMs`

#### Scenario: Direct runPipeline calls without evalLogger

- **WHEN** `runPipeline` is called without `evalLogger` (e.g. unit tests)
- **THEN** no file append occurs
