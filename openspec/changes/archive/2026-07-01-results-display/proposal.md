## Why

Pipeline API (08) streams progress and returns a final `PipelineResult`, but visitors still need a polished results experience: a copyable cover letter, iteration timeline with score badges, gap analysis, live progress during runs, and clear fatal-error recovery. Capability `09-results-display` completes Phase 6 of the MVP plan and satisfies FR-RESULTS-01 through FR-RESULTS-06 plus BC-BRAND-02. Core UI components are partially landed; this change formalizes requirements, closes acceptance gaps, and wires remaining polish and tests.

## What Changes

- Add results UI components: `LetterPanel`, `CopyButton`, `IterationTimeline`, `ScoreBadge`, `GapList`, `ErrorBanner`, `ProgressStream`, and `PipelineResultsView` composing them from `PipelineResult`
- Wire `HomePageClient` results region: hide letter/timeline until success; show `ProgressStream` while running; show `ErrorBanner` with “Try again” on fatal error (no partial results)
- Implement copy-to-clipboard with “Copied” label for 2 seconds (FR-RESULTS-02)
- Color score badges by threshold: green ≥ 8, yellow 5–7.9, red < 5 (FR-RESULTS-03)
- Show final-iteration gaps as a bullet list under the letter (FR-RESULTS-04)
- Display brand footer: “N iterations · model-id” in muted text (BC-BRAND-02)
- Consume streamed progress from 08 via `usePipelineRun` / `ProgressStream` (FR-RESULTS-05)
- Add component and integration tests; align styles with design-system tokens (NFR-A11Y-01/02 partial)

## Capabilities

### New Capabilities

- `results`: Visitor-facing results display — letter panel, copy action, iteration timeline, gap list, progress stream, fatal error banner, and brand footer (FR-RESULTS-01 … FR-RESULTS-06, BC-BRAND-02)

### Modified Capabilities

<!-- No existing spec requirements change; pipeline-api and app-shell contracts are consumed as-is -->

## Impact

- **New files:** `components/results/*`, `components/feedback/copy-button.tsx`, `components/feedback/error-banner.tsx`; `lib/model-config.ts` if not already shared; unit tests for `scoreTone`, copy behavior, and results composition
- **Modified files:** `components/home/home-page-client.tsx` (results state machine); `app/globals.css` (letter, timeline, score, gap, error styles); optional `lib/hooks/use-pipeline-run.ts` if reset behavior needs refinement
- **Existing contracts:** Consumes `PipelineResult`, `IterationRecord`, and stream events from `lib/pipeline/` and `lib/hooks/use-pipeline-run.ts` (08); no API route changes
- **Dependencies:** No new npm packages; design-system tokens and reference components under `docs/design-system/components/results/` and `feedback/`
- **Blocks:** `11-deploy-hardening` (Lighthouse a11y pass on results UI)
- **Out of scope:** Evals JSONL (10), deploy tuning (11), changes to pipeline streaming protocol (08)
