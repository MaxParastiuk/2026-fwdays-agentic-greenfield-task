# PRD: Job Application Agent

Last updated: 2026-06-29

This document is the **single source of truth** for what the product does and
what constraints govern it. Every requirement has a stable ID. Specs, tests,
PRs, and recordings reference these IDs to keep traceability intact.

Refer to [docs/product-brief.md](product-brief.md) for narrative context.

## ID conventions

| Prefix   | Meaning                    | Example                                           |
| -------- | -------------------------- | ------------------------------------------------- |
| `FR-*`   | Functional Requirement     | `FR-CV-01`: user uploads a PDF or plain-text CV   |
| `NFR-*`  | Non-Functional Requirement | `NFR-PERF-01`: pipeline completes in ≤60s       |
| `TC-*`   | Technical Constraint       | `TC-STACK-01`: Next.js 15 App Router              |
| `BC-*`   | Business / UX Constraint   | `BC-PRIVACY-01`: no analytics or trackers         |

Status values: `proposed` · `accepted` · `shipped` · `dropped`.

## Functional requirements

### Shell & navigation

| ID          | Description                                                                                                                       | Status   |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------- | -------- |
| FR-SHELL-01 | Single-page app with a top bar (logo, app name) and a main content area divided into input and results panels                       | proposed |
| FR-SHELL-02 | Layout adapts at 768px and 1280px breakpoints; mobile stacks CV panel then job panel in a single column; tablet and desktop use a two-column layout | proposed |
| FR-SHELL-03 | Empty state on first load: brief product description + CV upload and job posting inputs prominently centered                      | proposed |
| FR-SHELL-04 | A pipeline-status indicator (idle / running / done / error) is always visible in the header while a run is active                 | proposed |
| FR-SHELL-05 | Light and dark themes follow the visitor's system `prefers-color-scheme`; no in-app theme toggle in MVP                           | proposed |

### CV upload (capability `cv-upload`)

| ID       | Description                                                                                                              | Status   |
| -------- | ------------------------------------------------------------------------------------------------------------------------ | -------- |
| FR-CV-01 | User uploads a CV as a PDF file or pastes plain text into a textarea; both paths produce the same string payload         | proposed |
| FR-CV-02 | PDF files are parsed server-side via pdf-parse in an API route; raw file bytes never reach client-side code              | proposed |
| FR-CV-03 | After parsing, a read-only preview of the extracted text (first 400 chars, collapsed) is shown beneath the upload zone   | proposed |
| FR-CV-04 | File size is capped at 5 MB; oversized uploads are rejected client-side before the API call with an inline error message | proposed |
| FR-CV-05 | For file uploads, accepted MIME types are `application/pdf` and `text/plain`; any other type is rejected with an inline error | proposed |
| FR-CV-06 | Pasted CV text is capped at 32 KB; longer input is rejected with a field-level validation message                        | proposed |

### Job posting input (capability `job-input`)

| ID        | Description                                                                                                                     | Status   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------- | -------- |
| FR-JOB-01 | User provides a job posting either as a URL or as pasted plain text; a segmented toggle selects the input mode                | proposed |
| FR-JOB-02 | When a URL is provided, the server scrapes the page with fetch + cheerio and extracts the visible body text                     | proposed |
| FR-JOB-03 | Scraped or pasted job text is shown in a read-only collapsed preview (first 400 chars) before the pipeline run starts           | proposed |
| FR-JOB-04 | If the URL is unreachable or returns a non-2xx status, show an inline error: “Could not fetch posting: paste the text instead.” | proposed |
| FR-JOB-05 | All API inputs are validated with Zod before the pipeline route is invoked; validation errors surface as field-level messages | proposed |
| FR-JOB-06 | Pasted job text is capped at 32 KB; longer input is rejected with a field-level validation message                              | proposed |
| FR-JOB-07 | The run button stays disabled until both CV text and job text pass client-side Zod validation                                   | proposed |

### Maker agent (capability `maker-agent`)

| ID          | Description                                                                                                                  | Status   |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------- | -------- |
| FR-MAKER-01 | `agents/maker.ts` exports a single async function `makeCoverLetter(cv, jobText, feedback?): Promise<string>`                | proposed |
| FR-MAKER-02 | On iteration > 1, the Checker's gap list is appended to the prompt as explicit revision instructions                       | proposed |
| FR-MAKER-03 | The Maker calls `generateText` from the Vercel AI SDK via AI Gateway; model defaults to `google/gemini-2.0-flash`, overridable via `MODEL_ID` env (Gateway `provider/model` format) | proposed |
| FR-MAKER-04 | Output is a plain-text cover letter; the prompt enforces a 400-word maximum                                                  | proposed |
| FR-MAKER-05 | `agents/maker.ts` contains no import of `agents/checker.ts` or `pipeline/runner.ts`                                         | accepted |

