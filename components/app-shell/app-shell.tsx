import { PipelineShell } from "@/components/app-shell/pipeline-shell";

export interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return <PipelineShell>{children}</PipelineShell>;
}
