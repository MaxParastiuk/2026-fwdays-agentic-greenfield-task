## ADDED Requirements

### Requirement: Pipeline runner function

The system SHALL export a single async function `runPipeline(cv: string, jobText: string, options?: PipelineRunOptions): Promise<PipelineResult>` from `pipeline/runner.ts` (FR-PIPE-01). The return type SHALL use `PipelineResult` from `lib/schemas`.

#### Scenario: Successful run returns PipelineResult

- **WHEN** `runPipeline` is called with non-empty `cv` and `jobText` and agents complete without throwing
- **THEN** it resolves to a `PipelineResult` object that satisfies `pipelineResultSchema`

#### Scenario: Inputs are passed to agents

- **WHEN** `runPipeline` executes an iteration
- **THEN** `makeCoverLetter` and `checkCoverLetter` receive the same `cv` and `jobText` arguments passed to `runPipeline`

### Requirement: Maker then Checker iteration loop

The pipeline SHALL call Maker to produce a letter, then Checker to score it. If `score < 8.0` and the current iteration number is less than 3, it SHALL call Maker again with the Checker `gaps` array as revision feedback and increment the iteration counter (FR-PIPE-02).

#### Scenario: Revision passes gaps as feedback

- **WHEN** iteration 1 Checker returns `score` less than 8.0 and a non-empty `gaps` array
- **THEN** iteration 2 calls `makeCoverLetter(cv, jobText, gaps)` with those gaps

#### Scenario: First iteration has no feedback

- **WHEN** iteration 1 begins
- **THEN** `makeCoverLetter` is called without a `feedback` argument

### Requirement: Loop exit conditions

The loop SHALL exit when `score ≥ 8.0` or after exactly 3 iterations, whichever comes first. If the score never reaches 8.0, `finalLetter` SHALL be the letter from the last iteration (FR-PIPE-03).

#### Scenario: Early exit on score 8 or above

- **WHEN** Checker returns `score` of 8.0 or higher on iteration N (where N is 1 or 2)
- **THEN** `runPipeline` stops without starting iteration N+1 and `iterations` has length N

#### Scenario: Three iterations when score stays below 8

- **WHEN** Checker returns scores below 8.0 on all three iterations
- **THEN** `runPipeline` performs exactly 3 Maker calls and 3 Checker calls and `iterations` has length 3

#### Scenario: Final letter is last draft

- **WHEN** the loop completes with Checker scores 5, 6, and 7 across three iterations
- **THEN** `finalLetter` equals the letter from iteration 3 and `finalScore` is 7

### Requirement: PipelineResult shape

`PipelineResult` SHALL contain `finalLetter: string`, `iterations: IterationRecord[]`, `finalScore: number`, and `gaps: string[]` where `gaps` and `finalScore` reflect the last Checker result (FR-PIPE-04).

#### Scenario: Result fields populated after one iteration

- **WHEN** the loop exits after one iteration with Checker score 9
- **THEN** `finalLetter` is the iteration-1 letter, `finalScore` is 9, `gaps` matches iteration-1 Checker gaps, and `iterations` has one record

### Requirement: IterationRecord shape

Each `IterationRecord` in `iterations` SHALL store `iteration: number` (1-based), `letter: string`, `score: number`, and `gaps: string[]` from that round's Checker result (FR-PIPE-05).

#### Scenario: Iteration record captures round data

- **WHEN** iteration 2 completes
- **THEN** `iterations[1]` has `iteration: 2`, `letter` equal to the Maker output for round 2, and `score`/`gaps` from the Checker result for that letter

### Requirement: Eval logger error isolation

If an optional eval logger callback is provided and it throws or rejects, `runPipeline` SHALL still resolve with the `PipelineResult` and SHALL NOT propagate the logging error to the caller (FR-PIPE-06 partial).

#### Scenario: Throwing eval logger does not abort pipeline

- **WHEN** the loop completes successfully and `options.evalLogger` throws
- **THEN** `runPipeline` resolves with the assembled `PipelineResult`

#### Scenario: No eval logger is required

- **WHEN** `runPipeline` is called without an `evalLogger` option
- **THEN** it completes normally without attempting eval persistence

### Requirement: Fatal agent failures propagate

If `makeCoverLetter` or `checkCoverLetter` throws (e.g. network or Gateway error), `runPipeline` SHALL reject with that error and SHALL NOT return a partial `PipelineResult` (FR-RESULTS-06 error taxonomy).

#### Scenario: Maker failure rejects pipeline

- **WHEN** `makeCoverLetter` throws during iteration 1
- **THEN** `runPipeline` rejects and does not return a `PipelineResult`

#### Scenario: Checker parse failure does not throw

- **WHEN** Checker returns the safe default `{ score: 0, gaps: [], rationale: '' }` without throwing
- **THEN** `runPipeline` continues the loop or exits per iteration rules without rejecting

### Requirement: Optional progress callback

`PipelineRunOptions` MAY include `onProgress` invoked before each Maker call (`phase: 'writing'`) and each Checker call (`phase: 'checking'`) with the 1-based `iteration` number, for use by the pipeline API streaming layer (capability 08).

#### Scenario: Progress events fire in order

- **WHEN** `onProgress` is provided and the loop runs two full iterations
- **THEN** `onProgress` is called with `{ phase: 'writing', iteration: 1 }`, then `{ phase: 'checking', iteration: 1 }`, then `{ phase: 'writing', iteration: 2 }`, then `{ phase: 'checking', iteration: 2 }` in that order

### Requirement: Pipeline module boundary

`pipeline/runner.ts` SHALL import `agents/maker` and `agents/checker` for orchestration and MUST NOT be imported by `agents/maker.ts` or `agents/checker.ts` (TC-ARCH-01). The pipeline module MUST NOT be imported from `"use client"` components (TC-ARCH-02).

#### Scenario: Runner imports only agents and lib

- **WHEN** static analysis or import-boundary tests inspect `pipeline/runner.ts`
- **THEN** imports resolve only to `agents/maker`, `agents/checker`, and `lib/` modules

#### Scenario: Agents do not import runner

- **WHEN** import-boundary tests inspect `agents/maker.ts` and `agents/checker.ts`
- **THEN** no import path resolves to `pipeline/runner`

### Requirement: Unit test coverage with mocked agents

The pipeline SHALL have Jest unit tests that mock `makeCoverLetter` and `checkCoverLetter` without calling the live AI Gateway (NFR-DX-01, capability acceptance criteria).

#### Scenario: Score 9 on iteration 1

- **WHEN** mocked Checker returns score 9 on the first check
- **THEN** `makeCoverLetter` is called once and `checkCoverLetter` is called once

#### Scenario: Scores 5, 6, 7 across three iterations

- **WHEN** mocked Checker returns scores 5, 6, and 7 on successive checks
- **THEN** `makeCoverLetter` is called three times, `finalScore` is 7, and `iterations` has length 3

#### Scenario: Score 8 on iteration 2 stops early

- **WHEN** mocked Checker returns score 5 on iteration 1 and score 8 on iteration 2
- **THEN** `makeCoverLetter` is called twice, `iterations` has length 2, and `finalScore` is 8
