import { JOB_FETCH_ERROR_MESSAGE } from "@/lib/job/constants";
import { handleJobFetch } from "@/lib/job/handle-fetch";

const sampleHtml = `
  <html><body><h1>Backend Engineer</h1><p>Join our team.</p></body></html>
`;

function makeJsonRequest(url: string) {
  return new Request("http://localhost/api/job/fetch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
}

describe("handleJobFetch", () => {
  it("returns scraped job text for a successful fetch", async () => {
    const fetchFn = jest.fn(async () =>
      new Response(sampleHtml, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      }),
    ) as typeof fetch;

    const response = await handleJobFetch(
      makeJsonRequest("https://example.com/jobs/1"),
      fetchFn,
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      jobText: "Backend Engineer Join our team.",
    });
    expect(fetchFn).toHaveBeenCalledWith(
      "https://example.com/jobs/1",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("rejects invalid URLs", async () => {
    const response = await handleJobFetch(
      makeJsonRequest("not-a-url"),
      jest.fn() as typeof fetch,
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Enter a valid job posting URL.",
    });
  });

  it("maps non-2xx responses to the paste fallback message", async () => {
    const fetchFn = jest.fn(async () => new Response(null, { status: 404 }));

    const response = await handleJobFetch(
      makeJsonRequest("https://example.com/missing"),
      fetchFn,
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({
      error: JOB_FETCH_ERROR_MESSAGE,
    });
  });

  it("maps network failures to the paste fallback message", async () => {
    const fetchFn = jest.fn(async () => {
      throw new Error("network down");
    }) as typeof fetch;

    const response = await handleJobFetch(
      makeJsonRequest("https://example.com/jobs/1"),
      fetchFn,
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({
      error: JOB_FETCH_ERROR_MESSAGE,
    });
  });

  it("maps empty extracted text to the paste fallback message", async () => {
    const fetchFn = jest.fn(async () =>
      new Response("<html><body><script></script></body></html>", {
        status: 200,
      }),
    ) as typeof fetch;

    const response = await handleJobFetch(
      makeJsonRequest("https://example.com/empty"),
      fetchFn,
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({
      error: JOB_FETCH_ERROR_MESSAGE,
    });
  });
});
