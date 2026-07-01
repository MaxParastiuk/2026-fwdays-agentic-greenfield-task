# Product Brief — Job Application Agent

> Companion to `docs/requirements.md`. The requirements document is the numbered,
> traceable source of truth; this brief is the business narrative behind it.
> Tone throughout the product is professional and action-oriented, with no
> exclamation marks and no marketing hype (BC-BRAND-01).

## What this is

Job Application Agent is a privacy-first, zero-auth web app that turns a CV and
a job posting into a tailored cover letter through a multi-agent AI pipeline.
The visitor uploads their CV (PDF or plain text), provides the job posting (URL
or pasted text), and triggers a Maker → Checker loop that iterates until the
letter scores at least 8 out of 10 or three iterations are exhausted. The final
output is the best letter the pipeline produced, alongside a per-iteration score
history and a plain-language gap analysis. There are no accounts, no stored data,
no cookies, and no paid services beyond Vercel AI Gateway usage (monthly free
credits, then pay-as-you-go at provider list price).

## Who it is for

The single actor is an **anonymous visitor applying for a job**. There are no
roles, no sign-in, and no stored profile. The visitor arrives with a CV and a
target role, runs the pipeline, copies the letter, and leaves; nothing about them
is persisted server-side, and nothing is set in their browser by the application.
Anyone who can open the live URL is a full user — the repo and the Vercel
deployment are the project's primary, publicly demonstrable artifacts
(BC-DEMO-01).

## The pain it addresses

Writing a tailored cover letter for each application is slow and repetitive.
Generic letters fail to address the specific language and priorities of each job
posting, but iterating manually — read the posting, write a draft, identify gaps,
revise — can take an hour per application. Most AI writing tools produce a first
draft with no feedback loop; the visitor is left to judge quality themselves and
has no structured view of what is still missing.

This product replaces that manual loop with an automated agent pair. The Maker
writes the letter, the Checker scores it against both the CV and the posting and
names every gap, and the loop repeats up to three times. The visitor arrives with
two documents and leaves with the strongest letter the pipeline can produce in a
single run, together with a transparent record of how that letter evolved.

## End-to-end usage

1. **Land.** On first load the visitor sees a two-panel input interface: CV
   upload on the left, job posting input on the right, and a run button beneath
   them. The header shows the app name and an idle pipeline-status indicator
   (FR-SHELL-01/03/04). There is no default content; nothing runs until the
   visitor explicitly submits both inputs.
2. **Provide the CV.** The visitor either drags a PDF into the upload zone or
   switches to a textarea and pastes plain text. Both paths produce the same
   string payload passed to the pipeline (FR-CV-01). PDFs are parsed server-side
   via pdf-parse inside an API route; the raw bytes never reach the client
   (FR-CV-02). After upload a collapsed preview shows the first 400 characters
   of extracted text so the visitor can confirm the parse succeeded (FR-CV-03).
   Files over 5 MB or of unsupported type are rejected client-side with an inline
   error before any network call is made (FR-CV-04/05).
3. **Provide the job posting.** The visitor selects URL or paste mode with a
   segmented toggle, then provides the posting (FR-JOB-01). When a URL is
   given, the server scrapes the page with fetch + cheerio and extracts the
   visible body text (FR-JOB-02). A collapsed preview of the first 400 characters
   is shown for confirmation (FR-JOB-03). If the URL is unreachable or returns a
   non-2xx status, an inline message prompts the visitor to paste the text instead
   — no error page, no toast (FR-JOB-04). All inputs are validated with Zod
   before the pipeline route is invoked (FR-JOB-05).
4. **Run the pipeline.** The run button stays disabled until both inputs pass
   validation (FR-JOB-07). The visitor presses "Generate cover letter". The API
   route invokes `pipeline/runner.ts`, which calls the Maker agent, then the
   Checker agent, in a loop (FR-PIPE-01/02). The Maker produces a plain-text
   cover letter of at most 400 words (FR-MAKER-04); the Checker responds with a
   Zod-validated JSON object containing a score from 0 to 10, a list of gaps, and
   a one-sentence rationale (FR-CHECKER-01/02). If the score is below 8.0 and
   fewer than three iterations have run, the runner passes the gap list back to
   the Maker as explicit revision instructions and repeats (FR-PIPE-02/03). While
   the loop runs, progress is streamed to the UI: "Iteration N: writing…" then
   "Iteration N: checking…" (FR-RESULTS-05). The pipeline-status indicator in the
   header reflects the running state throughout (FR-SHELL-04).
5. **Read the results.** When the pipeline completes, the final cover letter
   appears in a styled text panel (FR-RESULTS-01). A "Copy to clipboard" button
   copies the full text; its label changes to "Copied" for two seconds then
   resets (FR-RESULTS-02). Below the letter, an iteration timeline shows each
   round's score as a colored badge — green for 8 or above, yellow for 5–7.9, red
   below 5 — with its gap list collapsed underneath (FR-RESULTS-03). The gap
   analysis for the final iteration is also rendered as a bullet list directly
   beneath the letter panel for immediate reference (FR-RESULTS-04). A small line
   of muted text credits the iteration count and the model used, for example
   "3 iterations · google/gemini-2.0-flash" (BC-BRAND-02).
