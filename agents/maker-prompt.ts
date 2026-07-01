export type MakerMessage = {
  role: "system" | "user";
  content: string;
};

const SYSTEM_PROMPT = `You are a professional cover letter writer.

Write a tailored cover letter that connects the candidate's experience to the job posting.

Requirements:
- Output plain text only (no markdown, no code fences, no JSON).
- Do not use placeholders such as [Your Name] or [Company].
- The cover letter MUST NOT exceed 400 words.`;

function buildRevisionSection(feedback: string[]): string {
  const items = feedback.map((gap, index) => `${index + 1}. ${gap}`).join("\n");
  return `REVISION INSTRUCTIONS
Address each of the following gaps in your revised cover letter:
${items}`;
}

export function buildMakerMessages(
  cv: string,
  jobText: string,
  feedback?: string[],
): MakerMessage[] {
  const sections = [`CV\n${cv}`, `JOB POSTING\n${jobText}`];

  if (feedback && feedback.length > 0) {
    sections.push(buildRevisionSection(feedback));
  }

  return [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: sections.join("\n\n") },
  ];
}
