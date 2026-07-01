## Context

Foundation (`01-foundation`) defines `jobFetchRequestSchema`, `jobFetchResponseSchema`, `pipelineRunRequestSchema`, and `TEXT_MAX_BYTES` (32 KB) in `lib/schemas/api.ts`. App shell (`05-app-shell`) renders `PanelPlaceholder kind="job"` inside `data-slot="job-panel"`. CV upload (`06-cv-upload`) ships `CvInputPanel` with `onCvTextChange`, `SegmentedControl`, `TextArea`, and `CollapsiblePreview` under `components/forms/`. `RunPlaceholder` is a permanently disabled button. `cheerio` is not yet in `package.json`.

**OpenSpec slug:** change folder `openspec/changes/job-input`; MVP capability slug `07-job-input`.

**Constraints:** FR-JOB-01 … FR-JOB-07, TC-STACK-05, NFR-PERF-03. Follow `DESIGN.md` and `.agents/skills/frontend-design-system/SKILL.md`. No pipeline execution (08), results UI (09), or evals.

## Goals / Non-Goals

**Goals:**

- Functional job panel: URL vs paste segmented toggle, URL fetch, paste textarea, collapsed 400-char preview (FR-JOB-01, FR-JOB-03)
- `POST /api/job/fetch` with JSON `{ url }` validated by `jobFetchRequestSchema`; server `fetch` + cheerio body extraction (FR-JOB-02, FR-JOB-05)
- Fetch failures show inline “Could not fetch posting: paste the text instead.” (FR-JOB-04)
- Paste capped at 32 KB with field-level Zod error (FR-JOB-06)
- Shared page state: run button enabled only when `cvText` and `jobText` both pass `pipelineRunRequestSchema` client-side (FR-JOB-07)
- `cheerio` imported only from server route / `lib/job/` helpers (TC-STACK-05, NFR-PERF-03)

**Non-Goals:**

- Pipeline API route, streaming, header status transitions (08)
- Results display (09)
- SSRF hardening beyond basic URL validation (defer to 11 if needed)
- Persisting job text server-side

## Decisions

### 1. Component layout

**Decision:** `components/job-input/job-input-panel.tsx` (`"use client"`) composes existing `SegmentedControl`, `TextField` (new form primitive for URL), `TextArea`, and `CollapsiblePreview`. Panel chrome matches job `PanelPlaceholder` (step eyebrow, title, `data-slot="job-panel"`).

**Rationale:** Mirrors `CvInputPanel` pattern; reuses form components from 06.

**Alternatives considered:** Extend `PanelPlaceholder` — rejected per composition-patterns skill.

### 2. Page composition and shared state

**Decision:** Introduce `components/home/home-page-client.tsx` as `"use client"` wrapper holding `cvText`, `jobText`, and derived `canRun` from `pipelineRunRequestSchema.safeParse`. `app/page.tsx` renders `<HomePageClient />` inside `AppShell` instead of wiring panels directly.

**Rationale:** FR-JOB-07 requires cross-panel validation; lifting state at page level is cleaner than context for two siblings. `CvInputPanel` and `JobInputPanel` accept `onCvTextChange` / `onJobTextChange` callbacks (CV callback already exists).

**Alternatives considered:** React context provider — acceptable but heavier for two fields; page wrapper is sufficient for MVP.

### 3. API route shape

**Decision:** Single `POST /api/job/fetch` route:

| Content-Type | Body | Behavior |
| ------------ | ---- | -------- |
| `application/json` | `{ url: string }` per `jobFetchRequestSchema` | Server `fetch(url)` with timeout → cheerio load → extract visible body text → `{ jobText }` |

Paste mode does **not** call the API; client sets `jobText` directly after Zod validation (same pattern as CV paste path).

**Rationale:** FR-JOB-02 applies to URL mode only; paste avoids unnecessary network round-trip.

### 4. HTML extraction strategy

**Decision:** `lib/job/extract-text.ts` — load HTML with cheerio, remove `script`, `style`, `noscript`, `nav`, `footer`, `header` (heuristic), then take `body` text with whitespace normalization. Return 422 if extracted text is empty.

