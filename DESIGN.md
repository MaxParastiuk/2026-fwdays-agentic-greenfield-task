# Design System — Job Application Agent

Design direction: **"Considered correspondence"** — editorial, document-forward, warm paper and ink, with a quiet mono technical layer. Professional, action-oriented. No hype, no exclamation marks, no emoji.

Source files: [`docs/design-system/`](docs/design-system/) (extracted from the ZIP; reference for components, tokens, and guidelines).

CSS tokens are integrated into [`app/globals.css`](app/globals.css). Fonts are loaded via `next/font/google` in [`app/layout.tsx`](app/layout.tsx).

---

## Typography

Three families, each with a distinct role:

| Variable | Family | Role |
|---|---|---|
| `--font-serif` / `--font-display` / `--font-letter` | **Newsreader** | Display titles, the rendered cover letter |
| `--font-sans` / `--font-ui` | **Public Sans** | All interface chrome (buttons, labels, nav) |
| `--font-mono` / `--font-code` | **JetBrains Mono** | Scores, model IDs, character counts, evals |

### Type scale

| Token | Size | Typical use |
|---|---|---|
| `--text-2xs` | 11px | Eyebrow labels (UPPERCASE + `--tracking-eyebrow`) |
| `--text-xs` | 12px | Captions, badges |
| `--text-sm` | 13px | Secondary UI |
| `--text-base` | 15px | Body UI |
| `--text-md` | 16px | Letter body |
| `--text-xl` | 22px | Panel titles |
| `--text-2xl` | 28px | Section headers |
| `--text-3xl` | 36px | Page title |

**Casing rule:** Sentence case everywhere. Uppercase only for eyebrow labels (`STEP 1`, `FINAL OUTPUT`) with `--tracking-eyebrow: 0.14em`.

---

## Color

### Neutrals

| Token | Value | Use |
|---|---|---|
| `--paper` / `--bg-app` | `#FAF8F4` | App background — warm off-white |
| `--paper-deep` / `--bg-sunken` | `#F2EFE8` | Sunken surfaces, wells |
| `--surface` / `--surface-card` | `#FFFFFF` | Cards, panels |
| `--ink-900` / `--text-strong` | `#1A1815` | Primary text |
| `--ink-700` / `--text-body` | `#3D3A33` | Strong body |
| `--ink-500` / `--text-muted` | `#6B665B` | Secondary text |
| `--ink-400` / `--text-faint` | `#8C867A` | Captions, muted |
| `--ink-300` / `--text-placeholder` | `#B0A99B` | Placeholder, disabled |
| `--line` / `--border-default` | `#E6E1D6` | Default borders |
| `--line-strong` / `--border-strong` | `#D6CFC1` | Emphasized borders |

### Accent (single action color — deep navy ink)

| Token | Value | Use |
|---|---|---|
| `--accent-700` / `--action-bg` | `#1E3550` | Primary button resting |
| `--accent-600` / `--action-bg-hover` | `#274463` | Primary button hover |
| `--accent-500` / `--link` / `--border-focus` | `#2F5680` | Links, focus ring |
| `--accent-100` | `#E7EDF4` | Tinted accent surface, focus ring outer |
| `--text-on-accent` | `#FBFAF7` | Text on navy buttons |

**Rule:** One primary button per view. No second brand hue. No purple. No gradients.

### Score semantics

| Token | Value | Threshold |
|---|---|---|
| `--pass` | `#2E7D57` | Score ≥ 8 |
| `--mid` | `#A9741A` | Score 5–7.9 |
| `--fail` | `#AC3A2B` | Score < 5 |

Each tone has matching `-bg` and `-line` variants (e.g. `--pass-bg #E6F0EA`, `--pass-line #BFD9CB`).

### Pipeline status

`--status-idle` `#B0A99B` · `--status-run` `#2F5680` · `--status-done` `#2E7D57` · `--status-error` `#AC3A2B`

---

## Spacing

4px base grid. Reference tokens via `--space-*`:

`--space-1` 4px · `--space-2` 8px · `--space-3` 12px · `--space-4` 16px · `--space-5` 20px · `--space-6` 24px · `--space-8` 32px · `--space-10` 40px · `--space-12` 48px · `--space-16` 64px

Layout: `--container-max: 1180px` · `--panel-gap: var(--space-6)` · `--content-pad: var(--space-8)` · `--page-gutter: var(--space-8)`

---

## Effects

### Radii

| Token | Value | Use |
|---|---|---|
| `--radius-md` | 8px | Controls, inputs |
| `--radius-lg` | 12px | Cards |
| `--radius-full` | 999px | Badges, status dots **only** — never buttons or inputs |

