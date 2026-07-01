import { handleJobFetch } from "@/lib/job/handle-fetch";

export async function POST(request: Request) {
  return handleJobFetch(request);
}
