import { generateText } from "ai";

import type { CheckResult } from "@/lib/schemas";
import { safeParseCheckResult } from "@/lib/validation";

import { buildCheckerMessages } from "./checker-prompt";
import { getCheckerModelId } from "./model-config";

export { getCheckerModelId };

export const INVALID_CHECK_RESULT: CheckResult = {
  score: 0,
  gaps: [],
  rationale: "",
};

function extractJson(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = /^```(?:json)?\s*([\s\S]*?)\s*```$/i.exec(trimmed);
  return fenceMatch ? fenceMatch[1].trim() : trimmed;
}

function logValidationFailure(reason: string, raw: string): void {
  if (process.env.NODE_ENV === "development") {
    console.error(`[checker] ${reason}`, raw.slice(0, 500));
  }
}

function parseCheckResultFromModelText(text: string): CheckResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJson(text));
  } catch {
    logValidationFailure("JSON parse failed", text);
    return INVALID_CHECK_RESULT;
  }

  const result = safeParseCheckResult(parsed);
  if (!result.success) {
    logValidationFailure("Zod validation failed", text);
    return INVALID_CHECK_RESULT;
  }

  return result.data;
}

export async function checkCoverLetter(
  cv: string,
  jobText: string,
  letter: string,
): Promise<CheckResult> {
  const { text } = await generateText({
    model: getCheckerModelId(),
    messages: buildCheckerMessages(cv, jobText, letter),
  });

  return parseCheckResultFromModelText(text);
}
