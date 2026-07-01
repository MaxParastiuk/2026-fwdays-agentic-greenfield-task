# StatusIndicator

The header pipeline-status pill. `idle` on first load; `running` pulses while the Maker→Checker loop runs; `complete` / `error` are terminal.

```jsx
<StatusIndicator state="idle" />
<StatusIndicator state="running" label="Iteration 2 of 3" />
```

Props: `state` (idle/running/complete/error), `label` override.
