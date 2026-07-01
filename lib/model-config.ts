/**
 * Vercel AI Gateway model ID (`provider/model` format).
 *
 * The `ai` package routes string model IDs through AI Gateway automatically.
 * Free-tier-eligible models: https://vercel.com/ai-gateway/models?freeTier=true
 *
 * Auth (NFR-SEC-01):
 * - Deployed on Vercel: OIDC via `VERCEL_OIDC_TOKEN` (automatic)
 * - Local dev: `AI_GATEWAY_API_KEY` from `vercel env pull` or the dashboard
 */
export const DEFAULT_MODEL_ID = "google/gemini-2.5-flash-lite";

export function getModelId(): string {
  return process.env.MODEL_ID ?? DEFAULT_MODEL_ID;
}
