import { handlePipelineRun } from "@/lib/pipeline/handle-run";

/** Maker–Checker loop budget (NFR-PERF-01) on Vercel Fluid/serverless. */
export const maxDuration = 60;

export async function POST(request: Request) {
  return handlePipelineRun(request);
}
