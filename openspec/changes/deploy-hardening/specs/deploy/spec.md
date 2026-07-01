# deploy Specification

## Purpose

Vercel hosting, production readiness verification, and MVP demo sign-off for the Job Application Agent (capability `11-deploy-hardening`).

## ADDED Requirements

### Requirement: Vercel hosting with Git-based deploys

The application SHALL be deployed on Vercel with Git integration providing a production URL on the default branch and a preview URL for each pull request. Production LLM authentication SHALL use Vercel AI Gateway OIDC (`VERCEL_OIDC_TOKEN`, automatic on Vercel) without requiring a long-lived `AI_GATEWAY_API_KEY` in production environment variables. Local development MAY use `AI_GATEWAY_API_KEY` via `vercel env pull` (TC-DEPLOY-01, NFR-SEC-01).

#### Scenario: Production URL serves the application

- **WHEN** a visitor opens the Vercel production URL
- **THEN** the home page loads the app shell with empty state and no authentication gate (BC-DEMO-01)

#### Scenario: Preview deployment on pull request

- **WHEN** a pull request is opened against the linked repository
- **THEN** Vercel builds and assigns a unique preview URL accessible without authentication

#### Scenario: OIDC in production

- **WHEN** `POST /api/pipeline/run` executes on the Vercel production deployment
- **THEN** the AI Gateway client authenticates via OIDC without `AI_GATEWAY_API_KEY` set in production env

#### Scenario: Documented local env setup

- **WHEN** a developer follows project deploy documentation
- **THEN** instructions describe `vercel link` and `vercel env pull .env.local` for local Gateway credentials

### Requirement: Pipeline completes within performance budget on production

An end-to-end pipeline run on the production URL (three iterations maximum, cold or warm serverless invocation) SHALL complete within 60 seconds under normal AI Gateway latency for the configured model (NFR-PERF-01).

#### Scenario: Successful production pipeline within budget

- **WHEN** a visitor submits valid CV and job inputs and runs the pipeline on production
- **THEN** the streamed run completes with a final result within 60 seconds wall-clock time under typical Gateway conditions

#### Scenario: Timing recorded in project docs

- **WHEN** deploy hardening sign-off is complete
- **THEN** measured production pipeline duration (or representative sample) is recorded in project handoff documentation

### Requirement: First Contentful Paint on production

The Vercel production URL SHALL achieve First Contentful Paint ≤ 1.5 seconds on Lighthouse performance audits for both mobile and desktop configurations (NFR-PERF-02).

#### Scenario: Mobile FCP target

- **WHEN** Lighthouse performance is run against the production home page with mobile settings
- **THEN** First Contentful Paint is ≤ 1.5 seconds

#### Scenario: Desktop FCP target

- **WHEN** Lighthouse performance is run against the production home page with desktop settings
- **THEN** First Contentful Paint is ≤ 1.5 seconds

### Requirement: Client bundle size and server-only dependency isolation

The initial client JavaScript payload SHALL be ≤ 150 KB gzipped. The packages `pdf-parse` and `cheerio` MUST NOT appear in any client bundle chunk (NFR-PERF-03, TC-STACK-04, TC-STACK-05).

#### Scenario: Build output within size budget

- **WHEN** `npm run build` completes
- **THEN** the reported first-load JS for the home route is ≤ 150 KB gzipped (or equivalent Next.js build metric)

#### Scenario: pdf-parse absent from client chunks

- **WHEN** client JavaScript chunks under `.next/static/chunks/` are searched after production build
- **THEN** no chunk contains `pdf-parse` module references

#### Scenario: cheerio absent from client chunks

- **WHEN** client JavaScript chunks under `.next/static/chunks/` are searched after production build
- **THEN** no chunk contains `cheerio` module references

#### Scenario: Server parsers remain server-only

- **WHEN** static analysis inspects client components and `"use client"` module graphs
- **THEN** `lib/cv/extract-text.ts` and `lib/job/extract-text.ts` are reachable only from API route handlers or server modules

### Requirement: Lighthouse accessibility threshold

