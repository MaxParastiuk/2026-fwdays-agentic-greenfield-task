import { createEvalLogger } from "@/lib/evals/logger";
import { DEFAULT_MODEL_ID } from "@/lib/model-config";
import type { PipelineResult } from "@/lib/schemas";

import { handlePipelineRun } from "./handle-run";

jest.mock("@/lib/evals/logger", () => ({
  createEvalLogger: jest.fn(() => jest.fn().mockResolvedValue(undefined)),
}));

jest.mock("ai", () => ({
  createUIMessageStream: ({
    execute,
  }: {
    execute: (opts: {
      writer: { write: (chunk: unknown) => void };
    }) => Promise<void>;
  }) => ({ execute }),
  createUIMessageStreamResponse: ({
    stream,
  }: {
    stream: {
      execute: (opts: {
        writer: { write: (chunk: unknown) => void };
      }) => Promise<void>;
    };
  }) =>
    new Response(
      new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          const writer = {
            write(chunk: unknown) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`),
              );
            },
          };
          await stream.execute({ writer });
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        },
      }),
      { headers: { "Content-Type": "text/event-stream" } },
    ),
}));

const CV = "Jane Doe\nSoftware engineer";
const JOB = "Backend role at Example GmbH";

const sampleResult: PipelineResult = {
  finalLetter: "Dear hiring manager,",
  iterations: [
    {
      iteration: 1,
      letter: "Dear hiring manager,",
      score: 9,
      gaps: [],
    },
  ],
  finalScore: 9,
  gaps: [],
  modelId: DEFAULT_MODEL_ID,
};

function makeJsonRequest(cvText: string, jobText: string) {
  return new Request("http://localhost/api/pipeline/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cvText, jobText }),
  });
}

describe("handlePipelineRun", () => {
  it("returns 400 for invalid request bodies", async () => {
    const runPipelineFn = jest.fn();

    const response = await handlePipelineRun(
      makeJsonRequest("", JOB),
      runPipelineFn,
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Invalid pipeline request.",
    });
    expect(runPipelineFn).not.toHaveBeenCalled();
  });

  it("streams progress events in order then a result event", async () => {
    const evalLogger = jest.fn().mockResolvedValue(undefined);
    (createEvalLogger as jest.Mock).mockReturnValue(evalLogger);

    const runPipelineFn = jest.fn(
      async (
        _cv: string,
        _job: string,
        options?: {
          onProgress?: (event: {
            phase: "writing" | "checking";
            iteration: number;
          }) => void;
          evalLogger?: (result: PipelineResult) => Promise<void>;
        },
      ) => {
        options?.onProgress?.({ phase: "writing", iteration: 1 });
        options?.onProgress?.({ phase: "checking", iteration: 1 });
        await options?.evalLogger?.(sampleResult);
        return sampleResult;
      },
    );

    const response = await handlePipelineRun(
      makeJsonRequest(CV, JOB),
      runPipelineFn,
    );

    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toContain('"type":"data-pipeline"');
    expect(text).toContain("Iteration 1: writing…");
    expect(text).toContain("Iteration 1: checking…");
    expect(text).toContain('"type":"result"');
    expect(text).toContain("Dear hiring manager,");
    expect(runPipelineFn).toHaveBeenCalledWith(
      CV,
      JOB,
      expect.objectContaining({ evalLogger: expect.any(Function) }),
    );
    expect(createEvalLogger).toHaveBeenCalledWith(expect.any(Number));
    expect(evalLogger).toHaveBeenCalledWith(sampleResult);
  });

  it("streams an error event when runPipeline throws", async () => {
    const evalLogger = jest.fn();
    (createEvalLogger as jest.Mock).mockReturnValue(evalLogger);

    const runPipelineFn = jest.fn(async () => {
      throw new Error("Gateway unavailable");
    });

    const response = await handlePipelineRun(
      makeJsonRequest(CV, JOB),
      runPipelineFn,
    );

    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toContain('"type":"error"');
    expect(text).toContain("Gateway unavailable");
    expect(text).not.toContain('"type":"result"');
    expect(evalLogger).not.toHaveBeenCalled();
  });
});