### Checker agent (capability `checker-agent`)

| ID            | Description                                                                                                                                 | Status   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| FR-CHECKER-01 | `agents/checker.ts` exports `checkCoverLetter(cv, jobText, letter): Promise<CheckResult>`                                                   | proposed |
| FR-CHECKER-02 | `CheckResult` is a Zod-validated schema: `{ score: number (0–10), gaps: string[], rationale: string }`                                    | proposed |
| FR-CHECKER-03 | The Checker prompt instructs the model to respond only with valid JSON matching `CheckResult`; the response is parsed and validated        | proposed |
| FR-CHECKER-04 | If the model output fails Zod validation, the runner treats the iteration as score 0 and continues the loop; in development only, the failure is logged to the server console | proposed |
| FR-CHECKER-05 | `agents/checker.ts` contains no import of `agents/maker.ts` or `pipeline/runner.ts`                                                          | accepted |

### Pipeline loop (capability `pipeline`)

| ID         | Description                                                                                                                                  | Status   |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| FR-PIPE-01 | `pipeline/runner.ts` exports `runPipeline(cv, jobText): Promise<PipelineResult>`                                                           | proposed |
| FR-PIPE-02 | The loop calls Maker → Checker; if `score < 8.0` and `iteration < 3`, it re-calls Maker with the gap list and increments the counter       | proposed |
| FR-PIPE-03 | The loop exits when `score ≥ 8.0` or after 3 iterations, whichever comes first; if the score never reaches 8.0, `finalLetter` is the letter from the last iteration | proposed |
| FR-PIPE-04 | `PipelineResult` contains: `finalLetter: string`, `iterations: IterationRecord[]`, `finalScore: number`, `gaps: string[]`                    | proposed |
| FR-PIPE-05 | Each `IterationRecord` stores: `iteration: number`, `letter: string`, `score: number`, `gaps: string[]`                                      | proposed |
| FR-PIPE-06 | Write errors when appending to `evals/runs.jsonl` (see FR-EVALS-01) must not abort the pipeline or surface to the user                     | proposed |

Fatal pipeline failures (network error, AI Gateway or upstream LLM API error, or unrecoverable server fault) abort the run and trigger FR-RESULTS-06. Recoverable iteration failures (FR-CHECKER-04) do not.

### Results display (capability `results`)

| ID            | Description                                                                                                                                  | Status   |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| FR-RESULTS-01 | After the pipeline completes, the final cover letter is displayed in a styled, copyable text panel                                           | proposed |
| FR-RESULTS-02 | A “Copy to clipboard” button copies the final letter text; the label changes to “Copied” for 2s, then resets                                 | proposed |
| FR-RESULTS-03 | An iteration timeline shows each iteration's score as a colored badge (green ≥ 8, yellow 5–7.9, red < 5) alongside its gap list            | proposed |
| FR-RESULTS-04 | The gap analysis for the final iteration is rendered as a bullet list beneath the cover letter panel                                         | proposed |
| FR-RESULTS-05 | While the pipeline runs, progress is streamed to the UI via `streamText`: “Iteration N: writing…” then “Iteration N: checking…”            | proposed |
| FR-RESULTS-06 | If the pipeline fails fatally (see error taxonomy under Pipeline loop), an error banner appears with a “Try again” button; no partial results are shown | proposed |

### Evals logging (capability `evals`)

| ID          | Description                                                                                                                                  | Status   |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| FR-EVALS-01 | Each completed pipeline run appends exactly one JSONL record to `evals/runs.jsonl` (append-only, never truncated)                            | shipped |
| FR-EVALS-02 | Each record contains: `timestamp`, `iterationCount`, `finalScore`, `gaps` (Checker-derived labels only; no raw CV or job text), `modelId`, `durationMs` | shipped |
| FR-EVALS-03 | `evals/runs.jsonl` is listed in `.gitignore` and is never exposed via any API route or static asset path                                     | shipped |

## Non-functional requirements

