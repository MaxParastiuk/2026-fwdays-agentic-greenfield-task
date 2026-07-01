import type { PipelineResult } from "@/lib/schemas";

import { pipelineStreamDataSchema, PIPELINE_UI_DATA_TYPE } from "./stream-events";

const SSE_DATA_PREFIX = "data: ";

export type PipelineStreamHandlers = {
  onProgress?: (message: string) => void;
  onResult?: (result: PipelineResult) => void;
  onError?: (message: string) => void;
};

function handleSseLine(line: string, handlers: PipelineStreamHandlers): void {
  if (!line.startsWith(SSE_DATA_PREFIX)) {
    return;
  }

  const payload = line.slice(SSE_DATA_PREFIX.length).trim();
  if (!payload || payload === "[DONE]") {
    return;
  }

  let chunk: unknown;
  try {
    chunk = JSON.parse(payload);
  } catch {
    return;
  }

  if (
    typeof chunk !== "object" ||
    chunk === null ||
    !("type" in chunk) ||
    (chunk as { type: string }).type !== PIPELINE_UI_DATA_TYPE ||
    !("data" in chunk)
  ) {
    return;
  }

  const parsed = pipelineStreamDataSchema.safeParse(
    (chunk as { data: unknown }).data,
  );
  if (!parsed.success) {
    return;
  }

  switch (parsed.data.type) {
    case "progress":
      handlers.onProgress?.(parsed.data.message);
      break;
    case "result":
      handlers.onResult?.(parsed.data.result);
      break;
    case "error":
      handlers.onError?.(parsed.data.message);
      break;
  }
}

export async function parsePipelineStream(
  body: ReadableStream<Uint8Array> | null,
  handlers: PipelineStreamHandlers,
): Promise<void> {
  if (!body) {
    throw new Error("No response body");
  }

  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      handleSseLine(line, handlers);
    }
  }

  if (buffer.trim()) {
    handleSseLine(buffer, handlers);
  }
}
