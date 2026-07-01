import React from 'react';
import { Icon } from './Icon.jsx';
import { inject } from './inject.js';

inject('iconbtn', `
.ds-iconbtn {
  display: inline-flex; align-items: center; justify-content: center;
  background: transparent; border: 1px solid transparent;
  border-radius: var(--radius-sm); color: var(--text-muted); cursor: pointer;
  transition: background var(--dur-fast) var(--ease-out),
              color var(--dur-fast) var(--ease-out),
              border-color var(--dur-fast) var(--ease-out);
}
.ds-iconbtn:hover:not(:disabled) { background: var(--paper-deep); color: var(--text-strong); }
.ds-iconbtn:active:not(:disabled) { background: var(--border-soft); }
.ds-iconbtn:focus-visible { outline: none; box-shadow: var(--ring); }
.ds-iconbtn:disabled { color: var(--text-placeholder); cursor: not-allowed; }
.ds-iconbtn--solid { background: var(--surface); border-color: var(--border-default); }
.ds-iconbtn--solid:hover:not(:disabled) { border-color: var(--ink-300); }
.ds-iconbtn--sm { width: 28px; height: 28px; }
.ds-iconbtn--md { width: 34px; height: 34px; }
.ds-iconbtn--lg { width: 40px; height: 40px; }
`);

/** IconButton — a square, icon-only affordance (close, collapse, secondary action). */
export function IconButton({
  icon,
  label,
  size = 'md',
  solid = false,
  disabled = false,
  className = '',
  style = {},
  ...rest
}) {
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 20 : 18;
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      className={`ds-iconbtn ds-iconbtn--${size} ${solid ? 'ds-iconbtn--solid' : ''} ${className}`}
      style={style}
      {...rest}
    >
      <Icon name={icon} size={iconSize} />
    </button>
  );
}
