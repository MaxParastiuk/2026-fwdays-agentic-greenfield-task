import * as React from 'react';
import { IconName } from '../core/Icon';

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style'> {
  /** Field label above the input. */
  label?: string;
  /** Helper text below (hidden when error is set). */
  hint?: string;
  /** Error message — turns the field red. */
  error?: string;
  /** Optional leading icon (e.g. 'link' for a URL field). */
  icon?: IconName;
  style?: React.CSSProperties;
}

/** Single-line labelled input — job posting URL, etc. */
export function TextField(props: TextFieldProps): JSX.Element;
