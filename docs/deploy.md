# Deploy — Job Application Agent

Last updated: 2026-07-01

Production hosting is on **Vercel** with Git integration (TC-DEPLOY-01). The app is a public demo with no authentication (BC-DEMO-01).

## Prerequisites

- Node.js 20+
- [Vercel CLI](https://vercel.com/docs/cli) (`npm i -g vercel`)
- Git remote connected to GitHub (for preview-per-PR deploys)
- Vercel account with AI Gateway enabled

## First-time setup

```bash
# From repo root
vercel login
vercel link
```

Choose your team and create or link a project. For Git-based preview deploys on every PR, connect the repo in the Vercel dashboard under **Project → Settings → Git**.

### Environment variables

| Variable | Production | Local dev |
| -------- | ---------- | --------- |
| `AI_GATEWAY_API_KEY` | **Not required** — OIDC (`VERCEL_OIDC_TOKEN`) is injected automatically | Set via `vercel env pull .env.local` or paste from [AI Gateway → API keys](https://vercel.com/dashboard) |
| `MODEL_ID` | Optional — defaults to a free-tier Flash model | Same |

Copy `.env.example` as a reference:

```bash
cp .env.example .env.local
vercel env pull .env.local
```

**Do not** set `NEXT_PUBLIC_*` gateway or provider keys (NFR-SEC-01).

`next.config.ts` must list `pdf-parse` and `@napi-rs/canvas` in `serverExternalPackages` so PDF parsing works on Vercel (see [pdf-parse troubleshooting](https://github.com/mehmet-kozan/pdf-parse/blob/main/docs/troubleshooting.md)).

### Deployment Protection (public demo)

BC-DEMO-01 requires a **public** demo with no login wall. If visitors are redirected to Vercel Login, disable protection:

1. Vercel dashboard → **Project** → **Settings** → **Deployment Protection**
2. Set **Vercel Authentication** (and any SSO requirement) to **Off** for Production (and Preview if reviewers need unauthenticated access)

Without this, `/api/*` routes also redirect unauthenticated `fetch` calls, so CV upload and the pipeline fail silently for public users.

**Production URL (2026-07-01):** https://2026-fwdays-agentic-greenfield-task-delta.vercel.app/

## Deploy workflow

### Production (default branch)

Push to `main` (or your production branch). Vercel builds and deploys automatically.

```bash
git push origin main
```

### Preview (pull requests)

Open a PR — Vercel comments with a preview URL. No extra steps.

### Manual CLI deploy (optional)

Preview only unless you explicitly need production:

```bash
vercel deploy -y --no-wait          # preview
vercel deploy --prod -y --no-wait   # production — use sparingly
```

## Local production smoke

```bash
npm run lint && npm run typecheck && npm test && npm run build
npm run start
# open http://localhost:3000
```

Run one full pipeline with Gateway credentials in `.env.local`.

## Audit scripts

After `npm run build`:

```bash
npm run audit:bundle    # client chunk sizes + pdf-parse/cheerio grep
npm run audit:lighthouse  # Lighthouse perf + a11y on local production server (port 3001)
```

Record scores in `docs/current-state.md` after deploying to Vercel production.

## Production checklist

1. Empty state loads; system light/dark theme works (FR-SHELL-05)
2. Full pipeline completes in ≤60s (NFR-PERF-01)
3. Lighthouse FCP ≤1.5s, a11y ≥95 on production URL (NFR-PERF-02, NFR-A11Y-01)
4. `npm run audit:bundle` — initial JS ≤150 KB gzipped; no server parsers in client chunks (NFR-PERF-03)
5. Browser console silent on healthy session (NFR-OBS-01)
6. No analytics scripts or app `Set-Cookie` headers (BC-PRIVACY-01, BC-PRIVACY-03)
7. `GET /evals/runs.jsonl` returns 404 (FR-EVALS-03)

## Pipeline timeout

`POST /api/pipeline/run` sets `maxDuration = 60` seconds to match the Maker–Checker budget on Vercel.

## Evals on Vercel

`evals/runs.jsonl` is gitignored and written server-side only. On serverless, the file is **ephemeral** (may not persist across invocations). Local dev is the primary inspection path.
