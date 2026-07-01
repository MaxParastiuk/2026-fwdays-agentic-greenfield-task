# MVP Capability Plan

Last updated: 2026-07-01

This document splits [`requirements.md`](requirements.md) into implementable capabilities
and defines the order in which each becomes an OpenSpec change. Use it before
`/opsx:new` or `openspec new change`.

**Source of truth for requirement IDs:** `docs/requirements.md`  
**Narrative context:** `docs/product-brief.md`  
**Per-capability detail:** `docs/capabilities/`

---

## Capability inventory

| Order | OpenSpec slug        | Capability        | Primary requirement IDs                          | Demo milestone                                      |
| ----- | -------------------- | ----------------- | ------------------------------------------------ | --------------------------------------------------- |
| 01    | `01-foundation`      | Foundation        | TC-STACK-*, TC-ARCH-03, TC-STACK-07, NFR-DX-01   | `npm test` passes; shared Zod types exist           |
| 02    | `02-maker-agent`     | Maker agent       | FR-MAKER-01 … FR-MAKER-05                        | Unit-tested `makeCoverLetter()`                     |
| 03    | `03-checker-agent`   | Checker agent     | FR-CHECKER-01 … FR-CHECKER-05                    | Unit-tested `checkCoverLetter()` + `CheckResult`    |
| 04    | `04-pipeline`        | Pipeline loop     | FR-PIPE-01 … FR-PIPE-05, FR-PIPE-06 (partial)   | Unit-tested `runPipeline()` with mocked LLM         |
| 05    | `05-app-shell`       | Shell & navigation| FR-SHELL-01 … FR-SHELL-05, BC-BRAND-01           | Responsive two-panel layout, empty state, themes    |
| 06    | `06-cv-upload`       | CV upload         | FR-CV-01 … FR-CV-06, TC-STACK-04, NFR-SEC-02     | PDF/text CV → preview via API                       |
| 07    | `07-job-input`       | Job posting input | FR-JOB-01 … FR-JOB-07, TC-STACK-05               | URL scrape or paste → preview                       |
| 08    | `08-pipeline-api`    | Pipeline API      | FR-RESULTS-05, TC-ARCH-02, TC-STACK-03, NFR-SEC-01 | Streamed run from validated inputs              |
| 09    | `09-results-display` | Results display   | FR-RESULTS-01 … FR-RESULTS-04, FR-RESULTS-06, BC-BRAND-02 | Full results UI with copy & timeline      |
| 10    | `10-evals-logging`   | Evals logging     | FR-EVALS-01 … FR-EVALS-03, FR-PIPE-06, TC-DATA-01 | JSONL append on completion; gitignored          |
| 11    | `11-deploy-hardening`| Deploy & quality  | TC-DEPLOY-01, NFR-PERF-*, NFR-A11Y-*, NFR-OBS-01 | Production URL meets perf/a11y targets          |

Cross-cutting constraints (`BC-PRIVACY-*`, `BC-DEMO-01`, `NFR-COST-01`, accepted
`TC-ARCH-01/02`, `NFR-SEC-01`) apply from capability 01 onward and are validated
again in `11-deploy-hardening`.

---

## Implementation order

Capabilities are numbered by **recommended build sequence**. Later items depend on
earlier ones unless marked parallel.

```
01-foundation
    ├── 02-maker-agent ──┐
    └── 03-checker-agent ┴──► 04-pipeline ──► 08-pipeline-api ──► 09-results-display
                                      │                    ▲
05-app-shell ──► 06-cv-upload ────────┴──► 07-job-input ──┘
                                                      │
04-pipeline ──────────────────────────────────────────┴──► 10-evals-logging
All shipped capabilities ────────────────────────────────► 11-deploy-hardening
```

### Phase 0 — Tooling & contracts (01)

Establish `lib/` (framework-free), shared Zod schemas (`CheckResult`,
`PipelineResult`, API request bodies), Jest setup, and `evals/` gitignore entry.
Nothing user-visible yet; every later capability imports from here.

### Phase 1 — Agent core (02, 03) — parallel OK

Implement and unit-test `agents/maker.ts` and `agents/checker.ts` independently.
No cross-imports (TC-ARCH-01). Use AI Gateway in integration tests only when
credentials are available; prefer mocked `generateText` in unit tests.

**Parallel:** 02 and 03 can be separate OpenSpec changes worked concurrently.

### Phase 2 — Orchestration (04)

`pipeline/runner.ts` wires Maker → Checker loop (score threshold 8.0, max 3
iterations). Unit-test with stubbed agents. Evals write failures are out of scope
until 10 but the runner interface should not throw on logging errors (FR-PIPE-06).

### Phase 3 — Application shell (05)

