# job-input Specification

## Purpose

Accept a job posting via URL scrape or pasted plain text, validate inputs, show a collapsed preview, and gate the run button until both CV and job text pass client-side Zod validation.

## Requirements

### Requirement: Dual job input paths

The application SHALL accept a job posting either as a URL or pasted plain text. A segmented control SHALL switch between URL and paste modes (FR-JOB-01). Both paths SHALL produce the same `jobText` string held in client state for downstream pipeline use.

#### Scenario: URL mode fetches jobText

- **WHEN** the visitor selects URL mode, enters a valid URL, and triggers fetch
- **THEN** the client sends JSON to `POST /api/job/fetch` and stores the returned `jobText` in client state

#### Scenario: Paste mode sets jobText directly

- **WHEN** the visitor selects paste mode and enters plain text that passes Zod validation
- **THEN** the client sets `jobText` in client state without calling the fetch API

#### Scenario: URL and paste modes are mutually exclusive active sources

- **WHEN** the visitor switches mode or clears the active input
- **THEN** `jobText` client state is cleared and the preview is hidden until a new valid input is provided

### Requirement: Server-side URL scraping

When a URL is provided, the server SHALL fetch the page and extract visible body text using `fetch` and `cheerio` inside `app/api/job/fetch/route.ts` or server-only `lib/job/` helpers only (FR-JOB-02, TC-STACK-05).

#### Scenario: URL scraped in API route

- **WHEN** `POST /api/job/fetch` receives a JSON body with a valid `url` per `jobFetchRequestSchema`
- **THEN** the route fetches the URL, extracts body text with cheerio, and returns `{ jobText: string }` matching `jobFetchResponseSchema`

#### Scenario: cheerio not in client bundle

- **WHEN** the production client bundle is built
- **THEN** `cheerio` does not appear in any client chunk (verified by import boundary or build analysis)

### Requirement: Read-only collapsed preview

After successful fetch or paste validation, the job panel SHALL show a read-only preview of the job text: first 400 characters, collapsed by default, expandable by the visitor (FR-JOB-03).

#### Scenario: Preview shows truncated text collapsed

- **WHEN** `jobText` is available and longer than 400 characters
- **THEN** the preview displays at most 400 characters with an affordance to expand the full text

#### Scenario: Preview hidden until jobText is valid

- **WHEN** no valid `jobText` is in client state
- **THEN** the collapsible preview is not shown

### Requirement: URL fetch failure messaging

If the URL is unreachable, times out, returns a non-2xx status, or yields no extractable text, the job panel SHALL show an inline error on the URL field: “Could not fetch posting: paste the text instead.” The application SHALL NOT navigate away or show a toast-only error (FR-JOB-04).

#### Scenario: Non-2xx response shows inline error

- **WHEN** `POST /api/job/fetch` receives a URL whose HTTP response status is not 2xx
- **THEN** the client displays “Could not fetch posting: paste the text instead.” on the URL field and does not update `jobText`

#### Scenario: Network failure shows inline error

- **WHEN** the fetch request fails due to network error or timeout
- **THEN** the client displays “Could not fetch posting: paste the text instead.” on the URL field

### Requirement: API input validation

All job fetch API inputs SHALL be validated with Zod before processing. Validation failures SHALL return structured 4xx responses with field-appropriate error messages (FR-JOB-05).

#### Scenario: Invalid URL rejected by schema

- **WHEN** `POST /api/job/fetch` receives a body that fails `jobFetchRequestSchema` (e.g. malformed URL)
- **THEN** the route returns 400 with an error message and does not call external fetch

#### Scenario: Valid URL proceeds to fetch

- **WHEN** the request body passes `jobFetchRequestSchema`
- **THEN** the route attempts to fetch and scrape the URL

### Requirement: Paste length limit

Pasted job text SHALL be capped at 32 KB (`TEXT_MAX_BYTES`). Longer input SHALL be rejected with a field-level validation message before `jobText` is set (FR-JOB-06).

#### Scenario: Paste within limit accepted

- **WHEN** the visitor pastes text of 32 KB or less that is non-empty
- **THEN** validation passes and `jobText` can be set

#### Scenario: Paste over limit rejected

- **WHEN** the visitor pastes text longer than 32 KB
- **THEN** the textarea shows a field-level error and `jobText` is not updated

### Requirement: Run button enablement

The “Generate cover letter” control SHALL remain disabled until both `cvText` and `jobText` pass client-side validation equivalent to `pipelineRunRequestSchema` (non-empty, each ≤ 32 KB). When both are valid, the control SHALL become enabled (FR-JOB-07).

#### Scenario: Run disabled with CV only

- **WHEN** `cvText` is valid and `jobText` is null or invalid
- **THEN** the run button is disabled

#### Scenario: Run disabled with job only

- **WHEN** `jobText` is valid and `cvText` is null or invalid
- **THEN** the run button is disabled

#### Scenario: Run enabled when both valid

- **WHEN** both `cvText` and `jobText` satisfy `pipelineRunRequestSchema`
- **THEN** the run button is enabled

#### Scenario: Run click is stub until pipeline API

- **WHEN** the visitor clicks the enabled run button before capability 08
- **THEN** no pipeline API call is made (handler stub only)

### Requirement: Job panel integration

The job input panel SHALL replace the app-shell job placeholder inside the `data-slot="job-panel"` region while preserving the shell layout and step labeling (FR-SHELL-03 structural slot).

#### Scenario: Job panel renders in shell slot

- **WHEN** the visitor loads `/`
- **THEN** the job region shows functional URL/paste controls instead of the inert placeholder message

#### Scenario: CV panel unchanged in behavior

- **WHEN** this capability is deployed
- **THEN** the CV panel continues to function as implemented in capability 06
