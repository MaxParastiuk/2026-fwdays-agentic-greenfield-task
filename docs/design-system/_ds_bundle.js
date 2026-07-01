/* @ds-bundle: {"format":3,"namespace":"JobApplicationAgentDesignSystem_8adca7","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"ICON_NAMES","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"CopyButton","sourcePath":"components/feedback/CopyButton.jsx"},{"name":"ErrorBanner","sourcePath":"components/feedback/ErrorBanner.jsx"},{"name":"ProgressStream","sourcePath":"components/feedback/ProgressStream.jsx"},{"name":"StatusIndicator","sourcePath":"components/feedback/StatusIndicator.jsx"},{"name":"CollapsiblePreview","sourcePath":"components/forms/CollapsiblePreview.jsx"},{"name":"SegmentedControl","sourcePath":"components/forms/SegmentedControl.jsx"},{"name":"TextArea","sourcePath":"components/forms/TextArea.jsx"},{"name":"TextField","sourcePath":"components/forms/TextField.jsx"},{"name":"UploadZone","sourcePath":"components/forms/UploadZone.jsx"},{"name":"GapList","sourcePath":"components/results/GapList.jsx"},{"name":"IterationTimeline","sourcePath":"components/results/IterationTimeline.jsx"},{"name":"LetterPanel","sourcePath":"components/results/LetterPanel.jsx"},{"name":"ScoreBadge","sourcePath":"components/results/ScoreBadge.jsx"}],"sourceHashes":{"components/core/Button.jsx":"16bd25196217","components/core/Card.jsx":"a9d340af4b22","components/core/Icon.jsx":"cc75fe30e281","components/core/IconButton.jsx":"a75826152be9","components/core/Tag.jsx":"5d3bb236bc96","components/core/inject.js":"ff170be8223c","components/feedback/CopyButton.jsx":"d9eeb6437f76","components/feedback/ErrorBanner.jsx":"60a04b949517","components/feedback/ProgressStream.jsx":"66231c465c1e","components/feedback/StatusIndicator.jsx":"2c379d6a8e32","components/forms/CollapsiblePreview.jsx":"6c715e623b17","components/forms/SegmentedControl.jsx":"457c139d5377","components/forms/TextArea.jsx":"cf3389ebe516","components/forms/TextField.jsx":"2a647258d103","components/forms/UploadZone.jsx":"184c4f17338e","components/results/GapList.jsx":"324562b8afdf","components/results/IterationTimeline.jsx":"a1ed0494693d","components/results/LetterPanel.jsx":"8c700d39f8f9","components/results/ScoreBadge.jsx":"a101e93c6897","ui_kits/job_application_agent/AppShell.jsx":"01ef44d6a0b3","ui_kits/job_application_agent/InputScreen.jsx":"e810299aeea8","ui_kits/job_application_agent/ResultsScreen.jsx":"8bd9f5977c44","ui_kits/job_application_agent/RunningView.jsx":"1cf6cf9965c0"},"inlinedExternals":[],"unexposedExports":[{"name":"inject","sourcePath":"components/core/inject.js"},{"name":"scoreTone","sourcePath":"components/results/ScoreBadge.jsx"}]} */

(() => {

const __ds_ns = (window.JobApplicationAgentDesignSystem_8adca7 = window.JobApplicationAgentDesignSystem_8adca7 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card — the base surface container. Holds panels, inputs, results.
 * Elevation is restrained: `flat` (border only), `raised` (sm shadow),
 * `floating` (lg shadow, for dialogs).
 */
function Card({
  children,
  elevation = 'flat',
  padding = 'md',
  as: Tag = 'div',
  className = '',
  style = {},
  ...rest
}) {
  const pad = padding === 'none' ? 0 : padding === 'sm' ? 'var(--space-4)' : padding === 'lg' ? 'var(--space-8)' : 'var(--space-6)';
  const shadow = elevation === 'raised' ? 'var(--shadow-sm)' : elevation === 'floating' ? 'var(--shadow-lg)' : 'none';
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: className,
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      padding: pad,
      boxShadow: shadow,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Icon — the brand's line-icon set (Lucide geometry, 24×24, 2px stroke,
 * round caps/joins). Inherits `currentColor`. Keep icons functional and
 * literal; never decorative, never emoji.
 */

const PATHS = {
  upload: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "17 8 12 3 7 8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    x2: "12",
    y1: "3",
    y2: "15"
  })),
  'file-text': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 2v4a2 2 0 0 0 2 2h4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 9H8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 13H8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 17H8"
  })),
  link: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
  })),
  globe: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M2 12h20"
  })),
  check: /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  }),
  copy: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    width: "14",
    height: "14",
    x: "8",
    y: "8",
    rx: "2",
    ry: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
  })),
  'clipboard-check': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    width: "8",
    height: "4",
    x: "8",
    y: "2",
    rx: "1",
    ry: "1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m9 14 2 2 4-4"
  })),
  'alert-triangle': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 9v4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 17h.01"
  })),
  'refresh-cw': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 3v5h-5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 16H3v5"
  })),
  'chevron-down': /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }),
  'chevron-right': /*#__PURE__*/React.createElement("path", {
    d: "m9 18 6-6-6-6"
  }),
  x: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12"
  })),
  shield: /*#__PURE__*/React.createElement("path", {
    d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
  }),
  'arrow-right': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m12 5 7 7-7 7"
  })),
  'pen-line': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 20h9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"
  })),
  'search-check': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "m8 11 2 2 4-4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m21 21-4.3-4.3"
  })),
  loader: /*#__PURE__*/React.createElement("path", {
    d: "M21 12a9 9 0 1 1-6.219-8.56"
  })
};
function Icon({
  name,
  size = 18,
  strokeWidth = 2,
  className = '',
  style = {},
  ...rest
}) {
  const glyph = PATHS[name];
  if (!glyph) return null;
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className,
    style: {
      flex: 'none',
      display: 'block',
      ...style
    },
    "aria-hidden": "true"
  }, rest), glyph);
}
const ICON_NAMES = Object.keys(PATHS);
Object.assign(__ds_scope, { Icon, ICON_NAMES });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  neutral: {
    color: 'var(--text-body)',
    background: 'var(--paper-deep)',
    border: 'var(--border-default)'
  },
  accent: {
    color: 'var(--accent-700)',
    background: 'var(--accent-100)',
    border: 'var(--accent-300)'
  },
  pass: {
    color: 'var(--pass)',
    background: 'var(--pass-bg)',
    border: 'var(--pass-line)'
  },
  mid: {
    color: 'var(--mid)',
    background: 'var(--mid-bg)',
    border: 'var(--mid-line)'
  },
  fail: {
    color: 'var(--fail)',
    background: 'var(--fail-bg)',
    border: 'var(--fail-line)'
  }
};

