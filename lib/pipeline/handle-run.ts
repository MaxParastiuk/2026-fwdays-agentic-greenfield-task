import { createUIMessageStream, createUIMessageStreamResponse } from "ai";

import { createEvalLogger } from "@/lib/evals/logger";
import { pipelineRunRequestSchema } from "@/lib/schemas";
import { runPipeline } from "@/pipeline/runner";

import {
  formatProgressMessage,
  PIPELINE_UI_DATA_TYPE,
} from "./stream-events";

export type PipelineRunErrorBody = {
  error: string;
  fieldErrors?: Record<string, string[]>;
};

export type RunPipelineFn = typeof runPipeline;

function jsonError(message: string, status: number): Response {
  return Response.json({ error: message } satisfies PipelineRunErrorBody, {
    status,
  });
}

export async function handlePipelineRun(
  request: Request,
  runPipelineFn: RunPipelineFn = runPipeline,
): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const parsed = pipelineRunRequestSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return Response.json(
      {
        error: "Invalid pipeline request.",
        fieldErrors,
      } satisfies PipelineRunErrorBody,
      { status: 400 },
    );
  }

  const { cvText, jobText } = parsed.data;

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      try {
        const startedAt = Date.now();
        const result = await runPipelineFn(cvText, jobText, {
          onProgress: ({ phase, iteration }) => {
            writer.write({
              type: PIPELINE_UI_DATA_TYPE,
              data: {
                type: "progress",
                message: formatProgressMessage(phase, iteration),
              },
            });
          },
          evalLogger: createEvalLogger(startedAt),
        });

        writer.write({
          type: PIPELINE_UI_DATA_TYPE,
          data: { type: "result", result },
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Pipeline failed.";
        writer.write({
          type: PIPELINE_UI_DATA_TYPE,
          data: { type: "error", message },
        });
      }
    },
  });

  return createUIMessageStreamResponse({ stream });
}
