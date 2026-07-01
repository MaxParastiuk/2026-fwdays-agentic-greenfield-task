# UploadZone

Drag-and-drop / click target for a CV PDF. Files over 5 MB or of the wrong type are rejected client-side — pass that message as `error`. Once selected, pass `file` to show the file row.

```jsx
<UploadZone onSelect={handle} file={cvFile} onRemove={clear}
  error={tooBig ? 'That file is over 5 MB.' : undefined} />
```

Props: `file`, `error`, `accept`, `maxLabel`, `onSelect`, `onRemove`. The hint always states the file is processed in memory and never stored.
