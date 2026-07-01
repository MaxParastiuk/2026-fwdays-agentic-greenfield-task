# IterationTimeline

The transparency centerpiece — every round's score as a colored badge, the Checker's rationale, and a collapsible gap list. The final round is emphasised as the letter that shipped.

```jsx
<IterationTimeline iterations={[
  { iteration: 1, score: 6.4, rationale: 'Solid but does not address the role’s focus on reliability.',
    gaps: ['No mention of on-call experience', 'Generic closing'] },
  { iteration: 2, score: 7.8, rationale: 'Closer; quantify the impact.', gaps: ['No metrics quantified'] },
  { iteration: 3, score: 8.6, rationale: 'Targeted and specific.', gaps: [] },
]} />
```

Props: `iterations` (`{iteration, score, rationale, gaps}`), `defaultOpenLast`.
