import { z } from "zod";

import { scoreSchema } from "./check-result";

export const evalRunRecordSchema = z.object({
  timestamp: z.string().datetime(),
  iterationCount: z.number().int().positive(),
  finalScore: scoreSchema,
  gaps: z.array(z.string()),
  modelId: z.string().min(1),
  durationMs: z.number().int().nonnegative(),
});

export type EvalRunRecord = z.infer<typeof evalRunRecordSchema>;
