# CopyButton

Copies the final cover letter; label flips to "Copied" (with a check) for two seconds, then resets. Errors are swallowed — clipboard failures never surface.

```jsx
<CopyButton text={letter} />
<CopyButton text={letter} variant="primary" label="Copy letter" />
```

Props: `text`, `label`, `copiedLabel`, `variant`, `size`.
