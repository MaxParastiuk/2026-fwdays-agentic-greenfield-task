import { z } from "zod";

import { pipelineResultSchema } from "./pipeline";

export const TEXT_MAX_BYTES = 32 * 1024;
export const CV_FILE_MAX_BYTES = 5 * 1024 * 1024;

export const CV_ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "text/plain",
] as const;

export type CvAcceptedMimeType = (typeof CV_ACCEPTED_MIME_TYPES)[number];

const nonEmptyTextMax = z.string().min(1).max(TEXT_MAX_BYTES);

export const cvParseRequestSchema = z.object({
  cvText: nonEmptyTextMax,
});

export const cvParseResponseSchema = z.object({
  cvText: z.string(),
});

export const jobFetchRequestSchema = z.object({
  url: z.string().url().max(2048),
});

export const jobFetchResponseSchema = z.object({
  jobText: z.string(),
});

export const jobPasteRequestSchema = z.object({
  jobText: nonEmptyTextMax,
});

export const pipelineRunRequestSchema = z.object({
  cvText: nonEmptyTextMax,
  jobText: nonEmptyTextMax,
});

export const pipelineRunResponseSchema = pipelineResultSchema;

export type CvParseRequest = z.infer<typeof cvParseRequestSchema>;
export type CvParseResponse = z.infer<typeof cvParseResponseSchema>;
export type JobFetchRequest = z.infer<typeof jobFetchRequestSchema>;
export type JobFetchResponse = z.infer<typeof jobFetchResponseSchema>;
export type JobPasteRequest = z.infer<typeof jobPasteRequestSchema>;
export type PipelineRunRequest = z.infer<typeof pipelineRunRequestSchema>;
export type PipelineRunResponse = z.infer<typeof pipelineRunResponseSchema>;
