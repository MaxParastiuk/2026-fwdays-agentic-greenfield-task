import { ZodError } from "zod";

import {
  parsePipelineRunRequest,
  safeParseCheckResult,
} from "@/lib/validation";

describe("validation helpers", () => {
  it("returns data from safeParseCheckResult on success", () => {
    const input = {
      score: 8,
      gaps: [],
      rationale: "Good fit",
    };

    const result = safeParseCheckResult(input);

    expect(result).toEqual({ success: true, data: input });
  });

  it("returns errors from safeParseCheckResult on failure", () => {
    const result = safeParseCheckResult({
      score: 12,
      gaps: [],
      rationale: "x",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ZodError);
    }
  });

  it("throws ZodError from parsePipelineRunRequest on failure", () => {
    expect(() =>
      parsePipelineRunRequest({ cvText: "", jobText: "Role" }),
    ).toThrow(ZodError);
  });
});
