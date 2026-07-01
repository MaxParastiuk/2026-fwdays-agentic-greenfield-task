import * as React from 'react';

export interface GapListProps {
  /** Checker-named gaps. Empty array → the "no gaps" confirmation. */
  gaps: string[];
  /** Label when there are no gaps. Default 'No gaps identified'. */
  emptyLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Bullet list of the Checker's named gaps for an iteration. */
export function GapList(props: GapListProps): JSX.Element;
