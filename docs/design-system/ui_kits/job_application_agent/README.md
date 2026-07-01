# Job Application Agent — UI kit

A high-fidelity, interactive recreation of the product's single surface: the
privacy-first web app that turns a CV and a job posting into a tailored cover
letter through a Maker→Checker loop.

## Run it
Open `index.html`. The kit walks the full flow; the dark **VIEW** strip at the
bottom jumps between states (it is a preview control, not part of the product):

- **input** — the two-panel landing. CV on the left (upload PDF or paste text),
  job posting on the right (URL or paste), run button beneath. The button stays
  disabled until both inputs validate.
- **running** — the streamed Maker→Checker log, advancing through
  "writing…" / "checking…" for each of up to three iterations.
- **results** — the final letter in a document panel with copy + a muted
  iteration/model credit line, the final-iteration gap analysis, and the full
  iteration score history.
- **error** — the honest failure state: a named banner with "Try again" and no
  partial results.

## Files
- `index.html` — shell + state machine + preview controls
- `AppShell.jsx` — header (logo + pipeline status) and footer (privacy line)
- `InputScreen.jsx` — the two-panel CV + job posting input
- `RunningView.jsx` — the live run progress
- `ResultsScreen.jsx` — letter, gap analysis, iteration timeline

## Composition
Every screen is built from design-system components mounted off
`window.JobApplicationAgentDesignSystem_8adca7` (loaded via `_ds_bundle.js`).
The kit adds no new primitives — it only arranges them.
