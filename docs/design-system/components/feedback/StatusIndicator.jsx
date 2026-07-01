import React from 'react';
import { inject } from '../core/inject.js';

inject('status', `
.ds-status {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-sans); font-size: 12.5px; font-weight: 600;
  padding: 5px 12px 5px 11px; border-radius: var(--radius-full);
  border: 1px solid var(--border-default); background: var(--surface); color: var(--text-muted);
}
.ds-status__dot { width: 8px; height: 8px; border-radius: 50%; flex: none; position: relative; }
.ds-status--running { color: var(--accent-700); border-color: var(--accent-300); background: var(--accent-050); }
.ds-status--complete { color: var(--pass); border-color: var(--pass-line); background: var(--pass-bg); }
.ds-status--error { color: var(--fail); border-color: var(--fail-line); background: var(--fail-bg); }
.ds-status--running .ds-status__dot::after {
  content: ''; position: absolute; inset: -4px; border-radius: 50%;
  background: var(--status-run); opacity: 0.35; animation: ds-status-pulse 1.4s var(--ease-out) infinite;
}
@keyframes ds-status-pulse { 0% { transform: scale(0.6); opacity: 0.5; } 100% { transform: scale(1.8); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .ds-status--running .ds-status__dot::after { animation: none; } }
`);

const COLORS = {
  idle: 'var(--status-idle)', running: 'var(--status-run)',
  complete: 'var(--status-done)', error: 'var(--status-error)',
};
const LABELS = { idle: 'Idle', running: 'Running', complete: 'Complete', error: 'Error' };

/** StatusIndicator — the header pipeline-status pill. */
export function StatusIndicator({ state = 'idle', label, className = '', style = {} }) {
  return (
    <span className={`ds-status ds-status--${state} ${className}`} style={style}>
      <span className="ds-status__dot" style={{ background: COLORS[state] }} />
      {label || LABELS[state]}
    </span>
  );
}
