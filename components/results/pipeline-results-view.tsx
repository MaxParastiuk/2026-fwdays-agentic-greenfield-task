"use client";

import type { PipelineResult } from "@/lib/schemas";

import {
  IterationTimeline,
  LetterGaps,
  LetterPanel,
} from "./pipeline-results";

export interface PipelineResultsViewProps {
  result: PipelineResult;
}

export function PipelineResultsView({ result }: PipelineResultsViewProps) {
  return (
    <div className="flex flex-col gap-8">
      <LetterPanel
        letter={result.finalLetter}
        finalScore={result.finalScore}
        iterations={result.iterations.length}
        modelId={result.modelId}
      />
      <LetterGaps gaps={result.gaps} />
      <IterationTimeline iterations={result.iterations} />
    </div>
  );
}
