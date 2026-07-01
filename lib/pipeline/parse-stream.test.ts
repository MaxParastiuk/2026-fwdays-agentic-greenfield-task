import { DEFAULT_MODEL_ID } from "@/lib/model-config";
import type { PipelineResult } from "@/lib/schemas";

import { parsePipelineStream } from "./parse-stream";

const sampleResult: PipelineResult = {
  finalLetter: "Dear team,",
  iterations: [
    {
      iteration: 1,
      letter: "Dear team,",
      score: 8,
      gaps: [],
    },
  ],
  finalScore: 8,
  gaps: [],
  modelId: DEFAULT_MODEL_ID,
};

const fixtureStream = `data: {"type":"data-pipeline","data":{"type":"progress","message":"Iteration 1: writing…"}}

data: {"type":"data-pipeline","data":{"type":"progress","message":"Iteration 1: checking…"}}

data: {"type":"data-pipeline","data":{"type":"result","result":${JSON.stringify(sampleResult)}}}

data: [DONE]

`;

function streamFromString(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });
}

describe("parsePipelineStream", () => {
  it("invokes handlers for progress, result, and error events", async () => {
    const progress: string[] = [];
    let result: PipelineResult | undefined;
    let error: string | undefined;

    await parsePipelineStream(streamFromString(fixtureStream), {
      onProgress: (message) => progress.push(message),
      onResult: (value) => {
        result = value;
      },
      onError: (message) => {
        error = message;
      },
    });

    expect(progress).toEqual([
      "Iteration 1: writing…",
      "Iteration 1: checking…",
    ]);
    expect(result).toEqual(sampleResult);
    expect(error).toBeUndefined();
  });

  it("handles error events without a result", async () => {
    const errorFixture = `data: {"type":"data-pipeline","data":{"type":"error","message":"Pipeline failed."}}

data: [DONE]

`;
    let result: PipelineResult | undefined;
    let error: string | undefined;

    await parsePipelineStream(streamFromString(errorFixture), {
      onResult: (value) => {
        result = value;
      },
      onError: (message) => {
        error = message;
      },
    });

    expect(error).toBe("Pipeline failed.");
    expect(result).toBeUndefined();
  });
});
