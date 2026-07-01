export type PipelineStatus = "idle" | "running" | "complete" | "error";

export const PIPELINE_STATUS_LABELS: Record<PipelineStatus, string> = {
  idle: "Idle",
  running: "Running",
  complete: "Complete",
  error: "Error",
};

const STATUS_DOT_COLORS: Record<PipelineStatus, string> = {
  idle: "var(--status-idle)",
  running: "var(--status-run)",
  complete: "var(--status-done)",
  error: "var(--status-error)",
};

export interface StatusIndicatorProps {
  state?: PipelineStatus;
  label?: string;
  className?: string;
}

export function StatusIndicator({
  state = "idle",
  label,
  className = "",
}: StatusIndicatorProps) {
  const displayLabel = label ?? PIPELINE_STATUS_LABELS[state];

  return (
    <span
      className={`ds-status ds-status--${state} ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      <span
        className="ds-status__dot"
        style={{ background: STATUS_DOT_COLORS[state] }}
        aria-hidden="true"
      />
      {displayLabel}
    </span>
  );
}
