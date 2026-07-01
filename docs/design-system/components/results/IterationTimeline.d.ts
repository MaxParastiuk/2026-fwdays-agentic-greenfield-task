import * as React from 'react';

export interface Iteration {
  /** Round number (1-based). Falls back to array index + 1. */
  iteration?: number;
  /** 0–10 Checker score for this round. */
  score: number;
  /** One-sentence Checker rationale. */
  rationale?: string;
  /** Named gaps for this round. */
  gaps?: string[];
}

export interface IterationTimelineProps {
  /** Rounds in order; the last is treated as the final/best letter. */
  iterations: Iteration[];
  /** Expand the final round's gaps by default. Default true. */
  defaultOpenLast?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/** Per-round score history with collapsible gap lists. */
export function IterationTimeline(props: IterationTimelineProps): JSX.Element;
