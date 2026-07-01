import React from 'react';
import { inject } from '../core/inject.js';

inject('textarea', `
.ds-ta { display: flex; flex-direction: column; gap: 6px; }
.ds-ta__label { font-family: var(--font-sans); font-size: 12.5px; font-weight: 600; color: var(--text-body); }
.ds-ta__field {
  width: 100%; box-sizing: border-box; resize: vertical;
  font-family: var(--font-sans); font-size: 14px; line-height: 1.55; color: var(--text-strong);
  background: var(--surface); border: 1px solid var(--border-strong);
  border-radius: var(--radius-md); padding: 12px 13px; min-height: 140px;
  transition: border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
}
.ds-ta__field--mono { font-family: var(--font-mono); font-size: 13px; line-height: 1.6; }
.ds-ta__field::placeholder { color: var(--text-placeholder); }
.ds-ta__field:hover { border-color: var(--ink-300); }
.ds-ta__field:focus { outline: none; border-color: var(--border-focus); box-shadow: var(--ring); }
.ds-ta__foot { display: flex; justify-content: space-between; font-family: var(--font-sans); font-size: 11.5px; color: var(--text-faint); }
`);

/** TextArea — multi-line input for pasted CV or job posting text. */
export function TextArea({
  label, hint, count, value, mono = false, id, className = '', style = {}, ...rest
}) {
  const fid = id || (label ? `t-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const len = typeof value === 'string' ? value.length : null;
  return (
    <div className={`ds-ta ${className}`} style={style}>
      {label && <label className="ds-ta__label" htmlFor={fid}>{label}</label>}
      <textarea
        id={fid}
        value={value}
        className={`ds-ta__field ${mono ? 'ds-ta__field--mono' : ''}`}
        {...rest}
      />
      {(hint || count) && (
        <div className="ds-ta__foot">
          <span>{hint}</span>
          {count && len != null && <span>{len.toLocaleString()} characters</span>}
        </div>
      )}
    </div>
  );
}
