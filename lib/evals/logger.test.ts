import { DEFAULT_MODEL_ID } from "@/lib/model-config";
import type { PipelineResult } from "@/lib/schemas";
import { evalRunRecordSchema } from "@/lib/schemas";

import {
  appendEvalRun,
  buildEvalRunRecord,
  EVALS_RUNS_PATH,
} from "./logger";

const sampleResult: PipelineResult = {
  finalLetter: "Dear hiring manager, I have ten years of experience.",
  iterations: [
    {
      iteration: 1,
      letter: "Draft one",
      score: 6,
      gaps: ["Add metrics"],
    },
    {
      iteration: 2,
      letter: "Dear hiring manager, I have ten years of experience.",
      score: 9,
      gaps: [],
    },
  ],
  finalScore: 9,
  gaps: [],
  modelId: DEFAULT_MODEL_ID,
};

const FORBIDDEN_KEYS = [
  "cv",
  "cvText",
  "jobText",
  "letter",
  "finalLetter",
  "rationale",
] as const;

describe("buildEvalRunRecord", () => {
  it("produces a record that satisfies evalRunRecordSchema", () => {
    const record = buildEvalRunRecord(sampleResult, 1234);
    const parsed = evalRunRecordSchema.safeParse(record);

    expect(parsed.success).toBe(true);
    expect(record).toMatchObject({
      iterationCount: 2,
      finalScore: 9,
      gaps: [],
      modelId: DEFAULT_MODEL_ID,
      durationMs: 1234,
    });
    expect(record.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("does not include sensitive text keys", () => {
    const record = buildEvalRunRecord(sampleResult, 500);
    const keys = Object.keys(record);

    for (const key of FORBIDDEN_KEYS) {
      expect(keys).not.toContain(key);
    }
  });
});

describe("appendEvalRun", () => {
  it("appends a single JSON line via appendFile", async () => {
    const mkdir = jest.fn().mockResolvedValue(undefined);
    const appendFile = jest.fn().mockResolvedValue(undefined);
    const record = buildEvalRunRecord(sampleResult, 999);

    await appendEvalRun(record, { mkdir, appendFile });

    expect(mkdir).toHaveBeenCalledWith(expect.any(String), { recursive: true });
    expect(appendFile).toHaveBeenCalledWith(
      EVALS_RUNS_PATH,
      `${JSON.stringify(record)}\n`,
      "utf8",
    );
  });

  it("swallows appendFile failures without rethrowing", async () => {
    const mkdir = jest.fn().mockResolvedValue(undefined);
    const appendFile = jest.fn().mockRejectedValue(new Error("disk full"));
    const record = buildEvalRunRecord(sampleResult, 100);

    await expect(
      appendEvalRun(record, { mkdir, appendFile }),
    ).resolves.toBeUndefined();
  });
});
