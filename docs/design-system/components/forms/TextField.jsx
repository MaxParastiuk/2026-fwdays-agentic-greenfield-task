import React from 'react';
import { inject } from '../core/inject.js';
import { Icon } from '../core/Icon.jsx';

inject('textfield', `
.ds-field { display: flex; flex-direction: column; gap: 6px; }
.ds-field__label { font-family: var(--font-sans); font-size: 12.5px; font-weight: 600; color: var(--text-body); }
.ds-field__hint { font-family: var(--font-sans); font-size: 11.5px; color: var(--text-faint); }
.ds-field__wrap { position: relative; display: flex; align-items: center; }
.ds-field__icon { position: absolute; left: 11px; color: var(--text-faint); pointer-events: none; }
.ds-input {
  width: 100%; box-sizing: border-box;
  font-family: var(--font-sans); font-size: 14px; color: var(--text-strong);
  background: var(--surface); border: 1px solid var(--border-strong);
  border-radius: var(--radius-md); padding: 10px 12px;
  transition: border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
}
.ds-input--icon { padding-left: 36px; }
.ds-input::placeholder { color: var(--text-placeholder); }
.ds-input:hover { border-color: var(--ink-300); }
.ds-input:focus { outline: none; border-color: var(--border-focus); box-shadow: var(--ring); }
.ds-input--error { border-color: var(--fail); }
.ds-input--error:focus { box-shadow: 0 0 0 3px var(--fail-bg); }
.ds-field__error { display: flex; align-items: center; gap: 5px; font-family: var(--font-sans); font-size: 11.5px; color: var(--fail); }
`);

/** TextField — a single-line labelled input (e.g. the job posting URL). */
export function TextField({
  label, hint, error, icon, id, className = '', style = {}, ...rest
}) {
  const fid = id || (label ? `f-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return (
    <div className={`ds-field ${className}`} style={style}>
      {label && <label className="ds-field__label" htmlFor={fid}>{label}</label>}
      <div className="ds-field__wrap">
        {icon && <span className="ds-field__icon"><Icon name={icon} size={16} /></span>}
        <input
          id={fid}
          className={`ds-input ${icon ? 'ds-input--icon' : ''} ${error ? 'ds-input--error' : ''}`}
          aria-invalid={!!error}
          {...rest}
        />
      </div>
      {error
        ? <span className="ds-field__error"><Icon name="alert-triangle" size={12} />{error}</span>
        : hint && <span className="ds-field__hint">{hint}</span>}
    </div>
  );
}
