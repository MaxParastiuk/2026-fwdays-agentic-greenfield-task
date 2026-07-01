# Job Application Agent — Design System

A privacy-first, zero-auth web app that turns a CV and a job posting into a
tailored cover letter through a multi-agent AI pipeline. A **Maker** writes the
letter, a **Checker** scores it against both the CV and the posting and names
every gap, and the loop repeats — up to three iterations — until the letter
scores at least 8.0 / 10. The visitor leaves with the strongest letter the
pipeline produced, plus a transparent per-iteration score history and gap
analysis. No accounts, no stored data, no cookies.

This design system encodes the product's brand so any future surface — the app
itself, a marketing page, a deck, a changelog — stays consistent and on-voice.

## Sources

No brand assets, codebase, or Figma were provided. **This system was authored
from the product brief alone** (the "Product Brief — Job Application Agent",
companion to `docs/requirements.md`, referencing requirement IDs such as
`FR-RESULTS-03`, `BC-BRAND-01`). The brief is the single source of truth behind
every decision here. Where the brief did not specify visuals, this system makes
a considered choice and flags it (see **Substitutions** below).

> If a real brand, codebase, or Figma exists, share it via the Import menu and
> this system should be reconciled against it — the values here are a coherent
> first proposal, not a recovered ground truth.

---

## The direction: "Considered correspondence"

A cover letter is a high-stakes, personal document. The product is also
technical and radically transparent (it shows you every score and every gap).
The system holds both: an **editorial, document-forward** core — warm paper,
ink-black text, a refined serif for titles and the letter itself — paired with a
**quiet technical layer** in mono for scores, model IDs, and the evals trail.
Restrained, professional, never hyped. It looks like something you would trust
with your career.

---

## Content fundamentals

The brief is explicit (`BC-BRAND-01`): **professional and action-oriented, no
exclamation marks, no marketing hype.** This system follows it literally.

- **Person.** Address the visitor as **you**; the product is "the pipeline",
  "the Maker", "the Checker" — never "we" selling to "I". The product describes
  what it does, plainly.
- **Casing.** Sentence case everywhere — buttons, titles, labels. Uppercase is
  reserved for small tracked **eyebrow labels** (e.g. `STEP 1`, `FINAL OUTPUT`).
- **Verbs lead.** Actions are imperative and concrete: "Generate cover letter",
  "Paste text instead", "Start over with a new CV". Never "Submit", never "Go".
- **No hype, no exclamation marks, ever.** Not "Land your dream job!" but
  "A cover letter worth signing." Claims never exceed what the pipeline does.
- **Honest under failure** (`NFR-OBS-01`). Errors are named and specific:
  "The AI Gateway did not respond. Your inputs are unchanged — try again." Never
  "Oops, something went wrong." Never a blank.
- **Transparent by default** (`BC-BRAND-02`). The UI always states the iteration
  count and model, e.g. `3 iterations · google/gemini-2.0-flash`, in muted mono.
- **No emoji. No jargon.** Technical facts (scores, model IDs, durations) appear
  as plain mono data, not dressed up.

Voice specimen card: `guidelines/brand-voice.html`.

---

## Visual foundations

**Color.** A warm paper-and-ink base, one deep navy-ink action color, and muted
editorial semantics.
- Backgrounds are **warm off-white paper** (`--paper #FAF8F4`), never pure white
  or cool gray. Surfaces (cards) are white; sunken wells use `--paper-deep`.
- Text is **warm near-black** (`--ink-900 #1A1815`) down through a warm neutral
  ramp — never blue-gray "slate".
- The **single action color** is deep navy ink (`--accent-700 #1E3550`); links
  and focus use the lighter `--accent-500`. There is no second brand hue.
- **Score semantics** are deliberately muted, not neon: green `--pass #2E7D57`
  (≥8), amber `--mid #A9741A` (5–7.9), red `--fail #AC3A2B` (<5). Each ships a
  matching tint background and border. This is the one place color is loud.
- No gradients. No purple. The palette is flat, warm, and quiet.

**Type.** Three families, each with a clear job (`tokens/typography.css`):
- **Newsreader** (serif) — display titles and the rendered cover letter. It is
  what makes the product feel like writing, not output.
- **Public Sans** (sans) — all interface chrome. A civic, no-nonsense grotesk
  that matches the privacy-first, plain-spoken tone.
- **JetBrains Mono** — the transparency layer: scores, model IDs, character
  counts, the evals JSONL. Tabular figures.

