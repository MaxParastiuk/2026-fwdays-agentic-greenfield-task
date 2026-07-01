import type { ReactNode } from "react";

export interface ResultsRegionProps {
  children?: ReactNode;
}

export function ResultsRegion({ children }: ResultsRegionProps) {
  const hasContent = Boolean(children);

  return (
    <section
      id="results"
      aria-hidden={hasContent ? undefined : true}
      className={hasContent ? "mt-8" : "sr-only"}
      data-slot="results-panel"
    >
      {children ?? "Results will appear here after a pipeline run."}
    </section>
  );
}
