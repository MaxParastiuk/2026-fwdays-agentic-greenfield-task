import { handleCvParse } from "@/lib/cv/handle-parse";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleCvParse(request);
}
