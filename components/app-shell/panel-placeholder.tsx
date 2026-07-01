export type PanelKind = "cv" | "job";

const PANEL_META: Record<
  PanelKind,
  { slot: string; step: string; title: string; placeholder: string }
> = {
  cv: {
    slot: "cv-panel",
    step: "Step 1",
    title: "Your CV",
    placeholder: "CV upload and paste controls will appear here.",
  },
  job: {
    slot: "job-panel",
    step: "Step 2",
    title: "Job posting",
    placeholder: "Job URL and paste controls will appear here.",
  },
};

export interface PanelPlaceholderProps {
  kind: PanelKind;
}

export function PanelPlaceholder({ kind }: PanelPlaceholderProps) {
  const meta = PANEL_META[kind];

  return (
    <article
      data-slot={meta.slot}
      className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-card)] p-[var(--space-8)] shadow-[var(--shadow-sm)]"
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-faint)]">
            {meta.step}
          </p>
          <h2 className="text-[17px] font-bold text-[var(--text-strong)]">
            {meta.title}
          </h2>
        </div>
      </header>
      <div
        tabIndex={0}
        className="focus-ring flex min-h-[188px] items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--border-default)] bg-[var(--bg-sunken)] px-4 py-6 text-center text-sm text-[var(--text-faint)]"
        aria-label={`${meta.title} input placeholder`}
      >
        {meta.placeholder}
      </div>
    </article>
  );
}
