# Button

The primary action control. `primary` is the navy fill (one per view — e.g. "Generate cover letter"); `secondary` is the outline; `ghost` is text-only for low-emphasis actions.

```jsx
<Button variant="primary" size="lg" icon="pen-line">Generate cover letter</Button>
<Button variant="secondary">Paste text instead</Button>
<Button variant="ghost" iconRight="arrow-right">See iterations</Button>
<Button variant="primary" loading>Generating</Button>
```

Props: `variant`, `size` (sm/md/lg), `icon`, `iconRight`, `loading`, `disabled`, `fullWidth`. Copy is sentence-case and verb-led; never an exclamation mark.
