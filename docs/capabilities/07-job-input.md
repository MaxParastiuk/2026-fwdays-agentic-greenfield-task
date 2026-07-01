# Capability: Job posting input

**OpenSpec slug:** `07-job-input`  
**Depends on:** `01-foundation`, `05-app-shell`, `06-cv-upload` (shared run-button state)  
**Blocks:** `08-pipeline-api`

## Purpose

Accept job posting via URL scrape or pasted text; validate; preview; gate the run
button until CV + job text are valid.

## Requirements covered

| ID | Summary |
| -- | ------- |
| FR-JOB-01 | URL or paste mode via segmented toggle |
| FR-JOB-02 | Server fetch + cheerio body extraction |
| FR-JOB-03 | Collapsed 400-char preview |
| FR-JOB-04 | Fetch failure → inline “Could not fetch posting: paste the text instead.” |
| FR-JOB-05 | Zod validation on all API inputs |
| FR-JOB-06 | Paste max 32 KB |
| FR-JOB-07 | Run disabled until CV + job pass client Zod |

Also: TC-STACK-05, NFR-PERF-03.

## Scope

### In scope

- `SegmentedControl` URL vs paste
- `POST /api/job/fetch` for URL mode
- Paste mode uses client text directly (no scrape)
- Shared form state with CV panel for run enablement
- Run button UI (disabled/enabled); click handler stub until 08

### Out of scope

- Pipeline execution (08)
- Results (09)

## Acceptance criteria

1. Valid public URL returns body text and preview.
2. 404/timeout shows FR-JOB-04 message, no toast/page navigation.
3. Run button disabled with empty CV or job; enabled when both valid.
4. Paste > 32 KB rejected with field message.
5. `cheerio` not in client bundle.

## OpenSpec artifacts

- **Specs:** `specs/job-input/spec.md`

## Parallel work

Can run in parallel with `06-cv-upload` after shell; coordinate on shared page
state and run button component.
