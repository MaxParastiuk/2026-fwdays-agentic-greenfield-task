# Capability: Pipeline loop

**OpenSpec slug:** `04-pipeline`  
**Depends on:** `02-maker-agent`, `03-checker-agent`  
**Blocks:** `08-pipeline-api`, `10-evals-logging`

## Purpose

Orchestrate Maker → Checker iterations until score ≥ 8.0 or three rounds
complete; return structured `PipelineResult`.

## Requirements covered

| ID | Summary |
| -- | ------- |
| FR-PIPE-01 | `runPipeline(cv, jobText)` in `pipeline/runner.ts` |
| FR-PIPE-02 | Maker → Checker; if score < 8 and iteration < 3, re-call Maker with gaps |
| FR-PIPE-03 | Exit at score ≥ 8 or after 3 iterations; `finalLetter` = last letter |
| FR-PIPE-04 | `PipelineResult`: `finalLetter`, `iterations[]`, `finalScore`, `gaps` |
| FR-PIPE-05 | Each `IterationRecord`: iteration, letter, score, gaps |
| FR-PIPE-06 | Eval write errors must not abort (stub/no-op until 10; interface ready) |

Fatal vs recoverable failures (from requirements): network/LLM faults throw;
Checker parse failures do not (FR-CHECKER-04).

## Scope

### In scope

- `pipeline/runner.ts` importing maker + checker only (TC-ARCH-01)
- Unit tests with mocked agents: 1-iteration success, 3-iteration cap, sub-8 final score
- Progress callback hook (for 08 streaming) optional in design

### Out of scope

- HTTP/streaming (08)
- JSONL append implementation (10)—but runner must catch logging errors when wired

## Acceptance criteria

1. Score 9 on iteration 1 → exactly 1 Maker + 1 Checker call.
2. Scores 5, 6, 7 across three iterations → 3 letters; `finalScore` = 7.
3. Score 8 on iteration 2 → stops early; 2 iterations recorded.
4. `PipelineResult` matches Zod schema from 01.
5. Injecting a throwing eval logger does not prevent `runPipeline` resolving.

## OpenSpec artifacts

- **Specs:** `specs/pipeline/spec.md`
