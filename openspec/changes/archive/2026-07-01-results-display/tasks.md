## 1. Results components audit and completion

- [x] 1.1 Audit `components/results/` (`LetterPanel`, `LetterGaps`, `IterationTimeline`, `GapList`, `ScoreBadge`, `PipelineResultsView`) against `specs/results/spec.md` — fix any spec gaps
- [x] 1.2 Verify `scoreTone()` thresholds: pass ≥ 8, mid 5–7.9, fail < 5; CSS classes `ds-score--pass|mid|fail` in `app/globals.css`
- [x] 1.3 Verify `LetterPanel` footer shows singular “1 iteration” vs “N iterations” and `modelId` (BC-BRAND-02)
- [x] 1.4 Verify `LetterGaps` renders final `PipelineResult.gaps` below letter and omits section when empty
- [x] 1.5 Verify `IterationTimeline` lists all iterations with per-row `GapList` and “Final letter” marker on last row

## 2. Feedback and progress components

- [x] 2.1 Verify `CopyButton` copies exact text, shows “Copied” for 2s, clears timer on unmount; accessible label and `focus-ring`
- [x] 2.2 Verify `ErrorBanner` uses `role="alert"`, shows message + “Try again”, calls `reset` from hook
- [x] 2.3 Verify `ProgressStream` shows latest message with `role="status"` and `aria-live="polite"`; renders nothing when message is null
- [x] 2.4 Align component markup/styles with design-system references (`docs/design-system/components/results/`, `feedback/`) where drift exists

## 3. Home page wiring

- [x] 3.1 Verify `HomePageClient` results state machine: idle → null, running → `ProgressStream` only, complete → `PipelineResultsView`, error → `ErrorBanner` only (no partial results)
- [x] 3.2 Verify `reset()` clears `progressMessage`, `result`, and `error` while preserving `cvText` / `jobText`
- [x] 3.3 Confirm `PipelineResult.modelId` is populated end-to-end (`lib/model-config.ts` + pipeline runner)

## 4. Tests

- [x] 4.1 Keep/extend `components/results/score-badge.test.ts` for threshold boundaries (8.0, 7.9, 5.0, 4.9)
- [x] 4.2 Add `components/feedback/copy-button.test.tsx` — mock clipboard, fake timers, label reset at 2s
- [x] 4.3 Add test for results branching (e.g. `home-page-client` with mocked `usePipelineRun` or hook integration test) covering error vs complete vs running
- [x] 4.4 Run `npm run lint && npm run typecheck && npm test && npm run build`

## 5. Manual validation and handoff

- [x] 5.1 Manual: successful run shows letter, copy works, timeline badges, final gaps, brand footer
- [x] 5.2 Manual: simulated fatal error (invalid Gateway / forced API error) shows banner only; “Try again” returns to idle with inputs intact
- [x] 5.3 Manual: progress lines appear during run before results replace `ProgressStream`
- [x] 5.4 Update `docs/current-state.md` — mark `09-results-display` implemented when complete; note any remaining 11-deploy items
