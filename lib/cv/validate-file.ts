import {
  CV_ACCEPTED_MIME_TYPES,
  CV_FILE_MAX_BYTES,
  type CvAcceptedMimeType,
} from "@/lib/schemas";

export type CvFileValidationResult =
  | { ok: true; mimeType: CvAcceptedMimeType }
  | { ok: false; error: string };

function mimeFromExtension(fileName: string): CvAcceptedMimeType | null {
  const ext = fileName.toLowerCase().split(".").pop();
  if (ext === "pdf") {
    return "application/pdf";
  }
  if (ext === "txt") {
    return "text/plain";
  }
  return null;
}

function mimeFromBuffer(buffer: Uint8Array): CvAcceptedMimeType | null {
  if (buffer.length >= 5) {
    const header = new TextDecoder().decode(buffer.subarray(0, 5));
    if (header === "%PDF-") {
      return "application/pdf";
    }
  }
  return null;
}

/** Resolve MIME from browser metadata, extension, and optional file bytes. */
export function resolveCvMimeType(
  file: Pick<File, "name" | "type">,
  buffer?: Uint8Array,
): CvAcceptedMimeType | null {
  const declared = file.type as CvAcceptedMimeType;
  if (CV_ACCEPTED_MIME_TYPES.includes(declared)) {
    return declared;
  }

  const fromExtension = mimeFromExtension(file.name);
  if (fromExtension) {
    return fromExtension;
  }

  if (buffer) {
    return mimeFromBuffer(buffer);
  }

  return null;
}

export function validateCvFile(file: File): CvFileValidationResult {
  const mimeType = resolveCvMimeType(file);

  if (!mimeType) {
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
