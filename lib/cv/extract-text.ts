import "pdf-parse/worker";
import { CanvasFactory } from "pdf-parse/worker";
import { PDFParse } from "pdf-parse";

import type { CvAcceptedMimeType } from "@/lib/schemas";

export type PdfParser = (buffer: Buffer) => Promise<{ text: string }>;

export async function extractTextFromBuffer(
  buffer: Buffer,
  mimeType: CvAcceptedMimeType,
  pdfParse: PdfParser = defaultPdfParse,
): Promise<string> {
  if (mimeType === "text/plain") {
    return buffer.toString("utf-8").trim();
  }

  const result = await pdfParse(buffer);
  return result.text.trim();
}

async function defaultPdfParse(buffer: Buffer): Promise<{ text: string }> {
  const parser = new PDFParse({ data: buffer, CanvasFactory });
  try {
    const result = await parser.getText();
    return { text: result.text };
  } finally {
    await parser.destroy();
  }
}
