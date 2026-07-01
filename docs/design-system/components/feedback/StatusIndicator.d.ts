import * as React from 'react';

export interface StatusIndicatorProps {
  /** Pipeline state. Default 'idle'. */
  state?: 'idle' | 'running' | 'complete' | 'error';
  /** Override the default label text. */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Header pipeline-status pill — idle (dot), running (pulsing), complete, error. */
export function StatusIndicator(props: StatusIndicatorProps): JSX.Element;
