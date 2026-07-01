# Capability: Results display

**OpenSpec slug:** `09-results-display`  
**Depends on:** `05-app-shell`, `08-pipeline-api`  
**Blocks:** `11-deploy-hardening` (partial)

## Purpose

Show the final letter, copy action, iteration timeline, gap analysis, and fatal
error recovery UI.

## Requirements covered

| ID | Summary |
| -- | ------- |
| FR-RESULTS-01 | Styled copyable letter panel |
| FR-RESULTS-02 | Copy button → “Copied” for 2s |
| FR-RESULTS-03 | Timeline with score badges (green ≥8, yellow 5–7.9, red <5) + gaps |
| FR-RESULTS-04 | Final iteration gaps as bullet list under letter |
| FR-RESULTS-05 | Consume streamed progress (from 08) in `ProgressStream` |
| FR-RESULTS-06 | Fatal error banner + “Try again”; hide partial results |
| BC-BRAND-02 | Muted line: “N iterations · model-id” |

Also: NFR-A11Y-01/02, BC-BRAND-01.

## Scope

### In scope

- `LetterPanel`, `CopyButton`, `IterationTimeline`, `ScoreBadge`, `GapList`,
  `ErrorBanner`, `ProgressStream`
- Client parser for 08 stream
- Reset to input state on “Try again”
- Hide results panel until success; show progress during run

### Out of scope

- Evals file (10)
- Deploy tuning (11)

## Acceptance criteria

1. Successful run displays `finalLetter` and all iteration badges.
2. Copy writes exact letter text; label resets after 2s.
3. Simulated fatal error shows banner only—no letter/timeline.
4. Badge colors match score thresholds.
5. Brand footer shows iteration count and `modelId` from result.

## OpenSpec artifacts

- **Specs:** `specs/results/spec.md`
