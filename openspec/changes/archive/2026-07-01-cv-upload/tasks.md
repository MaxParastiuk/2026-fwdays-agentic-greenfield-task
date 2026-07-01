## 1. Dependencies and shared constants

- [x] 1.1 Add `pdf-parse` to `package.json` (and types if required)
- [x] 1.2 Add `CV_FILE_MAX_BYTES` (5 MB) to `lib/schemas/api.ts` (or `lib/cv/constants.ts`) and export from `lib/schemas/index.ts`
- [x] 1.3 If Next build bundles `pdf-parse` incorrectly, set `serverExternalPackages: ['pdf-parse']` in `next.config.ts`

## 2. Form components (design system)

- [x] 2.1 Read reference `.prompt.md` / `.d.ts` for `UploadZone`, `TextArea`, `CollapsiblePreview`
- [x] 2.2 Implement `components/forms/upload-zone.tsx` — drag/drop, file picker, selected-file row, inline error, MIME + size validation before `onSelect`
- [x] 2.3 Implement `components/forms/text-area.tsx` — label, character count, field-level error
- [x] 2.4 Implement `components/forms/collapsible-preview.tsx` — 400-char collapsed preview, expand/collapse, "Parsed" label

## 3. API route

- [x] 3.1 Create `app/api/cv/parse/route.ts` — `POST` only
- [x] 3.2 Handle `multipart/form-data` with `file` field: PDF via dynamic `pdf-parse`, `text/plain` as UTF-8 read; in-memory only (NFR-SEC-02)
- [x] 3.3 Handle `application/json` body with `cvParseRequestSchema` validation; return `cvParseResponseSchema` shape
- [x] 3.4 Return structured 4xx errors for empty PDF text, validation failures, and unsupported content types
- [x] 3.5 Add route unit tests with mocked `pdf-parse` (and schema validation cases)

## 4. CV input panel

- [x] 4.1 Create `components/cv-input/cv-input-panel.tsx` (`"use client"`) — panel chrome matching CV placeholder (step, title, `data-slot="cv-panel"`)
- [x] 4.2 Wire upload path: on valid file → `POST /api/cv/parse` multipart → set `cvText` → show `CollapsiblePreview`
- [x] 4.3 Wire paste path: Zod validate with `cvParseRequestSchema` → debounced JSON `POST` or direct state when valid → preview
- [x] 4.4 Clear `cvText` and preview when file removed or paste cleared; mutual exclusion between active sources
- [x] 4.5 Optional: export `onCvTextChange(cvText: string | null)` callback for 07/08 integration

## 5. Page integration

- [x] 5.1 Replace `<PanelPlaceholder kind="cv" />` with `<CvInputPanel />` (or thin `CvInputSection` wrapper) in `app/page.tsx`
- [x] 5.2 Keep job placeholder and disabled run button unchanged

## 6. Tests and validation

- [x] 6.1 Extend `lib/schemas/api.test.ts` if `CV_FILE_MAX_BYTES` adds new exports
- [x] 6.2 Add component or integration tests for client MIME/size/paste length rejection (optional smoke)
- [x] 6.3 Manual check: valid PDF → preview; oversize → inline error; wrong MIME → inline error; paste > 32 KB → field error
- [x] 6.4 Verify `pdf-parse` absent from client bundle (`npm run build` + inspect or grep client chunks)
- [x] 6.5 Run `npm run lint && npm run typecheck && npm test && npm run build`
- [x] 6.6 Update `docs/current-state.md` to mark `06-cv-upload` in progress or implemented
