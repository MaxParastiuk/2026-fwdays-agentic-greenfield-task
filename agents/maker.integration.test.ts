const makerHasGatewayCredentials = Boolean(
  process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN,
);

const makerDescribeIntegration = makerHasGatewayCredentials
  ? describe
  : describe.skip;

makerDescribeIntegration("makeCoverLetter integration", () => {
  it(
    "generates a non-empty cover letter via AI Gateway",
    async () => {
      const { makeCoverLetter } = await import("./maker");
      const letter = await makeCoverLetter(
        "Jane Doe\nSoftware engineer with 5 years of TypeScript experience.",
        "We are hiring a senior TypeScript engineer to build web applications.",
      );

      expect(letter.length).toBeGreaterThan(50);
    },
    60_000,
  );
});
