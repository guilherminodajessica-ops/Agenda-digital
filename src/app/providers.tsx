"use client";

import type { ReactNode } from "react";
import { ExplainProvider } from "@/components/explain/explain-mode";
import { ToastProvider } from "@/components/ui/toast";
import { AppDataProvider } from "@/state/app-data-context";
import { SessionProvider } from "@/state/session-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AppDataProvider>
        <ToastProvider>
          <ExplainProvider>{children}</ExplainProvider>
        </ToastProvider>
      </AppDataProvider>
    </SessionProvider>
  );
}
