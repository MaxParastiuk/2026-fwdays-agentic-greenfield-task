import React from 'react';
import { inject } from '../core/inject.js';
import { Icon } from '../core/Icon.jsx';

inject('segmented', `
.ds-seg {
  display: inline-flex; padding: 3px; gap: 2px;
  background: var(--paper-deep); border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
}
.ds-seg__opt {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: var(--font-sans); font-size: 13px; font-weight: 600;
  color: var(--text-muted); background: transparent; border: none;
  padding: 6px 14px; border-radius: var(--radius-sm); cursor: pointer;
  transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
}
.ds-seg__opt:hover:not([aria-pressed="true"]) { color: var(--text-strong); }
.ds-seg__opt[aria-pressed="true"] {
  color: var(--accent-700); background: var(--surface); box-shadow: var(--shadow-xs);
}
.ds-seg__opt:focus-visible { outline: none; box-shadow: var(--ring); }
`);

/**
 * SegmentedControl — a 2–3 option toggle (CV upload ↔ paste, URL ↔ paste).
 * Controlled: pass `value` + `onChange`.
 */
export function SegmentedControl({ options, value, onChange, className = '', style = {} }) {
  return (
    <div role="group" className={`ds-seg ${className}`} style={style}>
      {options.map((opt) => {
        const val = typeof opt === 'string' ? opt : opt.value;
        const label = typeof opt === 'string' ? opt : opt.label;
        const icon = typeof opt === 'string' ? null : opt.icon;
        return (
          <button
            key={val}
            type="button"
            className="ds-seg__opt"
            aria-pressed={value === val}
            onClick={() => onChange && onChange(val)}
          >
            {icon && <Icon name={icon} size={15} />}
            {label}
          </button>
        );
      })}
    </div>
  );
}
