import { z } from "zod";

import { pipelineResultSchema } from "@/lib/schemas";
import type { PipelineProgressPhase } from "@/pipeline/types";

export const PIPELINE_UI_DATA_TYPE = "data-pipeline" as const;

export const pipelineProgressStreamDataSchema = z.object({
  type: z.literal("progress"),
  message: z.string(),
});

export const pipelineResultStreamDataSchema = z.object({
  type: z.literal("result"),
  result: pipelineResultSchema,
});

export const pipelineErrorStreamDataSchema = z.object({
  type: z.literal("error"),
  message: z.string(),
});

export const pipelineStreamDataSchema = z.discriminatedUnion("type", [
  pipelineProgressStreamDataSchema,
  pipelineResultStreamDataSchema,
  pipelineErrorStreamDataSchema,
]);

export type PipelineStreamData = z.infer<typeof pipelineStreamDataSchema>;

export function formatProgressMessage(
  phase: PipelineProgressPhase,
  iteration: number,
): string {
  const verb = phase === "writing" ? "writing" : "checking";
  return `Iteration ${iteration}: ${verb}…`;
}
