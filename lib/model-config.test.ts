import { DEFAULT_MODEL_ID, getModelId } from "@/lib/model-config";

describe("getModelId", () => {
  const originalModelId = process.env.MODEL_ID;

  afterEach(() => {
    if (originalModelId === undefined) {
      delete process.env.MODEL_ID;
    } else {
      process.env.MODEL_ID = originalModelId;
    }
  });

  it("returns the default model when MODEL_ID is unset", () => {
    delete process.env.MODEL_ID;
    expect(getModelId()).toBe(DEFAULT_MODEL_ID);
  });

  it("returns MODEL_ID when set", () => {
    process.env.MODEL_ID = "openai/gpt-4o-mini";
    expect(getModelId()).toBe("openai/gpt-4o-mini");
  });
});
