"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";

import { EmptyState } from "@/components/app-shell/empty-state";
import { InputLayout } from "@/components/app-shell/input-layout";
import { ResultsRegion } from "@/components/app-shell/results-region";
import { CvInputPanel } from "@/components/cv-input/cv-input-panel";
import { RunButton } from "@/components/forms/run-button";
import { JobInputPanel } from "@/components/job-input/job-input-panel";
import { usePipelineRun } from "@/lib/hooks/use-pipeline-run";
import { pipelineRunRequestSchema } from "@/lib/schemas/api";

import { selectResultsView } from "./select-results-view";

const ErrorBanner = dynamic(
  () =>
    import("@/components/feedback/error-banner").then((m) => ({
      default: m.ErrorBanner,
    })),
  { ssr: false },
);

const ProgressStream = dynamic(
  () =>
    import("@/components/pipeline/progress-stream").then((m) => ({
      default: m.ProgressStream,
    })),
  { ssr: false },
);

const PipelineResultsView = dynamic(
  () =>
    import("@/components/results/pipeline-results-view").then((m) => ({
      default: m.PipelineResultsView,
    })),
  { ssr: false },
);

export function HomePageClient() {
  const [cvText, setCvText] = useState<string | null>(null);
  const [jobText, setJobText] = useState<string | null>(null);
  const { status, progressMessage, result, error, run, reset } =
    usePipelineRun();

  const canRun = useMemo(() => {
    if (!cvText || !jobText) {
      return false;
    }
    return pipelineRunRequestSchema.safeParse({ cvText, jobText }).success;
  }, [cvText, jobText]);

  const handleRun = useCallback(() => {
    if (!cvText || !jobText || !canRun || status === "running") {
      return;
    }
    void run(cvText, jobText);
  }, [canRun, cvText, jobText, run, status]);

  const resultsView = selectResultsView(status, error, result);

  const resultsContent =
    resultsView === "error" ? (
      <ErrorBanner message={error!} onRetry={reset} />
    ) : resultsView === "running" ? (
      <ProgressStream message={progressMessage} />
    ) : resultsView === "complete" ? (
      <PipelineResultsView result={result!} />
    ) : null;

  return (
    <>
      <EmptyState />
      <InputLayout>
        <CvInputPanel onCvTextChange={setCvText} />
        <JobInputPanel onJobTextChange={setJobText} />
      </InputLayout>
      <RunButton
        disabled={!canRun || status === "running"}
        onClick={handleRun}
      />
      <ResultsRegion>{resultsContent}</ResultsRegion>
    </>
  );
}
