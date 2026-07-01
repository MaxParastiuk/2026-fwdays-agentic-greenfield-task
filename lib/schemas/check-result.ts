import { z } from "zod";

export const scoreSchema = z.number().min(0).max(10);

export const checkResultSchema = z.object({
  score: scoreSchema,
  gaps: z.array(z.string()),
  rationale: z.string(),
});

export type CheckResult = z.infer<typeof checkResultSchema>;
