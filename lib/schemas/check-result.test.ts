import { checkResultSchema } from "./check-result";

describe("checkResultSchema", () => {
  it("parses a valid check result", () => {
    const input = {
      score: 8.5,
      gaps: ["missing metric"],
      rationale: "Strong match",
    };

    const result = checkResultSchema.safeParse(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(input);
    }
  });

  it("rejects scores above 10", () => {
    const result = checkResultSchema.safeParse({
      score: 11,
      gaps: [],
      rationale: "x",
    });

    expect(result.success).toBe(false);
  });

  it("rejects negative scores", () => {
    const result = checkResultSchema.safeParse({
      score: -1,
      gaps: [],
      rationale: "x",
    });

    expect(result.success).toBe(false);
  });
});
