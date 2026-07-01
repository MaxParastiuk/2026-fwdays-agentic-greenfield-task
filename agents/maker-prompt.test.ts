import { buildMakerMessages } from "./maker-prompt";

describe("buildMakerMessages", () => {
  it("includes CV and job posting in the user message", () => {
    const messages = buildMakerMessages("My CV", "Engineer role");

    expect(messages).toHaveLength(2);
    expect(messages[0].role).toBe("system");
    expect(messages[1].role).toBe("user");
    expect(messages[1].content).toContain("CV\nMy CV");
    expect(messages[1].content).toContain("JOB POSTING\nEngineer role");
  });

  it("requires plain text and a 400-word limit in the system prompt", () => {
    const messages = buildMakerMessages("cv", "job");

    expect(messages[0].content).toContain("plain text");
    expect(messages[0].content).toContain("400 words");
    expect(messages[0].content).toContain("no markdown");
  });

  it("includes numbered revision instructions when feedback is provided", () => {
    const messages = buildMakerMessages("cv", "job", [
      "Add metrics",
      "Mention leadership",
    ]);

    expect(messages[1].content).toContain("REVISION INSTRUCTIONS");
    expect(messages[1].content).toContain("1. Add metrics");
    expect(messages[1].content).toContain("2. Mention leadership");
  });

  it("omits revision instructions when feedback is empty", () => {
    const messages = buildMakerMessages("cv", "job", []);

    expect(messages[1].content).not.toContain("REVISION INSTRUCTIONS");
  });
});
