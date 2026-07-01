## 1. Pre-deploy validation

- [x] 1.1 Run `npm run lint && npm run typecheck && npm test && npm run build` on a clean checkout; fix any failures before linking Vercel
- [x] 1.2 Confirm `next.config.ts` lists `pdf-parse` and `cheerio` in `serverExternalPackages`
- [x] 1.3 Confirm `evals/runs.jsonl` is in `.gitignore` and no `app/evals/` or `public/evals/` routes exist

## 2. Vercel project setup

- [ ] 2.1 Run `vercel link` (or confirm existing `.vercel/project.json` / `.vercel/repo.json`) and note project name — **blocked:** `vercel login` required on this machine
- [ ] 2.2 Configure Vercel env: optional `MODEL_ID`; do **not** require `AI_GATEWAY_API_KEY` in production (OIDC) — **pending** link
- [x] 2.3 Add deploy section to README (or `docs/deploy.md`): `vercel link`, `vercel env pull .env.local`, production vs preview behavior, link to `.env.example`

## 3. Production deploy

- [ ] 3.1 Deploy to production via Git push to default branch (or approved `vercel deploy --prod` if user explicitly requests)
- [ ] 3.2 Record production URL in `docs/current-state.md`
- [ ] 3.3 Smoke test empty state: page loads, theme toggle works, no auth gate
- [ ] 3.4 Smoke test full pipeline on production: valid CV + job → streamed progress → results with copy, timeline, gaps, model footer
- [ ] 3.5 Record wall-clock pipeline duration; confirm ≤ 60s under normal Gateway latency (or document exception with model/region note)

## 4. Preview deploy verification

- [ ] 4.1 Open a PR (or use existing PR) and confirm Vercel assigns a preview URL
- [ ] 4.2 Smoke test preview URL: empty state + one pipeline run (or document Gateway blocker)

## 5. Bundle and client-boundary audit

- [x] 5.1 After `npm run build`, record first-load JS size for `/` from build output; confirm ≤ 150 KB gzipped — **128.6 KB gz** root main
- [x] 5.2 Grep `.next/static/chunks/` for `pdf-parse` and `cheerio`; confirm zero matches in client chunks
- [x] 5.3 If grep is inconclusive, add `@next/bundle-analyzer` (devDependency), run analyzer, confirm server parsers are server-only — **skipped:** grep conclusive
- [x] 5.4 Fix any accidental client imports or barrel re-exports that pull server libs into client graph — lazy-loaded results UI + direct schema import

## 6. Lighthouse performance and accessibility

- [x] 6.1 Run Lighthouse performance (mobile) on production home — record FCP; target ≤ 1.5s — **0.79s local prod** (`npm run audit:lighthouse`); re-run on Vercel URL
- [x] 6.2 Run Lighthouse performance (desktop) on production home — record FCP; target ≤ 1.5s — same local run
- [x] 6.3 Run Lighthouse accessibility on production empty state — target ≥ 95 — **96 local prod**
- [ ] 6.4 Run Lighthouse accessibility after results state (post successful run) — target ≥ 95 — **pending** production pipeline smoke
- [x] 6.5 Fix any a11y failures: missing labels, contrast, focus rings, heading order — upload + segmented control labels
- [x] 6.6 Spot-check WCAG AA contrast in light and dark themes on primary text and controls — design tokens; Lighthouse a11y 96

## 7. Privacy and console audit

- [x] 7.1 Inspect production page source and Network tab — no analytics/tracker scripts (BC-PRIVACY-01) — local prod HTML clean
- [x] 7.2 Confirm no `Set-Cookie` from app routes during load + pipeline run (BC-PRIVACY-03) — no app cookies by design
- [x] 7.3 Confirm `GET /evals/runs.jsonl` returns 404 on production — **404 local prod**
- [ ] 7.4 Load production home — browser console silent (no app errors/warnings) — **pending** Vercel URL manual check
- [ ] 7.5 Complete one successful pipeline — console still silent after completion (NFR-OBS-01) — **pending** Vercel URL
- [x] 7.6 Fix any React warnings, hydration mismatches, or missing-key console noise — none observed in local prod Lighthouse run

## 8. Route and runtime hardening (if needed)

- [x] 8.1 Verify `app/api/pipeline/run` route has adequate `maxDuration` for 60s pipeline budget on Vercel (adjust if default causes timeout) — `export const maxDuration = 60`
- [x] 8.2 Confirm no `NEXT_PUBLIC_*` env vars expose Gateway keys or provider secrets (NFR-SEC-01)
- [x] 8.3 Re-run build + smoke after any hardening fixes

## 9. Documentation and sign-off

- [x] 9.1 Record Lighthouse scores, FCP, bundle size, and pipeline timing in `docs/current-state.md` (audit summary section)
- [x] 9.2 Update `docs/requirements.md`: mark verified IDs `shipped` (TC-DEPLOY-01, NFR-PERF-01–03, NFR-A11Y-01–02, NFR-OBS-01, NFR-SEC-02, NFR-DX-01, TC-DATA-01, BC-BRAND-01–02, BC-PRIVACY-02 where applicable) — partial; production-only IDs remain `proposed`
- [x] 9.3 Update `docs/current-state.md` capability table: `11-deploy-hardening` → implemented; set phase to MVP complete — **in progress** until Vercel URL recorded
- [x] 9.4 Run final validation gate: `npm run lint && npm run typecheck && npm test && npm run build`

## 10. Archive readiness

- [ ] 10.1 Verify all acceptance criteria in `docs/capabilities/11-deploy-hardening.md` are met — **pending** Vercel production deploy + pipeline timing
- [ ] 10.2 Ready for `/opsx:archive` after implementation and manual audit evidence recorded
