import { scoreTone } from "./score-badge";

describe("scoreTone", () => {
  it.each([
    [8.0, "pass"],
    [9.5, "pass"],
  ] as const)("returns pass at boundary %s", (score, tone) => {
    expect(scoreTone(score)).toBe(tone);
  });

  it.each([
    [5.0, "mid"],
    [7.9, "mid"],
  ] as const)("returns mid at boundary %s", (score, tone) => {
    expect(scoreTone(score)).toBe(tone);
  });

  it.each([
    [4.9, "fail"],
    [0, "fail"],
  ] as const)("returns fail at boundary %s", (score, tone) => {
    expect(scoreTone(score)).toBe(tone);
  });
});
