---
name: frontend-design-system
description: Implements Job Application Agent UI using the project design system — semantic CSS tokens, Newsreader/Public Sans/JetBrains Mono fonts, shadcn/ui primitives, and reference components. Use when building or editing React/Next.js UI, pages, components, styling, copy, layouts, forms, feedback states, or results views; when the user mentions design system, tokens, DESIGN.md, or brand voice.
---

# Frontend Design System

Follow this skill before writing any UI code in this project.

## Design System

Before writing any UI code, read `DESIGN.md`. It is the authoritative design reference for this project:

- **Tokens** are already integrated into `app/globals.css`; always use semantic CSS variables (`--text-body`, `--surface-card`, `--action-bg`, `--pass`…), never raw hex.
- **Fonts** — Newsreader (titles + the letter), Public Sans (UI chrome), JetBrains Mono (scores, model IDs, evals) — are loaded via `next/font/google` in `app/layout.tsx`.
- **Components** — 19 reference components live in `docs/design-system/components/`; each has a `.prompt.md` with usage and a `.d.ts`. In production code, implement equivalent components using the token system and shadcn/ui primitives.
- **Interactive UI kit** — open `docs/design-system/ui_kits/job_application_agent/index.html` in a browser to see the full input → running → results → error flow.
- **Voice rules** — sentence case, verb-led copy, no exclamation marks, no emoji; errors are named and specific; always show iteration count + model ID in muted mono.

## Workflow

1. Read `DESIGN.md` for tokens, typography, spacing, effects, component APIs, voice, and integration rules.
2. For a specific component, read its `docs/design-system/components/**/<Name>.prompt.md` and `.d.ts` before implementing.
3. For flow or layout questions, consult `docs/design-system/ui_kits/job_application_agent/index.html`.
4. Implement in `app/` or `components/` using semantic CSS variables from `app/globals.css` and shadcn/ui primitives — do not import the reference JSX bundle into production.
5. Verify copy against voice rules and integration rules in `DESIGN.md` (one primary button per view, mono for data, no pill radius on buttons, etc.).

## Additional resources

- Full design rationale: `docs/design-system/readme.md`
- Prototypes and static mocks: `docs/design-system/SKILL.md` (`job-application-agent-design`)
- UI accessibility and UX audit: `.agents/skills/web-design-guidelines/SKILL.md`
