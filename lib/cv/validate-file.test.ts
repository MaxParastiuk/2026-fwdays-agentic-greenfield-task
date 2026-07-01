import { CV_FILE_MAX_BYTES } from "@/lib/schemas";
import { formatFileSize, validateCvFile } from "@/lib/cv/validate-file";

function makeFile(size: number, type: string, name = "cv.pdf"): File {
  const buffer = new Uint8Array(size);
  return new File([buffer], name, { type });
}

describe("validateCvFile", () => {
  it("accepts a valid PDF under the size cap", () => {
    const file = makeFile(1024, "application/pdf");
    expect(validateCvFile(file)).toEqual({
      ok: true,
      mimeType: "application/pdf",
    });
  });

  it("rejects oversized files", () => {
    const file = makeFile(CV_FILE_MAX_BYTES + 1, "application/pdf");
    const result = validateCvFile(file);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("5 MB");
    }
  });

  it("rejects unsupported MIME types", () => {
    const file = makeFile(1024, "application/msword");
    const result = validateCvFile(file);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("PDF");
    }
  });
});

describe("formatFileSize", () => {
  it("formats kilobytes", () => {
    expect(formatFileSize(2048)).toBe("2 KB");
  });
});
