import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";

import type { EvalRunRecord, PipelineResult } from "@/lib/schemas";
import { safeParseEvalRunRecord } from "@/lib/validation";
import type { EvalLogger } from "@/pipeline/types";

export const EVALS_RUNS_PATH = path.join(process.cwd(), "evals", "runs.jsonl");

export type EvalFileDeps = {
  mkdir: typeof mkdir;
  appendFile: typeof appendFile;
};

const defaultDeps: EvalFileDeps = { mkdir, appendFile };

function logAppendFailure(error: unknown): void {
  if (process.env.NODE_ENV === "development") {
    console.error("[evals] appendEvalRun failed", error);
  }
}

export function buildEvalRunRecord(
  result: PipelineResult,
  durationMs: number,
): EvalRunRecord {
  return {
    timestamp: new Date().toISOString(),
    iterationCount: result.iterations.length,
    finalScore: result.finalScore,
    gaps: result.gaps,
    modelId: result.modelId,
    durationMs,
  };
}

export async function appendEvalRun(
  record: EvalRunRecord,
  deps: EvalFileDeps = defaultDeps,
): Promise<void> {
  const parsed = safeParseEvalRunRecord(record);
  if (!parsed.success) {
    throw new Error("Invalid eval run record");
  }

  try {
    await deps.mkdir(path.dirname(EVALS_RUNS_PATH), { recursive: true });
    await deps.appendFile(
      EVALS_RUNS_PATH,
      `${JSON.stringify(parsed.data)}\n`,
      "utf8",
    );
  } catch (error) {
    logAppendFailure(error);
  }
}

export function createEvalLogger(startedAt: number): EvalLogger {
  return async (result) => {
    const durationMs = Date.now() - startedAt;
    await appendEvalRun(buildEvalRunRecord(result, durationMs));
  };
}
