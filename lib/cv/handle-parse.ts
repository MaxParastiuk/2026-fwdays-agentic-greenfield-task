import {
  cvParseRequestSchema,
  cvParseResponseSchema,
  CV_FILE_MAX_BYTES,
} from "@/lib/schemas";
import { extractTextFromBuffer, type PdfParser } from "@/lib/cv/extract-text";
import { resolveCvMimeType } from "@/lib/cv/validate-file";

export type CvParseErrorBody = { error: string };

function jsonError(message: string, status: number): Response {
  return Response.json({ error: message } satisfies CvParseErrorBody, {
    status,
  });
}

function jsonSuccess(cvText: string): Response {
  const body = cvParseResponseSchema.parse({ cvText });
  return Response.json(body);
}

export async function handleCvParse(
  request: Request,
  pdfParse?: PdfParser,
): Promise<Response> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    return handleMultipart(request, pdfParse);
  }

  if (contentType.includes("application/json")) {
    return handleJson(request);
  }

  return jsonError("Unsupported content type.", 415);
}

async function handleMultipart(
  request: Request,
  pdfParse?: PdfParser,
): Promise<Response> {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("Invalid form data.", 400);
  }

  const fileValue = formData.get("file");
  if (!(fileValue instanceof File)) {
    return jsonError("Missing file field.", 400);
  }

  if (fileValue.size > CV_FILE_MAX_BYTES) {
    return jsonError("That file is over 5 MB.", 413);
  }

  const buffer = Buffer.from(await fileValue.arrayBuffer());
  const mimeType = resolveCvMimeType(fileValue, buffer);
  if (!mimeType) {
    return jsonError("Unsupported file type.", 415);
  }
  let cvText: string;
  try {
    cvText = await extractTextFromBuffer(buffer, mimeType, pdfParse);
  } catch {
    return jsonError("Could not read that file.", 422);
  }

  if (!cvText) {
    return jsonError("No text could be extracted from that file.", 422);
  }

  return jsonSuccess(cvText);
}

async function handleJson(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const parsed = cvParseRequestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("CV text is invalid or too long.", 400);
  }

  return jsonSuccess(parsed.data.cvText);
}
