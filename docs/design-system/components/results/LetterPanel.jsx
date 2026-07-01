import React from 'react';
import { inject } from '../core/inject.js';
import { ScoreBadge } from './ScoreBadge.jsx';
import { CopyButton } from '../feedback/CopyButton.jsx';

inject('letter', `
.ds-letter { background: var(--surface); border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm); }
.ds-letter__head {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 20px; border-bottom: 1px solid var(--border-soft); background: var(--surface);
}
.ds-letter__title { font-family: var(--font-sans); font-size: 13px; font-weight: 700; letter-spacing: .01em; color: var(--text-strong); }
.ds-letter__eyebrow { font-family: var(--font-sans); font-size: 10px; font-weight: 700; letter-spacing: .13em; text-transform: uppercase; color: var(--text-faint); }
.ds-letter__spacer { flex: 1; }
.ds-letter__body {
  font-family: var(--font-serif); font-size: 16px; line-height: 1.68; color: var(--ink-900);
  padding: 26px 28px; white-space: pre-wrap; max-width: 64ch;
}
.ds-letter__foot {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 20px; border-top: 1px solid var(--border-soft); background: var(--paper);
  font-family: var(--font-mono); font-size: 11.5px; color: var(--text-faint);
}
.ds-letter__dot { opacity: 0.5; }
`);

/**
 * LetterPanel — the final cover letter in a styled, document-like panel
 * (FR-RESULTS-01). Header carries the final score + copy action; the muted
 * footer credits iteration count and model (BC-BRAND-02).
 */
export function LetterPanel({
  letter = '', title = 'Cover letter',
  finalScore, iterations, model,
  onCopy, showCopy = true,
  className = '', style = {},
}) {
  return (
    <div className={`ds-letter ${className}`} style={style}>
      <div className="ds-letter__head">
        <div>
          <div className="ds-letter__eyebrow">Final output</div>
          <div className="ds-letter__title">{title}</div>
        </div>
        <div className="ds-letter__spacer" />
        {typeof finalScore === 'number' && <ScoreBadge score={finalScore} />}
        {showCopy && <CopyButton text={letter} size="sm" onClick={onCopy} />}
      </div>
      <div className="ds-letter__body">{letter}</div>
      {(iterations || model) && (
        <div className="ds-letter__foot">
          {iterations != null && <span>{iterations} {iterations === 1 ? 'iteration' : 'iterations'}</span>}
          {iterations != null && model && <span className="ds-letter__dot">·</span>}
          {model && <span>{model}</span>}
        </div>
      )}
    </div>
  );
}