**Rationale:** Job postings vary; simple body extraction is sufficient for MVP demo. No readability library dependency.

**Alternatives considered:** `@mozilla/readability` — rejected for MVP scope and bundle size.

### 5. Fetch error handling

**Decision:** Non-2xx responses, network errors, timeouts (e.g. 10 s `AbortSignal`), and empty extraction return 4xx with `{ error: "Could not fetch posting: paste the text instead." }`. Client maps to URL field inline error (FR-JOB-04 exact copy).

**Rationale:** Matches requirement wording; encourages paste fallback.

### 6. URL fetch trigger UX

**Decision:** Fetch on explicit action: visitor enters URL → clicks “Fetch posting” button (or Enter in URL field) after client Zod validates URL shape. Show loading state on button during fetch.

**Rationale:** Unlike CV paste debounce, URL fetch is expensive and should not fire on every keystroke.

### 7. Paste validation UX

**Decision:** Debounced validation (300 ms) like CV panel; when `jobText` passes `nonEmptyTextMax`, set client `jobText` and show preview. Over-limit shows field error immediately on Zod failure.

**Rationale:** Consistent with `CvInputPanel`; FR-JOB-06.

### 8. Run button component

**Decision:** Replace `RunPlaceholder` with `components/forms/run-button.tsx` — same visual treatment, `disabled={!canRun}`, `onClick` no-op or `console` stub until 08. Helper text updates: “Provide a CV and a job posting to begin.” when disabled.

**Rationale:** FR-JOB-07; minimal surface for 08 to attach handler.

### 9. cheerio dependency

**Decision:** Add `cheerio` to `dependencies`. Import only in `lib/job/extract-text.ts` and `app/api/job/fetch/route.ts`. Add `serverExternalPackages: ['cheerio']` in `next.config.ts` alongside `pdf-parse` if build requires it.

**Rationale:** TC-STACK-05; same pattern as pdf-parse in 06.

### 10. TextField form primitive

**Decision:** Implement `components/forms/text-field.tsx` per reference `TextField.prompt.md` — label, optional icon, inline error, native input props.

**Rationale:** URL mode needs single-line input; reference kit defines API.

### 11. Testing

**Decision:**

- Unit: `lib/job/extract-text.test.ts` with fixture HTML snippets
- Unit: API route tests with mocked `fetch` returning sample HTML
- Extend `jobFetchRequestSchema` tests if needed (already partial in `lib/schemas/api.test.ts`)
- Manual: valid URL, 404 URL, paste over 32 KB, run button enablement matrix

**Rationale:** Acceptance criteria in capability brief are behavior-focused.

## Risks / Trade-offs

- **[Scrape quality varies by site]** → Heuristic cheerio extraction may miss SPA-only content → FR-JOB-04 paste fallback is the recovery path
- **[SSRF via user-supplied URL]** → MVP accepts any valid URL string; document for 11-deploy-hardening → No internal network blocking in 07
- **[cheerio in Next 16 bundle]** → Server-only imports + `serverExternalPackages` → Same mitigation as pdf-parse
- **[Race on URL fetch]** → Increment request id; ignore stale responses → Prevent wrong preview
- **[Empty state vs functional panels]** → Empty-state hero may remain visible above functional panels per shell design → No change to FR-SHELL-03 hero behavior in 07

## Migration Plan

1. Add `cheerio` dependency and `TextField` component.
2. Implement `lib/job/` helpers and `POST /api/job/fetch`.
3. Implement `JobInputPanel`, `HomePageClient`, and `RunButton`; swap job placeholder in page.
4. Run `npm run lint && npm run typecheck && npm test && npm run build`.
5. Manual acceptance per capability brief (URL fetch, failure message, paste limit, run enablement).
6. Archive change; update `docs/current-state.md` and requirement statuses in `docs/requirements.md`.

Rollback: revert to `PanelPlaceholder kind="job"` and `RunPlaceholder` — no data migration.

## Open Questions

- _(none blocking)_ — URL fetch trigger: **recommend** explicit “Fetch posting” button after Zod-valid URL; Enter key submits same action.
