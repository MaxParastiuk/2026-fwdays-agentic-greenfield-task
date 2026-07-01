## Context

Pipeline API (`08-pipeline-api`) is archived. `POST /api/pipeline/run` streams `progress`, `result`, and `error` events; `lib/hooks/use-pipeline-run.ts` consumes the stream and exposes `{ status, progressMessage, result, error, run, reset }`. `HomePageClient` already branches the results region: error → `ErrorBanner`, running → `ProgressStream`, complete → `PipelineResultsView`.

Partial implementation exists under `components/results/` (`LetterPanel`, `IterationTimeline`, `GapList`, `ScoreBadge`, `PipelineResultsView`), `components/feedback/` (`CopyButton`, `ErrorBanner`), and `components/pipeline/progress-stream.tsx`. Styles live in `app/globals.css` (`.ds-letter`, `.ds-tl`, `.ds-score`, `.ds-err`, `.ds-gaps`). `lib/model-config.ts` supplies `modelId` on `PipelineResult`.

**OpenSpec slug:** change folder `openspec/changes/results-display`; MVP capability slug `09-results-display`.

**Constraints:** FR-RESULTS-01 … FR-RESULTS-06, BC-BRAND-02, NFR-A11Y-01/02 (partial), frontend-design-system skill, `DESIGN.md`. No changes to pipeline API stream protocol (08).

## Goals / Non-Goals

**Goals:**

- Render final letter, copy action, iteration timeline, final gap list, and brand footer from `PipelineResult` (FR-RESULTS-01 … 04, BC-BRAND-02)
- Show live progress during runs; hide letter/timeline until success (FR-RESULTS-05)
- Fatal error banner with “Try again” that resets hook state; never show partial results (FR-RESULTS-06)
- Score badge colors: pass ≥ 8, mid 5–7.9, fail < 5 (FR-RESULTS-03)
- Component unit tests for `scoreTone`, copy timing, and results state branching; align with design-system reference components

**Non-Goals:**

- Evals JSONL logging (10)
- Lighthouse deploy pass (11) — but leave a11y hooks (labels, focus rings, live regions) in place
- Changes to `runPipeline`, API route, or stream event schema
- DOCX export, print stylesheet, or share links

## Decisions

### 1. Results state machine in `HomePageClient`

**Decision:** Keep a single render function (or small helper) that maps `usePipelineRun` status to exactly one results child:

| Status | Results content |
| ------ | ---------------- |
| `idle` | `null` (empty results region) |
| `running` | `ProgressStream` only |
| `complete` | `PipelineResultsView` |
| `error` | `ErrorBanner` with `onRetry={reset}` |

**Rationale:** Enforces FR-RESULTS-06 (no partial UI) without a separate state store. Inputs (`cvText`, `jobText`) remain in parent state across retry.

**Alternatives considered:** Dedicated `ResultsPanel` with internal switch — acceptable refactor but not required if `HomePageClient` stays readable.

### 2. Component decomposition

**Decision:**

| Component | Responsibility |
| --------- | -------------- |
| `PipelineResultsView` | Compose letter + final gaps + timeline from `PipelineResult` |
| `LetterPanel` | Letter chrome, final score badge, copy button, brand footer |
| `LetterGaps` | Final `PipelineResult.gaps` section (omit when empty) |
| `IterationTimeline` | Per-iteration rail, score badge, inline gaps |
| `ScoreBadge` + `scoreTone()` | Threshold logic and tone CSS classes |
| `GapList` | Bullet list or empty state |
| `CopyButton` | Clipboard write + 2s “Copied” timer |
| `ErrorBanner` | Alert role, message, optional retry |
| `ProgressStream` | Latest progress string, `aria-live="polite"` |

**Rationale:** Mirrors `docs/design-system/components/results/` and `feedback/` references; keeps server components unnecessary (all client-driven from hook).

### 3. Copy implementation

**Decision:** `CopyButton` calls `navigator.clipboard.writeText(text)` inside try/catch; always shows “Copied” for 2000 ms via `setTimeout` cleared on unmount.

**Rationale:** FR-RESULTS-02; silent failure avoids broken UX in non-secure contexts.

**Alternatives considered:** `document.execCommand('copy')` fallback — out of scope unless clipboard API testing reveals gaps.

### 4. Score thresholds

**Decision:** Pure function `scoreTone(score)` in `score-badge.tsx`:

- `score >= 8` → `pass` (green)
- `score >= 5` → `mid` (yellow)
- else → `fail` (red)

CSS classes: `ds-score--pass`, `ds-score--mid`, `ds-score--fail`.

**Rationale:** Matches FR-RESULTS-03 and design-system `ScoreBadge` reference; unit-tested without DOM.

### 5. Brand footer format

**Decision:** Footer text: `{n} iteration(s) · {modelId}` using singular “1 iteration” when `iterations === 1`. Values from `PipelineResult.iterations.length` and `PipelineResult.modelId`.

**Rationale:** BC-BRAND-02; `modelId` populated server-side via `lib/model-config.ts`.

### 6. Styling approach

**Decision:** Semantic BEM-style classes in `app/globals.css` (`.ds-letter`, `.ds-tl`, etc.) using design tokens (`var(--text-muted)`, `--surface-*`, `--score-*`). No Tailwind utility soup in results components beyond layout gaps.

**Rationale:** Matches existing app-shell and frontend-design-system skill; reference HTML in `docs/design-system/components/results/results.card.html`.

### 7. Testing strategy

**Decision:**

- Unit: `scoreTone` thresholds (exists)
- Unit: `CopyButton` timer/label behavior with mocked `clipboard` and fake timers
- Unit or RTL: `HomePageClient` results branching with mocked `usePipelineRun` (optional if hook tests cover contract)
- No E2E against live AI Gateway in CI

**Rationale:** NFR-DX-01; keeps tests fast and deterministic.

## Risks / Trade-offs

- **[Clipboard API unavailable in HTTP or old browsers]** → Silent “Copied” feedback; letter remains selectable manually
- **[ProgressStream minimal styling]** → May need design-system alignment pass; functional `aria-live` is priority
- **[Large letters in timeline]** → Long gap lists could affect scroll; acceptable for MVP demo lengths
- **[Partial code already landed]** → Tasks must verify against spec, not blindly re-implement; gaps are mostly tests and polish

## Migration Plan

1. Audit existing components against `specs/results/spec.md`
2. Add/finish tests and any missing acceptance criteria
3. Run `npm run lint && npm run typecheck && npm test && npm run build`
4. Manual demo: success path, copy, fatal error + retry
5. Archive change; sync spec to `openspec/specs/results/spec.md`; update `docs/current-state.md`

No database or API migration. Rollback is revert UI commits only.

## Open Questions

- Whether `ProgressStream` should adopt full design-system `ProgressStream` markup (spinner + message) or stay text-only for MVP — default: text-only unless design review requests more chrome
