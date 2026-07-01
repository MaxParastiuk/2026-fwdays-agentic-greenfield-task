import React from 'react';

/** Resolve a 0–10 score to its semantic tone. */
export function scoreTone(score) {
  if (score >= 8) return 'pass';
  if (score >= 5) return 'mid';
  return 'fail';
}

const TONES = {
  pass: { color: 'var(--pass)', background: 'var(--pass-bg)', border: 'var(--pass-line)' },
  mid:  { color: 'var(--mid)',  background: 'var(--mid-bg)',  border: 'var(--mid-line)' },
  fail: { color: 'var(--fail)', background: 'var(--fail-bg)', border: 'var(--fail-line)' },
};
const SIZES = {
  sm: { fs: 12, pad: '3px 8px', sub: 9 },
  md: { fs: 14, pad: '5px 11px', sub: 10 },
  lg: { fs: 18, pad: '7px 14px', sub: 12 },
};

/**
 * ScoreBadge — the Checker score, colored by threshold:
 * green ≥ 8, amber 5–7.9, red < 5 (FR-RESULTS-03).
 */
export function ScoreBadge({ score, max = 10, size = 'md', showMax = true, className = '', style = {} }) {
  const t = TONES[scoreTone(score)];
  const s = SIZES[size] || SIZES.md;
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex', alignItems: 'baseline', gap: 3,
        fontFamily: 'var(--font-mono)', fontWeight: 600, fontVariantNumeric: 'tabular-nums',
        fontSize: s.fs, padding: s.pad, borderRadius: 'var(--radius-full)',
        color: t.color, background: t.background, border: `1px solid ${t.border}`,
        ...style,
      }}
    >
      {score.toFixed(1)}
      {showMax && <span style={{ fontSize: s.sub, fontWeight: 500, opacity: 0.7 }}>/{max}</span>}
    </span>
  );
}
