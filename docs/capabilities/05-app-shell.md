# Capability: App shell & navigation

**OpenSpec slug:** `05-app-shell`  
**Depends on:** `01-foundation`  
**Blocks:** `06-cv-upload`, `07-job-input`, `09-results-display`

## Purpose

Responsive single-page layout with header, input/results regions, empty state,
system theme, and pipeline status placeholder.

## Requirements covered

| ID | Summary |
| -- | ------- |
| FR-SHELL-01 | Top bar + main area: input panel + results panel |
| FR-SHELL-02 | Breakpoints 768px / 1280px; mobile single column (CV then job) |
| FR-SHELL-03 | Empty state: product description + prominent inputs |
| FR-SHELL-04 | Pipeline status in header (idle / running / done / error)—wire state in 08/09 |
| FR-SHELL-05 | `prefers-color-scheme` light/dark; no in-app toggle |
| BC-BRAND-01 | Professional copy; no exclamation marks |

Also: NFR-A11Y-01/02 (baseline), TC-STACK-02, DESIGN.md tokens.

## Scope

### In scope

- `app/page.tsx` layout composition
- Header: logo, app name, `StatusIndicator` (static idle first)
- Placeholder regions for CV panel, job panel, results panel
- Empty state copy per product brief
- Theme via CSS variables / `globals.css` (already started in repo)

### Out of scope

- Functional upload/scrape (06, 07)
- Live pipeline status updates (08)
- Results content (09)

## Acceptance criteria

1. At 375px width: single column, CV section above job section.
2. At ≥1280px: two-column input layout + results area per DESIGN.md.
3. First load shows empty state without errors.
4. Toggling OS dark mode updates theme without flash (no manual toggle).
5. Lighthouse a11y baseline: focus rings on interactive placeholders.

## OpenSpec artifacts

- **Specs:** `specs/app-shell/spec.md`
- **Design:** reference `DESIGN.md`, design-system components under `docs/design-system/`

## Notes

Can start after 01; recommended before 06/07 so panels have a home. Backend
phases 02–04 can proceed in parallel if another contributor owns shell UI.
