## Why

Capabilities 01–10 are implemented and archived: the Job Application Agent runs end-to-end locally with streaming pipeline, results UI, and privacy-safe eval logging. Capability `11-deploy-hardening` is the final MVP gate — ship to Vercel, verify performance, accessibility, security, and privacy constraints on a production URL, and mark the demo ready per BC-DEMO-01. Without this change, NFR and deploy requirements remain unverified and the course deliverable lacks a public URL.

## What Changes

- Link the repository to a Vercel project and document `vercel link` / `vercel env pull` in project docs (TC-DEPLOY-01)
- Deploy production and confirm preview deployments per PR via Git integration (TC-DEPLOY-01)
- Run Lighthouse on the production URL for FCP (NFR-PERF-02) and accessibility ≥ 95 (NFR-A11Y-01)
- Verify client bundle excludes `pdf-parse` and `cheerio`; initial JS ≤ 150 KB gzipped (NFR-PERF-03)
- Smoke-test full pipeline on production within 60s under normal Gateway latency (NFR-PERF-01)
- Audit built HTML and runtime for analytics, cookies, and third-party trackers (BC-PRIVACY-01, BC-PRIVACY-03)
- Confirm silent browser console on a healthy session (NFR-OBS-01); fix any client warnings/errors found
- Fix regressions discovered during audit (bundle leaks, a11y gaps, console noise)
- Record measurement results in the change; update `docs/requirements.md` statuses to `shipped` where verified
- Update `docs/current-state.md` with production URL and validation evidence

## Capabilities

### New Capabilities

- `deploy`: Vercel hosting, production/preview deploy workflow, Lighthouse and bundle verification, privacy/console audit, and MVP demo sign-off (TC-DEPLOY-01, NFR-PERF-01 … 03, NFR-A11Y-01 … 02, NFR-OBS-01, BC-PRIVACY-01 … 03, BC-DEMO-01)

### Modified Capabilities

<!-- No existing spec-level behavior changes — this change verifies and hardens shipped capabilities. -->

## Impact

- **Docs:** README or `docs/` deploy section; `docs/requirements.md` status updates; `docs/current-state.md` handoff
- **Config:** possible `vercel.json`, `next.config.ts` tweaks (e.g. headers, bundle hints); no new runtime npm dependencies unless bundle analysis tooling is added as devDependency
- **Code fixes:** targeted fixes only for audit failures (a11y labels, contrast, console warnings, accidental client imports)
- **External:** Vercel project, AI Gateway OIDC in production (`VERCEL_OIDC_TOKEN` automatic); optional `AI_GATEWAY_API_KEY` for local dev only
- **Out of scope:** new features, analytics dashboards, auth, evals HTTP exposure
