# Capability: Deploy & hardening

**OpenSpec slug:** `11-deploy-hardening`  
**Depends on:** all capabilities 01–10  
**Blocks:** —

## Purpose

Ship to Vercel, verify performance/accessibility/security constraints, and mark
MVP demo-ready per BC-DEMO-01.

## Requirements covered

| ID | Summary |
| -- | ------- |
| TC-DEPLOY-01 | Vercel hosting; OIDC in prod; preview per PR |
| NFR-PERF-01 | Pipeline ≤ 60s (3 iterations, cold) |
| NFR-PERF-02 | FCP ≤ 1.5s on production URL |
| NFR-PERF-03 | Client JS ≤ 150 KB gzipped; no pdf-parse/cheerio client-side |
| NFR-A11Y-01 | Lighthouse a11y ≥ 95 |
| NFR-A11Y-02 | WCAG AA contrast both themes |
| NFR-OBS-01 | Silent browser console on healthy session |
| BC-PRIVACY-01–03 | No analytics, cookies, or PII logging |
| BC-DEMO-01 | Public demo without auth |

Also: verify NFR-SEC-01, NFR-COST-01, accepted TC-* in production config.

## Scope

### In scope

- `vercel link`, env pull docs in README
- Production + preview smoke test checklist
- Lighthouse / bundle analyzer run recorded in change
- Fix regressions found in audit
- Update `requirements.md` statuses to `shipped` where verified

### Out of scope

- Features listed under MVP out-of-scope in requirements.md

## Acceptance criteria

1. Production URL loads empty state with FCP target met (mobile + desktop sample).
2. Full pipeline run completes on production within 60s under normal Gateway latency.
3. Client bundle report shows pdf-parse and cheerio absent.
4. Lighthouse a11y ≥ 95 on home + results state.
5. No third-party analytics scripts in built HTML.
6. Preview deployment works from PR.

## OpenSpec artifacts

- **Specs:** `specs/deploy/spec.md`
- **Tasks:** deploy, measure, fix, document URLs

## Notes

Run after functional MVP (01–10). Some NFR checks can start earlier (bundle size
after 06/07) but this change owns sign-off.
