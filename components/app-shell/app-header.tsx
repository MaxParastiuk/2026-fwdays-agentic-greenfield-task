"use client";

import Image from "next/image";

import { StatusIndicator } from "@/components/feedback/status-indicator";
import { usePipelineStatus } from "@/components/pipeline/pipeline-status-context";

export function AppHeader() {
  const { status } = usePipelineStatus();

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--border-default)] bg-[var(--surface-card)]">
      <div className="mx-auto flex max-w-[var(--container-max)] items-center gap-3 px-[var(--page-gutter)] py-3.5">
        <Image
          src="/logomark.svg"
          alt=""
          width={34}
          height={34}
          priority
        />
        <div className="font-[family-name:var(--font-display)] text-[19px] font-medium leading-none tracking-[-0.01em] text-[var(--text-strong)]">
          Job Application <span className="font-semibold">Agent</span>
        </div>
        <div className="flex-1" />
        <StatusIndicator state={status} />
      </div>
    </header>
  );
}
