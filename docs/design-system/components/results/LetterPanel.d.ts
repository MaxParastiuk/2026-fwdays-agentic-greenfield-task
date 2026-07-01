import * as React from 'react';

export interface LetterPanelProps {
  /** The cover-letter text (rendered in the serif, whitespace preserved). */
  letter: string;
  /** Header title. Default 'Cover letter'. */
  title?: string;
  /** Final score badge in the header. */
  finalScore?: number;
  /** Iteration count for the footer credit line. */
  iterations?: number;
  /** Model id for the footer, e.g. 'google/gemini-2.0-flash'. */
  model?: string;
  /** Show the copy button. Default true. */
  showCopy?: boolean;
  /** Extra click handler fired alongside the copy. */
  onCopy?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/** The final cover letter in a document-like panel with copy + credit line. */
export function LetterPanel(props: LetterPanelProps): JSX.Element;
