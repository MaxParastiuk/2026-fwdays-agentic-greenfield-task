import type { ZodError, ZodType } from "zod";

import {
  checkResultSchema,
  cvParseRequestSchema,
  evalRunRecordSchema,
  jobFetchRequestSchema,
  jobPasteRequestSchema,
  pipelineResultSchema,
  pipelineRunRequestSchema,
  type CheckResult,
  type CvParseRequest,
  type EvalRunRecord,
  type JobFetchRequest,
  type JobPasteRequest,
  type PipelineResult,
  type PipelineRunRequest,
} from "@/lib/schemas";

export type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: ZodError };

export function safeParse<T>(
  schema: ZodType<T>,
  input: unknown,
): ParseResult<T> {
  const result = schema.safeParse(input);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

export function parseOrThrow<T>(schema: ZodType<T>, input: unknown): T {
  return schema.parse(input);
}

export const safeParseCheckResult = (
  input: unknown,
): ParseResult<CheckResult> => safeParse(checkResultSchema, input);

export const safeParsePipelineResult = (
  input: unknown,
): ParseResult<PipelineResult> => safeParse(pipelineResultSchema, input);

export const safeParseEvalRunRecord = (
  input: unknown,
): ParseResult<EvalRunRecord> => safeParse(evalRunRecordSchema, input);

export const safeParseCvParseRequest = (
  input: unknown,
): ParseResult<CvParseRequest> => safeParse(cvParseRequestSchema, input);

export const safeParseJobFetchRequest = (
  input: unknown,
): ParseResult<JobFetchRequest> => safeParse(jobFetchRequestSchema, input);

export const safeParseJobPasteRequest = (
  input: unknown,
): ParseResult<JobPasteRequest> => safeParse(jobPasteRequestSchema, input);

export const safeParsePipelineRunRequest = (
  input: unknown,
): ParseResult<PipelineRunRequest> =>
  safeParse(pipelineRunRequestSchema, input);

export const parseCheckResult = (input: unknown): CheckResult =>
  parseOrThrow(checkResultSchema, input);

export const parsePipelineResult = (input: unknown): PipelineResult =>
  parseOrThrow(pipelineResultSchema, input);

export const parseCvParseRequest = (input: unknown): CvParseRequest =>
  parseOrThrow(cvParseRequestSchema, input);

export const parseJobFetchRequest = (input: unknown): JobFetchRequest =>
  parseOrThrow(jobFetchRequestSchema, input);

export const parsePipelineRunRequest = (input: unknown): PipelineRunRequest =>
  parseOrThrow(pipelineRunRequestSchema, input);