/** Tag — a compact label chip for gap labels, file types, input modes. */
function Tag({
  children,
  tone = 'neutral',
  icon,
  mono = false,
  className = '',
  style = {},
  ...rest
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: className,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
      fontSize: mono ? 11.5 : 12,
      fontWeight: mono ? 500 : 600,
      lineHeight: 1,
      letterSpacing: mono ? 0 : '0.005em',
      padding: '4px 9px',
      borderRadius: 'var(--radius-sm)',
      color: t.color,
      background: t.background,
      border: `1px solid ${t.border}`,
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 13
  }), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/core/inject.js
try { (() => {
// Shared one-time <style> injector for component pseudo-states (hover/focus/
// active) that inline styles can't express. Each component injects once,
// keyed by id. Rules reference the design-system CSS custom properties.
const _done = {};
function inject(id, css) {
  if (typeof document === 'undefined' || _done[id]) return;
  _done[id] = true;
  const el = document.createElement('style');
  el.setAttribute('data-ds', id);
  el.textContent = css;
  document.head.appendChild(el);
}
Object.assign(__ds_scope, { inject });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/inject.js", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.inject('button', `
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
function Button({
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
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled || loading,
    className: `ds-btn ds-btn--${variant} ds-btn--${size} ${className}`,
    style: {
      width: fullWidth ? '100%' : undefined,
      ...style
    }
  }, rest), loading ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "loader",
    size: iconSize,
    className: "ds-btn__spin"
  }) : icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: iconSize
  }), children, !loading && iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: iconSize
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.inject('iconbtn', `
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
function IconButton({
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
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    className: `ds-iconbtn ds-iconbtn--${size} ${solid ? 'ds-iconbtn--solid' : ''} ${className}`,
    style: style
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: iconSize
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/feedback/CopyButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CopyButton — copies text to the clipboard; its label flips to "Copied"
 * for two seconds, then resets (FR-RESULTS-02).
 */
function CopyButton({
  text = '',
  label = 'Copy to clipboard',
  copiedLabel = 'Copied',
  variant = 'secondary',
  size = 'md',
  className = '',
  style = {},
  ...rest
}) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  const onClick = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      }
    } catch (e) {/* swallow — never surface clipboard errors */}
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };
  return /*#__PURE__*/React.createElement(__ds_scope.Button, _extends({
    variant: variant,
    size: size,
    icon: copied ? 'check' : 'copy',
    onClick: onClick,
    className: className,
    style: style
  }, rest), copied ? copiedLabel : label);
}
Object.assign(__ds_scope, { CopyButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/CopyButton.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ErrorBanner.jsx
try { (() => {
__ds_scope.inject('errbanner', `
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
function ErrorBanner({
  title = 'The run could not complete',
  message,
  actionLabel = 'Try again',
  onRetry,
  className = '',
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `ds-err ${className}`,
    style: style,
    role: "alert"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-err__ic"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "alert-triangle",
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    className: "ds-err__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-err__title"
  }, title), message && /*#__PURE__*/React.createElement("div", {
    className: "ds-err__msg"
  }, message)), onRetry && /*#__PURE__*/React.createElement("div", {
    className: "ds-err__act"
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    size: "sm",
    icon: "refresh-cw",
    onClick: onRetry
  }, actionLabel)));
}
Object.assign(__ds_scope, { ErrorBanner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ErrorBanner.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressStream.jsx
try { (() => {
__ds_scope.inject('progress', `
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
function ProgressStream({
  steps = [],
  className = '',
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `ds-prog ${className}`,
    style: style
  }, steps.map((s, i) => {
    const status = s.status || 'pending';
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: `ds-prog__row ds-prog__row--${status} ${status === 'pending' ? 'ds-prog__pending' : ''}`
    }, /*#__PURE__*/React.createElement("span", {
      className: "ds-prog__ic"
    }, status === 'active' && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "loader",
      size: 16,
      className: "ds-prog__spin"
    }), status === 'done' && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "check",
      size: 16
    }), status === 'pending' && /*#__PURE__*/React.createElement("span", {
      className: "ds-prog__dot"
    })), /*#__PURE__*/React.createElement("span", {
      className: "ds-prog__label"
    }, s.label), s.phase && /*#__PURE__*/React.createElement("span", {
      className: "ds-prog__phase"
    }, s.phase));
  }));
}
Object.assign(__ds_scope, { ProgressStream });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressStream.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StatusIndicator.jsx
try { (() => {
__ds_scope.inject('status', `
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
  idle: 'var(--status-idle)',
  running: 'var(--status-run)',
  complete: 'var(--status-done)',
  error: 'var(--status-error)'
};
const LABELS = {
  idle: 'Idle',
  running: 'Running',
  complete: 'Complete',
  error: 'Error'
};

/** StatusIndicator — the header pipeline-status pill. */
function StatusIndicator({
  state = 'idle',
  label,
  className = '',
  style = {}
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: `ds-status ds-status--${state} ${className}`,
    style: style
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-status__dot",
    style: {
      background: COLORS[state]
    }
  }), label || LABELS[state]);
}
Object.assign(__ds_scope, { StatusIndicator });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StatusIndicator.jsx", error: String((e && e.message) || e) }); }

// components/forms/CollapsiblePreview.jsx
try { (() => {
__ds_scope.inject('collapse', `
.ds-col { border: 1px solid var(--border-default); border-radius: var(--radius-md); background: var(--surface); overflow: hidden; }
.ds-col__head {
  display: flex; align-items: center; gap: 9px; width: 100%;
  font-family: var(--font-sans); font-size: 12.5px; font-weight: 600; color: var(--text-body);
  background: transparent; border: none; cursor: pointer; padding: 11px 13px; text-align: left;
  transition: background var(--dur-fast) var(--ease-out);
}
.ds-col__head:hover { background: var(--paper-deep); }
.ds-col__head:focus-visible { outline: none; box-shadow: var(--ring); }
.ds-col__chev { color: var(--text-faint); transition: transform var(--dur-base) var(--ease-out); }
.ds-col__chev--open { transform: rotate(90deg); }
.ds-col__check { margin-left: auto; display: flex; align-items: center; gap: 5px; color: var(--pass); font-size: 11.5px; font-weight: 600; }
.ds-col__body {
  font-family: var(--font-mono); font-size: 12px; line-height: 1.65; color: var(--text-muted);
  padding: 0 14px 13px; white-space: pre-wrap; border-top: 1px solid var(--border-soft); padding-top: 12px;
}
.ds-col__more { color: var(--text-faint); font-style: normal; }
`);

/**
 * CollapsiblePreview — the confirmation preview of parsed CV / scraped job
 * text. Shows the first ~400 chars; collapsed by default.
 */
function CollapsiblePreview({
  title = 'Extracted text preview',
  text = '',
  limit = 400,
  defaultOpen = false,
  confirmedLabel = 'Parsed',
  className = '',
  style = {}
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const shown = text.slice(0, limit);
  const truncated = text.length > limit;
  return /*#__PURE__*/React.createElement("div", {
    className: `ds-col ${className}`,
    style: style
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ds-col__head",
    "aria-expanded": open,
    onClick: () => setOpen(o => !o)
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-right",
    size: 16,
    className: `ds-col__chev ${open ? 'ds-col__chev--open' : ''}`
  }), title, /*#__PURE__*/React.createElement("span", {
    className: "ds-col__check"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 13
  }), confirmedLabel)), open && /*#__PURE__*/React.createElement("div", {
    className: "ds-col__body"
  }, shown, truncated && /*#__PURE__*/React.createElement("span", {
    className: "ds-col__more"
  }, "\u2026 +", (text.length - limit).toLocaleString(), " more characters")));
}
Object.assign(__ds_scope, { CollapsiblePreview });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/CollapsiblePreview.jsx", error: String((e && e.message) || e) }); }

// components/forms/SegmentedControl.jsx
try { (() => {
__ds_scope.inject('segmented', `
.ds-seg {
  display: inline-flex; padding: 3px; gap: 2px;
  background: var(--paper-deep); border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
}
.ds-seg__opt {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: var(--font-sans); font-size: 13px; font-weight: 600;
  color: var(--text-muted); background: transparent; border: none;
  padding: 6px 14px; border-radius: var(--radius-sm); cursor: pointer;
  transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
}
.ds-seg__opt:hover:not([aria-pressed="true"]) { color: var(--text-strong); }
.ds-seg__opt[aria-pressed="true"] {
  color: var(--accent-700); background: var(--surface); box-shadow: var(--shadow-xs);
}
.ds-seg__opt:focus-visible { outline: none; box-shadow: var(--ring); }
`);

/**
 * SegmentedControl — a 2–3 option toggle (CV upload ↔ paste, URL ↔ paste).
 * Controlled: pass `value` + `onChange`.
 */
function SegmentedControl({
  options,
  value,
  onChange,
  className = '',
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "group",
    className: `ds-seg ${className}`,
    style: style
  }, options.map(opt => {
    const val = typeof opt === 'string' ? opt : opt.value;
    const label = typeof opt === 'string' ? opt : opt.label;
    const icon = typeof opt === 'string' ? null : opt.icon;
    return /*#__PURE__*/React.createElement("button", {
      key: val,
      type: "button",
      className: "ds-seg__opt",
      "aria-pressed": value === val,
      onClick: () => onChange && onChange(val)
    }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: icon,
      size: 15
    }), label);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextArea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.inject('textarea', `
.ds-ta { display: flex; flex-direction: column; gap: 6px; }
.ds-ta__label { font-family: var(--font-sans); font-size: 12.5px; font-weight: 600; color: var(--text-body); }
.ds-ta__field {
  width: 100%; box-sizing: border-box; resize: vertical;
  font-family: var(--font-sans); font-size: 14px; line-height: 1.55; color: var(--text-strong);
  background: var(--surface); border: 1px solid var(--border-strong);
  border-radius: var(--radius-md); padding: 12px 13px; min-height: 140px;
  transition: border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
}
.ds-ta__field--mono { font-family: var(--font-mono); font-size: 13px; line-height: 1.6; }
.ds-ta__field::placeholder { color: var(--text-placeholder); }
.ds-ta__field:hover { border-color: var(--ink-300); }
.ds-ta__field:focus { outline: none; border-color: var(--border-focus); box-shadow: var(--ring); }
.ds-ta__foot { display: flex; justify-content: space-between; font-family: var(--font-sans); font-size: 11.5px; color: var(--text-faint); }
`);

/** TextArea — multi-line input for pasted CV or job posting text. */
function TextArea({
  label,
  hint,
  count,
  value,
  mono = false,
  id,
  className = '',
  style = {},
  ...rest
}) {
  const fid = id || (label ? `t-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const len = typeof value === 'string' ? value.length : null;
  return /*#__PURE__*/React.createElement("div", {
    className: `ds-ta ${className}`,
    style: style
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "ds-ta__label",
    htmlFor: fid
  }, label), /*#__PURE__*/React.createElement("textarea", _extends({
    id: fid,
    value: value,
    className: `ds-ta__field ${mono ? 'ds-ta__field--mono' : ''}`
  }, rest)), (hint || count) && /*#__PURE__*/React.createElement("div", {
    className: "ds-ta__foot"
  }, /*#__PURE__*/React.createElement("span", null, hint), count && len != null && /*#__PURE__*/React.createElement("span", null, len.toLocaleString(), " characters")));
}
Object.assign(__ds_scope, { TextArea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextArea.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.inject('textfield', `
.ds-field { display: flex; flex-direction: column; gap: 6px; }
.ds-field__label { font-family: var(--font-sans); font-size: 12.5px; font-weight: 600; color: var(--text-body); }
.ds-field__hint { font-family: var(--font-sans); font-size: 11.5px; color: var(--text-faint); }
.ds-field__wrap { position: relative; display: flex; align-items: center; }
.ds-field__icon { position: absolute; left: 11px; color: var(--text-faint); pointer-events: none; }
.ds-input {
  width: 100%; box-sizing: border-box;
  font-family: var(--font-sans); font-size: 14px; color: var(--text-strong);
  background: var(--surface); border: 1px solid var(--border-strong);
  border-radius: var(--radius-md); padding: 10px 12px;
  transition: border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
}
.ds-input--icon { padding-left: 36px; }
.ds-input::placeholder { color: var(--text-placeholder); }
.ds-input:hover { border-color: var(--ink-300); }
.ds-input:focus { outline: none; border-color: var(--border-focus); box-shadow: var(--ring); }
.ds-input--error { border-color: var(--fail); }
.ds-input--error:focus { box-shadow: 0 0 0 3px var(--fail-bg); }
.ds-field__error { display: flex; align-items: center; gap: 5px; font-family: var(--font-sans); font-size: 11.5px; color: var(--fail); }
`);

/** TextField — a single-line labelled input (e.g. the job posting URL). */
function TextField({
  label,
  hint,
  error,
  icon,
  id,
  className = '',
  style = {},
  ...rest
}) {
  const fid = id || (label ? `f-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    className: `ds-field ${className}`,
    style: style
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "ds-field__label",
    htmlFor: fid
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "ds-field__wrap"
  }, icon && /*#__PURE__*/React.createElement("span", {
    className: "ds-field__icon"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  })), /*#__PURE__*/React.createElement("input", _extends({
    id: fid,
    className: `ds-input ${icon ? 'ds-input--icon' : ''} ${error ? 'ds-input--error' : ''}`,
    "aria-invalid": !!error
  }, rest))), error ? /*#__PURE__*/React.createElement("span", {
    className: "ds-field__error"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "alert-triangle",
    size: 12
  }), error) : hint && /*#__PURE__*/React.createElement("span", {
    className: "ds-field__hint"
  }, hint));
}
Object.assign(__ds_scope, { TextField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextField.jsx", error: String((e && e.message) || e) }); }

// components/forms/UploadZone.jsx
try { (() => {
__ds_scope.inject('uploadzone', `
.ds-drop {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px; text-align: center; cursor: pointer;
  border: 1.5px dashed var(--line-strong); border-radius: var(--radius-lg);
  background: var(--paper-deep); padding: 30px 24px; min-height: 150px;
  transition: border-color var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out);
}
.ds-drop:hover { border-color: var(--accent-300); }
.ds-drop--over { border-color: var(--accent-500); border-style: solid; background: var(--accent-050); }
.ds-drop--error { border-color: var(--fail); background: var(--fail-bg); }
.ds-drop__ic { color: var(--accent-500); }
.ds-drop--error .ds-drop__ic { color: var(--fail); }
.ds-drop__title { font-family: var(--font-sans); font-size: 14px; font-weight: 600; color: var(--text-strong); }
.ds-drop__title b { color: var(--accent-500); }
.ds-drop__hint { font-family: var(--font-sans); font-size: 12px; color: var(--text-faint); }
.ds-drop--error .ds-drop__hint { color: var(--fail); }

.ds-file {
  display: flex; align-items: center; gap: 12px;
  border: 1px solid var(--border-default); border-radius: var(--radius-lg);
  background: var(--surface); padding: 14px 16px;
}
.ds-file__ic { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; flex: none; border-radius: var(--radius-sm); background: var(--accent-100); color: var(--accent-700); }
.ds-file__name { font-family: var(--font-sans); font-size: 13.5px; font-weight: 600; color: var(--text-strong); }
.ds-file__meta { font-family: var(--font-mono); font-size: 11px; color: var(--text-faint); margin-top: 2px; }
.ds-file__x { margin-left: auto; }
`);

/**
 * UploadZone — drag-and-drop / click target for a CV PDF.
 * Stateless presentation: pass `file` to show the selected-file row,
 * or `error` for the rejected state. Wire `onSelect(file)` and `onRemove`.
 */
function UploadZone({
  file,
  error,
  accept = '.pdf',
  maxLabel = '5 MB',
  onSelect,
  onRemove,
  className = '',
  style = {}
}) {
  const inputRef = React.useRef(null);
  const [over, setOver] = React.useState(false);
  if (file) {
    return /*#__PURE__*/React.createElement("div", {
      className: `ds-file ${className}`,
      style: style
    }, /*#__PURE__*/React.createElement("span", {
      className: "ds-file__ic"
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "file-text",
      size: 20
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "ds-file__name"
    }, file.name), /*#__PURE__*/React.createElement("div", {
      className: "ds-file__meta"
    }, file.size, " \xB7 parsed server-side")), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "ds-file__x",
      "aria-label": "Remove file",
      onClick: onRemove,
      style: {
        background: 'transparent',
        border: 'none',
        color: 'var(--text-faint)',
        cursor: 'pointer',
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "x",
      size: 18
    })));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: `ds-drop ${over ? 'ds-drop--over' : ''} ${error ? 'ds-drop--error' : ''} ${className}`,
    style: style,
    role: "button",
    tabIndex: 0,
    onClick: () => inputRef.current && inputRef.current.click(),
    onDragOver: e => {
      e.preventDefault();
      setOver(true);
    },
    onDragLeave: () => setOver(false),
    onDrop: e => {
      e.preventDefault();
      setOver(false);
      const f = e.dataTransfer.files && e.dataTransfer.files[0];
      if (f && onSelect) onSelect(f);
    }
  }, /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    type: "file",
    accept: accept,
    hidden: true,
    onChange: e => {
      const f = e.target.files && e.target.files[0];
      if (f && onSelect) onSelect(f);
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "ds-drop__ic"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: error ? 'alert-triangle' : 'upload',
    size: 26,
    strokeWidth: 1.75
  })), error ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ds-drop__title"
  }, error), /*#__PURE__*/React.createElement("div", {
    className: "ds-drop__hint"
  }, "Try a different file, or switch to pasted text.")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ds-drop__title"
  }, "Drop your CV here, or ", /*#__PURE__*/React.createElement("b", null, "browse")), /*#__PURE__*/React.createElement("div", {
    className: "ds-drop__hint"
  }, "PDF up to ", maxLabel, " \xB7 processed in memory, never stored")));
}
Object.assign(__ds_scope, { UploadZone });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/UploadZone.jsx", error: String((e && e.message) || e) }); }

