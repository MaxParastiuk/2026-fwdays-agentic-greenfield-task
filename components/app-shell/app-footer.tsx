import { Icon } from "@/components/ui/icon";

export function AppFooter() {
  return (
    <footer className="border-t border-[var(--border-default)] bg-[var(--surface-card)]">
      <div className="mx-auto flex max-w-[var(--container-max)] items-center gap-2.5 px-[var(--page-gutter)] py-4 text-xs text-[var(--text-muted)]">
        <Icon name="shield" size={14} className="text-[var(--text-faint)]" />
        <p>
          No accounts · No stored data · No cookies. Your CV is processed in
          memory and never written to disk.
        </p>
      </div>
    </footer>
  );
}
