import { buildCheckerUserMessage, CHECKER_INSTRUCTIONS } from "./checker-prompt";

describe("buildCheckerUserMessage", () => {
  it("includes CV, job posting, and cover letter in the user message", () => {
    const content = buildCheckerUserMessage(
      "My CV",
      "Engineer role",
      "Dear team",
    );

    expect(content).toContain("CV\nMy CV");
    expect(content).toContain("JOB POSTING\nEngineer role");
    expect(content).toContain("COVER LETTER\nDear team");
  });

  it("requires JSON-only output with score, gaps, and rationale in the instructions", () => {
    expect(CHECKER_INSTRUCTIONS).toContain("JSON");
    expect(CHECKER_INSTRUCTIONS).toContain('"score"');
    expect(CHECKER_INSTRUCTIONS).toContain('"gaps"');
    expect(CHECKER_INSTRUCTIONS).toContain('"rationale"');
    expect(CHECKER_INSTRUCTIONS).toMatch(/0 to 10|0–10/);
    expect(CHECKER_INSTRUCTIONS).toContain("no markdown");
  });
});
