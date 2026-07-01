import * as React from 'react';

export interface ErrorBannerProps {
  /** Bold title. Default 'The run could not complete'. */
  title?: string;
  /** Plain-language explanation of what went wrong and what to try. */
  message?: string;
  /** Retry button label. Default 'Try again'. */
  actionLabel?: string;
  /** Retry handler — omit to hide the button. */
  onRetry?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/** Named fatal-failure state with a Try-again action. No partial results. */
export function ErrorBanner(props: ErrorBannerProps): JSX.Element;
