export type CheckerMessage = {
  role: "system" | "user";
  content: string;
};

const SYSTEM_PROMPT = `You are a cover letter evaluator.

Score how well a cover letter matches the candidate's CV and the job posting.

Respond with a single JSON object only — no markdown, no code fences, no other text.

The JSON MUST match this shape:
{
  "score": <number from 0 to 10>,
  "gaps": [<string>, ...],
  "rationale": <string>
}

- score: 0 = poor fit, 10 = excellent fit
- gaps: specific improvements the writer should make (empty array if none)
- rationale: one-sentence summary of the score`;

export function buildCheckerMessages(
  cv: string,
  jobText: string,
  letter: string,
): CheckerMessage[] {
  const userContent = [
    `CV\n${cv}`,
    `JOB POSTING\n${jobText}`,
    `COVER LETTER\n${letter}`,
  ].join("\n\n");

  return [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userContent },
  ];
}
