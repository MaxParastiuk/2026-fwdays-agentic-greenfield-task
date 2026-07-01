# SegmentedControl

Two/three-option toggle for input-mode switches. Controlled — pass `value` and `onChange`.

```jsx
<SegmentedControl
  value={mode}
  onChange={setMode}
  options={[
    { value: 'url', label: 'Job URL', icon: 'link' },
    { value: 'paste', label: 'Paste text', icon: 'file-text' },
  ]}
/>
```

Props: `options` (strings or `{value,label,icon}`), `value`, `onChange`.