6. **Handle failure.** A Checker Zod parse failure is treated as a score of 0 and
   the loop continues rather than aborting (FR-CHECKER-04). Fatal failures (a
   network error, an AI Gateway or upstream LLM API error, or an unrecoverable
   server fault) show
   an error banner with a "Try again" button and no partial results
   (FR-RESULTS-06). Write failures to the evals log are swallowed so they never
   surface to the visitor (FR-PIPE-06).
7. **Evals record.** Once a run completes, the runner appends one JSONL line to
   `evals/runs.jsonl` containing the timestamp, iteration count, final score,
   Checker-derived gap labels (no raw CV or job text), model ID, and wall-clock
   duration (FR-EVALS-01/02). This file is
   gitignored and never served via any route; it exists only for local inspection
   and offline analysis (FR-EVALS-03).

## Key workflows in prose

- **Standard run.** Upload a PDF CV, paste a job posting URL, press run. The
  pipeline iterates up to three times; the visitor reads the final letter, checks
  the score timeline to understand how the letter improved, and copies the result.
  This is the core loop and the entire MVP supports it.
- **Paste-only run.** When the visitor cannot share a URL (intranet postings,
  PDF job descriptions) they switch both inputs to textarea mode, paste the CV
  text and the job text, and run identically. No difference in pipeline behaviour;
  the server-side scraping path is simply skipped.
- **Gap-driven revision audit.** After a run the visitor reads the gap list for
  each iteration to understand what the Checker found missing. Even if the score
  reached 8.0 on the first attempt, the rationale and gap list of that single
  iteration are visible and can inform further manual editing before submission.
- **Re-run with an updated CV.** The visitor edits their CV text in the textarea
  (for example, adding a missing skill the gap list surfaced), pastes the same job
  posting, and runs again. There is no state to clear — refreshing the page resets
  everything and a new run begins cleanly.

## MVP vs Future boundary

**In the MVP:** the two-panel shell and responsive layout, the pipeline-status
header indicator, CV upload accepting PDF and plain text with server-side parsing
and a collapsed preview, job posting input accepting URL (scraped server-side) or
pasted text with a collapsed preview, full Zod validation of all inputs, the Maker
agent writing up to 400-word cover letters, the Checker agent returning a
Zod-validated score and gap list, the Maker → Checker loop running up to 3
iterations with a score target of 8.0, streaming progress updates during the run,
the results panel with copy-to-clipboard, the iteration score timeline with
colored badges, the final gap analysis bullet list, the evals JSONL logger, and
error handling that degrades gracefully without partial results.

**Future (deferred):**

- The PRD's explicit **out-of-scope** list, none of which is built:
  - user accounts, saved letters, or run history persisted server-side;
  - support for DOCX or RTF CV formats;
  - multi-language output (the letter is produced in the language of the posting);
  - fine-tuned or self-hosted model variants;
  - LinkedIn, Workday, or ATS auto-submission integrations;
  - batch processing of multiple job postings in a single session;
  - a native mobile app;
  - historical analytics or an aggregate dashboard over `evals/runs.jsonl`.

## Operating principles

- **Privacy-first.** No analytics, no third-party trackers, no fingerprinting, no
  application-set cookies. CV text and job posting text are transmitted only to
  Vercel AI Gateway (and the upstream model provider it routes to) and are never
  logged, stored, or cached server-side beyond the request lifecycle
  (BC-PRIVACY-01/02/03).
- **Key security.** Production uses Vercel AI Gateway OIDC (`VERCEL_OIDC_TOKEN`,
  provisioned automatically on deploy). Local development may use `vercel env pull`
  for a short-lived OIDC token or an optional `AI_GATEWAY_API_KEY`; no direct
  provider API keys. Credentials are never referenced via `NEXT_PUBLIC_*` or
  included in any client bundle (NFR-SEC-01). File bytes are processed in-memory
  and never written to disk (NFR-SEC-02).
- **Honest under failure.** No AI call, scrape, or parse failure produces a silent
  blank or a generic error page. Each failure degrades to a named, visible state
  that tells the visitor what went wrong and what to try next. The runtime console
  stays silent on a healthy session (NFR-OBS-01).
- **Transparent AI.** The iteration count, model name, per-iteration scores, and
  gap lists are all shown in the results view. The visitor always knows how many
  rounds ran and what the agent found lacking at each step (BC-BRAND-02).
- **Zero-ops.** No database, no Docker, no infrastructure to maintain. The app
  deploys to Vercel from the repo; AI Gateway auth is automatic in production via
  OIDC. For local dev, run `vercel link` and `vercel env pull` (or set an optional
  `AI_GATEWAY_API_KEY`). A preview URL is generated automatically per pull request
  (TC-DEPLOY-01).