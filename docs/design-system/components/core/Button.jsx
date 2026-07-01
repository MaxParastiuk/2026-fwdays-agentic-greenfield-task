import React from 'react';
import { Icon } from './Icon.jsx';
import { inject } from './inject.js';

inject('button', `
.ds-btn {
  font-family: var(--font-sans);
  display: inline-flex; align-items: center; justify-content: center;
  gap: 8px; white-space: nowrap; cursor: pointer;
  border: 1px solid transparent; border-radius: var(--radius-md);
  font-weight: 600; line-height: 1; letter-spacing: 0.005em;
  transition: background var(--dur-fast) var(--ease-out),
              border-color var(--dur-fast) var(--ease-out),
              color var(--dur-fast) var(--ease-out),
              box-shadow var(--dur-fast) var(--ease-out),
              transform var(--dur-fast) var(--ease-out);
}
.ds-btn:focus-visible { outline: none; box-shadow: var(--ring); }
.ds-btn:disabled { cursor: not-allowed; opacity: 1; }

.ds-btn--sm { font-size: 13px; padding: 7px 13px; }
.ds-btn--md { font-size: 14px; padding: 10px 18px; }
.ds-btn--lg { font-size: 15px; padding: 13px 24px; }

/* primary */
.ds-btn--primary { background: var(--action-bg); color: var(--action-text); }
.ds-btn--primary:hover:not(:disabled) { background: var(--action-bg-hover); }
.ds-btn--primary:active:not(:disabled) { background: var(--action-bg-active); transform: translateY(0.5px); }
.ds-btn--primary:disabled { background: var(--accent-300); color: #FBFAF7; }

/* secondary — outlined */
.ds-btn--secondary { background: var(--surface); color: var(--text-strong); border-color: var(--border-strong); }
.ds-btn--secondary:hover:not(:disabled) { background: var(--paper-deep); border-color: var(--ink-300); }
.ds-btn--secondary:active:not(:disabled) { background: var(--paper-deep); transform: translateY(0.5px); }
.ds-btn--secondary:disabled { color: var(--text-placeholder); border-color: var(--border-default); background: var(--surface); }

/* ghost */
.ds-btn--ghost { background: transparent; color: var(--accent-500); }
.ds-btn--ghost:hover:not(:disabled) { background: var(--accent-050); }
.ds-btn--ghost:active:not(:disabled) { background: var(--accent-100); }
.ds-btn--ghost:disabled { color: var(--text-placeholder); }

.ds-btn__spin { animation: ds-btn-spin 0.7s linear infinite; }
@keyframes ds-btn-spin { to { transform: rotate(360deg); } }
`);

/**
 * Button — the primary action control.
 * Variants: primary (navy fill), secondary (outline), ghost (text).
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = '',
  style = {},
  ...rest
}) {
  const iconSize = size === 'sm' ? 15 : size === 'lg' ? 18 : 16;
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`ds-btn ds-btn--${variant} ds-btn--${size} ${className}`}
      style={{ width: fullWidth ? '100%' : undefined, ...style }}
      {...rest}
    >
      {loading
        ? <Icon name="loader" size={iconSize} className="ds-btn__spin" />
        : icon && <Icon name={icon} size={iconSize} />}
      {children}
      {!loading && iconRight && <Icon name={iconRight} size={iconSize} />}
    </button>
  );
}
