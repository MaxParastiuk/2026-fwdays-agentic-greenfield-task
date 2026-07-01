import * as React from 'react';
import { IconName } from './Icon';

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  /** Glyph to render. */
  icon: IconName;
  /** Accessible label (also the title tooltip). Required. */
  label: string;
  /** Default 'md'. */
  size?: 'sm' | 'md' | 'lg';
  /** Give it a surface + border instead of bare. */
  solid?: boolean;
  style?: React.CSSProperties;
}

/** Square, icon-only affordance — close, collapse, low-emphasis actions. */
export function IconButton(props: IconButtonProps): JSX.Element;