Ship the responsive layout, header with pipeline-status placeholder, empty state,
and system theme (FR-SHELL-*, BC-BRAND-01). Input and results regions are
structural placeholders—no pipeline wiring yet.

### Phase 4 — Input panels (06, 07) — parallel OK after 05

- **06-cv-upload:** client upload zone, validation, `/api/cv/parse` (pdf-parse
  server-only).
- **07-job-input:** segmented URL/paste toggle, `/api/job/fetch` (cheerio),
  shared Zod validation, run-button enablement rules (FR-JOB-07).

Both need 01 (schemas) and 05 (layout slots). Neither needs 04 yet.

**Parallel:** 06 and 07 after 05 completes.

### Phase 5 — End-to-end API (08)

Single pipeline route handler: validate body → `runPipeline` → `streamText` progress
chunks (“Iteration N: writing…”, “Iteration N: checking…”). Connects 04 + 06 + 07
payloads. Header status indicator goes live (FR-SHELL-04).

### Phase 6 — Results UI (09)

Consume streamed/final pipeline output: letter panel, copy button, iteration
timeline, gap list, fatal error banner (FR-RESULTS-01 … 06). Depends on 08’s
stream contract.

### Phase 7 — Observability file (10)

Append-only `evals/runs.jsonl` on successful completion; swallow write errors
(FR-EVALS-*, FR-PIPE-06). Small change, intentionally after the happy path works.

### Phase 8 — Ship (11)

Vercel link/deploy, Lighthouse perf + a11y pass, bundle check (pdf-parse/cheerio
not in client), silent browser console on healthy session.

---

## OpenSpec workflow

For each row in the inventory table:

1. `openspec new change "<slug>"` (e.g. `openspec new change "02-maker-agent"`)
2. Generate proposal, design, specs, tasks (`/opsx:ff` or openspec propose flow)
3. Implement (`/opsx:apply`)
4. Archive when validated (`/opsx:archive`)
5. Update `docs/current-state.md` and requirement statuses in `requirements.md`

Suggested spec files under each change (mirror capability name):

| Capability     | Spec file (delta)        |
| -------------- | ------------------------ |
| Foundation     | `specs/lib/spec.md`      |
| Maker agent    | `specs/maker-agent/spec.md` |
| Checker agent  | `specs/checker-agent/spec.md` |
| Pipeline       | `specs/pipeline/spec.md` |
| App shell      | `specs/app-shell/spec.md` |
| CV upload      | `specs/cv-upload/spec.md` |
| Job input      | `specs/job-input/spec.md` |
| Pipeline API   | `specs/pipeline-api/spec.md` |
| Results        | `specs/results/spec.md` |
| Evals          | `specs/evals/spec.md` |
| Deploy         | `specs/deploy/spec.md` |

After archiving, sync deltas to `openspec/specs/` with `/opsx:sync` (or
`openspec-sync-specs` skill).

---

## Requirement traceability matrix

| Requirement ID | Capability (slug)   |
| -------------- | ------------------- |
| FR-SHELL-01–05 | 05-app-shell        |
| FR-CV-01–06    | 06-cv-upload        |
| FR-JOB-01–07   | 07-job-input        |
| FR-MAKER-01–05 | 02-maker-agent      |
| FR-CHECKER-01–05 | 03-checker-agent  |
| FR-PIPE-01–06  | 04-pipeline, 10-evals-logging |
| FR-RESULTS-01–06 | 09-results-display, 08-pipeline-api (streaming) |
| FR-EVALS-01–03 | 10-evals-logging    |
| NFR-PERF-01–03 | 11-deploy-hardening |
| NFR-A11Y-01–02 | 05-app-shell, 09-results-display, 11-deploy-hardening |
| NFR-SEC-01–02  | 06-cv-upload, 08-pipeline-api, 11-deploy-hardening |
| NFR-OBS-01     | 11-deploy-hardening |
| NFR-DX-01      | 01-foundation       |
| TC-STACK-01–07 | 01-foundation (+ enforced per capability) |
| TC-ARCH-01–03  | 02–04, 01-foundation |
| TC-DEPLOY-01   | 11-deploy-hardening |
| TC-DATA-01     | 10-evals-logging    |
| BC-PRIVACY-01–03 | all (verify in 11) |
| BC-BRAND-01–02 | 05-app-shell, 09-results-display |
| BC-DEMO-01     | 11-deploy-hardening |

---

## What is explicitly out of scope

See **Out of scope (MVP)** in `requirements.md`. No OpenSpec change should be
opened for accounts, DOCX, multi-language, ATS integrations, batch runs, mobile
native, or evals dashboards.

---

## Next step

Start with **`01-foundation`**: `openspec new change "01-foundation"` and follow
the capability brief in [`capabilities/01-foundation.md`](capabilities/01-foundation.md).
