# TextArea

Multi-line input for pasted CV or job posting text. Pair with `count` to show length; both paste paths produce the same string payload sent to the pipeline.

```jsx
<TextArea label="Paste your CV" count value={cv} onChange={e => setCv(e.target.value)}
  placeholder="Paste plain-text CV…" />
```

Props: `label`, `hint`, `count`, `mono`, plus native textarea props.
