import * as React from 'react';

export interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'> {
  /** Label above the field. */
  label?: string;
  /** Helper text in the footer. */
  hint?: string;
  /** Show a live character count in the footer. */
  count?: boolean;
  /** Render in the mono family (for raw pasted text). */
  mono?: boolean;
  style?: React.CSSProperties;
}

/** Multi-line input — pasted CV text or pasted job posting. */
export function TextArea(props: TextAreaProps): JSX.Element;
