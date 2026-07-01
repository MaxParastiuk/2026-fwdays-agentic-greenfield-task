## 1. Dependencies

- [x] 1.1 Add `ai` (Vercel AI SDK) to `package.json` dependencies
- [x] 1.2 Run `npm install` and confirm `npm run typecheck` still passes

## 2. Model configuration

- [x] 2.1 Create `agents/model-config.ts` with `getMakerModelId()` returning `process.env.MODEL_ID ?? 'google/gemini-2.0-flash'`
- [x] 2.2 Add unit test for default and `MODEL_ID` override behavior

## 3. Prompt builders

- [x] 3.1 Create `agents/maker-prompt.ts` with `buildMakerMessages(cv, jobText, feedback?)` returning system + user messages
- [x] 3.2 Ensure system prompt requires plain text, no markdown, and ≤400 words
- [x] 3.3 When `feedback` is non-empty, include a `REVISION INSTRUCTIONS` section listing each gap as a numbered item
- [x] 3.4 Add unit tests asserting feedback gaps appear in the user message and word-limit instruction is present

## 4. Maker agent

- [x] 4.1 Implement `agents/maker.ts` exporting `makeCoverLetter(cv, jobText, feedback?)` calling `generateText` with `getMakerModelId()` and prompt messages
- [x] 4.2 Trim `result.text`; throw if empty after trim
- [x] 4.3 Re-export `getMakerModelId` from `agents/maker.ts` (or `agents/index.ts`) for pipeline/UI attribution

## 5. Tests and boundaries

- [x] 5.1 Add `agents/maker.test.ts` with `jest.mock('ai')` — happy path returns mocked letter text
- [x] 5.2 Add test asserting `generateText` receives feedback gaps in prompt when `feedback` is provided
- [x] 5.3 Add `agents/import-boundary.test.ts` asserting `maker.ts` does not import `checker` or `pipeline/runner`
- [x] 5.4 (Optional) Add `agents/maker.integration.test.ts` gated on `AI_GATEWAY_API_KEY` or `VERCEL_OIDC_TOKEN`

## 6. Validation gate

- [x] 6.1 Run `npm run lint && npm run typecheck && npm test && npm run build` and fix any failures
- [x] 6.2 Update `docs/current-state.md` to mark `02-maker-agent` as in progress or implemented
