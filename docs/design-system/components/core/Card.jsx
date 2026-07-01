import React from 'react';

/**
 * Card — the base surface container. Holds panels, inputs, results.
 * Elevation is restrained: `flat` (border only), `raised` (sm shadow),
 * `floating` (lg shadow, for dialogs).
 */
export function Card({
  children,
  elevation = 'flat',
  padding = 'md',
  as: Tag = 'div',
  className = '',
  style = {},
  ...rest
}) {
  const pad = padding === 'none' ? 0
    : padding === 'sm' ? 'var(--space-4)'
    : padding === 'lg' ? 'var(--space-8)'
    : 'var(--space-6)';
  const shadow = elevation === 'raised' ? 'var(--shadow-sm)'
    : elevation === 'floating' ? 'var(--shadow-lg)'
    : 'none';
  return (
    <Tag
      className={className}
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        padding: pad,
        boxShadow: shadow,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
