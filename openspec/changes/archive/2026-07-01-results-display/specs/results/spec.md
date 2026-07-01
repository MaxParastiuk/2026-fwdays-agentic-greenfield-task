# results Specification

## Purpose

Display pipeline output to visitors: final cover letter with copy action, iteration timeline with score badges, gap analysis, live progress during runs, and fatal-error recovery (capability `09-results-display`).

## ADDED Requirements

### Requirement: Final letter panel

After a successful pipeline run, the application SHALL display the final cover letter in a styled, readable panel within the results region (FR-RESULTS-01).

#### Scenario: Letter shown on success

- **WHEN** `usePipelineRun` status becomes `complete` with a valid `PipelineResult`
- **THEN** the results region renders the `finalLetter` text in a styled letter panel

#### Scenario: Letter hidden while running

- **WHEN** status is `running`
- **THEN** the letter panel and iteration timeline are not shown

#### Scenario: Letter hidden on fatal error

- **WHEN** status is `error`
- **THEN** the letter panel and iteration timeline are not shown

### Requirement: Copy to clipboard

The letter panel SHALL include a control that copies the exact `finalLetter` text to the clipboard. After a successful copy, the control label SHALL change to “Copied” for 2 seconds, then revert (FR-RESULTS-02).

#### Scenario: Copy writes letter text

- **WHEN** the visitor activates the copy control
- **THEN** `navigator.clipboard.writeText` is called with the full `finalLetter` string

#### Scenario: Label resets after 2 seconds

- **WHEN** the visitor activates the copy control
- **THEN** the control label shows “Copied” and returns to the default label after 2000 ms

#### Scenario: Clipboard failure is silent

- **WHEN** clipboard write throws or is unavailable
- **THEN** the UI still shows the “Copied” feedback without surfacing an error toast

### Requirement: Iteration timeline with score badges

The application SHALL render an iteration timeline listing each iteration with a score badge and that iteration’s gap list. Badge color SHALL reflect score thresholds: green (pass) for scores ≥ 8, yellow (mid) for 5–7.9, red (fail) for scores < 5 (FR-RESULTS-03).

#### Scenario: All iterations listed

- **WHEN** a run completes with N iterations in `PipelineResult.iterations`
- **THEN** the timeline renders N rows in order with iteration numbers and scores

#### Scenario: Pass threshold styling

- **WHEN** an iteration score is 8.0 or higher
- **THEN** its badge uses the pass (green) tone class

#### Scenario: Mid threshold styling

- **WHEN** an iteration score is at least 5.0 and below 8.0
- **THEN** its badge uses the mid (yellow) tone class

#### Scenario: Fail threshold styling

- **WHEN** an iteration score is below 5.0
- **THEN** its badge uses the fail (red) tone class

#### Scenario: Per-iteration gaps in timeline

- **WHEN** an iteration record includes a non-empty `gaps` array
- **THEN** those gaps render as a bullet list in that timeline row

### Requirement: Final gap list under letter

The gap analysis for the final iteration SHALL render as a bullet list in a dedicated section beneath the cover letter panel (FR-RESULTS-04).

#### Scenario: Final gaps displayed

- **WHEN** `PipelineResult.gaps` is non-empty after a successful run
- **THEN** a “Gaps in final letter” section with bullet items appears below the letter panel

#### Scenario: Empty gaps omitted

- **WHEN** `PipelineResult.gaps` is empty
- **THEN** the final gap section is not rendered

### Requirement: Progress stream during run

While the pipeline runs, the results region SHALL display the latest streamed progress message from the pipeline API (FR-RESULTS-05).

#### Scenario: Progress message visible

- **WHEN** status is `running` and the stream emits a progress event
- **THEN** `ProgressStream` shows the latest human-readable message (e.g. “Iteration 1: writing…”)

#### Scenario: Progress uses polite live region

- **WHEN** the progress message updates
- **THEN** the element has `role="status"` and `aria-live="polite"`

#### Scenario: No progress placeholder before first event

- **WHEN** status is `running` and no progress message has arrived yet
- **THEN** the progress component renders nothing (or an empty state) without showing stale results

### Requirement: Fatal error banner and retry

If the pipeline fails fatally, the application SHALL show an error banner with a “Try again” action and SHALL NOT display partial letter or timeline content (FR-RESULTS-06).

#### Scenario: Error banner on fatal failure

- **WHEN** the stream emits an `error` event or the run hook sets status to `error`
- **THEN** `ErrorBanner` displays the error message with `role="alert"`

#### Scenario: Try again resets run state

- **WHEN** the visitor activates “Try again”
- **THEN** run state resets to idle (clears error, result, and progress) so inputs remain and the visitor can re-run

#### Scenario: No partial results on error

- **WHEN** status is `error`
- **THEN** `PipelineResultsView`, letter panel, and timeline are not rendered

### Requirement: Results brand footer

The letter panel footer SHALL show the iteration count and model identifier in small muted text, formatted as “N iterations · {modelId}” (or “1 iteration · {modelId}” when N is 1) (BC-BRAND-02).

#### Scenario: Footer shows count and model

- **WHEN** a successful result includes `iterations.length` and `modelId`
- **THEN** the letter footer displays both values separated by a middle dot

#### Scenario: Singular iteration label

- **WHEN** the pipeline completes in exactly one iteration
- **THEN** the footer uses “1 iteration” not “1 iterations”

### Requirement: Results accessibility

Interactive elements in the results UI SHALL have accessible names and visible focus styles per the design system (NFR-A11Y-01 partial).

#### Scenario: Copy button accessible name

- **WHEN** the copy control is in default state
- **THEN** it exposes an accessible name (visible label or `aria-label`) describing the copy action

#### Scenario: Score badge accessible label

- **WHEN** a score badge renders
- **THEN** it includes an `aria-label` with the numeric score out of 10

#### Scenario: Focus ring on interactive controls

- **WHEN** copy or retry controls receive keyboard focus
- **THEN** a visible focus indicator is applied via design-system `focus-ring` class
