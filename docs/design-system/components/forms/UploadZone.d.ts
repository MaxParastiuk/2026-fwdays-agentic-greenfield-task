import * as React from 'react';

export interface UploadedFile {
  name: string;
  /** Pre-formatted size label, e.g. "142 KB". */
  size: string;
}

export interface UploadZoneProps {
  /** When set, renders the selected-file row instead of the dropzone. */
  file?: UploadedFile | null;
  /** Error message — turns the zone red (oversize / wrong type). */
  error?: string;
  /** Accept attribute. Default '.pdf'. */
  accept?: string;
  /** Max-size label shown in the hint. Default '5 MB'. */
  maxLabel?: string;
  /** Called with the chosen File on drop/select. */
  onSelect?: (file: File) => void;
  /** Called when the selected file is removed. */
  onRemove?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/** Drag-and-drop / click target for a CV PDF, with a selected-file state. */
export function UploadZone(props: UploadZoneProps): JSX.Element;
