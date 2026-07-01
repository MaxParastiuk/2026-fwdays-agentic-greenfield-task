import { checkCoverLetter } from "@/agents/checker";
import { makeCoverLetter } from "@/agents/maker";
import type { IterationRecord, PipelineResult } from "@/lib/schemas";
import { getModelId } from "@/lib/model-config";
import { safeParsePipelineResult } from "@/lib/validation";

import { MAX_ITERATIONS, SCORE_THRESHOLD } from "./constants";
import type { PipelineRunOptions } from "./types";

export { MAX_ITERATIONS, SCORE_THRESHOLD } from "./constants";
export type {
  EvalLogger,
  PipelineProgressEvent,
  PipelineProgressPhase,
  PipelineRunOptions,
} from "./types";

function logEvalLoggerFailure(error: unknown): void {
  if (process.env.NODE_ENV === "development") {
    console.error("[pipeline] evalLogger failed", error);
  }
}

export async function runPipeline(
  cv: string,
  jobText: string,
  options?: PipelineRunOptions,
): Promise<PipelineResult> {
  const iterations: IterationRecord[] = [];
  let feedback: string[] | undefined;
  let finalLetter = "";
  let finalScore = 0;
  let gaps: string[] = [];

  for (let iteration = 1; iteration <= MAX_ITERATIONS; iteration++) {
    options?.onProgress?.({ phase: "writing", iteration });

    const letter =
      feedback !== undefined
        ? await makeCoverLetter(cv, jobText, feedback)
        : await makeCoverLetter(cv, jobText);

    options?.onProgress?.({ phase: "checking", iteration });

    const checkResult = await checkCoverLetter(cv, jobText, letter);

    iterations.push({
      iteration,
      letter,
      score: checkResult.score,
      gaps: checkResult.gaps,
    });

    finalLetter = letter;
    finalScore = checkResult.score;
    gaps = checkResult.gaps;

    if (checkResult.score >= SCORE_THRESHOLD) {
      break;
    }

    if (iteration < MAX_ITERATIONS) {
      feedback = checkResult.gaps;
    }
  }

  const result: PipelineResult = {
    finalLetter,
    iterations,
    finalScore,
    gaps,
    modelId: getModelId(),
  };

  const parsed = safeParsePipelineResult(result);
  if (!parsed.success) {
    throw new Error("Pipeline assembled an invalid PipelineResult");
  }

  if (options?.evalLogger) {
    try {
      await options.evalLogger(parsed.data);
    } catch (error) {
      logEvalLoggerFailure(error);
    }
  }

  return parsed.data;
}