The application SHALL score ≥ 95 on Lighthouse Accessibility for the production home page in empty state and SHALL maintain visible focus styles and accessible names on interactive elements (NFR-A11Y-01).

#### Scenario: Empty state a11y score

- **WHEN** Lighthouse accessibility is run on the production home page (empty state)
- **THEN** the accessibility score is ≥ 95

#### Scenario: Results state a11y score

- **WHEN** Lighthouse accessibility is run on the production home page after a completed pipeline run (results visible)
- **THEN** the accessibility score is ≥ 95

#### Scenario: Focus visibility

- **WHEN** a keyboard user tabs through interactive controls on the home page
- **THEN** each focusable element displays a visible focus indicator

### Requirement: WCAG AA contrast in both themes

Color tokens for light and dark themes SHALL meet WCAG AA contrast ratios for text and interactive UI (NFR-A11Y-02, FR-SHELL-05).

#### Scenario: Light theme contrast

- **WHEN** the application uses the light theme
- **THEN** primary text and control labels meet WCAG AA contrast against their backgrounds

#### Scenario: Dark theme contrast

- **WHEN** the application uses the dark theme
- **THEN** primary text and control labels meet WCAG AA contrast against their backgrounds

### Requirement: Silent browser console on healthy session

During a normal visitor session (load empty state, optionally complete one successful pipeline), the browser console SHALL emit no errors and no warnings attributable to application code (NFR-OBS-01).

#### Scenario: Empty state console clean

- **WHEN** a visitor loads the production home page without interaction
- **THEN** the browser console contains no application errors or warnings

#### Scenario: Successful run console clean

- **WHEN** a visitor completes one successful pipeline run on production
- **THEN** the browser console contains no application errors or warnings after the run finishes

#### Scenario: Server diagnostics not exposed to client

- **WHEN** eval append or other server-only operations fail in production
- **THEN** no failure details appear in the browser console or API response body beyond user-safe error messages

### Requirement: No analytics, trackers, or application cookies

The deployed application MUST NOT include third-party analytics scripts, fingerprinting, or tracker pixels. Application code MUST NOT set cookies (BC-PRIVACY-01, BC-PRIVACY-03).

#### Scenario: Built HTML free of tracker scripts

- **WHEN** the production home page HTML is inspected
- **THEN** no third-party analytics or tracking script tags are present

#### Scenario: No Set-Cookie from app routes

- **WHEN** a visitor loads the home page and runs the pipeline API on production
- **THEN** responses from application routes do not include `Set-Cookie` headers set by application code

#### Scenario: Evals not HTTP-accessible on production

- **WHEN** a client requests `/evals/runs.jsonl` or any path under `/evals/` on production
- **THEN** the response is not-found and does not expose eval file contents (FR-EVALS-03)

### Requirement: Public demo without authentication

The production and preview URLs SHALL be publicly accessible without login, consistent with the course deliverable model (BC-DEMO-01).

#### Scenario: No auth gate on production

- **WHEN** an unauthenticated visitor opens the production URL
- **THEN** the full MVP workflow (inputs, run, results) is usable without credentials

#### Scenario: Production URL documented

- **WHEN** deploy hardening is complete
- **THEN** the production URL is recorded in `docs/current-state.md` for reviewers

### Requirement: Pre-ship validation gate

All local quality gates SHALL pass before production sign-off (NFR-DX-01).

#### Scenario: Local validation commands pass

- **WHEN** `npm run lint && npm run typecheck && npm test && npm run build` is executed on a clean checkout before deploy sign-off
- **THEN** all four commands exit successfully

### Requirement: Requirement traceability sign-off

Verified requirement IDs from this capability SHALL be marked `shipped` in `docs/requirements.md` upon successful audit (see capability brief traceability matrix).

#### Scenario: Deploy and NFR statuses updated

- **WHEN** all acceptance criteria in this spec are verified on production
- **THEN** `docs/requirements.md` lists TC-DEPLOY-01, NFR-PERF-01 through NFR-PERF-03, NFR-A11Y-01, NFR-A11Y-02, NFR-OBS-01, and cross-cutting BC-PRIVACY and BC-DEMO items as `shipped` where applicable
