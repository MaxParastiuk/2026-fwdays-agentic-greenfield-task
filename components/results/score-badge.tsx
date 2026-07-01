export type ScoreTone = "pass" | "mid" | "fail";

export function scoreTone(score: number): ScoreTone {
  if (score >= 8) return "pass";
  if (score >= 5) return "mid";
  return "fail";
}

export interface ScoreBadgeProps {
  score: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showMax?: boolean;
}

export function ScoreBadge({
  score,
  max = 10,
  size = "md",
  showMax = true,
}: ScoreBadgeProps) {
  const tone = scoreTone(score);

  return (
    <span
      className={`ds-score ds-score--${tone} ds-score--${size}`}
      aria-label={`Score ${score.toFixed(1)} out of ${max}`}
    >
      {score.toFixed(1)}
      {showMax ? <span className="ds-score__max">/{max}</span> : null}
    </span>
  );
}
