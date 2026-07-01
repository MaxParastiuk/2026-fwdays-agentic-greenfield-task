import type { IterationRecord } from "@/lib/schemas";

import { CopyButton } from "@/components/feedback/copy-button";

import { GapList } from "./gap-list";
import { ScoreBadge } from "./score-badge";

export interface LetterPanelProps {
  letter: string;
  title?: string;
  finalScore: number;
  iterations: number;
  modelId: string;
}

export function LetterPanel({
  letter,
  title = "Cover letter",
  finalScore,
  iterations,
  modelId,
}: LetterPanelProps) {
  const iterationLabel =
    iterations === 1 ? "1 iteration" : `${iterations} iterations`;

  return (
    <article className="ds-letter">
      <header className="ds-letter__head">
        <div>
          <div className="ds-letter__eyebrow">Final output</div>
          <h2 className="ds-letter__title">{title}</h2>
        </div>
        <div className="ds-letter__spacer" />
        <ScoreBadge score={finalScore} size="md" />
        <CopyButton text={letter} size="sm" />
      </header>
      <div className="ds-letter__body">{letter}</div>
      <footer className="ds-letter__foot">
        <span>{iterationLabel}</span>
        <span className="ds-letter__dot" aria-hidden="true">
          ·
        </span>
        <span>{modelId}</span>
      </footer>
    </article>
  );
}

export interface LetterGapsProps {
  gaps: string[];
}

export function LetterGaps({ gaps }: LetterGapsProps) {
  if (gaps.length === 0) {
    return null;
  }

  return (
    <section className="ds-letter-gaps" aria-label="Remaining gaps">
      <h3 className="ds-letter-gaps__title">Gaps in final letter</h3>
      <GapList gaps={gaps} />
    </section>
  );
}

export type TimelineIteration = Pick<
  IterationRecord,
  "iteration" | "score" | "gaps"
>;

export interface IterationTimelineProps {
  iterations: TimelineIteration[];
}

export function IterationTimeline({ iterations }: IterationTimelineProps) {
  return (
    <section className="ds-tl" aria-label="Iteration history">
      {iterations.map((item, index) => {
        const isLast = index === iterations.length - 1;

        return (
          <div key={item.iteration} className="ds-tl__row">
            <div className="ds-tl__rail">
              <div
                className={`ds-tl__node ${isLast ? "ds-tl__node--last" : ""}`}
              >
                {item.iteration}
              </div>
              {!isLast ? <div className="ds-tl__line" /> : null}
            </div>
            <div className="ds-tl__body">
              <div className="ds-tl__head">
                <span className="ds-tl__title">Iteration {item.iteration}</span>
                <ScoreBadge score={item.score} size="sm" />
                {isLast ? (
                  <span className="ds-tl__final">Final letter</span>
                ) : null}
              </div>
              {item.gaps.length > 0 ? (
                <div className="ds-tl__gaps">
                  <GapList gaps={item.gaps} />
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </section>
  );
}
