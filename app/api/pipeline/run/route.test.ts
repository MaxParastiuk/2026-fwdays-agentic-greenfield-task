import { POST, maxDuration } from "@/app/api/pipeline/run/route";
import { handlePipelineRun } from "@/lib/pipeline/handle-run";

jest.mock("@/lib/pipeline/handle-run", () => ({
  handlePipelineRun: jest.fn(),
}));

const mockedHandlePipelineRun = handlePipelineRun as jest.MockedFunction<
  typeof handlePipelineRun
>;

describe("POST /api/pipeline/run", () => {
  it("allows up to 60s on Vercel", () => {
    expect(maxDuration).toBe(60);
  });

  it("delegates to handlePipelineRun", async () => {
    const expected = new Response("ok", { status: 200 });
    mockedHandlePipelineRun.mockResolvedValueOnce(expected);

    const request = new Request("http://localhost/api/pipeline/run", {
      method: "POST",
      body: JSON.stringify({ cvText: "cv", jobText: "job" }),
    });

    const response = await POST(request);

    expect(mockedHandlePipelineRun).toHaveBeenCalledWith(request);
    expect(response).toBe(expected);
  });
});
