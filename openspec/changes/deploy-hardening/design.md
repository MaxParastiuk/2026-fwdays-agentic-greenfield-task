## Context

All functional capabilities (01–10) are archived. The app is a Next.js 16 App Router single-page workflow: CV upload, job input, streamed pipeline via `POST /api/pipeline/run`, and results display. Server-only parsers (`pdf-parse`, `cheerio`) are already listed in `next.config.ts` `serverExternalPackages`. Eval logging writes to gitignored `evals/runs.jsonl` on the server filesystem (ephemeral on Vercel — acceptable for MVP).

This change does not add features; it deploys, measures, fixes regressions, and documents sign-off against NFR and deploy requirements from `docs/requirements.md` and `docs/capabilities/11-deploy-hardening.md`.

**Constraints:** BC-DEMO-01 (public, no auth), BC-PRIVACY-01–03 (no analytics/cookies/PII logging), NFR-SEC-01 (Gateway OIDC in prod, no provider keys in client), NFR-COST-01 (no paid third-party services beyond AI Gateway).

## Goals / Non-Goals

**Goals:**

- Production Vercel URL loads empty state and completes a full pipeline run
- Documented deploy/setup path for reviewers and course submission
- Lighthouse and bundle evidence recorded in change artifacts or `docs/current-state.md`
- Verified: no client bundle contamination from server parsers; a11y ≥ 95; FCP ≤ 1.5s (sample mobile + desktop); silent console on healthy session
- Requirements marked `shipped` where verified

**Non-Goals:**

- Persistent eval storage on Vercel (serverless FS is ephemeral — already documented in evals design)
- Load testing, CDN tuning, or multi-region config
- CI Lighthouse automation (manual run acceptable for MVP; optional script note only)
- Features listed under MVP out-of-scope in `requirements.md`

## Decisions

### 1. Vercel linking and env: Git integration + documented local pull

**Choice:** Use Vercel Git integration for production and preview deploys. Document in README: `vercel link`, `vercel env pull .env.local`, and note that production uses OIDC automatically (no long-lived gateway key in prod env).

**Rationale:** Matches TC-DEPLOY-01 and existing `.env.example`. Aligns with deploy skill guidance (linked project + git push).

**Alternative considered:** CLI-only deploy without git — rejected because preview-per-PR requires Git integration.

### 2. Bundle verification: `next build` output + grep, optional `@next/bundle-analyzer`

**Choice:** Primary check: inspect `.next` build output / Next.js route size table after `npm run build`; grep client chunks for `pdf-parse` and `cheerio` strings. Add `@next/bundle-analyzer` as devDependency only if grep is inconclusive.

**Rationale:** NFR-PERF-03 requires absence of server libs in client bundle and ≤ 150 KB gzipped initial JS. `serverExternalPackages` plus dynamic import in `lib/cv/extract-text.ts` should already satisfy this; build output confirms.

**Alternative considered:** `@next/bundle-analyzer` always — deferred unless manual inspection fails.

### 3. Lighthouse: manual run against production URL, record scores in change

**Choice:** Run Lighthouse (Chrome DevTools or `npx lighthouse <url> --only-categories=performance,accessibility`) on production home (empty state) and, if feasible, post-results state. Record FCP and a11y scores in `docs/current-state.md` or a short `docs/deploy-audit.md` section.

**Rationale:** NFR-PERF-02 and NFR-A11Y-01 are acceptance gates; automated CI is non-goal for MVP.

### 4. Console audit: manual session script

**Choice:** Open production URL, perform empty-state load + one successful pipeline (or mocked inputs if Gateway unavailable during audit), confirm DevTools console has zero errors/warnings unrelated to extensions.

**Rationale:** NFR-OBS-01. Fix React hydration warnings, missing keys, or aria issues at source.

### 5. Privacy audit: built HTML + Network tab

**Choice:** View page source and Network tab on production; confirm no `<script src="https://...analytics...">`, no `Set-Cookie` from app routes, no third-party tracker domains.

**Rationale:** BC-PRIVACY-01, BC-PRIVACY-03. Evals file is not HTTP-served (already spec'd in evals capability).

### 6. A11y contrast: design tokens + Lighthouse

**Choice:** Rely on existing semantic tokens from design system; if Lighthouse or axe flags contrast, fix token values in global CSS. WCAG AA both themes (NFR-A11Y-02) verified via Lighthouse a11y audit + spot-check focus rings (NFR-A11Y-01).

**Alternative considered:** Separate contrast tooling — only if Lighthouse fails.

### 7. Production pipeline timing: single manual run with stopwatch

**Choice:** One cold production run with representative CV + job text; wall clock ≤ 60s (NFR-PERF-01). Record model ID and iteration count in audit notes.

**Rationale:** Depends on Gateway latency; not unit-testable in CI without live credentials.

### 8. Requirements status updates

**Choice:** After verification, update `docs/requirements.md` from `proposed`/`accepted` to `shipped` for IDs verified in this change (see capability brief matrix).

**Rationale:** Traceability for course submission and handoff.

## Risks / Trade-offs

- **[Gateway latency / cold start]** → Pipeline may exceed 60s on cold Vercel function + slow model. **Mitigation:** Use default free-tier Flash model; note actual timing in audit; consider `maxDuration` in route config if Vercel default is too low.

- **[Ephemeral evals on Vercel]** → `evals/runs.jsonl` may not persist across invocations. **Mitigation:** Already accepted in evals design; not a deploy blocker.

- **[Lighthouse variance]** → Scores fluctuate by network and region. **Mitigation:** Run 2–3 samples; document best representative mobile + desktop run.

- **[README is course template]** → May need a project-specific section without removing course instructions. **Mitigation:** Add `## Job Application Agent — Deploy` subsection with URLs and env steps.

## Migration Plan

1. Ensure `npm run lint && npm run typecheck && npm test && npm run build` pass locally
2. `vercel link` (if not linked); configure env in Vercel dashboard (MODEL_ID optional; no `AI_GATEWAY_API_KEY` required in prod if OIDC works)
3. Push to main (or merge PR) for production; open PR for preview URL smoke test
4. Run Lighthouse, bundle grep, console, and privacy audits on production URL
5. Fix any failures; redeploy; re-run audits until gates pass
6. Update `docs/requirements.md`, `docs/current-state.md`; archive change

Rollback: revert deploy via Vercel dashboard to previous deployment; code rollback via git revert if fixes introduced regressions.

## Open Questions

- Is the Vercel project already linked in this fork? (Check `.vercel/` during apply — if missing, link in first task.)
- Production URL slug for course PR description — record after first deploy.
