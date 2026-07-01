const checkerHasGatewayCredentials = Boolean(
  process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN,
);

const checkerDescribeIntegration = checkerHasGatewayCredentials
  ? describe
  : describe.skip;

checkerDescribeIntegration("checkCoverLetter integration", () => {
  it(
    "returns a valid CheckResult via AI Gateway",
    async () => {
      const { checkCoverLetter } = await import("./checker");
      const result = await checkCoverLetter(
        "Jane Doe\nSoftware engineer with 5 years of TypeScript experience.",
        "We are hiring a senior TypeScript engineer to build web applications.",
        "Dear hiring manager,\n\nI have five years of TypeScript experience building web applications.",
      );

      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(10);
      expect(Array.isArray(result.gaps)).toBe(true);
      expect(typeof result.rationale).toBe("string");
    },
    60_000,
  );
});
