## 1. Stream types and server helpers

- [x] 1.1 Create `lib/pipeline/stream-events.ts` — Zod schemas / types for `progress`, `result`, `error` events and progress message formatter (`Iteration N: writing…` / `checking…`)
- [x] 1.2 Create `lib/pipeline/handle-run.ts` — validate with `pipelineRunRequestSchema`, invoke `runPipeline` with `onProgress`, map to stream events; fatal errors → `error` only
- [x] 1.3 Add `lib/pipeline/handle-run.test.ts` — mock `runPipeline`: success with progress order, validation 400 path, thrown error → error event
- [x] 1.4 Create `lib/pipeline/parse-stream.ts` — framework-free consumer for AI SDK stream bytes → callbacks for progress / result / error
- [x] 1.5 Add `lib/pipeline/parse-stream.test.ts` with fixture stream payloads

## 2. API route

- [x] 2.1 Create `app/api/pipeline/run/route.ts` — `POST` JSON only; delegate to `handle-run`; return AI SDK streaming response (`createUIMessageStreamResponse` or `streamText` per installed `ai` v7)
- [x] 2.2 Add route tests — 400 on invalid body; mocked pipeline returns stream with progress + result content-type
- [x] 2.3 Verify import boundary: `ai` only in `app/api/` and server pipeline modules, not in `components/` or `lib/hooks/`

## 3. Client orchestration and status

- [x] 3.1 Create `lib/hooks/use-pipeline-run.ts` (`"use client"`) — `fetch` + `parse-stream`; expose `status`, `progressMessage`, `result`, `error`, `run`, `reset`
- [x] 3.2 Create `components/pipeline/pipeline-status-context.tsx` — context provider for `PipelineStatus`; hook `usePipelineStatus`
- [x] 3.3 Convert `AppHeader` to `"use client"` and read status from context for `StatusIndicator`
- [x] 3.4 Wrap page tree with `PipelineStatusProvider` (e.g. in `app/page.tsx` or `HomePageClient`)
- [x] 3.5 Wire `HomePageClient` — `RunButton` calls `run(cvText, jobText)`; sync context status idle → running → complete | error; disable run while running
- [x] 3.6 Create minimal `components/pipeline/progress-stream.tsx` — show latest progress message in results region when running (stub for 09)

## 4. Tests and validation

- [x] 4.1 Extend import-boundary tests if needed to guard `ai` out of client bundles
- [x] 4.2 Manual check: enabled run → progress lines appear → header shows Running → Complete on success
- [x] 4.3 Manual check: simulated fatal error (e.g. mock or missing Gateway key) → header Error, no result payload in UI state
- [x] 4.4 Manual check with real AI Gateway credentials — one full pipeline run completes within reasonable time
- [x] 4.5 Run `npm run lint && npm run typecheck && npm test && npm run build`
- [x] 4.6 Update `docs/current-state.md` to mark `08-pipeline-api` in progress or implemented
