import { generateText } from "ai";

import { buildMakerMessages } from "./maker-prompt";
import { getMakerModelId } from "./model-config";

export { getMakerModelId };

export async function makeCoverLetter(
  cv: string,
  jobText: string,
  feedback?: string[],
): Promise<string> {
  const { text } = await generateText({
    model: getMakerModelId(),
    messages: buildMakerMessages(cv, jobText, feedback),
  });

  const letter = text.trim();
  if (!letter) {
    throw new Error("Maker returned an empty cover letter");
  }

  return letter;
}
