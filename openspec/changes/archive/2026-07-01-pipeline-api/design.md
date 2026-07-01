## Context

Foundation (`01-foundation`) defines `pipelineRunRequestSchema`, `pipelineResultSchema`, and validation helpers in `lib/`. Pipeline (`04-pipeline`) exports `runPipeline(cv, jobText, options?)` with optional `onProgress({ phase, iteration })` before each Maker and Checker call. CV upload (`06-cv-upload`) and job input (`07-job-input`) lift `cvText` and `jobText` into `HomePageClient`; `RunButton` enables when `pipelineRunRequestSchema` passes but `onClick` is a stub. `AppHeader` renders `StatusIndicator state="idle"` statically. No `app/api/pipeline/` route exists. Agents call `generateText` from `ai` in `agents/`; TC-ARCH-02 requires all AI SDK usage in `app/api/` for the streaming layer (agents remain as-is for this change).

**OpenSpec slug:** change folder `openspec/changes/pipeline-api`; MVP capability slug `08-pipeline-api`.

**Constraints:** FR-RESULTS-05, FR-SHELL-04, FR-JOB-05, FR-RESULTS-06 (fatal error contract), TC-ARCH-02, TC-STACK-03, NFR-SEC-01. Follow `DESIGN.md` and frontend-design-system skill for any UI touched.

## Goals / Non-Goals

**Goals:**

- `POST /api/pipeline/run` validates `{ cvText, jobText }` with `pipelineRunRequestSchema`; invalid body → 400 with field errors (FR-JOB-05)
- Route invokes `runPipeline` and streams progress lines “Iteration N: writing…” / “Iteration N: checking…” using Vercel AI SDK streaming (`streamText` or UI message stream helpers from `ai` per TC-STACK-03) (FR-RESULTS-05)
- Document stream event types (`progress`, `result`, `error`) for capability 09
- Client run orchestration: run button triggers fetch/stream consume; header `StatusIndicator` transitions idle → running → complete | error (FR-SHELL-04)
- Fatal pipeline failures end stream with error event; no partial `PipelineResult` (FR-RESULTS-06)
- No `ai` imports in `"use client"` modules (TC-ARCH-02)
- Route unit tests with mocked `runPipeline`; eval logger remains no-op until 10

**Non-Goals:**

- Full results panel (letter, copy, timeline, gap list) — 09
- Evals JSONL append — 10 (may pass undefined `evalLogger`)
- Error banner UI with “Try again” — 09 (08 establishes error state + stream contract)
- Re-validating CV PDF parse or job URL fetch server-side beyond request body schema
- Rate limiting, auth, or request deduplication

## Decisions

### 1. API route path and method

**Decision:** `POST /api/pipeline/run` with JSON body `{ cvText, jobText }`.

**Rationale:** Matches `pipelineRunRequestSchema` and capability brief; consistent with `/api/cv/parse` and `/api/job/fetch`.

**Alternatives considered:** `GET` with query params — rejected (32 KB payloads, logging risk).

### 2. Server validation and error shape

**Decision:** Parse JSON body; `safeParse(pipelineRunRequestSchema)`; on failure return `400` with `{ error: string, fieldErrors?: Record<string, string[]> }` aligned with existing API routes.

**Rationale:** FR-JOB-05; mirrors cv/job routes.

### 3. Streaming transport (AI SDK)

**Decision:** Implement the route with AI SDK streaming primitives from the `ai` package (prefer `createUIMessageStream` + `createUIMessageStreamResponse` or equivalent in v7; if the installed API requires `streamText`, wrap progress emission so the HTTP response uses the SDK stream protocol). Progress lines are plain text chunks; the final `PipelineResult` is emitted as a structured **data** part (not mixed into letter text).

**Stream event schema (document in `lib/pipeline/stream-events.ts`):**

| `type`     | Payload | When |
| ---------- | ------- | ---- |
| `progress` | `{ message: string }` — e.g. `"Iteration 1: writing…"` | Each `onProgress` callback |
| `result`   | `{ result: PipelineResult }` | After `runPipeline` resolves |
| `error`    | `{ message: string }` | Fatal rejection before/at pipeline |

**Rationale:** TC-STACK-03 mandates AI SDK streaming for UI progress; structured final chunk lets 09 render without parsing prose. `onProgress` mapping:

- `{ phase: 'writing', iteration: n }` → `"Iteration ${n}: writing…"`
- `{ phase: 'checking', iteration: n }` → `"Iteration ${n}: checking…"`

**Alternatives considered:** Raw `ReadableStream` of NDJSON without AI SDK — rejected (violates TC-STACK-03). SSE-only custom format — rejected for same reason.

### 4. Pipeline execution in route

**Decision:** `lib/pipeline/handle-run.ts` (framework-free orchestration helper):

