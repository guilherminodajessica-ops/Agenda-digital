"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";

type ToastTone = "success" | "error" | "info";
interface ToastItem {
  id: number;
  tone: ToastTone;
  message: string;
}

const ToastContext = createContext<((message: string, tone?: ToastTone) => void) | null>(null);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => setItems((list) => list.filter((t) => t.id !== id)), []);

  const show = useCallback(
    (message: string, tone: ToastTone = "success") => {
      nextId += 1;
      const id = nextId;
      setItems((list) => [...list.slice(-2), { id, tone, message }]);
      setTimeout(() => dismiss(id), tone === "error" ? 6000 : 3500);
    },
    [dismiss],
  );

  const value = useMemo(() => show, [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-36 z-[60] flex flex-col items-center gap-2 px-4 md:bottom-24 md:items-end md:px-6"
      >
        {items.map((t) => (
          <div
            key={t.id}
            role={t.tone === "error" ? "alert" : "status"}
            className={cn(
              "animate-toast-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border bg-white px-4 py-3 text-sm shadow-lg",
              t.tone === "success" && "border-emerald-200",
              t.tone === "error" && "border-red-200",
              t.tone === "info" && "border-line",
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                t.tone === "success" && "bg-emerald-100 text-emerald-600",
                t.tone === "error" && "bg-red-100 text-red-600",
                t.tone === "info" && "bg-sky-100 text-sky-600",
              )}
            >
              <Icon name={t.tone === "success" ? "check" : t.tone === "error" ? "alert" : "info"} size={13} strokeWidth={2.5} />
            </span>
            <p className="flex-1 text-navy-900">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Fechar aviso"
              className="text-navy-800/40 hover:text-navy-900"
            >
              <Icon name="x" size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de ToastProvider");
  return ctx;
}
