## 1. Theme and layout foundation

- [x] 1.1 Add `@media (prefers-color-scheme: dark)` token overrides to `app/globals.css` (neutrals, surfaces, borders, semantic aliases)
- [x] 1.2 Set `color-scheme: light dark` on `html` in `app/layout.tsx`
- [x] 1.3 Copy `docs/design-system/assets/logomark.svg` to `public/logomark.svg`

## 2. Feedback components

- [x] 2.1 Create `components/feedback/status-indicator.tsx` with `state` (`idle` | `running` | `complete` | `error`), default labels, and running pulse animation per reference
- [x] 2.2 Add status-indicator styles using semantic CSS variables and `prefers-reduced-motion` guard

## 3. App shell components

- [x] 3.1 Create `components/app-shell/app-header.tsx` — logomark, app name, `StatusIndicator` (idle)
- [x] 3.2 Create `components/app-shell/app-footer.tsx` — privacy line with shield icon or equivalent
- [x] 3.3 Create `components/app-shell/app-shell.tsx` — sticky header, `main`, footer; max-width container
- [x] 3.4 Create `components/app-shell/empty-state.tsx` — hero headline and product description (BC-BRAND-01, no `!`)
- [x] 3.5 Create `components/app-shell/panel-placeholder.tsx` — CV and job variants with step eyebrow, title, and inert content area; `data-slot` attributes
- [x] 3.6 Create `components/app-shell/input-layout.tsx` — responsive grid (`<768px` column, `≥768px` two columns)
- [x] 3.7 Create disabled run-button placeholder row ("Generate cover letter" + helper text)

## 4. Page composition

- [x] 4.1 Compose `app/page.tsx` with `AppShell`, `EmptyState`, `InputLayout`, two panel placeholders, run row, and hidden/minimal results landmark
- [x] 4.2 Ensure focus-visible rings on all focusable placeholder controls (NFR-A11Y-01)

## 5. Tests and validation

- [x] 5.1 Add unit test for `StatusIndicator` default and each `state` label (optional smoke)
- [x] 5.2 Manual viewport check at 375px, 768px, and 1280px; verify OS dark mode switches tokens
- [x] 5.3 Run `npm run lint && npm run typecheck && npm test && npm run build` and fix failures
- [x] 5.4 Update `docs/current-state.md` to mark `05-app-shell` in progress or implemented
