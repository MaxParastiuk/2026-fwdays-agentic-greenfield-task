import * as React from 'react';

export interface CopyButtonProps {
  /** The text written to the clipboard. */
  text: string;
  /** Resting label. Default 'Copy to clipboard'. */
  label?: string;
  /** Confirmation label shown for 2s. Default 'Copied'. */
  copiedLabel?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

/** Copies text; label flips to "Copied" for two seconds then resets. */
export function CopyButton(props: CopyButtonProps): JSX.Element;