1. Validate request
2. Start stream
3. Call `runPipeline(cvText, jobText, { onProgress })` inside stream `execute`
4. On success, write `result` event and close
5. On throw, write `error` event and close; do not send partial `PipelineResult`

**Rationale:** Keeps route thin; testable without Next request objects. `runPipeline` already isolates agents (TC-ARCH-01).

### 5. Client consumption without `ai` in client components

**Decision:** `lib/pipeline/parse-stream.ts` (framework-free): parse AI SDK UI message stream / data parts from `fetch` `response.body` and invoke callbacks `onProgress`, `onResult`, `onError`. `lib/hooks/use-pipeline-run.ts` (`"use client"`) uses only `fetch` + parser — no `import from 'ai'`.

**Rationale:** TC-ARCH-02. Hook exposes `{ status, progressMessage, result, error, run, reset }`.

**Alternatives considered:** `@ai-sdk/react` `useChat` — adds client dependency surface; custom parser is smaller for typed events.

### 6. Header status wiring

**Decision:** Add `components/pipeline/pipeline-status-context.tsx` — client context holding `PipelineStatus` (`idle` | `running` | `complete` | `error`). Provider wraps content inside `AppShell` from `app/page.tsx` (or `HomePageClient` exports provider wrapping its tree). `AppHeader` becomes `"use client"` and reads context for `StatusIndicator state`.

**Rationale:** FR-SHELL-04 requires header visibility while run is active; context avoids prop drilling through server `AppShell`. Status updates driven by `usePipelineRun` in `HomePageClient`.

**Alternatives considered:** Duplicate status indicator in page body — rejected (requirement is header). Server-sent events to header — overkill.

### 7. Run button behavior

**Decision:** `HomePageClient` calls `run(cvText, jobText)` from hook on `RunButton` click. While `status === 'running'`, disable run button and optionally disable input panels (design: disable run only for MVP). On success, set `status` to `complete`; store `result` in hook state for 09. On fatal error, set `status` to `error`; no results region content yet (09 adds banner).

**Rationale:** FR-RESULTS-06 — no partial results on error; hook clears previous `result` when a new run starts.

### 8. Progress display stub for 09

**Decision:** Minimal `components/pipeline/progress-stream.tsx` — renders latest `progressMessage` in results region when `status === 'running'` (muted text). Full timeline deferred to 09.

**Rationale:** Makes streaming manually testable before 09; satisfies acceptance “client receives progress lines”.

### 9. Testing strategy

**Decision:**

- Unit: `lib/pipeline/handle-run.test.ts` with mocked `runPipeline` (success, throw, progress order)
- Unit: `lib/pipeline/parse-stream.test.ts` with fixture stream bytes
- Route test: mock `handle-run` or `runPipeline`, assert 400 on bad body, content-type on success
- Import boundary: assert no `from 'ai'` in `components/` or `lib/hooks/`
- Manual: real Gateway credentials — at least one full run shows progress lines and completes

**Rationale:** NFR-DX-01; capability acceptance criteria.

### 10. Security

**Decision:** LLM calls remain inside `runPipeline` → agents → `generateText` (existing NFR-SEC-01). Route handler does not expose env keys. Request body processed in-memory only (NFR-SEC-02). No `NEXT_PUBLIC_*` gateway keys.

**Rationale:** Streaming route orchestrates; it does not add new provider credentials.

## Risks / Trade-offs

- **[AI SDK stream API drift in v7]** → Verify exact exports during implementation against installed `ai` version; adapter layer in `lib/pipeline/` isolates churn → Mitigation: single module imports `ai`
- **[Client parser fragility]** → SDK stream format may change → Mitigation: fixture-based tests; pin `ai` version in package.json
- **[Long-running request timeout on Vercel]** → 3 iterations may approach 60s (NFR-PERF-01) → Mitigation: document for 11; use default function max duration; no change in 08
- **[Header/client boundary]** → `AppHeader` must be client for context → Mitigation: small client island; no SEO impact
- **[Duplicate validation]** → Client already validates; server re-validates anyway → Acceptable per FR-JOB-05

## Migration Plan

1. Add `lib/pipeline/` stream types, `handle-run`, `parse-stream` + tests.
2. Add `app/api/pipeline/run/route.ts`.
3. Add `use-pipeline-run` hook, status context, wire `AppHeader` + `HomePageClient` + minimal progress UI.
4. Run `npm run lint && npm run typecheck && npm test && npm run build`.
5. Manual E2E with Gateway credentials.
6. Archive change; sync specs; update `docs/current-state.md` and `docs/requirements.md` statuses.

Rollback: remove API route and revert run button to stub; header returns to static idle.

## Open Questions

- _(none blocking)_ — **Recommend** using `createUIMessageStreamResponse` if available in `ai@7`; otherwise implement via `streamText` text-delta stream for progress lines plus a final data annotation for `PipelineResult`. Implementation chooses based on installed SDK exports.