### Shadows (low, warm, ink-tinted)

`--shadow-xs` through `--shadow-xl`. Most surfaces use a `1px --line` border with no shadow at all.

### Focus

`--ring: 0 0 0 3px var(--accent-100)` — soft 3px ring around interactive elements.  
`--ring-strong` — 2px white + 4px accent, for high-contrast needs.

### Motion

Subtle and functional. 120–280ms range, `--ease-out` default. Hovers shift one step; no scale-bounce. The only looping animation is the status-dot pulse — obeys `prefers-reduced-motion`.

| Token | Value |
|---|---|
| `--dur-fast` | 120ms |
| `--dur-base` | 180ms |
| `--dur-slow` | 280ms |
| `--ease-out` | `cubic-bezier(0.22, 0.61, 0.36, 1)` |

---

## Components

Namespace: `window.JobApplicationAgentDesignSystem_8adca7` (loaded via `_ds_bundle.js`). Component source is in `docs/design-system/components/`; each has a `.prompt.md` (usage), `.d.ts` (types), and `.jsx` (implementation).

### Core

**`Button`** — `variant` primary/secondary/ghost · `size` sm/md/lg · `icon` · `iconRight` · `loading` · `disabled` · `fullWidth`. One primary button per view; sentence-case, verb-led copy.

```jsx
<Button variant="primary" size="lg" icon="pen-line">Generate cover letter</Button>
<Button variant="secondary">Paste text instead</Button>
<Button variant="ghost" iconRight="arrow-right">See iterations</Button>
```

**`IconButton`** — Square icon-only control. `icon` · `label` (required for a11y) · `size` · `solid`.

```jsx
<IconButton icon="x" label="Dismiss" />
<IconButton icon="copy" label="Copy letter" solid />
```

**`Card`** — Base surface container. `elevation` flat/raised/floating · `padding` none/sm/md/lg · `as`.

```jsx
<Card elevation="raised" padding="lg">…</Card>
```

**`Icon`** — Lucide geometry, 24×24, 2px round stroke. Use for affordances only — never decoration.  
Available names: `upload` `file-text` `link` `globe` `check` `copy` `clipboard-check` `alert-triangle` `refresh-cw` `chevron-down` `chevron-right` `x` `shield` `arrow-right` `pen-line` `search-check` `loader`

```jsx
<Icon name="upload" size={20} />
```

**`Tag`** — Compact label chip. `tone` neutral/accent/pass/mid/fail · `icon` · `mono`.

```jsx
<Tag tone="neutral" icon="file-text">PDF · 142 KB</Tag>
<Tag tone="fail">No metrics quantified</Tag>
<Tag tone="accent" mono>google/gemini-2.0-flash</Tag>
```

### Forms

**`UploadZone`** — Drag-and-drop CV upload. `file` · `error` · `accept` · `maxLabel` · `onSelect` · `onRemove`. Rejects files >5 MB or wrong MIME type client-side.

```jsx
<UploadZone onSelect={handle} file={cvFile} onRemove={clear}
  error={tooBig ? 'That file is over 5 MB.' : undefined} />
```

**`SegmentedControl`** — Input-mode toggle (URL / paste text). Controlled. `options` · `value` · `onChange`.

```jsx
<SegmentedControl value={mode} onChange={setMode}
  options={[
    { value: 'url', label: 'Job URL', icon: 'link' },
    { value: 'paste', label: 'Paste text', icon: 'file-text' },
  ]} />
```

**`TextField`** — Single-line labelled input. `label` · `hint` · `error` · `icon` + native input props.

```jsx
<TextField label="Job posting URL" icon="link" placeholder="https://…"
  error="That URL was unreachable. Paste the text instead." />
```

**`TextArea`** — Multi-line input with optional char count. `label` · `hint` · `count` · `mono` + native textarea props.

```jsx
<TextArea label="Paste your CV" count value={cv} onChange={e => setCv(e.target.value)}
  placeholder="Paste plain-text CV…" />
```

**`CollapsiblePreview`** — Parse-confirmation preview (first 400 chars). `title` · `text` · `limit` · `defaultOpen` · `confirmedLabel`.

```jsx
<CollapsiblePreview title="CV — extracted text" text={parsedCv} confirmedLabel="Parsed" />
```

### Feedback

**`StatusIndicator`** — Header pipeline status pill. `state` idle/running/complete/error · `label`.

```jsx
<StatusIndicator state="running" label="Iteration 2 of 3" />
```

**`ProgressStream`** — Live Maker→Checker log. Each step: `{ label, phase?, status }` where status is done/active/pending.

