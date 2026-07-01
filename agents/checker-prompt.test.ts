import { buildCheckerMessages } from "./checker-prompt";

describe("buildCheckerMessages", () => {
  it("includes CV, job posting, and cover letter in the user message", () => {
    const messages = buildCheckerMessages("My CV", "Engineer role", "Dear team");

    expect(messages).toHaveLength(2);
    expect(messages[0].role).toBe("system");
    expect(messages[1].role).toBe("user");
    expect(messages[1].content).toContain("CV\nMy CV");
    expect(messages[1].content).toContain("JOB POSTING\nEngineer role");
    expect(messages[1].content).toContain("COVER LETTER\nDear team");
  });

  it("requires JSON-only output with score, gaps, and rationale in the system prompt", () => {
    const messages = buildCheckerMessages("cv", "job", "letter");

    expect(messages[0].content).toContain("JSON");
    expect(messages[0].content).toContain('"score"');
    expect(messages[0].content).toContain('"gaps"');
    expect(messages[0].content).toContain('"rationale"');
    expect(messages[0].content).toMatch(/0 to 10|0–10/);
    expect(messages[0].content).toContain("no markdown");
  });
});
