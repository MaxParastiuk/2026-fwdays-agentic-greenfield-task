## ADDED Requirements

### Requirement: Checker cover letter function

The system SHALL export a single async function `checkCoverLetter(cv: string, jobText: string, letter: string): Promise<CheckResult>` from `agents/checker.ts` (FR-CHECKER-01). The return type SHALL use the `CheckResult` type from `lib/schemas`.

#### Scenario: Successful check returns structured result

- **WHEN** `checkCoverLetter` is called with non-empty `cv`, `jobText`, and `letter` and the model returns valid JSON matching `CheckResult`
- **THEN** it resolves to an object with `score` (0–10), `gaps` (string array), and `rationale` (string)

#### Scenario: Score within valid range

- **WHEN** the model returns a valid `CheckResult` with `score` between 0 and 10 inclusive
- **THEN** `checkCoverLetter` resolves with that score unchanged

### Requirement: JSON-only model response

The Checker prompt SHALL instruct the model to respond only with valid JSON matching the `CheckResult` shape: `{ score, gaps, rationale }` (FR-CHECKER-02, FR-CHECKER-03). The function SHALL parse the model text as JSON and validate with `checkResultSchema` (via `safeParseCheckResult` or equivalent from `lib/validation`).

#### Scenario: Prompt requires JSON only

- **WHEN** the Checker builds the model prompt for any call
- **THEN** the prompt text instructs the model to output only a JSON object with `score`, `gaps`, and `rationale` fields

#### Scenario: Valid JSON is validated

- **WHEN** `generateText` returns text that parses to a valid `CheckResult` object
- **THEN** `checkCoverLetter` resolves to the validated `CheckResult` data

### Requirement: Graceful validation failure

If model output fails JSON parsing or Zod validation, `checkCoverLetter` SHALL NOT throw. It SHALL return a safe default `CheckResult` with `score: 0`, `gaps: []`, and `rationale: ''` so the pipeline can continue the loop (FR-CHECKER-04).

#### Scenario: Invalid JSON returns score zero

- **WHEN** the model returns text that is not valid JSON
- **THEN** `checkCoverLetter` resolves to `{ score: 0, gaps: [], rationale: '' }`

#### Scenario: JSON failing Zod validation returns score zero

- **WHEN** the model returns JSON that does not satisfy `checkResultSchema` (e.g. missing fields, score out of range)
- **THEN** `checkCoverLetter` resolves to `{ score: 0, gaps: [], rationale: '' }`

#### Scenario: Development-only failure logging

- **WHEN** validation fails and `NODE_ENV` is `development`
- **THEN** the Checker logs the failure to the server console (e.g. `console.error`) at least once

#### Scenario: No logging outside development on validation failure

- **WHEN** validation fails and `NODE_ENV` is not `development`
- **THEN** the Checker does not log the validation failure to the console

### Requirement: AI Gateway integration

The Checker SHALL call `generateText` from the Vercel AI SDK (`ai` package) with the model routed through Vercel AI Gateway (TC-STACK-03). The default model ID SHALL be `google/gemini-2.0-flash`. The model ID SHALL be overridable via the `MODEL_ID` environment variable using Gateway `provider/model` format.

#### Scenario: Default model when MODEL_ID unset

- **WHEN** `MODEL_ID` is not set in the environment
- **THEN** `generateText` is invoked with model `google/gemini-2.0-flash`

#### Scenario: MODEL_ID override

- **WHEN** `MODEL_ID` is set to a valid Gateway model string
- **THEN** `generateText` is invoked with that model ID

#### Scenario: Gateway authentication

- **WHEN** `checkCoverLetter` runs on Vercel or locally with valid Gateway credentials (`VERCEL_OIDC_TOKEN` or `AI_GATEWAY_API_KEY`)
- **THEN** the AI SDK uses Gateway routing without requiring provider-specific API keys in application code (NFR-SEC-01)

### Requirement: Agent module boundary

`agents/checker.ts` MUST NOT import `agents/maker.ts` or `pipeline/runner.ts` (FR-CHECKER-05, TC-ARCH-01). LLM calls in the Checker MUST remain server-side only; the Checker module MUST NOT be imported from `"use client"` components (TC-ARCH-02).

#### Scenario: No maker or pipeline imports

- **WHEN** static analysis or the agent import-boundary test inspects `agents/checker.ts`
- **THEN** no import path resolves to `agents/maker` or `pipeline/runner`

#### Scenario: Checker not bundled in client

- **WHEN** the Next.js production build completes
- **THEN** `agents/checker.ts` is not included in any client JavaScript bundle

### Requirement: Unit test coverage

The project MUST include Jest unit tests for `checkCoverLetter` that mock `generateText` and do not require live Gateway credentials (NFR-DX-01, capability acceptance criteria).

#### Scenario: Happy path unit test

- **WHEN** `npm test` runs with `generateText` mocked to return valid `CheckResult` JSON
- **THEN** `checkCoverLetter(cv, jobText, letter)` resolves to the parsed `CheckResult`

#### Scenario: Invalid output unit test

- **WHEN** `npm test` runs with `generateText` mocked to return non-JSON or schema-invalid text
- **THEN** `checkCoverLetter` resolves to `{ score: 0, gaps: [], rationale: '' }` without throwing

#### Scenario: Optional integration test skipped without credentials

- **WHEN** `npm test` runs without `AI_GATEWAY_API_KEY` and without `VERCEL_OIDC_TOKEN`
- **THEN** any live Gateway integration test is skipped and unit tests still pass
