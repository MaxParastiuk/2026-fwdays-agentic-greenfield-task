# Job Application Agent

**Homework — fwdays Academy · Agentic Engineering: Greenfield**

A privacy-first web app that turns a CV and job posting into a tailored cover letter through a multi-agent **Maker → Checker** AI pipeline. Visitors upload a resume (PDF or plain text), provide the job posting (URL or pasted text), run the loop, and receive the best letter along with scores and gap analysis. No accounts, no cookies, no analytics.

## What it does

1. CV upload (PDF / plain text) with server-side PDF parsing
2. Job posting input (URL scraping or pasted text)
3. Maker → Checker loop (up to 3 iterations, target score ≥ 8/10)
4. Output: cover letter, score history, gap list, copy button

## Stack

| Layer | Technology |
| ----- | ---------- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, design system (`DESIGN.md`) |
| AI | Vercel AI SDK + AI Gateway (`google/gemini-2.0-flash`) |
| Validation | Zod 4 |
| Tests | Jest + Testing Library |
| Deploy | Vercel |

## Agentic Engineering artifacts

| Practice | Where in the repo |
| -------- | ----------------- |
| **Context engineering** | `AGENTS.md`, `.agents/skills/`, `docs/current-state.md` (dynamic handoff), `docs/requirements.md` (static PRD) |
| **SDD / specs upfront** | OpenSpec: `openspec/specs/`, changes in `openspec/changes/` |
| **Maker ≠ Checker** | Separate `agents/maker.ts` and `agents/checker.ts` with no cross-imports; orchestration in `pipeline/runner.ts` |
| **Loop engineering** | Pipeline iterates the letter until score ≥ 8 or 3 attempts |
| **Verification** | `npm test` (25+ test files), `npm run audit:bundle`, `npm run audit:lighthouse`, evals logger (`evals/`) |

See the [PR template](.github/pull_request_template.md) for submission details.

## Local development

```bash
npm install
cp .env.example .env.local
# Add AI_GATEWAY_API_KEY from Vercel AI Gateway, or: vercel env pull .env.local
npm run dev
```

Open http://localhost:3000

### Verification

```bash
npm run lint && npm run typecheck && npm test && npm run build
npm run audit:bundle
npm run audit:lighthouse   # requires production build + Chrome
```

Deploy and production checklist: [`docs/deploy.md`](docs/deploy.md)

## Structure

```
app/              # Next.js routes (UI + API)
agents/           # Maker and Checker (isolated agents)
pipeline/         # Loop orchestrator
components/       # UI (forms, results, feedback)
lib/              # Schemas, CV/job parsing, evals
openspec/         # Specs and changes (SDD)
docs/             # PRD, deploy, design system, handoff
evals/            # Run logs (gitignored)
```

## Submission (course assignment)

1. **Fork** this repository (CodeRabbit config and PR template included).
2. Enable **CodeRabbit** on your fork (free for public repos).
3. Put your project on a separate branch (`job-application-agent` → PR to `main`).
4. Open a **Pull Request** and fill in the [template](.github/pull_request_template.md):
   - your real name;
   - link to a 1–2 min video demo;
   - description of agentic practices (what the agent did vs what you did, tools / MCP used).
5. Address CodeRabbit feedback, iterate if needed, submit the PR link.

### Checklist

- [ ] Production deploy works publicly (Deployment Protection off)
- [ ] Full pipeline runs end-to-end (CV + job → letter)
- [ ] Video demo recorded
- [ ] PR filled out per template
- [ ] CodeRabbit feedback addressed

---

Questions — course channel.
