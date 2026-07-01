import {
  CV_FILE_MAX_BYTES,
  cvParseRequestSchema,
  jobFetchRequestSchema,
  jobPasteRequestSchema,
  pipelineRunRequestSchema,
  TEXT_MAX_BYTES,
} from "./api";

describe("api schemas", () => {
  describe("pipelineRunRequestSchema", () => {
    it("rejects an empty CV", () => {
      const result = pipelineRunRequestSchema.safeParse({
        cvText: "",
        jobText: "Engineer role",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.path[0] === "cvText")).toBe(
          true,
        );
      }
    });

    it("rejects oversized job text", () => {
      const result = pipelineRunRequestSchema.safeParse({
        cvText: "Valid CV",
        jobText: "x".repeat(TEXT_MAX_BYTES + 1),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.path[0] === "jobText"),
        ).toBe(true);
      }
    });

    it("accepts valid CV and job text", () => {
      const result = pipelineRunRequestSchema.safeParse({
        cvText: "Jane Doe, software engineer",
        jobText: "We are hiring a backend engineer.",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("cvParseRequestSchema", () => {
    it("rejects oversized pasted CV text", () => {
      const result = cvParseRequestSchema.safeParse({
        cvText: "x".repeat(TEXT_MAX_BYTES + 1),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.path[0] === "cvText"),
        ).toBe(true);
      }
    });
  });

  it("exposes a 5 MB CV file cap constant", () => {
    expect(CV_FILE_MAX_BYTES).toBe(5 * 1024 * 1024);
  });

  describe("jobFetchRequestSchema", () => {
    it("rejects an invalid URL", () => {
      const result = jobFetchRequestSchema.safeParse({
        url: "not-a-url",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.path[0] === "url")).toBe(
          true,
        );
      }
    });

    it("accepts valid job posting URLs", () => {
      const result = jobFetchRequestSchema.safeParse({
        url: "https://example.com/jobs/1",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("jobPasteRequestSchema", () => {
    it("rejects oversized pasted job text", () => {
      const result = jobPasteRequestSchema.safeParse({
        jobText: "x".repeat(TEXT_MAX_BYTES + 1),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.path[0] === "jobText"),
        ).toBe(true);
      }
    });
  });
});
