import { z } from "zod";

import { scoreSchema } from "./check-result";

export const iterationRecordSchema = z.object({
  iteration: z.number().int().positive(),
  letter: z.string(),
  score: scoreSchema,
  gaps: z.array(z.string()),
});

export const pipelineResultSchema = z.object({
  finalLetter: z.string(),
  iterations: z.array(iterationRecordSchema),
  finalScore: scoreSchema,
  gaps: z.array(z.string()),
  modelId: z.string().min(1),
});

export type IterationRecord = z.infer<typeof iterationRecordSchema>;
export type PipelineResult = z.infer<typeof pipelineResultSchema>;
