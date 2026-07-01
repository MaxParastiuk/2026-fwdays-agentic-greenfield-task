import { DEFAULT_MODEL_ID } from "@/lib/model-config";
import { pipelineResultSchema } from "./pipeline";

describe("pipelineResultSchema", () => {
  it("parses a valid pipeline result", () => {
    const result = pipelineResultSchema.safeParse({
      finalLetter: "Dear hiring manager,",
      iterations: [
        {
          iteration: 1,
          letter: "Dear hiring manager,",
          score: 7.5,
          gaps: ["Add metrics"],
        },
      ],
      finalScore: 7.5,
      gaps: ["Add metrics"],
      modelId: DEFAULT_MODEL_ID,
    });

    expect(result.success).toBe(true);
  });

  it("allows an empty iterations array", () => {
    const result = pipelineResultSchema.safeParse({
      finalLetter: "",
      iterations: [],
      finalScore: 0,
      gaps: [],
      modelId: DEFAULT_MODEL_ID,
    });

    expect(result.success).toBe(true);
  });

  it("rejects finalScore above 10", () => {
    const result = pipelineResultSchema.safeParse({
      finalLetter: "Letter",
      iterations: [],
      finalScore: 11,
      gaps: [],
      modelId: DEFAULT_MODEL_ID,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path[0] === "finalScore"),
      ).toBe(true);
    }
  });
});
