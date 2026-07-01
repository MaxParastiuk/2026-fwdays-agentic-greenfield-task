"use client";

import type { IconName } from "@/components/ui/icon";
import { Icon } from "@/components/ui/icon";

export interface SegmentedOption {
  value: string;
  label: string;
  icon?: IconName;
}

export interface SegmentedControlProps {
  options: (string | SegmentedOption)[];
  value: string;
  onChange?: (value: string) => void;
  className?: string;
}

function normalizeOption(option: string | SegmentedOption): SegmentedOption {
  return typeof option === "string" ? { value: option, label: option } : option;
}

export function SegmentedControl({
  options,
  value,
  onChange,
  className = "",
}: SegmentedControlProps) {
  const normalized = options.map(normalizeOption);

  return (
    <div
      className={`ds-seg ${className}`.trim()}
      role="group"
      aria-label="Input mode"
    >
      {normalized.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            className={`ds-seg__btn focus-ring ${active ? "ds-seg__btn--active" : ""}`.trim()}
            aria-pressed={active}
            onClick={() => onChange?.(option.value)}
          >
            {option.icon ? <Icon name={option.icon} size={14} /> : null}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
