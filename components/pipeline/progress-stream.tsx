"use client";

import { Icon } from "@/components/ui/icon";

export interface ProgressStreamProps {
  message: string | null;
}

export function ProgressStream({ message }: ProgressStreamProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="ds-prog" role="status" aria-live="polite">
      <div className="ds-prog__row ds-prog__row--active">
        <span className="ds-prog__ic">
          <Icon name="loader" size={16} className="ds-prog__spin" />
        </span>
        <span className="ds-prog__label">{message}</span>
      </div>
    </div>
  );
}
