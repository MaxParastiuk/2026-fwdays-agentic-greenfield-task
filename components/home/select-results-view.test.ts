import { DEFAULT_MODEL_ID } from "@/lib/model-config";
import type { PipelineResult } from "@/lib/schemas";

import { selectResultsView } from "./select-results-view";

const sampleResult: PipelineResult = {
  finalLetter: "Dear hiring manager,",
  finalScore: 8.5,
  gaps: ["Add metrics"],
  iterations: [
    { iteration: 1, letter: "Dear hiring manager,", score: 8.5, gaps: ["Add metrics"] },
  ],
  modelId: DEFAULT_MODEL_ID,
};

describe("selectResultsView", () => {
  it("returns none when idle", () => {
    expect(selectResultsView("idle", null, null)).toBe("none");
  });

  it("returns running without requiring a progress message", () => {
    expect(selectResultsView("running", null, null)).toBe("running");
  });

  it("returns complete only when result is present", () => {
    expect(selectResultsView("complete", null, null)).toBe("none");
    expect(selectResultsView("complete", null, sampleResult)).toBe("complete");
  });

  it("returns error only when error message is present", () => {
    expect(selectResultsView("error", null, null)).toBe("none");
    expect(selectResultsView("error", "Pipeline failed", null)).toBe("error");
  });

  it("prefers error over other states", () => {
    expect(selectResultsView("error", "Pipeline failed", sampleResult)).toBe(
      "error",
    );
  });
});
