## Context

Foundation (`01-foundation`) defines `cvParseRequestSchema`, `cvParseResponseSchema`, and `TEXT_MAX_BYTES` (32 KB) in `lib/schemas/api.ts`. App shell (`05-app-shell`) renders `PanelPlaceholder kind="cv"` inside `data-slot="cv-panel"`. Design reference components (`UploadZone`, `TextArea`, `CollapsiblePreview`) live in `docs/design-system/components/forms/` with `.prompt.md` APIs. `pdf-parse` is not yet in `package.json`.

**OpenSpec slug:** change folder `openspec/changes/cv-upload`; MVP capability slug `06-cv-upload`.

**Constraints:** FR-CV-01 … FR-CV-06, TC-STACK-04, NFR-SEC-02, NFR-PERF-03. Follow `DESIGN.md` and `.agents/skills/frontend-design-system/SKILL.md`. No pipeline run, job input, or run-button enablement (07, 08).

## Goals / Non-Goals

**Goals:**

- Functional CV panel: drag-and-drop / click upload, paste textarea, collapsed 400-char preview (FR-CV-01, FR-CV-03)
- `POST /api/cv/parse` with multipart PDF and JSON `{ cvText }` paste paths (FR-CV-02)
- Client validation: 5 MB, MIME `application/pdf` | `text/plain`, paste ≤ 32 KB (FR-CV-04 … FR-CV-06)
- `cvText` in React client state for 08; in-memory PDF handling only (NFR-SEC-02)
- `pdf-parse` imported only from `app/api/cv/parse/route.ts` (TC-STACK-04)

**Non-Goals:**

- Job posting panel (07), run button enablement (FR-JOB-07), pipeline API (08)
- DOCX or image CV formats
- Persisting CV to DB, localStorage, or server disk
- shadcn/ui full install unless a primitive clearly reduces duplication

## Decisions

### 1. Component layout

**Decision:** `components/cv-input/cv-input-panel.tsx` (client) composes `UploadZone`, `TextArea`, and `CollapsiblePreview` under `components/forms/`. Panel wrapper keeps app-shell card chrome (step eyebrow, title) matching `PanelPlaceholder` CV variant.

**Rationale:** Mirrors reference `InputScreen.jsx` CV section; isolates client state; job panel can follow same pattern in 07.

**Alternatives considered:** Extend `PanelPlaceholder` with props — rejected; boolean proliferation per composition-patterns skill.

### 2. Page composition and state

**Decision:** `app/page.tsx` remains a Server Component. Introduce `components/cv-input/cv-input-section.tsx` as `"use client"` wrapper holding `cvText`, upload error, and paste error state. Swap `<PanelPlaceholder kind="cv" />` for `<CvInputSection />`.

**Rationale:** Shell stays SSR-friendly; CV state is inherently client-side until 08 lifts state higher.

### 3. API route shape

**Decision:** Single `POST /api/cv/parse` route:

| Content-Type | Body | Behavior |
| ------------ | ---- | -------- |
| `multipart/form-data` | field `file` (PDF bytes) | `pdf-parse` buffer → `{ cvText }` |
| `application/json` | `{ cvText: string }` per `cvParseRequestSchema` | Validate with Zod; return `{ cvText }` echo (normalizes paste path) |

Plain-text **files** (`text/plain` MIME): read as UTF-8 string in the route (no `pdf-parse`).

**Rationale:** One endpoint for both paths; JSON path reuses foundation schema; paste can skip PDF machinery.

**Alternatives considered:** Separate `/api/cv/upload` — rejected; unnecessary surface area.

### 4. Client validation constants

**Decision:** Add `CV_FILE_MAX_BYTES = 5 * 1024 * 1024` in `lib/schemas/api.ts` (or `lib/cv/constants.ts`) alongside `TEXT_MAX_BYTES`. Client imports constants and Zod schemas only — never `pdf-parse`.

**Rationale:** Single source of truth; `TEXT_MAX_BYTES` already 32 KB in foundation.

### 5. Parse trigger UX

**Decision:** PDF: parse immediately on valid file select. Paste: parse on debounced change (e.g. 300 ms) after Zod passes, or on blur — prefer debounced auto-parse when valid to match reference kit flow.

**Rationale:** Reduces extra "Parse" button; preview appears as soon as input is valid.

### 6. Error handling

**Decision:** Upload zone inline `error` string for size/MIME/API failures. TextArea field error from Zod `safeParse` messages (specific copy per DESIGN.md voice). API errors return `{ error: string }` with 4xx/5xx; client maps to inline errors.

**Rationale:** FR-CV-04/05/06 require inline/field errors; no toast-only feedback.

### 7. pdf-parse dependency

**Decision:** Add `pdf-parse` to `dependencies`. Import dynamically inside route handler if needed for edge bundling: `const pdf = (await import('pdf-parse')).default`.

**Rationale:** TC-STACK-04; dynamic import extra safety for Next.js server/client split.

### 8. Form components implementation

**Decision:** Implement `UploadZone`, `TextArea`, `CollapsiblePreview` per reference `.d.ts` / `.prompt.md` using semantic CSS variables. Drag-and-drop via native `onDrop` / hidden `<input type="file">`.

**Rationale:** DESIGN.md integration rules; no imports from `docs/design-system/_ds_bundle.js`.

### 9. Testing

**Decision:**

- Unit: `cvParseRequestSchema` edge cases (already partial in `lib/schemas/api.test.ts`); add API route tests with mocked `pdf-parse` if feasible in Jest
- Component: optional smoke for `UploadZone` MIME/size rejection
- Manual: upload sample PDF, paste text, verify preview and bundle absence of `pdf-parse`

**Rationale:** Acceptance criteria in capability brief are behavior-focused.

## Risks / Trade-offs

- **[pdf-parse in Next 16]** → Use route-only import; if build warns, add `serverExternalPackages: ['pdf-parse']` in `next.config.ts` → Mitigation documented in tasks
- **[Large paste debounce]** → Cap debounce work; cancel in-flight fetch on new input → Prevent race showing stale preview
- **[Empty PDF text]** → Return 422 with clear error if `pdf-parse` yields empty string → Visitor sees upload error
- **[State not shared with 08 yet]** → `CvInputSection` exposes `cvText` via React state local to page; 08 will lift to parent or context → Document interface for 07/08 (`onCvTextChange?` optional callback)

## Migration Plan

1. Add `pdf-parse` dependency and form components.
2. Implement API route and `CvInputPanel`; swap CV placeholder in `app/page.tsx`.
3. Run `npm run lint && npm run typecheck && npm test && npm run build`.
4. Manual acceptance per capability brief (PDF, oversize, wrong MIME, long paste).
5. Archive change; update `docs/current-state.md` and requirement statuses in `docs/requirements.md`.

Rollback: revert to `PanelPlaceholder kind="cv"` — no data migration.

## Open Questions

- _(none blocking)_ — Paste parse trigger: **recommend** debounced auto-parse when Zod-valid; explicit Parse button only if debounce causes UX issues in manual testing.
