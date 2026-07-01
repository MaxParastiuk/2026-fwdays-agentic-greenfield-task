import React from 'react';
import { inject } from '../core/inject.js';
import { Icon } from '../core/Icon.jsx';

inject('collapse', `
.ds-col { border: 1px solid var(--border-default); border-radius: var(--radius-md); background: var(--surface); overflow: hidden; }
.ds-col__head {
  display: flex; align-items: center; gap: 9px; width: 100%;
  font-family: var(--font-sans); font-size: 12.5px; font-weight: 600; color: var(--text-body);
  background: transparent; border: none; cursor: pointer; padding: 11px 13px; text-align: left;
  transition: background var(--dur-fast) var(--ease-out);
}
.ds-col__head:hover { background: var(--paper-deep); }
.ds-col__head:focus-visible { outline: none; box-shadow: var(--ring); }
.ds-col__chev { color: var(--text-faint); transition: transform var(--dur-base) var(--ease-out); }
.ds-col__chev--open { transform: rotate(90deg); }
.ds-col__check { margin-left: auto; display: flex; align-items: center; gap: 5px; color: var(--pass); font-size: 11.5px; font-weight: 600; }
.ds-col__body {
  font-family: var(--font-mono); font-size: 12px; line-height: 1.65; color: var(--text-muted);
  padding: 0 14px 13px; white-space: pre-wrap; border-top: 1px solid var(--border-soft); padding-top: 12px;
}
.ds-col__more { color: var(--text-faint); font-style: normal; }
`);

/**
 * CollapsiblePreview — the confirmation preview of parsed CV / scraped job
 * text. Shows the first ~400 chars; collapsed by default.
 */
export function CollapsiblePreview({
  title = 'Extracted text preview', text = '', limit = 400, defaultOpen = false,
  confirmedLabel = 'Parsed', className = '', style = {},
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const shown = text.slice(0, limit);
  const truncated = text.length > limit;
  return (
    <div className={`ds-col ${className}`} style={style}>
      <button type="button" className="ds-col__head" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <Icon name="chevron-right" size={16} className={`ds-col__chev ${open ? 'ds-col__chev--open' : ''}`} />
        {title}
        <span className="ds-col__check"><Icon name="check" size={13} />{confirmedLabel}</span>
      </button>
      {open && (
        <div className="ds-col__body">
          {shown}{truncated && <span className="ds-col__more">… +{(text.length - limit).toLocaleString()} more characters</span>}
        </div>
      )}
    </div>
  );
}
