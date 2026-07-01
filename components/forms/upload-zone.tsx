"use client";

import { useRef, useState } from "react";

import { Icon } from "@/components/ui/icon";

export interface UploadedFile {
  name: string;
  size: string;
}

export interface UploadZoneProps {
  file?: UploadedFile | null;
  error?: string;
  accept?: string;
  maxLabel?: string;
  onSelect?: (file: File) => void;
  onRemove?: () => void;
  className?: string;
}

export function UploadZone({
  file,
  error,
  accept = ".pdf,.txt",
  maxLabel = "5 MB",
  onSelect,
  onRemove,
  className = "",
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  if (file) {
    return (
      <div className={`ds-file ${className}`.trim()}>
        <span className="ds-file__ic">
          <Icon name="file-text" size={20} />
        </span>
        <div>
          <div className="ds-file__name">{file.name}</div>
          <div className="ds-file__meta">{file.size} · parsed server-side</div>
        </div>
        <button
          type="button"
          className="ds-file__x focus-ring"
          aria-label="Remove file"
          onClick={onRemove}
        >
          <Icon name="x" size={18} />
        </button>
      </div>
    );
  }

  const handleFile = (next: File | undefined) => {
    if (next && onSelect) {
      onSelect(next);
    }
  };

  return (
    <div
      className={`ds-drop ${over ? "ds-drop--over" : ""} ${error ? "ds-drop--error" : ""} ${className}`.trim()}
      role="button"
      tabIndex={0}
      aria-label="Upload CV file"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setOver(false);
        handleFile(event.dataTransfer.files?.[0]);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      <span className="ds-drop__ic">
        <Icon name={error ? "alert-triangle" : "upload"} size={26} />
      </span>
      {error ? (
        <>
          <div className="ds-drop__title">{error}</div>
          <div className="ds-drop__hint">
            Try a different file, or switch to pasted text.
          </div>
        </>
      ) : (
        <>
          <div className="ds-drop__title">
            Drop your CV here, or <b>browse</b>
          </div>
          <div className="ds-drop__hint">
            PDF up to {maxLabel} · processed in memory, never stored
          </div>
        </>
      )}
    </div>
  );
}
