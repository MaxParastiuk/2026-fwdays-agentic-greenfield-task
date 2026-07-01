import { generateText } from "ai";

import { DEFAULT_MODEL_ID } from "@/lib/model-config";

import { checkCoverLetter, INVALID_CHECK_RESULT } from "./checker";

jest.mock("ai", () => ({
  generateText: jest.fn(),
}));

const mockedGenerateText = jest.mocked(generateText);

function setNodeEnv(value: string | undefined): void {
  (process.env as { NODE_ENV?: string }).NODE_ENV = value;
}

describe("checkCoverLetter", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    mockedGenerateText.mockReset();
    setNodeEnv("test");
  });

  afterEach(() => {
    setNodeEnv(originalNodeEnv);
    jest.restoreAllMocks();
  });

  it("returns parsed CheckResult when model returns valid JSON", async () => {
    mockedGenerateText.mockResolvedValue({
      text: JSON.stringify({
        score: 8.5,
        gaps: ["Add metrics"],
        rationale: "Strong fit with minor gaps",
      }),
    } as Awaited<ReturnType<typeof generateText>>);

    await expect(
      checkCoverLetter("cv body", "job body", "letter body"),
    ).resolves.toEqual({
      score: 8.5,
      gaps: ["Add metrics"],
      rationale: "Strong fit with minor gaps",
    });

    expect(mockedGenerateText).toHaveBeenCalledWith({
      model: DEFAULT_MODEL_ID,
      messages: expect.arrayContaining([
        expect.objectContaining({ role: "system" }),
        expect.objectContaining({
          role: "user",
          content: expect.stringContaining("letter body"),
        }),
      ]),
    });
  });

  it("returns INVALID_CHECK_RESULT when model returns non-JSON", async () => {
    mockedGenerateText.mockResolvedValue({
      text: "not json at all",
    } as Awaited<ReturnType<typeof generateText>>);

    await expect(
      checkCoverLetter("cv", "job", "letter"),
    ).resolves.toEqual(INVALID_CHECK_RESULT);
  });

  it("returns INVALID_CHECK_RESULT when JSON fails schema validation", async () => {
    mockedGenerateText.mockResolvedValue({
      text: JSON.stringify({ score: 11, gaps: [], rationale: "too high" }),
    } as Awaited<ReturnType<typeof generateText>>);

    await expect(
      checkCoverLetter("cv", "job", "letter"),
    ).resolves.toEqual(INVALID_CHECK_RESULT);
  });

  it("parses JSON wrapped in markdown code fences", async () => {
    mockedGenerateText.mockResolvedValue({
      text: '```json\n{"score":7,"gaps":[],"rationale":"ok"}\n```',
    } as Awaited<ReturnType<typeof generateText>>);

    await expect(checkCoverLetter("cv", "job", "letter")).resolves.toEqual({
      score: 7,
      gaps: [],
      rationale: "ok",
    });
  });

  it("logs validation failures only in development", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    mockedGenerateText.mockResolvedValue({
      text: "invalid",
    } as Awaited<ReturnType<typeof generateText>>);

    setNodeEnv("test");
    await checkCoverLetter("cv", "job", "letter");
    expect(errorSpy).not.toHaveBeenCalled();

    setNodeEnv("development");
    await checkCoverLetter("cv", "job", "letter");
    expect(errorSpy).toHaveBeenCalledWith(
      "[checker] JSON parse failed",
      "invalid",
    );
  });
});
