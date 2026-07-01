# LetterPanel

The final cover letter in a styled, document-like panel — serif body, header with the final score and a copy button, and a muted mono footer crediting iteration count and model.

```jsx
<LetterPanel
  letter={finalLetter}
  finalScore={8.6}
  iterations={3}
  model="google/gemini-2.0-flash" />
```

Props: `letter`, `title`, `finalScore`, `iterations`, `model`, `showCopy`, `onCopy`.
