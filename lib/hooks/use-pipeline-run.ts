"use client";

import { useCallback, useState } from "react";

import { usePipelineStatus } from "@/components/pipeline/pipeline-status-context";
import type { PipelineResult } from "@/lib/schemas";
import { parsePipelineStream } from "@/lib/pipeline/parse-stream";

export type PipelineRunStatus = "idle" | "running" | "complete" | "error";

export function usePipelineRun() {
  const { setStatus: setHeaderStatus } = usePipelineStatus();
  const [status, setStatus] = useState<PipelineRunStatus>("idle");
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const syncStatus = useCallback(
    (next: PipelineRunStatus) => {
      setStatus(next);
      if (next === "idle") {
        setHeaderStatus("idle");
      } else if (next === "running") {
        setHeaderStatus("running");
      } else if (next === "complete") {
        setHeaderStatus("complete");
      } else {
        setHeaderStatus("error");
      }
    },
    [setHeaderStatus],
  );

  const reset = useCallback(() => {
    setProgressMessage(null);
    setResult(null);
    setError(null);
    syncStatus("idle");
  }, [syncStatus]);

  const failRun = useCallback(
    (message: string) => {
      setResult(null);
      setError(message);
      syncStatus("error");
    },
    [syncStatus],
  );

  const run = useCallback(
    async (cvText: string, jobText: string) => {
      setProgressMessage(null);
      setResult(null);
      setError(null);
      syncStatus("running");

      try {
        const response = await fetch("/api/pipeline/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cvText, jobText }),
        });

        if (!response.ok) {
          const body: unknown = await response.json().catch(() => null);
          const message =
            typeof body === "object" &&
            body !== null &&
            "error" in body &&
            typeof (body as { error: unknown }).error === "string"
              ? (body as { error: string }).error
              : "Pipeline request failed.";
          failRun(message);
          return;
        }

        let gotResult = false;
        let streamError: string | null = null;

        await parsePipelineStream(response.body, {
          onProgress: (message) => setProgressMessage(message),
          onResult: (value) => {
            gotResult = true;
            setResult(value);
            syncStatus("complete");
          },
          onError: (message) => {
            streamError = message;
          },
        });

        if (streamError) {
          failRun(streamError);
          return;
        }

        if (!gotResult) {
          failRun("Pipeline ended without a result.");
        }
      } catch {
        failRun("Pipeline request failed.");
      }
    },
    [failRun, syncStatus],
  );

  return {
    status,
    progressMessage,
    result,
    error,
    run,
    reset,
  };
}
