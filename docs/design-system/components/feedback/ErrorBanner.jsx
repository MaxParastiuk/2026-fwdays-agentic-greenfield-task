import React from 'react';
import { inject } from '../core/inject.js';
import { Icon } from '../core/Icon.jsx';
import { Button } from '../core/Button.jsx';

inject('errbanner', `
.ds-err {
  display: flex; align-items: flex-start; gap: 12px;
  border: 1px solid var(--fail-line); background: var(--fail-bg);
  border-radius: var(--radius-md); padding: 14px 16px;
}
.ds-err__ic { color: var(--fail); flex: none; margin-top: 1px; }
.ds-err__body { flex: 1; min-width: 0; }
.ds-err__title { font-family: var(--font-sans); font-size: 13.5px; font-weight: 700; color: var(--fail); }
.ds-err__msg { font-family: var(--font-sans); font-size: 13px; line-height: 1.5; color: var(--ink-700); margin-top: 3px; }
.ds-err__act { flex: none; }
`);

/**
 * ErrorBanner — the named failure state. Fatal failures degrade here with a
 * "Try again" action and never show partial results.
 */
export function ErrorBanner({
  title = 'The run could not complete',
  message,
  actionLabel = 'Try again',
  onRetry,
  className = '', style = {},
}) {
  return (
    <div className={`ds-err ${className}`} style={style} role="alert">
      <span className="ds-err__ic"><Icon name="alert-triangle" size={20} /></span>
      <div className="ds-err__body">
        <div className="ds-err__title">{title}</div>
        {message && <div className="ds-err__msg">{message}</div>}
      </div>
      {onRetry && (
        <div className="ds-err__act">
          <Button variant="secondary" size="sm" icon="refresh-cw" onClick={onRetry}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}
