import React from 'react';
import { inject } from '../core/inject.js';

inject('gaplist', `
.ds-gaps { display: flex; flex-direction: column; gap: 7px; margin: 0; padding: 0; list-style: none; }
.ds-gaps__item {
  display: flex; align-items: flex-start; gap: 9px;
  font-family: var(--font-sans); font-size: 13px; line-height: 1.5; color: var(--ink-700);
}
.ds-gaps__mark {
  flex: none; margin-top: 6px; width: 5px; height: 5px; border-radius: 50%;
  background: var(--mid);
}
.ds-gaps--empty {
  display: flex; align-items: center; gap: 8px;
  font-family: var(--font-sans); font-size: 13px; color: var(--pass); font-weight: 500;
}
.ds-gaps__check { flex: none; }
`);

/**
 * GapList — the Checker's named gaps for an iteration, as a bullet list.
 * When there are no gaps, shows the "no gaps" confirmation.
 */
export function GapList({ gaps = [], emptyLabel = 'No gaps identified', className = '', style = {} }) {
  if (!gaps.length) {
    return (
      <div className={`ds-gaps--empty ${className}`} style={style}>
        <svg className="ds-gaps__check" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        {emptyLabel}
      </div>
    );
  }
  return (
    <ul className={`ds-gaps ${className}`} style={style}>
      {gaps.map((g, i) => (
        <li key={i} className="ds-gaps__item">
          <span className="ds-gaps__mark" />
          <span>{g}</span>
        </li>
      ))}
    </ul>
  );
}
