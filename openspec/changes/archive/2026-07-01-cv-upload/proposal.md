## Why

The app shell (`05-app-shell`) provides layout slots but the CV panel is still an inert placeholder. Visitors cannot supply a CV—the first input required before a pipeline run. Capability `06-cv-upload` is Phase 4 of the MVP plan and unblocks `08-pipeline-api` by producing validated `cvText` client state from PDF upload or plain-text paste.

## What Changes

- Replace the CV `PanelPlaceholder` with a client `CvInputPanel`: `UploadZone` (PDF / plain-text file), paste `TextArea`, and `CollapsiblePreview` after successful parse (FR-CV-01, FR-CV-03)
- Add `POST /api/cv/parse` — multipart PDF upload path and JSON paste path; server-side `pdf-parse` only in the route handler (FR-CV-02, TC-STACK-04, NFR-SEC-02)
- Client-side validation before network: 5 MB file cap, MIME `application/pdf` and `text/plain` only, paste max 32 KB via existing `cvParseRequestSchema` / `TEXT_MAX_BYTES` (FR-CV-04, FR-CV-05, FR-CV-06)
- Hold parsed `cvText` in client state for later pipeline submit (wired in 07/08); run button remains disabled until job input lands in 07
- Add `pdf-parse` dependency (server-only); verify it never appears in the client bundle (NFR-PERF-03)

## Capabilities

### New Capabilities

- `cv-upload`: PDF or pasted CV input, client validation, `/api/cv/parse`, read-only collapsed text preview, and client `cvText` state (FR-CV-01 … FR-CV-06, TC-STACK-04, NFR-SEC-02)

### Modified Capabilities

- `app-shell`: CV panel slot switches from placeholder to functional `CvInputPanel`; empty-state hero may remain until both inputs are ready (no requirement change to shell layout—implementation swap only)

## Impact

- **New files:** `components/cv-input/` (or `components/forms/`) — `UploadZone`, `TextArea`, `CollapsiblePreview`, `CvInputPanel`; `app/api/cv/parse/route.ts`; optional `lib/cv/` parse helpers
- **Modified files:** `app/page.tsx` (swap CV placeholder for `CvInputPanel`); `package.json` (+ `pdf-parse`, `@types` if needed)
- **Existing contracts:** Reuses `cvParseRequestSchema`, `cvParseResponseSchema`, `parseCvParseRequest` from `lib/` (foundation)
- **Dependencies:** `pdf-parse` added; must not be imported from any `"use client"` module
- **Blocks:** `08-pipeline-api` (needs `cvText` from client state)
- **Out of scope:** Job posting input (07), pipeline run, run-button enablement rules (07), evals, deploy hardening
