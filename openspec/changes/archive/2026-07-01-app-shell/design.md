## Context

Foundation (`01-foundation`) integrated design tokens and fonts into `app/globals.css` and `app/layout.tsx`. Pipeline (`04-pipeline`) is archived; `app/page.tsx` is still empty. The design-system reference kit (`docs/design-system/ui_kits/job_application_agent/`) defines the target shell: sticky header with logomark and `StatusIndicator`, hero empty state, two-panel input grid, run row, results region placeholder, and privacy footer.

**OpenSpec slug:** change folder `openspec/changes/app-shell`; MVP capability slug `05-app-shell`.

**Constraints:** FR-SHELL-01 … FR-SHELL-05, BC-BRAND-01, NFR-A11Y-01 baseline, TC-STACK-02 (Next.js App Router). No functional CV/job/pipeline logic. Follow `DESIGN.md` and `.agents/skills/frontend-design-system/SKILL.md` — semantic CSS variables only, no imports from `docs/design-system/_ds_bundle.js`.

## Goals / Non-Goals

**Goals:**

- Render a complete visitor-facing shell on `/` with header, main, and footer (FR-SHELL-01)
- Responsive layout: &lt;768px single column (CV above job); ≥768px two-column input grid; results region structurally present for ≥1280px per capability brief (FR-SHELL-02)
- Empty-state hero + panel placeholders on first load (FR-SHELL-03)
- `StatusIndicator` visible in header, default `idle` (FR-SHELL-04 — static until 08/09)
- System light/dark via `@media (prefers-color-scheme: dark)` token overrides; `color-scheme: light dark` on `html` (FR-SHELL-05)
- Professional copy, no exclamation marks (BC-BRAND-01)
- Visible focus rings on interactive placeholders (`:focus-visible`, `--ring` / `--ring-strong`)

**Non-Goals:**

- CV upload/parse, job URL scrape, Zod validation, run-button enablement (06, 07)
- Live pipeline status updates, streaming, results content (08, 09)
- shadcn/ui full install unless a primitive clearly reduces duplication for Card/Button shells
- Theme toggle, accounts, cookies banner beyond privacy footer line
- Lighthouse/axe CI gates (deferred to 11-deploy-hardening)

## Decisions

### 1. Component file layout

**Decision:** `components/app-shell/app-shell.tsx` (layout wrapper), `app-header.tsx`, `app-footer.tsx`, `empty-state.tsx`, `input-layout.tsx` (grid + panel slots), `panel-placeholder.tsx` (CV/job stubs). `components/feedback/status-indicator.tsx` mirrors reference API (`state`, `label`).

**Rationale:** Matches reference `AppShell.jsx` + `InputScreen.jsx` decomposition; slots accept `children` for 06/07 to replace placeholders.

**Alternatives considered:** Single monolithic `page.tsx` — rejected; blocks parallel work on input panels.

### 2. Page composition

**Decision:** `app/page.tsx` is a Server Component composing `<AppShell status="idle">` with `<EmptyState />` and `<InputLayout>` containing two `<PanelPlaceholder kind="cv" />` and `<PanelPlaceholder kind="job" />`, plus a disabled run-button placeholder and an empty `<ResultsRegion />` (hidden or collapsed on first load).

**Rationale:** Shell is static; no client state needed until 08. Keeps page simple and SSR-friendly.

### 3. Responsive breakpoints

**Decision:** Tailwind arbitrary/custom breakpoints aligned to requirements:

| Viewport | Layout |
| -------- | ------ |
| &lt;768px | `flex flex-col` — CV panel, job panel, run row stacked |
| ≥768px | CSS grid `grid-cols-2` for input panels |
| ≥1280px | Same two-column input; results region below or beside per UI kit — use **stacked** pattern from `InputScreen.jsx` (inputs grid, then results section with min-height placeholder) to match reference |

**Rationale:** FR-SHELL-02 names 768px and 1280px; reference kit uses 1180px container (`--container-max`) with two-column inputs at desktop widths.

### 4. Dark theme implementation

**Decision:** Add `@media (prefers-color-scheme: dark) { :root { … } }` block in `app/globals.css` overriding neutrals, surfaces, borders, and semantic aliases (mirror `docs/design-system/tokens/colors.css` dark values if present, else derive from DESIGN.md warm ink palette). Set `color-scheme: light dark` on `html` in `layout.tsx`.

**Rationale:** FR-SHELL-05; DESIGN.md rule 3 — no toggle. CSS-only avoids hydration flash.

**Alternatives considered:** `next-themes` — rejected for MVP.

### 5. Status indicator (static)

**Decision:** Hard-code `state="idle"` and `label="Idle"` in `AppHeader` for this capability. Export `PipelineStatus` type (`'idle' | 'running' | 'complete' | 'error'`) for 08/09.

**Rationale:** FR-SHELL-04 requires visibility on first load; dynamic wiring is 08's responsibility.

### 6. Placeholder interactivity

**Decision:** Panel placeholders use inert `<button disabled>` or `<div role="region">` with visible borders/cards matching `Card` reference styling. Run button: disabled primary button with label "Generate cover letter". All focusable controls use `focus-visible:outline` / `--ring-strong`.

**Rationale:** NFR-A11Y-01 baseline without faking upload behavior.

### 7. Assets

**Decision:** Copy or reference `docs/design-system/assets/logomark.svg` via `public/logomark.svg` (or `next/image` from `public/`). Header alt text empty decorative mark per reference.

**Rationale:** BC-BRAND-01; consistent with UI kit.

### 8. Styling approach

**Decision:** Tailwind utility classes mapped to CSS variables already in `globals.css` (e.g. `bg-[var(--bg-app)]`, `text-[var(--text-body)]`). No raw hex in TSX.

**Rationale:** TC-STACK-02, DESIGN.md integration rules. shadcn not in `package.json` — avoid adding it solely for shell placeholders unless Card/Button duplication exceeds ~80 lines.

### 9. Testing

**Decision:** Optional lightweight test: render `StatusIndicator` states; manual/visual acceptance per capability brief. No Playwright in this change unless already present.

**Rationale:** UI shell; acceptance criteria are viewport/layout checks.

## Risks / Trade-offs

- **[Dark token contrast]** → Verify key pairs (`--text-body` on `--bg-app`, `--action-text` on `--action-bg`) against WCAG AA; adjust dark overrides before merge (NFR-A11Y-02 partial).
- **[Placeholder vs real panels]** → Use explicit `data-slot="cv-panel"` / `data-slot="job-panel"` attributes so 06/07 can target replacement without layout churn.
- **[Results region on empty state]** → Show collapsed/minimal results placeholder or omit until first run; align with product brief "no default content" — results area may be `aria-hidden` until 09.
- **[No shadcn]** → Reference Card/Button styles duplicated in Tailwind; acceptable for shell; consolidate when form components land in 06/07.

## Migration Plan

1. Implement components and update `app/page.tsx` / `globals.css`.
2. Run `npm run lint && npm run typecheck && npm test && npm run build`.
3. Manual check at 375px, 768px, 1280px viewports and OS dark mode toggle.
4. Archive change; update `docs/current-state.md` to mark `05-app-shell` implemented.

No rollback complexity — purely additive UI.

## Open Questions

- _(none blocking)_ — Results region on empty state: use minimal hidden landmark vs visible dashed placeholder; **recommend** hidden landmark until 09 to match "no default content."
