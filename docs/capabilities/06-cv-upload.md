# Capability: CV upload

**OpenSpec slug:** `06-cv-upload`  
**Depends on:** `01-foundation`, `05-app-shell`  
**Blocks:** `08-pipeline-api`

## Purpose

Accept PDF or pasted plain text; extract text server-side; show collapsed preview.

## Requirements covered

| ID | Summary |
| -- | ------- |
| FR-CV-01 | PDF upload or paste → same string payload |
| FR-CV-02 | pdf-parse in API route only |
| FR-CV-03 | Read-only preview, first 400 chars, collapsed |
| FR-CV-04 | 5 MB client-side cap + inline error |
| FR-CV-05 | MIME `application/pdf` and `text/plain` only |
| FR-CV-06 | Paste max 32 KB |

Also: TC-STACK-04, NFR-SEC-02, NFR-PERF-03 (no pdf-parse in client bundle).

## Scope

### In scope

- Client: `UploadZone`, paste `TextArea`, `CollapsiblePreview`
- `POST /api/cv/parse` (multipart or JSON for paste)
- Client Zod validation before API call
- CV text held in client state for pipeline submit (07 enables run button)

### Out of scope

- Pipeline run (08)
- Job posting (07)

## Acceptance criteria

1. Valid PDF < 5 MB → preview shows extracted text prefix.
2. Oversize file rejected before network; inline error visible.
3. Wrong MIME rejected client-side.
4. Paste > 32 KB shows field error.
5. `pdf-parse` appears only in server bundle (build analysis or import lint).

## OpenSpec artifacts

- **Specs:** `specs/cv-upload/spec.md`

## Parallel work

Can run in parallel with `07-job-input` after `05-app-shell`.