// components/results/GapList.jsx
try { (() => {
__ds_scope.inject('gaplist', `
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
function GapList({
  gaps = [],
  emptyLabel = 'No gaps identified',
  className = '',
  style = {}
}) {
  if (!gaps.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: `ds-gaps--empty ${className}`,
      style: style
    }, /*#__PURE__*/React.createElement("svg", {
      className: "ds-gaps__check",
      width: "15",
      height: "15",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.4",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M20 6 9 17l-5-5"
    })), emptyLabel);
  }
  return /*#__PURE__*/React.createElement("ul", {
    className: `ds-gaps ${className}`,
    style: style
  }, gaps.map((g, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    className: "ds-gaps__item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-gaps__mark"
  }), /*#__PURE__*/React.createElement("span", null, g))));
}
Object.assign(__ds_scope, { GapList });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/results/GapList.jsx", error: String((e && e.message) || e) }); }

// components/results/ScoreBadge.jsx
try { (() => {
/** Resolve a 0–10 score to its semantic tone. */
function scoreTone(score) {
  if (score >= 8) return 'pass';
  if (score >= 5) return 'mid';
  return 'fail';
}
const TONES = {
  pass: {
    color: 'var(--pass)',
    background: 'var(--pass-bg)',
    border: 'var(--pass-line)'
  },
  mid: {
    color: 'var(--mid)',
    background: 'var(--mid-bg)',
    border: 'var(--mid-line)'
  },
  fail: {
    color: 'var(--fail)',
    background: 'var(--fail-bg)',
    border: 'var(--fail-line)'
  }
};
const SIZES = {
  sm: {
    fs: 12,
    pad: '3px 8px',
    sub: 9
  },
  md: {
    fs: 14,
    pad: '5px 11px',
    sub: 10
  },
  lg: {
    fs: 18,
    pad: '7px 14px',
    sub: 12
  }
};

/**
 * ScoreBadge — the Checker score, colored by threshold:
 * green ≥ 8, amber 5–7.9, red < 5 (FR-RESULTS-03).
 */
function ScoreBadge({
  score,
  max = 10,
  size = 'md',
  showMax = true,
  className = '',
  style = {}
}) {
  const t = TONES[scoreTone(score)];
  const s = SIZES[size] || SIZES.md;
  return /*#__PURE__*/React.createElement("span", {
    className: className,
    style: {
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: 3,
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums',
      fontSize: s.fs,
      padding: s.pad,
      borderRadius: 'var(--radius-full)',
      color: t.color,
      background: t.background,
      border: `1px solid ${t.border}`,
      ...style
    }
  }, score.toFixed(1), showMax && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: s.sub,
      fontWeight: 500,
      opacity: 0.7
    }
  }, "/", max));
}
Object.assign(__ds_scope, { scoreTone, ScoreBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/results/ScoreBadge.jsx", error: String((e && e.message) || e) }); }

// components/results/IterationTimeline.jsx
try { (() => {
__ds_scope.inject('timeline', `
.ds-tl { display: flex; flex-direction: column; }
.ds-tl__row { position: relative; display: flex; gap: 14px; padding-bottom: 6px; }
.ds-tl__rail { display: flex; flex-direction: column; align-items: center; flex: none; width: 28px; }
.ds-tl__node {
  width: 28px; height: 28px; border-radius: 50%; flex: none;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-mono); font-size: 12px; font-weight: 600;
  background: var(--surface); color: var(--text-muted); border: 1.5px solid var(--border-strong);
}
.ds-tl__node--last { background: var(--accent-700); color: #FBFAF7; border-color: var(--accent-700); }
.ds-tl__line { flex: 1; width: 1.5px; background: var(--border-default); margin: 4px 0; min-height: 8px; }
.ds-tl__body { flex: 1; min-width: 0; padding-bottom: 18px; }
.ds-tl__head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.ds-tl__title { font-family: var(--font-sans); font-size: 13.5px; font-weight: 700; color: var(--text-strong); }
.ds-tl__final { font-family: var(--font-sans); font-size: 10.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--accent-500); }
.ds-tl__rationale { font-family: var(--font-serif); font-style: italic; font-size: 14px; line-height: 1.5; color: var(--text-muted); margin: 8px 0 10px; }
.ds-tl__toggle {
  display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
  background: transparent; border: none; padding: 0;
  font-family: var(--font-sans); font-size: 12px; font-weight: 600; color: var(--accent-500);
}
.ds-tl__chev { transition: transform var(--dur-base) var(--ease-out); }
.ds-tl__chev--open { transform: rotate(90deg); }
.ds-tl__gaps { margin-top: 10px; padding-left: 2px; }
`);

/**
 * IterationTimeline — per-round score history (FR-RESULTS-03). Each entry
 * shows the round number, its ScoreBadge, the Checker rationale, and a
 * collapsible GapList. The final (best) round is emphasised.
 */
function IterationTimeline({
  iterations = [],
  defaultOpenLast = true,
  className = '',
  style = {}
}) {
  const [open, setOpen] = React.useState(() => {
    const init = {};
    iterations.forEach((_, i) => {
      init[i] = defaultOpenLast && i === iterations.length - 1;
    });
    return init;
  });
  const toggle = i => setOpen(o => ({
    ...o,
    [i]: !o[i]
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: `ds-tl ${className}`,
    style: style
  }, iterations.map((it, i) => {
    const isLast = i === iterations.length - 1;
    const gaps = it.gaps || [];
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "ds-tl__row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ds-tl__rail"
    }, /*#__PURE__*/React.createElement("div", {
      className: `ds-tl__node ${isLast ? 'ds-tl__node--last' : ''}`
    }, it.iteration ?? i + 1), !isLast && /*#__PURE__*/React.createElement("div", {
      className: "ds-tl__line"
    })), /*#__PURE__*/React.createElement("div", {
      className: "ds-tl__body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ds-tl__head"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ds-tl__title"
    }, "Iteration ", it.iteration ?? i + 1), /*#__PURE__*/React.createElement(__ds_scope.ScoreBadge, {
      score: it.score,
      size: "sm"
    }), isLast && /*#__PURE__*/React.createElement("span", {
      className: "ds-tl__final"
    }, "Final letter")), it.rationale && /*#__PURE__*/React.createElement("div", {
      className: "ds-tl__rationale"
    }, "\u201C", it.rationale, "\u201D"), gaps.length > 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "ds-tl__toggle",
      "aria-expanded": !!open[i],
      onClick: () => toggle(i)
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "chevron-right",
      size: 14,
      className: `ds-tl__chev ${open[i] ? 'ds-tl__chev--open' : ''}`
    }), gaps.length, " ", gaps.length === 1 ? 'gap' : 'gaps', " identified"), open[i] && /*#__PURE__*/React.createElement("div", {
      className: "ds-tl__gaps"
    }, /*#__PURE__*/React.createElement(__ds_scope.GapList, {
      gaps: gaps
    }))) : /*#__PURE__*/React.createElement("div", {
      className: "ds-tl__gaps"
    }, /*#__PURE__*/React.createElement(__ds_scope.GapList, {
      gaps: []
    }))));
  }));
}
Object.assign(__ds_scope, { IterationTimeline });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/results/IterationTimeline.jsx", error: String((e && e.message) || e) }); }

// components/results/LetterPanel.jsx
try { (() => {
__ds_scope.inject('letter', `
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
function LetterPanel({
  letter = '',
  title = 'Cover letter',
  finalScore,
  iterations,
  model,
  onCopy,
  showCopy = true,
  className = '',
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `ds-letter ${className}`,
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-letter__head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ds-letter__eyebrow"
  }, "Final output"), /*#__PURE__*/React.createElement("div", {
    className: "ds-letter__title"
  }, title)), /*#__PURE__*/React.createElement("div", {
    className: "ds-letter__spacer"
  }), typeof finalScore === 'number' && /*#__PURE__*/React.createElement(__ds_scope.ScoreBadge, {
    score: finalScore
  }), showCopy && /*#__PURE__*/React.createElement(__ds_scope.CopyButton, {
    text: letter,
    size: "sm",
    onClick: onCopy
  })), /*#__PURE__*/React.createElement("div", {
    className: "ds-letter__body"
  }, letter), (iterations || model) && /*#__PURE__*/React.createElement("div", {
    className: "ds-letter__foot"
  }, iterations != null && /*#__PURE__*/React.createElement("span", null, iterations, " ", iterations === 1 ? 'iteration' : 'iterations'), iterations != null && model && /*#__PURE__*/React.createElement("span", {
    className: "ds-letter__dot"
  }, "\xB7"), model && /*#__PURE__*/React.createElement("span", null, model)));
}
Object.assign(__ds_scope, { LetterPanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/results/LetterPanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/job_application_agent/AppShell.jsx
try { (() => {
// AppShell — header (logo + pipeline status) and footer (privacy line)
// for the Job Application Agent. Composes the design-system components.
const NS = window.JobApplicationAgentDesignSystem_8adca7;
function AppShell({
  status,
  statusLabel,
  children
}) {
  const {
    StatusIndicator,
    Icon
  } = NS;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      background: 'var(--paper)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      borderBottom: '1px solid var(--border-default)',
      background: 'var(--surface)',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '14px 32px',
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logomark.svg",
    alt: "",
    width: "34",
    height: "34",
    style: {
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 19,
      fontWeight: 500,
      letterSpacing: '-0.01em',
      lineHeight: 1
    }
  }, "Job Application ", /*#__PURE__*/React.createElement("b", {
    style: {
      fontWeight: 600
    }
  }, "Agent")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(StatusIndicator, {
    state: status,
    label: statusLabel
  }))), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      width: '100%',
      maxWidth: 1180,
      margin: '0 auto',
      padding: '40px 32px 28px',
      boxSizing: 'border-box'
    }
  }, children), /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--border-default)',
      background: 'var(--surface)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '16px 32px',
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 14,
    style: {
      color: 'var(--text-faint)'
    }
  }), "No accounts \xB7 No stored data \xB7 No cookies. Your CV is processed in memory and never written to disk.")));
}
window.AppShell = AppShell;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/job_application_agent/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/job_application_agent/InputScreen.jsx
try { (() => {
// InputScreen — the two-panel landing: CV on the left, job posting on the
// right, run button beneath. Nothing runs until both inputs validate.
const NSi = window.JobApplicationAgentDesignSystem_8adca7;
const SAMPLE_CV = `JANE DOE
Staff Software Engineer · Berlin · jane@example.com

SUMMARY
Reliability-focused engineer with 9 years building distributed systems.
Cut p99 latency 38% across the payments platform and mentored six
engineers to senior. Comfortable owning a service end to end, from
on-call rotation to capacity planning.

EXPERIENCE
Acme Payments — Staff Engineer (2021–present)
- Reduced p99 checkout latency from 940ms to 580ms.
- Brought on-call pages down from 19/week to 3/week.`;
function InputScreen({
  onRun
}) {
  const {
    SegmentedControl,
    UploadZone,
    TextArea,
    TextField,
    CollapsiblePreview,
    Button,
    Card
  } = NSi;
  const [cvMode, setCvMode] = React.useState('upload');
  const [cvFile, setCvFile] = React.useState({
    name: 'jane-doe-cv.pdf',
    size: '142 KB'
  });
  const [cvText, setCvText] = React.useState('');
  const [jobMode, setJobMode] = React.useState('url');
  const [jobUrl, setJobUrl] = React.useState('https://careers.acme.com/staff-engineer');
  const [jobText, setJobText] = React.useState('');
  const cvReady = cvMode === 'upload' ? !!cvFile : cvText.trim().length > 60;
  const validUrl = /^https?:\/\/.+\..+/.test(jobUrl.trim());
  const jobReady = jobMode === 'url' ? validUrl : jobText.trim().length > 60;
  const runEnabled = cvReady && jobReady;
  const panelLabel = {
    fontFamily: 'var(--font-sans)',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '.12em',
    textTransform: 'uppercase',
    color: 'var(--text-faint)',
    marginBottom: 4
  };
  const panelTitle = {
    fontFamily: 'var(--font-sans)',
    fontSize: 17,
    fontWeight: 700,
    color: 'var(--text-strong)'
  };
  const panelHead = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 640,
      marginBottom: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 38,
      fontWeight: 500,
      letterSpacing: '-0.02em',
      lineHeight: 1.08,
      color: 'var(--ink-900)'
    }
  }, "A cover letter worth signing."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15.5,
      lineHeight: 1.55,
      color: 'var(--text-body)',
      marginTop: 12,
      marginBottom: 0
    }
  }, "Provide your CV and the job posting. A Maker writes the letter, a Checker scores it against both, and the loop repeats up to three times \u2014 until the words fit the role.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    elevation: "raised",
    padding: "lg"
  }, /*#__PURE__*/React.createElement("div", {
    style: panelHead
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: panelLabel
  }, "Step 1"), /*#__PURE__*/React.createElement("div", {
    style: panelTitle
  }, "Your CV")), /*#__PURE__*/React.createElement(SegmentedControl, {
    value: cvMode,
    onChange: setCvMode,
    options: [{
      value: 'upload',
      label: 'Upload PDF',
      icon: 'upload'
    }, {
      value: 'paste',
      label: 'Paste text',
      icon: 'file-text'
    }]
  })), cvMode === 'upload' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(UploadZone, {
    file: cvFile,
    onSelect: f => setCvFile({
      name: f.name,
      size: Math.max(1, Math.round(f.size / 1024)) + ' KB'
    }),
    onRemove: () => setCvFile(null)
  }), cvFile && /*#__PURE__*/React.createElement(CollapsiblePreview, {
    title: "Extracted text",
    confirmedLabel: "Parsed",
    text: SAMPLE_CV
  })) : /*#__PURE__*/React.createElement(TextArea, {
    label: "Paste plain-text CV",
    count: true,
    value: cvText,
    onChange: e => setCvText(e.target.value),
    placeholder: "Paste your CV as plain text\u2026",
    style: {
      minHeight: 188
    }
  })), /*#__PURE__*/React.createElement(Card, {
    elevation: "raised",
    padding: "lg"
  }, /*#__PURE__*/React.createElement("div", {
    style: panelHead
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: panelLabel
  }, "Step 2"), /*#__PURE__*/React.createElement("div", {
    style: panelTitle
  }, "Job posting")), /*#__PURE__*/React.createElement(SegmentedControl, {
    value: jobMode,
    onChange: setJobMode,
    options: [{
      value: 'url',
      label: 'Job URL',
      icon: 'link'
    }, {
      value: 'paste',
      label: 'Paste text',
      icon: 'file-text'
    }]
  })), jobMode === 'url' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(TextField, {
    label: "Posting URL",
    icon: "link",
    value: jobUrl,
    onChange: e => setJobUrl(e.target.value),
    error: jobUrl && !validUrl ? 'Enter a full URL, or paste the text instead.' : undefined,
    hint: "We scrape the visible body text server-side."
  }), validUrl && /*#__PURE__*/React.createElement(CollapsiblePreview, {
    title: "Scraped text",
    confirmedLabel: "Scraped",
    text: 'Staff Software Engineer — Acme\nWe are looking for a staff engineer to steady a fast-growing payments platform. You will own reliability end to end: on-call, capacity planning, and latency. Experience with distributed tracing is a strong plus.'
  })) : /*#__PURE__*/React.createElement(TextArea, {
    label: "Paste the job posting",
    count: true,
    value: jobText,
    onChange: e => setJobText(e.target.value),
    placeholder: "Paste the posting text\u2026",
    style: {
      minHeight: 188
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      marginTop: 30
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    icon: "pen-line",
    disabled: !runEnabled,
    onClick: onRun
  }, "Generate cover letter"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      color: 'var(--text-faint)'
    }
  }, runEnabled ? 'Runs up to three iterations · target score 8.0 / 10' : 'Provide a CV and a job posting to begin.')));
}
window.InputScreen = InputScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/job_application_agent/InputScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/job_application_agent/ResultsScreen.jsx
try { (() => {
// ResultsScreen — final letter, final-iteration gap analysis, and the
// iteration score history. Composes LetterPanel, GapList, IterationTimeline.
const NSre = window.JobApplicationAgentDesignSystem_8adca7;
const FINAL_LETTER = `Dear hiring team,

Your staff engineer posting calls for someone who can steady a fast-growing payments platform without slowing it down. Over the last four years I have done exactly that. I cut p99 checkout latency from 940ms to 580ms, and brought our on-call load from nineteen pages a week to three.

Reliability, for me, is not a separate workstream — it is how I build. I have owned capacity planning, led incident reviews, and introduced distributed tracing across a twelve-service estate, which is where I see the clearest overlap with your team's current focus.

I would welcome the chance to bring that same steadiness to your platform.

Regards,
Jane Doe`;
const ITERATIONS = [{
  iteration: 1,
  score: 6.4,
  rationale: 'Solid writing, but does not address the role focus on reliability or quantify impact.',
  gaps: ['No mention of on-call or incident experience', 'No quantified impact', 'Closing paragraph is generic']
}, {
  iteration: 2,
  score: 7.8,
  rationale: 'Much closer. Reliability is addressed; one metric would push it over the bar.',
  gaps: ['Distributed tracing (a posting priority) not mentioned']
}, {
  iteration: 3,
  score: 8.6,
  rationale: 'Targeted and specific. Addresses every posting priority with concrete evidence.',
  gaps: []
}];
function ResultsScreen({
  onReset
}) {
  const {
    LetterPanel,
    IterationTimeline,
    GapList,
    Card,
    Button,
    Icon
  } = NSre;
  const sectionLabel = {
    fontFamily: 'var(--font-sans)',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '.12em',
    textTransform: 'uppercase',
    color: 'var(--text-faint)',
    marginBottom: 12
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.35fr 1fr',
      gap: 28,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(LetterPanel, {
    letter: FINAL_LETTER,
    finalScore: 8.6,
    iterations: 3,
    model: "google/gemini-2.0-flash"
  }), /*#__PURE__*/React.createElement(Card, {
    elevation: "flat",
    padding: "lg"
  }, /*#__PURE__*/React.createElement("div", {
    style: sectionLabel
  }, "Gap analysis \xB7 final iteration"), /*#__PURE__*/React.createElement(GapList, {
    gaps: [],
    emptyLabel: "No gaps remaining \u2014 the letter met the bar."
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12.5,
      lineHeight: 1.55,
      color: 'var(--text-muted)',
      marginTop: 12,
      marginBottom: 0
    }
  }, "Earlier rounds surfaced on-call experience, quantified impact, and distributed tracing \u2014 each was addressed before the run completed. Review the history to see how.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    icon: "refresh-cw",
    onClick: onReset
  }, "Start over with a new CV"))), /*#__PURE__*/React.createElement(Card, {
    elevation: "raised",
    padding: "lg"
  }, /*#__PURE__*/React.createElement("div", {
    style: sectionLabel
  }, "How the letter evolved"), /*#__PURE__*/React.createElement(IterationTimeline, {
    iterations: ITERATIONS
  })));
}
window.ResultsScreen = ResultsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/job_application_agent/ResultsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/job_application_agent/RunningView.jsx
try { (() => {
// RunningView — the live Maker→Checker run. Advances a ProgressStream
// through writing/checking phases, then calls onComplete.
const NSr = window.JobApplicationAgentDesignSystem_8adca7;
const RUN_STEPS = [{
  label: 'Iteration 1 · writing'
}, {
  label: 'Iteration 1 · checking',
  phase: 'score 6.4'
}, {
  label: 'Iteration 2 · writing'
}, {
  label: 'Iteration 2 · checking',
  phase: 'score 7.8'
}, {
  label: 'Iteration 3 · writing'
}, {
  label: 'Iteration 3 · checking',
  phase: 'score 8.6'
}];
function RunningView({
  onComplete,
  onProgress
}) {
  const {
    ProgressStream,
    Card,
    Icon
  } = NSr;
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    if (idx >= RUN_STEPS.length) {
      const t = setTimeout(onComplete, 650);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setIdx(i => i + 1);
      if (onProgress) onProgress(idx + 1);
    }, 850);
    return () => clearTimeout(t);
  }, [idx]);
  const steps = RUN_STEPS.map((s, i) => ({
    ...s,
    status: i < idx ? 'done' : i === idx ? 'active' : 'pending',
    phase: i <= idx ? s.phase : undefined
  }));
  const iterationOf = Math.min(3, Math.floor(idx / 2) + 1);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 560,
      margin: '8px auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 28,
      fontWeight: 500,
      letterSpacing: '-0.015em',
      color: 'var(--ink-900)'
    }
  }, "Writing your letter."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-muted)',
      marginTop: 8
    }
  }, "Iteration ", iterationOf, " of 3 \xB7 revising against every gap the Checker names.")), /*#__PURE__*/React.createElement(Card, {
    elevation: "raised",
    padding: "lg"
  }, /*#__PURE__*/React.createElement(ProgressStream, {
    steps: steps
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 14,
      paddingTop: 14,
      borderTop: '1px solid var(--border-soft)',
      fontFamily: 'var(--font-mono)',
      fontSize: 11.5,
      color: 'var(--text-faint)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "refresh-cw",
    size: 13
  }), "google/gemini-2.0-flash \xB7 target 8.0 / 10")));
}
window.RunningView = RunningView;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/job_application_agent/RunningView.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.CopyButton = __ds_scope.CopyButton;

__ds_ns.ErrorBanner = __ds_scope.ErrorBanner;

__ds_ns.ProgressStream = __ds_scope.ProgressStream;

__ds_ns.StatusIndicator = __ds_scope.StatusIndicator;

__ds_ns.CollapsiblePreview = __ds_scope.CollapsiblePreview;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.TextArea = __ds_scope.TextArea;

__ds_ns.TextField = __ds_scope.TextField;

__ds_ns.UploadZone = __ds_scope.UploadZone;

__ds_ns.GapList = __ds_scope.GapList;

__ds_ns.IterationTimeline = __ds_scope.IterationTimeline;

__ds_ns.LetterPanel = __ds_scope.LetterPanel;

__ds_ns.ScoreBadge = __ds_scope.ScoreBadge;

})();
