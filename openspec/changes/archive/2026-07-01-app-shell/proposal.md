## Why

Foundation (`01-foundation`) and the agent/pipeline core (`02`–`04`) are archived and tested. The app still renders an empty `app/page.tsx`, so there is no visitor-facing surface for CV upload, job input, or results. Capability `05-app-shell` is Phase 3 of the MVP plan and unblocks input panels (`06-cv-upload`, `07-job-input`) by providing the responsive layout, header, empty state, and theme system they plug into.

## What Changes

- Compose `app/page.tsx` into a full single-page shell: sticky header (logomark, app name, pipeline status), main content area, and privacy footer per `docs/design-system/ui_kits/job_application_agent/AppShell.jsx`
- Add responsive layout at 768px and 1280px breakpoints: mobile single column (CV then job); tablet/desktop two-column input grid with a results region placeholder (FR-SHELL-01, FR-SHELL-02)
- Ship empty-state hero copy and structural placeholders for CV panel, job panel, run button, and results panel — no functional upload, scrape, or pipeline wiring (FR-SHELL-03)
- Implement `StatusIndicator` in `components/` showing **idle** on first load; state transitions wired in capabilities 08/09 (FR-SHELL-04 partial)
- Add system `prefers-color-scheme` dark theme tokens to `app/globals.css` with no in-app toggle (FR-SHELL-05)
- Professional, action-oriented copy with no exclamation marks (BC-BRAND-01); baseline focus rings on interactive placeholders (NFR-A11Y-01)

## Capabilities

### New Capabilities

- `app-shell`: Responsive SPA layout, header with pipeline-status placeholder, input/results region slots, empty state, system theme, and privacy footer (FR-SHELL-01 … FR-SHELL-05, BC-BRAND-01, NFR-A11Y-01 baseline)

### Modified Capabilities

- _(none — no existing `openspec/specs/app-shell/spec.md`; this introduces the capability)_

## Impact

- **New files:** `components/app-shell/` (or equivalent) — `AppShell`, `AppHeader`, `StatusIndicator`, `EmptyState`, panel/region placeholders; optional layout utilities
- **Modified files:** `app/page.tsx`, `app/globals.css` (dark theme token overrides), possibly `app/layout.tsx` (theme-color meta, `color-scheme`)
- **Reference only:** `docs/design-system/` components and UI kit — reimplemented with tokens + shadcn/ui, not imported into production
- **Dependencies:** Uses existing fonts/tokens from foundation; no new npm packages required unless shadcn primitives are added for Card/Button shells
- **Blocks:** `06-cv-upload`, `07-job-input` (layout slots); `08-pipeline-api` / `09-results-display` (status indicator and results region)
- **Out of scope:** Functional CV parse, job fetch, pipeline API, results content, evals, deploy hardening