```jsx
<ProgressStream steps={[
  { label: 'Iteration 1 · writing', status: 'done' },
  { label: 'Iteration 1 · checking', phase: 'score 6.4', status: 'done' },
  { label: 'Iteration 2 · writing', status: 'active' },
]} />
```

**`ErrorBanner`** — Honest failure state. Never "Oops, something went wrong." `title` · `message` · `actionLabel` · `onRetry`.

```jsx
<ErrorBanner
  message="The AI Gateway did not respond. Your inputs are unchanged — try the run again."
  onRetry={rerun} />
```

**`CopyButton`** — Copies text; label flips to "Copied" for 2s. `text` · `label` · `copiedLabel` · `variant` · `size`.

```jsx
<CopyButton text={letter} variant="primary" label="Copy letter" />
```

### Results

**`ScoreBadge`** — Checker score colored by threshold. `score` · `max` (10) · `size` sm/md/lg · `showMax`. Uses `scoreTone(score)` helper for pass/mid/fail mapping.

```jsx
<ScoreBadge score={8.6} />
<ScoreBadge score={6.4} size="lg" />
```

**`GapList`** — Checker gap list as bullet list. `gaps` · `emptyLabel`. Empty array shows green "no gaps" confirmation.

```jsx
<GapList gaps={['Does not mention distributed tracing experience']} />
```

**`IterationTimeline`** — Full transparency view — every round's score, rationale, and gaps. `iterations` (`{iteration, score, rationale, gaps}`) · `defaultOpenLast`.

```jsx
<IterationTimeline iterations={[
  { iteration: 1, score: 6.4, rationale: 'Solid but misses reliability focus.', gaps: ['No on-call mention'] },
  { iteration: 3, score: 8.6, rationale: 'Targeted and specific.', gaps: [] },
]} />
```

**`LetterPanel`** — Final cover letter in a document panel with copy button and muted model credit. `letter` · `finalScore` · `iterations` · `model` · `showCopy` · `onCopy`.

```jsx
<LetterPanel letter={finalLetter} finalScore={8.6} iterations={3} model="google/gemini-2.0-flash" />
```

---

## Voice & copy

- **Sentence case everywhere.** Buttons, titles, labels. Uppercase only for eyebrow labels.
- **Verbs lead.** "Generate cover letter", "Paste text instead", "Start over with a new CV". Never "Submit" or "Go".
- **No exclamation marks. No emoji. No jargon.**
- **Honest under failure.** Errors are named and specific. Never "Oops, something went wrong." Never a blank screen.
- **Transparent by default.** Always show iteration count + model: `3 iterations · google/gemini-2.0-flash` in muted mono text.
- **Address the visitor as "you".** The product is "the pipeline", "the Maker", "the Checker" — not "we".

---

## Integration rules for production code

1. **Never reference raw hex** in component code. Always use semantic CSS variables (`--text-body`, `--surface-card`, `--action-bg`, `--pass`).
2. **Never use pill radius** (`--radius-full`) on buttons or inputs — only on badges and status dots.
3. **No dark mode toggle in MVP.** `prefers-color-scheme` is the sole mechanism.
4. **Primary button is one per view.** Secondary and ghost for everything else.
5. **Score colors are the only loud color.** All other UI is warm, quiet, and neutral.
6. **No decorative motion.** The only looping animation is the status-dot pulse.
7. **No imagery.** This is text in, text out. No stock photos, no illustrations.
8. **Mono for data.** Scores, model IDs, counts, and evals use `--font-mono`. Never style data as prose.

---

## File reference

```
docs/design-system/
├── readme.md              — full design rationale
├── SKILL.md               — agent skill entry point
├── styles.css             — CSS entry point (@imports token files)
├── _ds_bundle.js          — bundled React components (browser)
├── _ds_manifest.json      — component registry
├── assets/
│   └── logomark.svg       — brand mark (navy tile, check + signature line)
├── tokens/
│   ├── fonts.css          — Google Fonts @import
│   ├── colors.css         — full color token set
│   ├── typography.css     — type scale, weights, line-heights, tracking
│   ├── spacing.css        — 4px grid + layout constants
│   └── effects.css        — radii, shadows, motion
├── components/
│   ├── core/              — Button, IconButton, Card, Icon, Tag
│   ├── forms/             — SegmentedControl, TextField, TextArea, UploadZone, CollapsiblePreview
│   ├── feedback/          — StatusIndicator, ProgressStream, ErrorBanner, CopyButton
│   └── results/           — ScoreBadge, GapList, IterationTimeline, LetterPanel
├── guidelines/            — 14 specimen HTML cards (colors, type, spacing, brand)
└── ui_kits/
    └── job_application_agent/
        └── index.html     — interactive full-flow recreation (open in browser)
```
