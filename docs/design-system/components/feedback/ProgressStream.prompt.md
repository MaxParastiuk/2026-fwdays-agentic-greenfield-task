# ProgressStream

The live run log. Each iteration emits two phases — "writing…" then "checking…" — streamed as the loop runs. Mark completed steps `done`, the current one `active`.

```jsx
<ProgressStream steps={[
  { label: 'Iteration 1 · writing', status: 'done' },
  { label: 'Iteration 1 · checking', phase: 'score 6.4', status: 'done' },
  { label: 'Iteration 2 · writing', status: 'active' },
]} />
```

Props: `steps` (`{label, phase?, status}`).
