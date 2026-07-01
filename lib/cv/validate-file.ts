import {
  CV_ACCEPTED_MIME_TYPES,
  CV_FILE_MAX_BYTES,
  type CvAcceptedMimeType,
} from "@/lib/schemas";

export type CvFileValidationResult =
  | { ok: true; mimeType: CvAcceptedMimeType }
  | { ok: false; error: string };

export function validateCvFile(file: File): CvFileValidationResult {
  const mimeType = file.type as CvAcceptedMimeType;

  if (
    !CV_ACCEPTED_MIME_TYPES.includes(mimeType as CvAcceptedMimeType)
  ) {
    return {
      ok: false,
      error: "Only PDF and plain-text files are accepted.",
    };
  }

  if (file.size > CV_FILE_MAX_BYTES) {
    return {
      ok: false,
      error: "That file is over 5 MB.",
    };
  }

  return { ok: true, mimeType };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const kb = Math.round(bytes / 1024);
  if (kb < 1024) {
    return `${kb} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
