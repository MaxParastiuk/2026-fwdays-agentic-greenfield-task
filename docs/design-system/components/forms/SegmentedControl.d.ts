import * as React from 'react';
import { IconName } from '../core/Icon';

export interface SegmentedOption {
  value: string;
  label: string;
  icon?: IconName;
}

export interface SegmentedControlProps {
  /** Options as strings or {value,label,icon}. 2–3 recommended. */
  options: (string | SegmentedOption)[];
  /** Currently selected value (controlled). */
  value: string;
  /** Fired with the new value. */
  onChange?: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

/** Two/three-option toggle — input mode switches (URL ↔ paste, file ↔ text). */
export function SegmentedControl(props: SegmentedControlProps): JSX.Element;
