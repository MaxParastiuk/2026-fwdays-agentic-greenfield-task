export const CHECKER_INSTRUCTIONS = `You are a cover letter evaluator.

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

export function buildCheckerUserMessage(
  cv: string,
  jobText: string,
  letter: string,
): string {
  return [
    `CV\n${cv}`,
    `JOB POSTING\n${jobText}`,
    `COVER LETTER\n${letter}`,
  ].join("\n\n");
}
