## ADDED Requirements

### Requirement: Dual CV input paths

The application SHALL accept a CV as either a PDF file upload or pasted plain text. Both paths SHALL produce the same `cvText` string held in client state for downstream pipeline use (FR-CV-01).

#### Scenario: PDF upload produces cvText

- **WHEN** the visitor selects a valid PDF file under 5 MB
- **THEN** the client sends the file to `POST /api/cv/parse` and stores the returned `cvText` in client state

#### Scenario: Paste produces cvText

- **WHEN** the visitor enters plain text in the CV paste field and submits (blur or explicit parse action per design)
- **THEN** the client validates the text with `cvParseRequestSchema` and either uses the text directly or sends JSON to `POST /api/cv/parse` with the same `cvText` response shape

#### Scenario: Upload and paste are mutually exclusive active sources

- **WHEN** the visitor clears one input path (remove file or clear paste)
- **THEN** `cvText` client state is cleared and the preview is hidden until a new valid input is provided

### Requirement: Server-side PDF parsing

PDF files SHALL be parsed server-side using `pdf-parse` inside `app/api/cv/parse/route.ts` only. Raw file bytes SHALL NOT be processed in any `"use client"` module (FR-CV-02, TC-STACK-04).

#### Scenario: PDF parsed in API route

- **WHEN** `POST /api/cv/parse` receives a multipart request with a PDF file field
- **THEN** the route extracts text with `pdf-parse` and returns `{ cvText: string }` matching `cvParseResponseSchema`

#### Scenario: pdf-parse not in client bundle

- **WHEN** the production client bundle is built
- **THEN** `pdf-parse` does not appear in any client chunk (verified by import boundary or build analysis)

### Requirement: Read-only collapsed preview

After successful parse, the CV panel SHALL show a read-only preview of the extracted text: first 400 characters, collapsed by default, expandable by the visitor (FR-CV-03).

#### Scenario: Preview shows truncated text collapsed

- **WHEN** `cvText` is available and longer than 400 characters
- **THEN** the preview displays at most 400 characters with an affordance to expand the full text

#### Scenario: Preview hidden until parse succeeds

- **WHEN** no valid `cvText` is in client state
- **THEN** the collapsible preview is not shown

### Requirement: Client-side file size limit

Uploaded files SHALL be capped at 5 MB. Oversized files SHALL be rejected in the browser before any API call, with an inline error on the upload zone (FR-CV-04).

#### Scenario: Oversize file rejected client-side

- **WHEN** the visitor selects a file larger than 5 MB
- **THEN** the upload zone shows an inline error and no network request is made

#### Scenario: Valid size proceeds to API

- **WHEN** the visitor selects a PDF under 5 MB with an allowed MIME type
- **THEN** the client proceeds to call `POST /api/cv/parse`

### Requirement: Client-side MIME validation

For file uploads, accepted MIME types SHALL be `application/pdf` and `text/plain` only. Any other type SHALL be rejected client-side with an inline error (FR-CV-05).

#### Scenario: PDF accepted

- **WHEN** the visitor selects a file with MIME type `application/pdf`
- **THEN** the client accepts the file for upload (subject to size validation)

#### Scenario: Plain-text file accepted

- **WHEN** the visitor selects a file with MIME type `text/plain`
- **THEN** the client accepts the file for upload (subject to size validation)

#### Scenario: Wrong MIME rejected

- **WHEN** the visitor selects a file with any other MIME type (e.g. `application/msword`)
- **THEN** the upload zone shows an inline error and no API call is made

### Requirement: Paste length limit

Pasted CV text SHALL be capped at 32 KB (`TEXT_MAX_BYTES`). Longer input SHALL be rejected with a field-level validation message before parse (FR-CV-06).

#### Scenario: Paste within limit accepted

- **WHEN** the visitor pastes text of 32 KB or less
- **THEN** validation passes and `cvText` can be set after parse

#### Scenario: Paste over limit rejected

- **WHEN** the visitor pastes text longer than 32 KB
- **THEN** the textarea shows a field-level error and `cvText` is not updated

### Requirement: In-memory server processing

Uploaded file bytes SHALL be processed in memory within the request lifecycle and SHALL NOT be written to disk on the server (NFR-SEC-02).

#### Scenario: No disk persistence of uploads

- **WHEN** `POST /api/cv/parse` handles a PDF upload
- **THEN** the handler reads the file from the request buffer/stream only and does not call filesystem write APIs for the upload

### Requirement: CV panel integration

The CV input panel SHALL replace the app-shell CV placeholder inside the `data-slot="cv-panel"` region while preserving the shell layout and step labeling (FR-SHELL-03 structural slot).

#### Scenario: CV panel renders in shell slot

- **WHEN** the visitor loads `/`
- **THEN** the CV region shows functional upload and paste controls instead of the inert placeholder message

#### Scenario: Job panel unchanged

- **WHEN** this capability is deployed
- **THEN** the job posting region remains the existing placeholder until capability 07
