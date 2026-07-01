import {
  PIPELINE_STATUS_LABELS,
  type PipelineStatus,
} from "@/components/feedback/status-indicator";

describe("StatusIndicator labels", () => {
  const states: PipelineStatus[] = [
    "idle",
    "running",
    "complete",
    "error",
  ];

  it.each(states)("maps %s to a default label", (state) => {
    expect(PIPELINE_STATUS_LABELS[state]).toBeTruthy();
    expect(typeof PIPELINE_STATUS_LABELS[state]).toBe("string");
  });

  it("defaults idle label to Idle", () => {
    expect(PIPELINE_STATUS_LABELS.idle).toBe("Idle");
  });

  it("covers all lifecycle states", () => {
    expect(Object.keys(PIPELINE_STATUS_LABELS).sort()).toEqual(
      ["complete", "error", "idle", "running"].sort(),
    );
  });
});
