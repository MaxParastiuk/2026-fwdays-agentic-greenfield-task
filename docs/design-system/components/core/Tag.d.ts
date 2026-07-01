import * as React from 'react';
import { IconName } from './Icon';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color role. Default 'neutral'. */
  tone?: 'neutral' | 'accent' | 'pass' | 'mid' | 'fail';
  /** Optional leading icon. */
  icon?: IconName;
  /** Use the mono family (for codes, model fragments). */
  mono?: boolean;
}

/** Compact label chip — gap labels, file types, input modes. */
export function Tag(props: TagProps): JSX.Element;
