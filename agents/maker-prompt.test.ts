import { buildMakerUserMessage, MAKER_INSTRUCTIONS } from "./maker-prompt";

describe("buildMakerUserMessage", () => {
  it("includes CV and job posting in the user message", () => {
    const content = buildMakerUserMessage("My CV", "Engineer role");

    expect(content).toContain("CV\nMy CV");
    expect(content).toContain("JOB POSTING\nEngineer role");
  });

  it("requires plain text and a 400-word limit in the instructions", () => {
    expect(MAKER_INSTRUCTIONS).toContain("plain text");
    expect(MAKER_INSTRUCTIONS).toContain("400 words");
    expect(MAKER_INSTRUCTIONS).toContain("no markdown");
  });

  it("includes numbered revision instructions when feedback is provided", () => {
    const content = buildMakerUserMessage("cv", "job", [
      "Add metrics",
      "Mention leadership",
    ]);

    expect(content).toContain("REVISION INSTRUCTIONS");
    expect(content).toContain("1. Add metrics");
    expect(content).toContain("2. Mention leadership");
  });

  it("omits revision instructions when feedback is empty", () => {
    const content = buildMakerUserMessage("cv", "job", []);

    expect(content).not.toContain("REVISION INSTRUCTIONS");
  });
});
