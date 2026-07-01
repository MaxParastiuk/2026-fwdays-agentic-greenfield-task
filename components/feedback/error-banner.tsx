"use client";

import { Icon } from "@/components/ui/icon";

export interface ErrorBannerProps {
  title?: string;
  message: string;
  actionLabel?: string;
  onRetry?: () => void;
}

export function ErrorBanner({
  title = "The run could not complete",
  message,
  actionLabel = "Try again",
  onRetry,
}: ErrorBannerProps) {
  return (
    <div className="ds-err" role="alert">
      <span className="ds-err__ic">
        <Icon name="alert-triangle" size={20} />
      </span>
      <div className="ds-err__body">
        <div className="ds-err__title">{title}</div>
        <div className="ds-err__msg">{message}</div>
      </div>
      {onRetry ? (
        <div className="ds-err__act">
          <button
            type="button"
            onClick={onRetry}
            className="ds-btn ds-btn--secondary ds-btn--sm focus-ring"
          >
            <Icon name="refresh-cw" size={14} />
            {actionLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}
