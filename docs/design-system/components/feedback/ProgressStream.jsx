import React from 'react';
import { inject } from '../core/inject.js';
import { Icon } from '../core/Icon.jsx';

inject('progress', `
.ds-prog { display: flex; flex-direction: column; gap: 0; }
.ds-prog__row {
  display: flex; align-items: center; gap: 11px;
  font-family: var(--font-sans); font-size: 13.5px; padding: 9px 2px;
}
.ds-prog__ic { display: flex; flex: none; width: 22px; justify-content: center; }
.ds-prog__phase { color: var(--text-faint); font-family: var(--font-mono); font-size: 12px; }
.ds-prog__spin { color: var(--accent-500); animation: ds-prog-spin 0.7s linear infinite; }
@keyframes ds-prog-spin { to { transform: rotate(360deg); } }
.ds-prog__row--active .ds-prog__label { color: var(--text-strong); font-weight: 600; }
.ds-prog__row--done .ds-prog__label { color: var(--text-muted); }
.ds-prog__row--done .ds-prog__ic { color: var(--pass); }
.ds-prog__pending .ds-prog__label { color: var(--text-placeholder); }
.ds-prog__dot { width: 7px; height: 7px; border-radius: 50%; background: var(--border-strong); }
`);

/**
 * ProgressStream — the live "Iteration N: writing… / checking…" log shown
 * while the pipeline runs. Pass an array of steps with status.
 */
export function ProgressStream({ steps = [], className = '', style = {} }) {
  return (
    <div className={`ds-prog ${className}`} style={style}>
      {steps.map((s, i) => {
        const status = s.status || 'pending';
        return (
          <div key={i} className={`ds-prog__row ds-prog__row--${status} ${status === 'pending' ? 'ds-prog__pending' : ''}`}>
            <span className="ds-prog__ic">
              {status === 'active' && <Icon name="loader" size={16} className="ds-prog__spin" />}
              {status === 'done' && <Icon name="check" size={16} />}
              {status === 'pending' && <span className="ds-prog__dot" />}
            </span>
            <span className="ds-prog__label">{s.label}</span>
            {s.phase && <span className="ds-prog__phase">{s.phase}</span>}
          </div>
        );
      })}
    </div>
  );
}
