import * as React from 'react';

export interface ProgressStep {
  /** Main line, e.g. "Iteration 2 · writing". */
  label: string;
  /** Optional trailing mono phase note. */
  phase?: string;
  /** 'done' (check), 'active' (spinner), 'pending' (dot). Default 'pending'. */
  status?: 'done' | 'active' | 'pending';
}

export interface ProgressStreamProps {
  steps: ProgressStep[];
  className?: string;
  style?: React.CSSProperties;
}

/** Live Maker→Checker progress log streamed during a run. */
export function ProgressStream(props: ProgressStreamProps): JSX.Element;