**Spacing & layout.** 4px base grid, generous document-like rhythm. The app
shell is centered, max 1180px, with a sticky header and a privacy footer. The
core view is a **symmetric two-panel grid** (CV | job posting).

**Shape & elevation.** Moderate radii (cards 12px, controls 8px, inputs 8px);
**pill radius is reserved for badges and status dots only** — never buttons or
inputs. Shadows are low, warm, and ink-tinted (`--shadow-sm/md/lg`); most
surfaces rest on a hairline border (`--line #E6E1D6`) with no shadow at all.
Cards are warm-white, hairline-bordered, lightly rounded — calm, not floating.

**Borders & focus.** Hairline 1px borders default; inputs use the stronger
`--line-strong` and shift to the accent on focus with a soft 3px accent ring
(`--ring`). Dashed border only on the upload dropzone.

**Motion.** Subtle and functional. 120–280ms, gentle `--ease-out`. Hovers shift
background/border one step; presses nudge 0.5px down (never scale-bounce). The
only looping animation is the running status dot's pulse — and it respects
`prefers-reduced-motion`. No decorative motion.

**Imagery.** The product has none, by design — it is text in, text out. The only
graphic is the logomark. Don't introduce stock photography or illustration; the
"image" of this brand is well-set type on warm paper.

Specimen cards live in `guidelines/` and populate the Design System tab
(groups: Colors, Type, Spacing, Brand).

---

## Iconography

- **System:** [Lucide](https://lucide.dev) geometry — 24×24, 2px stroke, round
  caps and joins. Chosen for its clean, neutral, professional line style, which
  matches Public Sans. Icons are **functional only** (upload, copy, status,
  chevrons) — never decorative, never emoji, never Unicode glyph hacks.
- **Implementation:** the needed glyphs are inlined in `components/core/Icon.jsx`
  (Lucide is ISC-licensed) so components are self-contained with no CDN
  dependency. Use `<Icon name="…" />`; the full name list is in its `.prompt.md`.
  This is a **substitution** — see below.
- **Emoji / Unicode:** never used anywhere in the product or brand.

---

## Substitutions (no brand assets were provided — please confirm)

1. **Fonts** — Newsreader, Public Sans, JetBrains Mono are loaded from Google
   Fonts (`tokens/fonts.css`). If real brand fonts exist, replace the `@import`
   with self-hosted `@font-face` rules. *(The compiler reports 0 `@font-face`
   rules because the fonts come via a remote `@import` rather than local files;
   they still load correctly in every card and kit.)*
2. **Icons** — Lucide stands in for any house icon set.
3. **Logo** — `assets/logomark.svg` (a check above a signature line on a navy
   tile, "a letter signed off") was designed for this system; there was no
   existing mark. Replace if a real logo exists.
4. **Color & type specifics** — all hex values and the type pairing are proposals
   derived from the brief's tone, not recovered from a real brand.

---

## Index / manifest

**Foundations**
- `styles.css` — the single entry point consumers link; `@import`s only.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`,
  `effects.css` (radii, shadows, motion).
- `guidelines/` — 14 specimen cards (Colors, Type, Spacing, Brand).

**Components** (`components/`, mounted off `window.JobApplicationAgentDesignSystem_8adca7`)
- `core/` — `Icon`, `Button`, `IconButton`, `Tag`, `Card`
- `forms/` — `SegmentedControl`, `TextField`, `TextArea`, `UploadZone`,
  `CollapsiblePreview`
- `feedback/` — `StatusIndicator`, `ProgressStream`, `ErrorBanner`, `CopyButton`
- `results/` — `ScoreBadge` (+ `scoreTone`), `GapList`, `IterationTimeline`,
  `LetterPanel`
- Each directory has a `.card.html` showcase (Design System tab → Components),
  and each component ships `<Name>.d.ts` + `<Name>.prompt.md`.

**UI kit** (`ui_kits/job_application_agent/`)
- Interactive recreation of the full app: input → running → results → error.
  See its `README.md`.

**Other**
- `assets/logomark.svg` — the brand mark.
- `SKILL.md` — makes this system usable as a downloadable Agent Skill.

---

## Conventions for building with this system

- Link `styles.css`; reference everything through the semantic CSS variables
  (`--text-body`, `--surface-card`, `--action-bg`, `--pass`…), not raw hex.
- One primary button per view. Copy is sentence-case, verb-led, no exclamation.
- Show, don't hide, the AI's work: scores, gaps, iteration count, model.
- When in doubt, choose the quieter option.
