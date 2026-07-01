# Current state

Handoff aid — verify against code and OpenSpec if anything disagrees.

- **Date and time:** 2026-07-01 19:45:00 (Europe/Kyiv)
- **Phase:** Deploy hardening in progress — local audits pass; Vercel production URL pending

## Summary

The Job Application Agent MVP (capabilities 01–10) is feature-complete. OpenSpec change **`deploy-hardening`** is in progress: route hardening, bundle/Lighthouse audit scripts, deploy docs, and a11y fixes are landed. Local production audits pass NFR-PERF-03 (128.6 KB gz root JS), FCP ~0.79s, and Lighthouse a11y 96.

**Production URL:** not deployed yet — run `vercel login` && `vercel link`, then push to `main` (see [`deploy.md`](deploy.md)).

## Capability status

| Slug | Status |
| ---- | ------ |
| `01-foundation` | **implemented** (archived `foundation`) |
| `02-maker-agent` | **implemented** (archived `maker-agent`) |
| `03-checker-agent` | **implemented** (archived `checker-agent`) |
| `04-pipeline` | **implemented** (archived `pipeline`) |
| `05-app-shell` | **implemented** (archived `app-shell`) |
| `06-cv-upload` | **implemented** (archived `cv-upload`) |
| `07-job-input` | **implemented** (archived `job-input`) |
| `08-pipeline-api` | **implemented** (archived `pipeline-api`) |
| `09-results-display` | **implemented** (archived `results-display`) |
| `10-evals-logging` | **implemented** (archived `evals-logging`) |
| `11-deploy-hardening` | **in progress** (OpenSpec `deploy-hardening`) |

## Deploy hardening audit (local production, 2026-07-01)

Run on `npm run build && PORT=3001 npm run start`:

| Check | Result | Command / evidence |
| ----- | ------ | ------------------ |
| Root main JS | **128.6 KB gz** (≤150 KB) | `npm run audit:bundle` |
| pdf-parse / cheerio in client | **absent** | `npm run audit:bundle` |
| FCP | **0.79s** (≤1.5s) | `npm run audit:lighthouse` → `docs/lighthouse-last-run.txt` |
| Lighthouse a11y | **96** (≥95) | same |
| Lighthouse perf | **93** | same |
| `/evals/runs.jsonl` | **404** | local prod smoke |
| Analytics scripts in HTML | **none** | page source review |
| `maxDuration` on pipeline route | **60s** | `app/api/pipeline/run/route.ts` |

## What landed in deploy hardening (11, partial)

- `docs/deploy.md` — Vercel link, env, checklist
- `scripts/audit-client-bundle.mjs` + `npm run audit:bundle`
- `scripts/audit-lighthouse.mjs` + `npm run audit:lighthouse`
- `maxDuration = 60` on `POST /api/pipeline/run`
- Lazy-loaded results/progress/error UI (`next/dynamic`) to meet JS budget
- A11y: `aria-label` on CV upload zone and segmented control group
- Direct schema import in `home-page-client` (avoids barrel bloat)

## Next step

1. `vercel login` && `vercel link` (no `.vercel/` in repo yet)
2. Push to `main` → record production URL here
3. Re-run checklist on production: pipeline ≤60s, Lighthouse, console silent
4. Mark remaining requirements `shipped` in `requirements.md`
5. `/opsx:archive` for `deploy-hardening`

## Blockers

- **Vercel CLI not authenticated** on this machine (`vercel login` required). Git remote exists: `github.com/MaxParastiuk/2026-fwdays-agentic-greenfield-task.git`.

Gateway auth for pipeline runs:

- **Deployed:** OIDC (`VERCEL_OIDC_TOKEN`) — automatic on Vercel
- **Local:** `.env.local` with `AI_GATEWAY_API_KEY` via `vercel env pull`

## Validation

```bash
npm run lint && npm run typecheck && npm test && npm run build
npm run audit:bundle
```

All pass after deploy-hardening code changes.
