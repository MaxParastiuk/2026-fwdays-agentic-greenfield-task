# pipeline Specification

## MODIFIED Requirements

### Requirement: Eval logger error isolation

If an optional eval logger callback is provided and it throws or rejects, `runPipeline` SHALL still resolve with the `PipelineResult` and SHALL NOT propagate the logging error to the caller (FR-PIPE-06). The pipeline API handler SHALL supply an `evalLogger` on successful runs that appends to `evals/runs.jsonl` via the evals module (capability `10-evals-logging`).

#### Scenario: Throwing eval logger does not abort pipeline

- **WHEN** the loop completes successfully and `options.evalLogger` throws
- **THEN** `runPipeline` resolves with the assembled `PipelineResult`

#### Scenario: No eval logger is required

- **WHEN** `runPipeline` is called without an `evalLogger` option
- **THEN** it completes normally without attempting eval persistence

#### Scenario: API handler provides eval logger

- **WHEN** `handlePipelineRun` executes a successful pipeline
- **THEN** it passes an `evalLogger` callback to `runPipeline` that invokes eval file append
