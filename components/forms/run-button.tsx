import { Icon } from "@/components/ui/icon";

export interface RunButtonProps {
  disabled?: boolean;
  hasCv?: boolean;
  hasJob?: boolean;
  isRunning?: boolean;
  onClick?: () => void;
}

function runButtonHint({
  disabled,
  hasCv,
  hasJob,
  isRunning,
}: Required<Pick<RunButtonProps, "disabled" | "hasCv" | "hasJob" | "isRunning">>): string {
  if (isRunning) {
    return "Generating your cover letter…";
  }
  if (!disabled) {
    return "Ready to generate your cover letter.";
  }
  if (!hasCv && !hasJob) {
    return "Add your CV and a job posting to begin.";
  }
  if (!hasCv) {
    return "Add your CV to continue.";
  }
  if (!hasJob) {
    return "Add a job posting to continue.";
  }
  return "Check CV and job posting — text may be too long.";
}

export function RunButton({
  disabled = true,
  hasCv = false,
  hasJob = false,
  isRunning = false,
  onClick,
}: RunButtonProps) {
  const hint = runButtonHint({ disabled, hasCv, hasJob, isRunning });

  return (
    <div className="mt-8 flex flex-col items-center gap-2.5">
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="ds-btn ds-btn--primary focus-ring px-6 py-3.5 text-[15px] font-semibold disabled:cursor-not-allowed"
        aria-disabled={disabled}
      >
        <Icon name="pen-line" size={18} />
        Generate cover letter
      </button>
      <p className="text-xs text-[var(--text-faint)]">{hint}</p>
    </div>
  );
}
