## Why

CV upload (`06-cv-upload`) is live, but the job posting panel is still an inert placeholder. Visitors cannot supply the second required input before a pipeline run. Capability `07-job-input` is Phase 4 of the MVP plan and unblocks `08-pipeline-api` by producing validated `jobText` client state from URL scrape or plain-text paste, plus shared run-button enablement when both inputs are valid.

## What Changes

- Replace the job `PanelPlaceholder` with a client `JobInputPanel`: `SegmentedControl` for URL vs paste, URL fetch flow, paste `TextArea`, and `CollapsiblePreview` after successful fetch or validation (FR-JOB-01, FR-JOB-03)
- Add `POST /api/job/fetch` — JSON body with `url`; server-side `fetch` + `cheerio` body text extraction (FR-JOB-02, TC-STACK-05)
- Inline fetch failure message: “Could not fetch posting: paste the text instead.” — no toast or page navigation (FR-JOB-04)
- Client-side Zod validation on URL and paste; paste capped at 32 KB via existing `TEXT_MAX_BYTES` / `pipelineRunRequestSchema` patterns (FR-JOB-05, FR-JOB-06)
- Lift CV + job text to shared page state; run button enabled only when both pass client-side Zod validation (FR-JOB-07)
- Add `cheerio` dependency (server-only); verify it never appears in the client bundle (NFR-PERF-03)
- Replace `RunPlaceholder` with a functional run button (click handler stub until 08)

## Capabilities

### New Capabilities

- `job-input`: URL or pasted job posting input, client validation, `/api/job/fetch`, read-only collapsed text preview, shared run-button enablement with CV panel (FR-JOB-01 … FR-JOB-07, TC-STACK-05)

### Modified Capabilities

- `app-shell`: Job panel slot switches from placeholder to functional `JobInputPanel`; run region switches from disabled placeholder to state-aware run button (no layout requirement change—implementation swap only)

## Impact

- **New files:** `components/job-input/` — `JobInputPanel`; `app/api/job/fetch/route.ts`; optional `lib/job/` fetch/scrape helpers
- **Modified files:** `app/page.tsx` (lift shared state, swap job placeholder, wire run button); `package.json` (+ `cheerio`); `next.config.ts` (possible `serverExternalPackages`)
- **Existing contracts:** Reuses `jobFetchRequestSchema`, `jobFetchResponseSchema`, `pipelineRunRequestSchema`, `TEXT_MAX_BYTES` from `lib/` (foundation); `CvInputPanel` already exposes `onCvTextChange`
- **Dependencies:** `cheerio` added; must not be imported from any `"use client"` module
- **Blocks:** `08-pipeline-api` (needs `cvText` + `jobText` from client state)
- **Out of scope:** Pipeline execution (08), results UI (09), evals, deploy hardening
