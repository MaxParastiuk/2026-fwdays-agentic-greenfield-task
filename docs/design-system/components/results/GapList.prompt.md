# GapList

The Checker's named gaps for an iteration, rendered as a bullet list. Renders directly beneath the letter (final iteration) and inside each timeline row. An empty array shows the green "no gaps" confirmation.

```jsx
<GapList gaps={[
  'Does not mention experience with distributed tracing',
  'Closing paragraph is generic; no reference to the team’s mission',
]} />
```

Props: `gaps`, `emptyLabel`.
