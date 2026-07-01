import * as React from 'react';
import { IconName } from './Icon';

/**
 * Button — the primary action control.
 */
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  /** Visual weight. Default 'primary'. */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Default 'md'. */
  size?: 'sm' | 'md' | 'lg';
  /** Optional leading icon name. */
  icon?: IconName;
  /** Optional trailing icon name (e.g. 'arrow-right'). */
  iconRight?: IconName;
  /** Show a spinner and disable. */
  loading?: boolean;
  /** Stretch to container width. */
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

export function Button(props: ButtonProps): JSX.Element;
