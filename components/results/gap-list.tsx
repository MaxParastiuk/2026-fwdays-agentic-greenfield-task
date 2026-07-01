import { Icon } from "@/components/ui/icon";

export interface GapListProps {
  gaps: string[];
  emptyLabel?: string;
}

export function GapList({
  gaps,
  emptyLabel = "No gaps identified",
}: GapListProps) {
  if (gaps.length === 0) {
    return (
      <div className="ds-gaps--empty">
        <Icon name="check" size={15} className="ds-gaps__check" />
        {emptyLabel}
      </div>
    );
  }

  return (
    <ul className="ds-gaps">
      {gaps.map((gap, index) => (
        <li key={`${index}-${gap}`} className="ds-gaps__item">
          <span className="ds-gaps__mark" aria-hidden="true" />
          <span>{gap}</span>
        </li>
      ))}
    </ul>
  );
}
