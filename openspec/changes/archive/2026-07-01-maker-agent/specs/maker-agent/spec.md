## ADDED Requirements

### Requirement: Maker cover letter function

The system SHALL export a single async function `makeCoverLetter(cv: string, jobText: string, feedback?: string[]): Promise<string>` from `agents/maker.ts` (FR-MAKER-01).

#### Scenario: First iteration without feedback

- **WHEN** `makeCoverLetter` is called with non-empty `cv` and `jobText` and no `feedback` argument
- **THEN** it resolves to a non-empty string representing a cover letter

#### Scenario: Revision iteration with feedback

- **WHEN** `makeCoverLetter` is called with a non-empty `feedback` string array
- **THEN** it resolves to a non-empty string and the model prompt includes each gap as an explicit revision instruction (FR-MAKER-02)

### Requirement: Plain-text output with word limit

The Maker prompt SHALL instruct the model to return only plain-text cover letter content with a maximum of 400 words (FR-MAKER-04). The function SHALL return the `generateText` result text trimmed of leading and trailing whitespace.

#### Scenario: Output is plain text

- **WHEN** `makeCoverLetter` completes successfully
- **THEN** the returned string contains no markdown code fences or JSON wrapper from the model response handling layer

#### Scenario: Prompt enforces word limit

- **WHEN** the Maker builds the model prompt for any call
- **THEN** the prompt text includes an instruction that the cover letter MUST NOT exceed 400 words

### Requirement: AI Gateway integration

The Maker SHALL call `generateText` from the Vercel AI SDK (`ai` package) with the model routed through Vercel AI Gateway (FR-MAKER-03, TC-STACK-03). The default model ID SHALL be `google/gemini-2.0-flash`. The model ID SHALL be overridable via the `MODEL_ID` environment variable using Gateway `provider/model` format.

#### Scenario: Default model when MODEL_ID unset

- **WHEN** `MODEL_ID` is not set in the environment
- **THEN** `generateText` is invoked with model `google/gemini-2.0-flash`

#### Scenario: MODEL_ID override

- **WHEN** `MODEL_ID` is set to a valid Gateway model string (e.g. `openai/gpt-4o-mini`)
- **THEN** `generateText` is invoked with that model ID

#### Scenario: Gateway authentication

- **WHEN** `makeCoverLetter` runs on Vercel or locally with valid Gateway credentials (`VERCEL_OIDC_TOKEN` or `AI_GATEWAY_API_KEY`)
- **THEN** the AI SDK uses Gateway routing without requiring provider-specific API keys in application code (NFR-SEC-01)

### Requirement: Model ID export for attribution

The Maker module SHALL export a function or constant accessor (e.g. `getMakerModelId()`) that returns the resolved model ID string used for `generateText`, so the pipeline and results UI can display model attribution (BC-BRAND-02).

#### Scenario: Resolved model ID matches invocation

- **WHEN** `getMakerModelId()` is called in an environment where `MODEL_ID` is unset
- **THEN** it returns `google/gemini-2.0-flash`

### Requirement: Agent module boundary

`agents/maker.ts` MUST NOT import `agents/checker.ts` or `pipeline/runner.ts` (FR-MAKER-05, TC-ARCH-01). LLM calls in the Maker MUST remain server-side only; the Maker module MUST NOT be imported from `"use client"` components (TC-ARCH-02).

#### Scenario: No checker or pipeline imports

- **WHEN** static analysis or the agent import-boundary test inspects `agents/maker.ts`
- **THEN** no import path resolves to `agents/checker` or `pipeline/runner`

#### Scenario: Maker not bundled in client

- **WHEN** the Next.js production build completes
- **THEN** `agents/maker.ts` is not included in any client JavaScript bundle

### Requirement: Unit test coverage

The project MUST include Jest unit tests for `makeCoverLetter` that mock `generateText` and do not require live Gateway credentials (NFR-DX-01, capability acceptance criteria).

#### Scenario: Happy path unit test

- **WHEN** `npm test` runs with `generateText` mocked to return a sample letter
- **THEN** `makeCoverLetter(cv, jobText)` resolves to that letter text

#### Scenario: Feedback path unit test

- **WHEN** `npm test` runs with `generateText` mocked and `feedback` provided
- **THEN** the test asserts the prompt or messages passed to `generateText` contain each feedback gap string

#### Scenario: Optional integration test skipped without credentials

- **WHEN** `npm test` runs without `AI_GATEWAY_API_KEY` and without `VERCEL_OIDC_TOKEN`
- **THEN** any live Gateway integration test is skipped and unit tests still pass
