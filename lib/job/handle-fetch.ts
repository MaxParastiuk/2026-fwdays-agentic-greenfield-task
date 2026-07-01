import { JOB_FETCH_ERROR_MESSAGE } from "@/lib/job/constants";
import { extractTextFromHtml } from "@/lib/job/extract-text";
import {
  jobFetchRequestSchema,
  jobFetchResponseSchema,
} from "@/lib/schemas";

export type JobFetchErrorBody = { error: string };
export type FetchFn = typeof fetch;

const FETCH_TIMEOUT_MS = 10_000;

function jsonError(message: string, status: number): Response {
  return Response.json({ error: message } satisfies JobFetchErrorBody, {
    status,
  });
}

function jsonSuccess(jobText: string): Response {
  const body = jobFetchResponseSchema.parse({ jobText });
  return Response.json(body);
}

export async function handleJobFetch(
  request: Request,
  fetchFn: FetchFn = fetch,
): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const parsed = jobFetchRequestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Enter a valid job posting URL.", 400);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetchFn(parsed.data.url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "JobApplicationAgent/1.0 (+https://example.com)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      return jsonError(JOB_FETCH_ERROR_MESSAGE, 422);
    }

    const html = await response.text();
    const jobText = extractTextFromHtml(html);

    if (!jobText) {
      return jsonError(JOB_FETCH_ERROR_MESSAGE, 422);
    }

    return jsonSuccess(jobText);
  } catch {
    return jsonError(JOB_FETCH_ERROR_MESSAGE, 422);
  } finally {
    clearTimeout(timeoutId);
  }
}
