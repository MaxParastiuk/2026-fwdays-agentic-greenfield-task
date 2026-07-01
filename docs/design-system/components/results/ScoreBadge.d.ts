import * as React from 'react';

export interface ScoreBadgeProps {
  /** The 0–10 Checker score. */
  score: number;
  /** Denominator. Default 10. */
  max?: number;
  /** Default 'md'. */
  size?: 'sm' | 'md' | 'lg';
  /** Show the "/10". Default true. */
  showMax?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/** Checker score badge — green ≥8, amber 5–7.9, red <5. */
export function ScoreBadge(props: ScoreBadgeProps): JSX.Element;

/** Map a 0–10 score to 'pass' | 'mid' | 'fail'. */
export function scoreTone(score: number): 'pass' | 'mid' | 'fail';
