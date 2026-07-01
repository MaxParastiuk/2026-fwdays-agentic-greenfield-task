# TextField

Single-line labelled input. Set `error` to surface inline validation (the brief validates with Zod before the run button enables).

```jsx
<TextField label="Job posting URL" icon="link"
  placeholder="https://…"
  error="That URL was unreachable. Paste the text instead." />
```

Props: `label`, `hint`, `error`, `icon`, plus native input props.
