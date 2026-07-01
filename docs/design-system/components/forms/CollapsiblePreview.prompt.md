# CollapsiblePreview

The "did the parse succeed?" confirmation. Shows the first 400 characters of extracted CV or scraped job text, collapsed by default, with a green confirmed marker.

```jsx
<CollapsiblePreview title="CV — extracted text" text={parsedCv} confirmedLabel="Parsed" />
<CollapsiblePreview title="Job posting — scraped text" text={jobText} confirmedLabel="Scraped" />
```

Props: `title`, `text`, `limit` (400), `defaultOpen`, `confirmedLabel`.
