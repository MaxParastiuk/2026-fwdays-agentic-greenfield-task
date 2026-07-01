"use client";

import { useState } from "react";

import { Icon } from "@/components/ui/icon";

export interface CollapsiblePreviewProps {
  title?: string;
  text: string;
  limit?: number;
  defaultOpen?: boolean;
  confirmedLabel?: string;
  className?: string;
}

export function CollapsiblePreview({
  title = "Extracted text preview",
  text,
  limit = 400,
  defaultOpen = false,
  confirmedLabel = "Parsed",
  className = "",
}: CollapsiblePreviewProps) {
  const [open, setOpen] = useState(defaultOpen);
  const shown = text.slice(0, limit);
  const truncated = text.length > limit;

  return (
    <div className={`ds-col ${className}`.trim()}>
      <button
        type="button"
        className="ds-col__head"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <Icon
          name="chevron-right"
          size={16}
          className={`ds-col__chev ${open ? "ds-col__chev--open" : ""}`}
        />
        {title}
        <span className="ds-col__check">
          <Icon name="check" size={13} />
          {confirmedLabel}
        </span>
      </button>
      {open ? (
        <div className="ds-col__body">
          {shown}
          {truncated ? (
            <span className="ds-col__more">
              … +{(text.length - limit).toLocaleString()} more characters
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
