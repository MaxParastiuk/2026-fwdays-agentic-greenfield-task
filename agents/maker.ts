import { generateText } from "ai";

import { buildMakerUserMessage, MAKER_INSTRUCTIONS } from "./maker-prompt";
import { getMakerModelId } from "./model-config";

export { getMakerModelId };

export async function makeCoverLetter(
  cv: string,
  jobText: string,
  feedback?: string[],
): Promise<string> {
  const { text } = await generateText({
    model: getMakerModelId(),
    instructions: MAKER_INSTRUCTIONS,
    messages: [
      { role: "user", content: buildMakerUserMessage(cv, jobText, feedback) },
    ],
  });

  const letter = text.trim();
  if (!letter) {
    throw new Error("Maker returned an empty cover letter");
  }

  return letter;
}
