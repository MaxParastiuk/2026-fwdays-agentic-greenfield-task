---
name: job-application-agent-design
description: Use this skill to generate well-branded interfaces and assets for Job Application Agent, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation
- **Direction:** "Considered correspondence" — editorial, document-forward, warm paper and ink, with a quiet mono technical layer. Professional, action-oriented, no hype, no exclamation marks, no emoji.
- **Tokens:** `styles.css` → `tokens/*.css`. Always reference the semantic CSS variables (`--text-body`, `--surface-card`, `--action-bg`, `--pass`/`--mid`/`--fail`).
- **Type:** Newsreader (serif — titles + the letter), Public Sans (UI), JetBrains Mono (scores, model IDs, evals).
- **Components:** `components/` — load `_ds_bundle.js`, then read off `window.JobApplicationAgentDesignSystem_8adca7`. Each has a `.prompt.md` with usage.
- **UI kit:** `ui_kits/job_application_agent/` — interactive full-flow recreation.
- **Voice:** sentence case, verbs lead, errors are named and honest, always expose the AI's work (scores, gaps, iteration count, model).
