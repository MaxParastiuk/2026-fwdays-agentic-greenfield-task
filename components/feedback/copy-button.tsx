"use client";

import { useEffect, useRef, useState } from "react";

import { Icon } from "@/components/ui/icon";

export interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  size?: "sm" | "md";
}

export function CopyButton({
  text,
  label = "Copy to clipboard",
  copiedLabel = "Copied",
  size = "md",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  const handleClick = () => {
    try {
      void navigator.clipboard?.writeText(text);
    } catch {
      // Clipboard failures are never surfaced (FR-RESULTS-02).
    }
    setCopied(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const sizeClass = size === "sm" ? "ds-btn--sm" : "";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`ds-btn ds-btn--secondary focus-ring ${sizeClass}`.trim()}
    >
      <Icon name={copied ? "check" : "copy"} size={size === "sm" ? 14 : 16} />
      {copied ? copiedLabel : label}
    </button>
  );
}
