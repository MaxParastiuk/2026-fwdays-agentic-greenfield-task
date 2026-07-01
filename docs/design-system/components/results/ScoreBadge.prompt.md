# ScoreBadge

The Checker's 0–10 score, colored by the brief's thresholds: green ≥ 8, amber 5–7.9, red < 5. Mono, tabular figures. `scoreTone(score)` exposes the same mapping for other UI.

```jsx
<ScoreBadge score={8.6} />
<ScoreBadge score={6.4} size="lg" />
<ScoreBadge score={3.1} size="sm" showMax={false} />
```

Props: `score`, `max` (10), `size` (sm/md/lg), `showMax`.
