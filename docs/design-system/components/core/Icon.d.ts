import * as React from 'react';

export type IconName =
  | 'upload' | 'file-text' | 'link' | 'globe' | 'check' | 'copy'
  | 'clipboard-check' | 'alert-triangle' | 'refresh-cw' | 'chevron-down'
  | 'chevron-right' | 'x' | 'shield' | 'arrow-right' | 'pen-line'
  | 'search-check' | 'loader';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  /** Which glyph to render. */
  name: IconName;
  /** Pixel size (width = height). Default 18. */
  size?: number;
  /** Stroke width in the 24×24 viewBox. Default 2. */
  strokeWidth?: number;
}

/** The brand line-icon set (Lucide geometry). Inherits currentColor. */
export function Icon(props: IconProps): JSX.Element | null;

export const ICON_NAMES: IconName[];
