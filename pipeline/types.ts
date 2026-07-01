import type { PipelineResult } from "@/lib/schemas";

export type PipelineProgressPhase = "writing" | "checking";

export type PipelineProgressEvent = {
  phase: PipelineProgressPhase;
  iteration: number;
};

export type EvalLogger = (result: PipelineResult) => Promise<void>;

export type PipelineRunOptions = {
  onProgress?: (event: PipelineProgressEvent) => void;
  evalLogger?: EvalLogger;
};
