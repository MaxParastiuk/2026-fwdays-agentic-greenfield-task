"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { PipelineStatus } from "@/components/feedback/status-indicator";

type PipelineStatusContextValue = {
  status: PipelineStatus;
  setStatus: (status: PipelineStatus) => void;
};

const PipelineStatusContext = createContext<PipelineStatusContextValue | null>(
  null,
);

export function PipelineStatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<PipelineStatus>("idle");

  const value = useMemo(
    () => ({
      status,
      setStatus,
    }),
    [status],
  );

  return (
    <PipelineStatusContext.Provider value={value}>
      {children}
    </PipelineStatusContext.Provider>
  );
}

export function usePipelineStatus(): PipelineStatusContextValue {
  const context = useContext(PipelineStatusContext);
  if (!context) {
    throw new Error(
      "usePipelineStatus must be used within PipelineStatusProvider",
    );
  }
  return context;
}
