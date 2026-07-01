import { CV_FILE_MAX_BYTES, TEXT_MAX_BYTES } from "@/lib/schemas";
import { handleCvParse } from "@/lib/cv/handle-parse";

const mockPdfParse = jest.fn(async () => ({ text: "Jane Doe\nEngineer" }));

function makeMultipartRequest(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return new Request("http://localhost/api/cv/parse", {
    method: "POST",
    body: formData,
  });
}

describe("handleCvParse", () => {
  it("parses JSON paste requests", async () => {
    const response = await handleCvParse(
      new Request("http://localhost/api/cv/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText: "Jane Doe" }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ cvText: "Jane Doe" });
  });

  it("rejects oversized pasted CV text", async () => {
    const response = await handleCvParse(
      new Request("http://localhost/api/cv/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText: "x".repeat(TEXT_MAX_BYTES + 1) }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "CV text is invalid or too long.",
    });
  });

  it("rejects oversized multipart uploads before parsing", async () => {
    const oversized = new File(
      [new Uint8Array(CV_FILE_MAX_BYTES + 1)],
      "cv.pdf",
      { type: "application/pdf" },
    );

    const response = await handleCvParse(
      makeMultipartRequest(oversized),
      mockPdfParse,
    );

    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toEqual({
      error: "That file is over 5 MB.",
    });
    expect(mockPdfParse).not.toHaveBeenCalled();
  });

  it("parses multipart PDF uploads", async () => {
    const response = await handleCvParse(
      makeMultipartRequest(
        new File([Buffer.from("%PDF-1.4")], "cv.pdf", {
          type: "application/pdf",
        }),
      ),
      mockPdfParse,
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      cvText: "Jane Doe\nEngineer",
    });
    expect(mockPdfParse).toHaveBeenCalled();
  });

  it("rejects empty PDF extraction results", async () => {
    const emptyPdfParse = jest.fn(async () => ({ text: "   " }));

    const response = await handleCvParse(
      makeMultipartRequest(
        new File([Buffer.from("%PDF-1.4")], "cv.pdf", {
          type: "application/pdf",
        }),
      ),
      emptyPdfParse,
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({
      error: "No text could be extracted from that file.",
    });
  });

  it("rejects unsupported multipart file types", async () => {
    const response = await handleCvParse(
      makeMultipartRequest(
        new File([Buffer.from("doc")], "cv.doc", {
          type: "application/msword",
        }),
      ),
      mockPdfParse,
    );

    expect(response.status).toBe(415);
    await expect(response.json()).resolves.toEqual({
      error: "Unsupported file type.",
    });
  });
});
