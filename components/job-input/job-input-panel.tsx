"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

import { CollapsiblePreview } from "@/components/forms/collapsible-preview";
import { SegmentedControl } from "@/components/forms/segmented-control";
import { TextArea } from "@/components/forms/text-area";
import { TextField } from "@/components/forms/text-field";
import { JOB_FETCH_ERROR_MESSAGE } from "@/lib/job/constants";
import { TEXT_MAX_BYTES } from "@/lib/schemas";
import { safeParseJobFetchRequest, safeParseJobPasteRequest } from "@/lib/validation";

type JobMode = "url" | "paste";

export interface JobInputPanelProps {
  onJobTextChange?: (jobText: string | null) => void;
}

export function JobInputPanel({ onJobTextChange }: JobInputPanelProps) {
  const [mode, setMode] = useState<JobMode>("url");
  const [urlValue, setUrlValue] = useState("");
  const [urlError, setUrlError] = useState<string | undefined>();
  const [pasteText, setPasteText] = useState("");
  const [pasteError, setPasteError] = useState<string | undefined>();
  const [jobText, setJobText] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const pasteDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchRequestRef = useRef(0);

  const updateJobText = useCallback(
    (next: string | null) => {
      setJobText(next);
      onJobTextChange?.(next);
    },
    [onJobTextChange],
  );

  const fetchUrl = useCallback(
    async (url: string) => {
      const parsed = safeParseJobFetchRequest({ url });
      if (!parsed.success) {
        setUrlError("Enter a valid job posting URL.");
        updateJobText(null);
        return;
      }

      const requestId = ++fetchRequestRef.current;
      setUrlError(undefined);
      setIsFetching(true);

      try {
        const response = await fetch("/api/job/fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: parsed.data.url }),
        });
        const payload = (await response.json()) as {
          jobText?: string;
          error?: string;
        };

        if (requestId !== fetchRequestRef.current) {
          return;
        }

        if (!response.ok) {
          setUrlError(payload.error ?? JOB_FETCH_ERROR_MESSAGE);
          updateJobText(null);
          return;
        }

        if (payload.jobText) {
          updateJobText(payload.jobText);
        }
      } catch {
        if (requestId === fetchRequestRef.current) {
          setUrlError(JOB_FETCH_ERROR_MESSAGE);
          updateJobText(null);
        }
      } finally {
        if (requestId === fetchRequestRef.current) {
          setIsFetching(false);
        }
      }
    },
    [updateJobText],
  );

  const validatePaste = useCallback(
    (text: string) => {
      const parsed = safeParseJobPasteRequest({ jobText: text });
      if (!parsed.success) {
        const tooLong = text.length > TEXT_MAX_BYTES;
        setPasteError(
          tooLong
            ? `Pasted job text must be ${TEXT_MAX_BYTES.toLocaleString()} characters or less.`
            : "Enter some job posting text to continue.",
        );
        updateJobText(null);
        return;
      }

      setPasteError(undefined);
      updateJobText(parsed.data.jobText);
    },
    [updateJobText],
  );

  const handleUrlChange = useCallback((value: string) => {
    setUrlValue(value);
    setUrlError(undefined);
    updateJobText(null);
  }, [updateJobText]);

  const handleFetchClick = useCallback(() => {
    if (!urlValue.trim()) {
      setUrlError("Enter a valid job posting URL.");
      updateJobText(null);
      return;
    }
    void fetchUrl(urlValue.trim());
  }, [fetchUrl, updateJobText, urlValue]);

  const handleUrlKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleFetchClick();
      }
    },
    [handleFetchClick],
  );

  const handlePasteChange = useCallback(
    (value: string) => {
      setMode("paste");
      setUrlValue("");
      setUrlError(undefined);
      setPasteText(value);

      if (pasteDebounceRef.current) {
        clearTimeout(pasteDebounceRef.current);
      }

      if (!value.trim()) {
        setPasteError(undefined);
        updateJobText(null);
        return;
      }

      pasteDebounceRef.current = setTimeout(() => {
        validatePaste(value);
      }, 300);
    },
    [updateJobText, validatePaste],
  );

  const handleModeChange = useCallback(
    (nextMode: string) => {
      const jobMode = nextMode as JobMode;
      setMode(jobMode);
      fetchRequestRef.current += 1;
      setIsFetching(false);

      if (jobMode === "url") {
        setPasteText("");
        setPasteError(undefined);
        updateJobText(null);
      } else {
        setUrlValue("");
        setUrlError(undefined);
        if (!pasteText.trim()) {
          updateJobText(null);
        } else {
          validatePaste(pasteText);
        }
      }
    },
    [pasteText, updateJobText, validatePaste],
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
      data-slot="job-panel"
      className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-card)] p-[var(--space-8)] shadow-[var(--shadow-sm)]"
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-faint)]">
            Step 2
          </p>
          <h2 className="text-[17px] font-bold text-[var(--text-strong)]">
            Job posting
          </h2>
        </div>
        <SegmentedControl
          value={mode}
          onChange={handleModeChange}
          options={[
            { value: "url", label: "Job URL", icon: "link" },
            { value: "paste", label: "Paste text", icon: "file-text" },
          ]}
        />
      </header>

      {mode === "url" ? (
        <div className="flex flex-col gap-3.5">
          <TextField
            label="Job posting URL"
            icon="link"
            value={urlValue}
            onChange={(event) => handleUrlChange(event.target.value)}
            onKeyDown={handleUrlKeyDown}
            placeholder="https://…"
            error={urlError}
          />
          <button
            type="button"
            className="focus-ring self-start rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-card)] px-4 py-2.5 text-sm font-semibold text-[var(--text-strong)] hover:border-[var(--border-default)] disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleFetchClick}
            disabled={isFetching || !urlValue.trim()}
          >
            {isFetching ? "Fetching posting…" : "Fetch posting"}
          </button>
          {jobText && !urlError ? (
            <CollapsiblePreview title="Job posting text" text={jobText} />
          ) : null}
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          <TextArea
            label="Paste job posting"
            count
            mono
            value={pasteText}
            onChange={(event) => handlePasteChange(event.target.value)}
            placeholder="Paste the job posting as plain text…"
            error={pasteError}
            rows={10}
          />
          {jobText && !pasteError ? (
            <CollapsiblePreview title="Job posting text" text={jobText} />
          ) : null}
        </div>
      )}
    </article>
  );
}
