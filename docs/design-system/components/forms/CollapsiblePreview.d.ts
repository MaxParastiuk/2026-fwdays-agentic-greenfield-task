import * as React from 'react';

export interface CollapsiblePreviewProps {
  /** Header label. Default 'Extracted text preview'. */
  title?: string;
  /** The full extracted text (only the first `limit` chars are shown). */
  text: string;
  /** Character cap for the preview. Default 400. */
  limit?: number;
  /** Start expanded. Default false. */
  defaultOpen?: boolean;
  /** Right-aligned confirmation label. Default 'Parsed'. */
  confirmedLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Collapsed confirmation preview of parsed CV / scraped job text. */
export function CollapsiblePreview(props: CollapsiblePreviewProps): JSX.Element;
