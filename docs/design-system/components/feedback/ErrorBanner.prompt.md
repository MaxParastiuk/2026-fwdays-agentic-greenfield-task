# ErrorBanner

The honest failure state. A network / AI Gateway / upstream error degrades here — named, visible, with a Try-again button and no partial results. Keep the message specific; never "Oops, something went wrong."

```jsx
<ErrorBanner
  message="The AI Gateway did not respond. Your inputs are unchanged — try the run again."
  onRetry={rerun} />
```

Props: `title`, `message`, `actionLabel`, `onRetry`.
