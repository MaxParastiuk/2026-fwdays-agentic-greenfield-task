"use client";

import { AppFooter } from "@/components/app-shell/app-footer";
import { AppHeader } from "@/components/app-shell/app-header";
import { PipelineStatusProvider } from "@/components/pipeline/pipeline-status-context";

export interface PipelineShellProps {
  children: React.ReactNode;
}

export function PipelineShell({ children }: PipelineShellProps) {
  return (
    <PipelineStatusProvider>
      <div className="flex min-h-dvh flex-1 flex-col bg-[var(--bg-app)]">
        <AppHeader />
        <main className="mx-auto w-full max-w-[var(--container-max)] flex-1 px-[var(--page-gutter)] pb-7 pt-10">
          {children}
        </main>
        <AppFooter />
      </div>
    </PipelineStatusProvider>
  );
}
