import { handleCvParse } from "@/lib/cv/handle-parse";

export async function POST(request: Request) {
  return handleCvParse(request);
}
