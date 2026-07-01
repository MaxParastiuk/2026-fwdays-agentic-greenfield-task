import { Icon } from "@/components/ui/icon";

export function RunPlaceholder() {
  return (
    <div className="mt-8 flex flex-col items-center gap-2.5">
      <button
        type="button"
        disabled
        className="focus-ring inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-transparent bg-[var(--accent-300)] px-6 py-3.5 text-[15px] font-semibold text-[var(--text-on-accent)] disabled:cursor-not-allowed"
        aria-disabled="true"
      >
        <Icon name="pen-line" size={18} />
        Generate cover letter
      </button>
      <p className="text-xs text-[var(--text-faint)]">
        Provide a CV and a job posting to begin.
      </p>
    </div>
  );
}