| ID          | Description                                                                                                                          | Status   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| NFR-PERF-01 | End-to-end pipeline (3 iterations, cold start) completes in ≤60s under normal AI Gateway latency for the configured model                | proposed |
| NFR-PERF-02 | First Contentful Paint ≤1.5s on the Vercel production URL (mobile + desktop)                                                         | proposed |
| NFR-PERF-03 | Initial client JS payload ≤150 KB gzipped; pdf-parse and cheerio must never appear in the client bundle                                | shipped |
| NFR-A11Y-01 | Lighthouse Accessibility ≥ 95; all interactive elements have visible focus styles and accessible names                               | proposed |
| NFR-A11Y-02 | Color palette meets WCAG AA contrast ratio across both light and dark themes (see FR-SHELL-05)                                       | proposed |
| NFR-SEC-01  | LLM auth uses Vercel AI Gateway OIDC (`VERCEL_OIDC_TOKEN`, automatic on Vercel deploy) or, for local dev only, `AI_GATEWAY_API_KEY`; no provider API keys (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, etc.); never referenced via `NEXT_PUBLIC_*` or included in any client bundle | accepted |
| NFR-SEC-02  | Uploaded file bytes are processed in-memory within the request lifecycle and never written to disk on the server                     | shipped |
| NFR-OBS-01  | The browser console is silent at runtime (no warnings, no errors) on a healthy session; server-side diagnostic logs are permitted in development only | proposed |
| NFR-DX-01   | `npm run lint && tsc --noEmit && npm test && npm run build` finish in <90s on a clean checkout                                       | shipped |
| NFR-COST-01 | No paid third-party services beyond Vercel AI Gateway usage (monthly free credits, then pay-as-you-go at provider list price); all scraping and PDF parsing use open-source libraries only | accepted |

## Technical constraints

| ID           | Description                                                                                                                                    | Status   |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| TC-STACK-01  | Next.js 15 App Router; TypeScript strict; React 19                                                                                             | accepted |
| TC-STACK-02  | Tailwind CSS + shadcn/ui components; class-variance-authority for variant management                                                           | accepted |
| TC-STACK-03  | Vercel AI SDK (`ai`) with all LLM calls routed through Vercel AI Gateway; `generateText` for agents, `streamText` for UI progress streaming; model IDs use Gateway `provider/model` format | accepted |
| TC-STACK-04  | `pdf-parse` for PDF text extraction; must only be imported inside API routes, never by any `"use client"` module                             | accepted |
| TC-STACK-05  | `fetch` + `cheerio` for job URL scraping; runs server-side only inside API routes or Route Handlers                                            | accepted |
| TC-STACK-06  | Zod for validation of all API request bodies and of the Checker's JSON output; no `any` casts on validated data                                | accepted |
| TC-STACK-07  | Jest + React Testing Library for unit and integration tests; test coverage is required for `agents/`, `pipeline/`, and `lib/`                  | proposed |
| TC-ARCH-01   | `agents/maker.ts` and `agents/checker.ts` never import each other; `pipeline/runner.ts` is the sole orchestrator of both                       | accepted |
| TC-ARCH-02   | All AI Gateway LLM calls originate in `app/api/` route handlers; no AI SDK imports appear in `"use client"` components                       | accepted |
| TC-ARCH-03   | `lib/` is framework-free: no `next/*`, no `react`, no DOM globals; enables 100% unit-testability with Jest alone                               | proposed |
| TC-DEPLOY-01 | Vercel for hosting; OIDC for AI Gateway auth in production (no long-lived gateway key required); optional `AI_GATEWAY_API_KEY` for local dev via `vercel env pull`; preview URL generated per PR via Git integration | proposed |
| TC-DATA-01   | Evals storage follows FR-EVALS-01 through FR-EVALS-03                                                                                            | shipped |

## Business / UX constraints

| ID            | Description                                                                                                                                  | Status   |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| BC-PRIVACY-01 | No analytics, no third-party trackers, no fingerprinting                                                                                      | accepted |
| BC-PRIVACY-02 | CV text and job posting text are transmitted to Vercel AI Gateway (and the upstream model provider it routes to) only; they are never logged, stored, or cached server-side except as permitted in FR-EVALS-02 (Checker-derived gap labels in a local gitignored file) | accepted |
| BC-PRIVACY-03 | No cookies are set by the application code                                                                                                   | accepted |
| BC-BRAND-01   | UI tone is professional and action-oriented; no exclamation marks; copy focuses on agent output, not marketing hype                            | shipped |
| BC-BRAND-02   | The results panel credits the iteration count and model used (e.g., “3 iterations · google/gemini-2.0-flash”) in small muted text            | shipped |
| BC-DEMO-01    | The repo and live Vercel URL are the primary deliverables; every requirement is publicly demonstrable without authentication                  | accepted |

## Out of scope (MVP)

- User accounts, saved letters, or run history persisted server-side
- Support for DOCX or RTF CV formats
- Multi-language output (the cover letter is produced in the language of the job posting)
- Fine-tuned or self-hosted model variants
- LinkedIn, Workday, or ATS auto-submission integrations
- Batch processing of multiple job postings in a single session
- Mobile native app
- Historical analytics or aggregate dashboard over `evals/runs.jsonl`
