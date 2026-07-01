import { generateText } from "ai";

import { DEFAULT_MODEL_ID } from "@/lib/model-config";

import { makeCoverLetter } from "./maker";

jest.mock("ai", () => ({
  generateText: jest.fn(),
}));

const mockedGenerateText = jest.mocked(generateText);

describe("makeCoverLetter", () => {
  beforeEach(() => {
    mockedGenerateText.mockReset();
  });

  it("returns trimmed letter text from generateText", async () => {
    mockedGenerateText.mockResolvedValue({
      text: "  Dear hiring manager,\n\nI am a strong fit.\n  ",
    } as Awaited<ReturnType<typeof generateText>>);

    await expect(
      makeCoverLetter("cv body", "job body"),
    ).resolves.toBe("Dear hiring manager,\n\nI am a strong fit.");

    expect(mockedGenerateText).toHaveBeenCalledWith({
      model: DEFAULT_MODEL_ID,
      instructions: expect.stringContaining("plain text"),
      messages: [
        expect.objectContaining({
          role: "user",
          content: expect.stringContaining("cv body"),
        }),
      ],
    });
  });

  it("passes feedback gaps into the prompt", async () => {
    mockedGenerateText.mockResolvedValue({
      text: "Revised letter",
    } as Awaited<ReturnType<typeof generateText>>);

    await makeCoverLetter("cv body", "job body", ["Add metrics"]);

    const call = mockedGenerateText.mock.calls[0][0];
    const userMessage = call.messages?.[0];

    expect(userMessage?.content).toContain("REVISION INSTRUCTIONS");
    expect(userMessage?.content).toContain("1. Add metrics");
  });

  it("throws when generateText returns empty text", async () => {
    mockedGenerateText.mockResolvedValue({
      text: "   ",
    } as Awaited<ReturnType<typeof generateText>>);

    await expect(makeCoverLetter("cv", "job")).rejects.toThrow(
      "Maker returned an empty cover letter",
    );
  });
});
