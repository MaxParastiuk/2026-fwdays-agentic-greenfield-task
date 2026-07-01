# app-shell Specification

## MODIFIED Requirements

### Requirement: Pipeline status indicator in header

A pipeline-status indicator SHALL be visible in the header at all times and SHALL reflect the active pipeline run lifecycle: idle when no run is in progress, running while a pipeline API request is active, complete after a successful run, and error after a fatal pipeline failure (FR-SHELL-04).

#### Scenario: Idle on first load

- **WHEN** the page loads and no pipeline run is active
- **THEN** the status indicator shows the idle state with label "Idle"

#### Scenario: Running during pipeline API call

- **WHEN** the client has started `POST /api/pipeline/run` and the stream has not yet finished
- **THEN** the header status indicator shows the running state with label "Running"

#### Scenario: Complete after successful run

- **WHEN** the pipeline stream delivers a successful `result` event
- **THEN** the header status indicator shows the complete state with label "Complete"

#### Scenario: Error after fatal pipeline failure

- **WHEN** the pipeline stream delivers an `error` event or the run fails before a result
- **THEN** the header status indicator shows the error state with label "Error"

#### Scenario: Status component supports all lifecycle states

- **WHEN** `StatusIndicator` is rendered with `state` of `running`, `complete`, or `error`
- **THEN** it displays the corresponding visual treatment and default label (Running, Complete, Error)
