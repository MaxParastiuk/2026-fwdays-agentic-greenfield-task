import { DEFAULT_MODEL_ID } from "@/lib/model-config";
import { checkCoverLetter } from "@/agents/checker";
import { makeCoverLetter } from "@/agents/maker";
import { pipelineResultSchema } from "@/lib/schemas";

import { runPipeline } from "./runner";

jest.mock("@/agents/maker", () => ({
  makeCoverLetter: jest.fn(),
}));

jest.mock("@/agents/checker", () => ({
  checkCoverLetter: jest.fn(),
}));

const mockedMakeCoverLetter = jest.mocked(makeCoverLetter);
const mockedCheckCoverLetter = jest.mocked(checkCoverLetter);

const CV = "cv body";
const JOB = "job body";

describe("runPipeline", () => {
  beforeEach(() => {
    mockedMakeCoverLetter.mockReset();
    mockedCheckCoverLetter.mockReset();
  });

  it("includes modelId from model config", async () => {
    mockedMakeCoverLetter.mockResolvedValue("letter v1");
    mockedCheckCoverLetter.mockResolvedValue({
      score: 9,
      gaps: [],
      rationale: "Excellent",
    });

    const result = await runPipeline(CV, JOB);

    expect(result.modelId).toBe(DEFAULT_MODEL_ID);
    expect(pipelineResultSchema.safeParse(result).success).toBe(true);
  });

  it("calls Maker once and Checker once when score is 9 on iteration 1", async () => {
    mockedMakeCoverLetter.mockResolvedValue("letter v1");
    mockedCheckCoverLetter.mockResolvedValue({
      score: 9,
      gaps: [],
      rationale: "Excellent",
    });

    const result = await runPipeline(CV, JOB);

    expect(mockedMakeCoverLetter).toHaveBeenCalledTimes(1);
    expect(mockedMakeCoverLetter).toHaveBeenCalledWith(CV, JOB);
    expect(mockedCheckCoverLetter).toHaveBeenCalledTimes(1);
    expect(mockedCheckCoverLetter).toHaveBeenCalledWith(CV, JOB, "letter v1");
    expect(result.finalScore).toBe(9);
    expect(result.finalLetter).toBe("letter v1");
    expect(result.iterations).toHaveLength(1);
    expect(pipelineResultSchema.safeParse(result).success).toBe(true);
  });

  it("runs three iterations when scores are 5, 6, and 7", async () => {
    mockedMakeCoverLetter
      .mockResolvedValueOnce("letter v1")
      .mockResolvedValueOnce("letter v2")
      .mockResolvedValueOnce("letter v3");
    mockedCheckCoverLetter
      .mockResolvedValueOnce({ score: 5, gaps: ["gap-a"], rationale: "" })
      .mockResolvedValueOnce({ score: 6, gaps: ["gap-b"], rationale: "" })
      .mockResolvedValueOnce({ score: 7, gaps: ["gap-c"], rationale: "" });

    const result = await runPipeline(CV, JOB);

    expect(mockedMakeCoverLetter).toHaveBeenCalledTimes(3);
    expect(mockedCheckCoverLetter).toHaveBeenCalledTimes(3);
    expect(result.finalScore).toBe(7);
    expect(result.finalLetter).toBe("letter v3");
    expect(result.gaps).toEqual(["gap-c"]);
    expect(result.iterations).toHaveLength(3);
  });

  it("stops early on iteration 2 when score reaches 8", async () => {
    mockedMakeCoverLetter
      .mockResolvedValueOnce("letter v1")
      .mockResolvedValueOnce("letter v2");
    mockedCheckCoverLetter
      .mockResolvedValueOnce({ score: 5, gaps: ["gap-a"], rationale: "" })
      .mockResolvedValueOnce({ score: 8, gaps: [], rationale: "" });

    const result = await runPipeline(CV, JOB);

    expect(mockedMakeCoverLetter).toHaveBeenCalledTimes(2);
    expect(mockedCheckCoverLetter).toHaveBeenCalledTimes(2);
    expect(result.finalScore).toBe(8);
    expect(result.iterations).toHaveLength(2);
  });

  it("passes Checker gaps as Maker feedback on revision", async () => {
    mockedMakeCoverLetter
      .mockResolvedValueOnce("letter v1")
      .mockResolvedValueOnce("letter v2");
    mockedCheckCoverLetter
      .mockResolvedValueOnce({
        score: 5,
        gaps: ["Add metrics", "Mention team size"],
        rationale: "",
      })
      .mockResolvedValueOnce({ score: 9, gaps: [], rationale: "" });

    await runPipeline(CV, JOB);

    expect(mockedMakeCoverLetter).toHaveBeenNthCalledWith(1, CV, JOB);
    expect(mockedMakeCoverLetter).toHaveBeenNthCalledWith(2, CV, JOB, [
      "Add metrics",
      "Mention team size",
    ]);
  });

  it("resolves when evalLogger throws", async () => {
    mockedMakeCoverLetter.mockResolvedValue("letter v1");
    mockedCheckCoverLetter.mockResolvedValue({
      score: 9,
      gaps: [],
      rationale: "",
    });

    await expect(
      runPipeline(CV, JOB, {
        evalLogger: async () => {
          throw new Error("disk full");
        },
      }),
    ).resolves.toMatchObject({
      finalScore: 9,
      finalLetter: "letter v1",
    });
  });

  it("rejects when Maker throws", async () => {
    mockedMakeCoverLetter.mockRejectedValue(new Error("gateway down"));

    await expect(runPipeline(CV, JOB)).rejects.toThrow("gateway down");
    expect(mockedCheckCoverLetter).not.toHaveBeenCalled();
  });

  it("rejects when Checker throws", async () => {
    mockedMakeCoverLetter.mockResolvedValue("letter v1");
    mockedCheckCoverLetter.mockRejectedValue(new Error("gateway down"));

    await expect(runPipeline(CV, JOB)).rejects.toThrow("gateway down");
    expect(mockedMakeCoverLetter).toHaveBeenCalledTimes(1);
  });

  it("runs three iterations when Checker returns score 0 each time", async () => {
    mockedMakeCoverLetter
      .mockResolvedValueOnce("letter v1")
      .mockResolvedValueOnce("letter v2")
      .mockResolvedValueOnce("letter v3");
    mockedCheckCoverLetter.mockResolvedValue({
      score: 0,
      gaps: [],
      rationale: "",
    });

    const result = await runPipeline(CV, JOB);

    expect(mockedMakeCoverLetter).toHaveBeenCalledTimes(3);
    expect(mockedCheckCoverLetter).toHaveBeenCalledTimes(3);
    expect(result.finalScore).toBe(0);
    expect(result.finalLetter).toBe("letter v3");
    expect(result.iterations).toHaveLength(3);
    expect(pipelineResultSchema.safeParse(result).success).toBe(true);
  });

  it("fires onProgress events in order for two iterations", async () => {
    mockedMakeCoverLetter
      .mockResolvedValueOnce("letter v1")
      .mockResolvedValueOnce("letter v2");
    mockedCheckCoverLetter
      .mockResolvedValueOnce({ score: 5, gaps: ["gap-a"], rationale: "" })
      .mockResolvedValueOnce({ score: 9, gaps: [], rationale: "" });

    const progress: Array<{ phase: string; iteration: number }> = [];

    await runPipeline(CV, JOB, {
      onProgress: (event) => {
        progress.push(event);
      },
    });

    expect(progress).toEqual([
      { phase: "writing", iteration: 1 },
      { phase: "checking", iteration: 1 },
      { phase: "writing", iteration: 2 },
      { phase: "checking", iteration: 2 },
    ]);
  });
});
