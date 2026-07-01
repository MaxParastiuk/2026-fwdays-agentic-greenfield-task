"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { CollapsiblePreview } from "@/components/forms/collapsible-preview";
import { SegmentedControl } from "@/components/forms/segmented-control";
import { TextArea } from "@/components/forms/text-area";
import {
  UploadZone,
  type UploadedFile,
} from "@/components/forms/upload-zone";
import { formatFileSize, validateCvFile } from "@/lib/cv/validate-file";
import { TEXT_MAX_BYTES } from "@/lib/schemas";
import { safeParseCvParseRequest } from "@/lib/validation";

type CvMode = "upload" | "paste";

export interface CvInputPanelProps {
  onCvTextChange?: (cvText: string | null) => void;
}

export function CvInputPanel({ onCvTextChange }: CvInputPanelProps) {
  const [mode, setMode] = useState<CvMode>("upload");
  const [cvFile, setCvFile] = useState<UploadedFile | null>(null);
  const [uploadError, setUploadError] = useState<string | undefined>();
  const [pasteText, setPasteText] = useState("");
  const [pasteError, setPasteError] = useState<string | undefined>();
  const [cvText, setCvText] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const pasteDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const parseRequestRef = useRef(0);

  const updateCvText = useCallback(
    (next: string | null) => {
      setCvText(next);
      onCvTextChange?.(next);
    },
    [onCvTextChange],
  );

  const parseFile = useCallback(
    async (file: File) => {
      const requestId = ++parseRequestRef.current;
      setIsParsing(true);
      setUploadError(undefined);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/cv/parse", {
          method: "POST",
          body: formData,
        });
        const payload = (await response.json()) as {
          cvText?: string;
          error?: string;
        };

        if (requestId !== parseRequestRef.current) {
          return;
        }

        if (!response.ok) {
          setUploadError(payload.error ?? "Could not parse that file.");
          updateCvText(null);
          return;
        }

        if (payload.cvText) {
          updateCvText(payload.cvText);
        }
      } catch {
        if (requestId === parseRequestRef.current) {
          setUploadError("Could not reach the server. Try again.");
          updateCvText(null);
        }
      } finally {
        if (requestId === parseRequestRef.current) {
          setIsParsing(false);
        }
      }
    },
    [updateCvText],
  );

  const parsePaste = useCallback(
    async (text: string) => {
      const parsed = safeParseCvParseRequest({ cvText: text });
      if (!parsed.success) {
        const tooLong = text.length > TEXT_MAX_BYTES;
        setPasteError(
          tooLong
            ? `Pasted CV must be ${TEXT_MAX_BYTES.toLocaleString()} characters or less.`
            : "Enter some CV text to continue.",
        );
        updateCvText(null);
        return;
      }

      const requestId = ++parseRequestRef.current;
      setPasteError(undefined);
      setIsParsing(true);

      try {
        const response = await fetch("/api/cv/parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cvText: parsed.data.cvText }),
        });
        const payload = (await response.json()) as {
          cvText?: string;
          error?: string;
        };

        if (requestId !== parseRequestRef.current) {
          return;
        }

        if (!response.ok) {
          setPasteError(payload.error ?? "Could not validate that text.");
          updateCvText(null);
          return;
        }

        if (payload.cvText) {
          updateCvText(payload.cvText);
        }
      } catch {
        if (requestId === parseRequestRef.current) {
          setPasteError("Could not reach the server. Try again.");
          updateCvText(null);
        }
      } finally {
        if (requestId === parseRequestRef.current) {
          setIsParsing(false);
        }
      }
    },
    [updateCvText],
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      const validation = validateCvFile(file);
      if (!validation.ok) {
        setUploadError(validation.error);
        setCvFile(null);
        updateCvText(null);
        return;
      }

      setMode("upload");
      setPasteText("");
      setPasteError(undefined);
      setCvFile({ name: file.name, size: formatFileSize(file.size) });
      void parseFile(file);
    },
    [parseFile, updateCvText],
  );

  const handleFileRemove = useCallback(() => {
    parseRequestRef.current += 1;
    setCvFile(null);
    setUploadError(undefined);
    updateCvText(null);
    setIsParsing(false);
  }, [updateCvText]);

  const handlePasteChange = useCallback(
    (value: string) => {
      setMode("paste");
      setCvFile(null);
      setUploadError(undefined);
      setPasteText(value);

      if (pasteDebounceRef.current) {
        clearTimeout(pasteDebounceRef.current);
      }

      if (!value.trim()) {
        setPasteError(undefined);
        updateCvText(null);
        return;
      }

      pasteDebounceRef.current = setTimeout(() => {
        void parsePaste(value);
      }, 300);
    },
    [parsePaste, updateCvText],
  );

  const handleModeChange = useCallback(
    (nextMode: string) => {
      const cvMode = nextMode as CvMode;
      setMode(cvMode);
      parseRequestRef.current += 1;
      setIsParsing(false);

      if (cvMode === "upload") {
        setPasteText("");
        setPasteError(undefined);
        if (!cvFile) {
          updateCvText(null);
        }
      } else {
        setCvFile(null);
        setUploadError(undefined);
        if (!pasteText.trim()) {
          updateCvText(null);
        } else {
          void parsePaste(pasteText);
        }
      }
    },
    [cvFile, parsePaste, pasteText, updateCvText],
  );

  useEffect(() => {
    return () => {
      if (pasteDebounceRef.current) {
        clearTimeout(pasteDebounceRef.current);
      }
    };
  }, []);

  return (
    <article
      data-slot="cv-panel"
      className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-card)] p-[var(--space-8)] shadow-[var(--shadow-sm)]"
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-faint)]">
            Step 1
          </p>
          <h2 className="text-[17px] font-bold text-[var(--text-strong)]">
            Your CV
          </h2>
        </div>
        <SegmentedControl
          value={mode}
          onChange={handleModeChange}
          options={[
            { value: "upload", label: "Upload PDF", icon: "upload" },
            { value: "paste", label: "Paste text", icon: "file-text" },
          ]}
        />
      </header>

      {mode === "upload" ? (
        <div className="flex flex-col gap-3.5">
          <UploadZone
            file={cvFile}
            error={uploadError}
            isParsing={isParsing}
            onSelect={handleFileSelect}
            onRemove={handleFileRemove}
          />
          {isParsing && cvFile && !uploadError ? (
            <p className="text-sm text-[var(--text-faint)]">Parsing CV…</p>
          ) : null}
          {cvText ? (
            <CollapsiblePreview title="Extracted text" text={cvText} />
          ) : null}
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          <TextArea
            label="Paste plain-text CV"
            count
            mono
            value={pasteText}
            onChange={(event) => handlePasteChange(event.target.value)}
            placeholder="Paste your CV as plain text…"
            error={pasteError}
            rows={10}
          />
          {isParsing && pasteText.trim() ? (
            <p className="text-sm text-[var(--text-faint)]">Validating CV…</p>
          ) : null}
          {cvText && !pasteError ? (
            <CollapsiblePreview title="Extracted text" text={cvText} />
          ) : null}
        </div>
      )}
    </article>
  );
}
