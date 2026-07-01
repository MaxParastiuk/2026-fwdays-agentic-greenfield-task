# Tag

Compact label chip for gap labels, file types ("PDF"), and input modes. Tones map to the score semantics so a "missing" gap can read `fail`.

```jsx
<Tag tone="neutral" icon="file-text">PDF · 142 KB</Tag>
<Tag tone="fail">No metrics quantified</Tag>
<Tag tone="accent" mono>google/gemini-2.0-flash</Tag>
```

Props: `tone` (neutral/accent/pass/mid/fail), `icon`, `mono`.
