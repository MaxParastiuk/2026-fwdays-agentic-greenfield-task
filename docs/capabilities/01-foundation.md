# Capability: Foundation

**OpenSpec slug:** `01-foundation`  
**Depends on:** —  
**Blocks:** all other capabilities

## Purpose

Shared types, validation schemas, test harness, and project conventions so every
later capability imports from a framework-free `lib/` layer.

## Requirements covered

| ID | Summary |
| -- | ------- |
| TC-STACK-01 | Next.js 15 App Router, TypeScript strict, React 19 |
| TC-STACK-06 | Zod for API bodies and Checker output |
| TC-STACK-07 | Jest + RTL; coverage required for `agents/`, `pipeline/`, `lib/` |
| TC-ARCH-03 | `lib/` has no `next/*`, `react`, or DOM globals |
| NFR-DX-01 | `lint && tsc && test && build` < 90s |
| TC-DATA-01 | Prepare `evals/` path + `.gitignore` entry (full logging in 10) |

Partial setup for accepted constraints: TC-STACK-02/03, TC-ARCH-01/02 (documented, enforced in later caps).

## Scope

### In scope

- `lib/schemas/` — `CheckResult`, `PipelineResult`, `IterationRecord`, API request/response shapes
- `lib/validation/` — shared Zod parsers reused by API routes and client forms
- Jest config, test utilities, example smoke test
- Directory layout: `agents/`, `pipeline/`, `lib/`, `evals/` (empty), `app/api/`
- `evals/runs.jsonl` in `.gitignore`

### Out of scope

- Agent implementations (02, 03)
- UI components (05+)
- Vercel deploy (11)

## Acceptance criteria

1. `lib/` modules import only Node-safe dependencies; `tsc` proves no React/Next in `lib/`.
2. Zod schemas export inferred TypeScript types; no `any` on validated data.
3. `npm test` runs at least one `lib/` unit test green on clean checkout.
4. `npm run lint && npm run typecheck && npm test && npm run build` succeeds.

## OpenSpec artifacts

- **Proposal:** establish shared contracts before agents/UI diverge
- **Design:** folder layout, schema naming, test strategy
- **Specs:** `specs/lib/spec.md`
- **Tasks:** jest setup, schemas, gitignore, CI script verification

## Notes

FR-MAKER-05 and FR-CHECKER-05 are already `accepted` in requirements—preserve
import boundaries when scaffolding `agents/`.
