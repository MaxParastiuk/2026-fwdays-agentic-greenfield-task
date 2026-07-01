import type { PipelineRunStatus } from "@/lib/hooks/use-pipeline-run";
import type { PipelineResult } from "@/lib/schemas";

export type ResultsView = "none" | "error" | "running" | "complete";

export function selectResultsView(
  status: PipelineRunStatus,
  error: string | null,
  result: PipelineResult | null,
): ResultsView {
  if (status === "error" && error) {
    return "error";
  }

  if (status === "running") {
    return "running";
  }

  if (status === "complete" && result) {
    return "complete";
  }

  return "none";
}
