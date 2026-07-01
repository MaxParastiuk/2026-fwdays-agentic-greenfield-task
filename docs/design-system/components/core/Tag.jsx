import React from 'react';
import { Icon } from './Icon.jsx';

const TONES = {
  neutral: { color: 'var(--text-body)', background: 'var(--paper-deep)', border: 'var(--border-default)' },
  accent:  { color: 'var(--accent-700)', background: 'var(--accent-100)', border: 'var(--accent-300)' },
  pass:    { color: 'var(--pass)', background: 'var(--pass-bg)', border: 'var(--pass-line)' },
  mid:     { color: 'var(--mid)', background: 'var(--mid-bg)', border: 'var(--mid-line)' },
  fail:    { color: 'var(--fail)', background: 'var(--fail-bg)', border: 'var(--fail-line)' },
};

/** Tag — a compact label chip for gap labels, file types, input modes. */
export function Tag({ children, tone = 'neutral', icon, mono = false, className = '', style = {}, ...rest }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
        fontSize: mono ? 11.5 : 12, fontWeight: mono ? 500 : 600,
        lineHeight: 1, letterSpacing: mono ? 0 : '0.005em',
        padding: '4px 9px', borderRadius: 'var(--radius-sm)',
        color: t.color, background: t.background, border: `1px solid ${t.border}`,
        ...style,
      }}
      {...rest}
    >
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  );
}
