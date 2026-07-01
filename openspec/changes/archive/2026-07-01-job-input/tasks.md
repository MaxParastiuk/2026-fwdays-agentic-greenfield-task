## 1. Dependencies and shared primitives

- [x] 1.1 Add `cheerio` to `package.json`
- [x] 1.2 If Next build bundles `cheerio` incorrectly, add `serverExternalPackages: ['cheerio']` in `next.config.ts` (alongside `pdf-parse`)
- [x] 1.3 Read reference `.prompt.md` / `.d.ts` for `TextField`
- [x] 1.4 Implement `components/forms/text-field.tsx` — label, optional icon, inline error, native input props

## 2. Server-side job fetch

- [x] 2.1 Create `lib/job/extract-text.ts` — cheerio load, strip scripts/styles/nav noise, normalize whitespace, return text or empty
- [x] 2.2 Add `lib/job/extract-text.test.ts` with HTML fixture snippets
- [x] 2.3 Create `lib/job/handle-fetch.ts` (or inline in route) — validate with `jobFetchRequestSchema`, `fetch` with timeout, map non-2xx/network/empty to FR-JOB-04 error copy
- [x] 2.4 Create `app/api/job/fetch/route.ts` — `POST` JSON only; return `jobFetchResponseSchema` shape
- [x] 2.5 Add route unit tests with mocked `fetch` (2xx HTML, 404, timeout, empty body)

## 3. Job input panel

- [x] 3.1 Create `components/job-input/job-input-panel.tsx` (`"use client"`) — panel chrome matching job placeholder (step, title, `data-slot="job-panel"`)
- [x] 3.2 Wire `SegmentedControl` for URL vs paste modes (FR-JOB-01)
- [x] 3.3 URL mode: `TextField` + “Fetch posting” action; client Zod validate URL → `POST /api/job/fetch` → set `jobText` → show `CollapsiblePreview`; map failures to FR-JOB-04 inline error
- [x] 3.4 Paste mode: `TextArea` with debounced Zod validation (`TEXT_MAX_BYTES`); set `jobText` and preview when valid (FR-JOB-06)
- [x] 3.5 Clear `jobText` and preview on mode switch or input clear; cancel in-flight fetch on new request
- [x] 3.6 Export `onJobTextChange(jobText: string | null)` callback for page integration

## 4. Shared page state and run button

- [x] 4.1 Create `components/home/home-page-client.tsx` — hold `cvText` and `jobText`; derive `canRun` from `pipelineRunRequestSchema.safeParse`
- [x] 4.2 Wire `CvInputPanel onCvTextChange` and `JobInputPanel onJobTextChange` in the client wrapper
- [x] 4.3 Create `components/forms/run-button.tsx` — same visual as `RunPlaceholder`, `disabled={!canRun}`, stub `onClick` until 08
- [x] 4.4 Update `app/page.tsx` to use `HomePageClient` (replace job placeholder and `RunPlaceholder`)

## 5. Tests and validation

- [x] 5.1 Extend `lib/schemas/api.test.ts` if new exports or edge cases are added
- [x] 5.2 Manual check: valid public URL → preview; 404/timeout → FR-JOB-04 message; paste > 32 KB → field error
- [x] 5.3 Manual check: run button disabled/enabled matrix (CV only, job only, both valid)
- [x] 5.4 Verify `cheerio` absent from client bundle (`npm run build` + inspect or grep client chunks)
- [x] 5.5 Run `npm run lint && npm run typecheck && npm test && npm run build`
- [x] 5.6 Update `docs/current-state.md` to mark `07-job-input` in progress or implemented
