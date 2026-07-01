import React from 'react';
import { Button } from '../core/Button.jsx';

/**
 * CopyButton — copies text to the clipboard; its label flips to "Copied"
 * for two seconds, then resets (FR-RESULTS-02).
 */
export function CopyButton({
  text = '', label = 'Copy to clipboard', copiedLabel = 'Copied',
  variant = 'secondary', size = 'md', className = '', style = {}, ...rest
}) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef(null);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      }
    } catch (e) { /* swallow — never surface clipboard errors */ }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant={variant}
      size={size}
      icon={copied ? 'check' : 'copy'}
      onClick={onClick}
      className={className}
      style={style}
      {...rest}
    >
      {copied ? copiedLabel : label}
    </Button>
  );
}
