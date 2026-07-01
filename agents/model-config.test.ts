import { DEFAULT_MODEL_ID } from "@/lib/model-config";

import { getCheckerModelId, getMakerModelId } from "./model-config";

describe("getMakerModelId", () => {
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
    expect(getMakerModelId()).toBe(DEFAULT_MODEL_ID);
  });

  it("returns MODEL_ID when set", () => {
    process.env.MODEL_ID = "openai/gpt-4o-mini";
    expect(getMakerModelId()).toBe("openai/gpt-4o-mini");
  });
});

describe("getCheckerModelId", () => {
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
    expect(getCheckerModelId()).toBe(DEFAULT_MODEL_ID);
  });

  it("returns MODEL_ID when set", () => {
    process.env.MODEL_ID = "openai/gpt-4o-mini";
    expect(getCheckerModelId()).toBe("openai/gpt-4o-mini");
  });
});
