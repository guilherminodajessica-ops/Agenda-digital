import { cn } from "@/lib/cn";

export function Spinner({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <span
      role="status"
      aria-label="Carregando"
      className={cn("inline-block animate-spin rounded-full border-2 border-current border-r-transparent", className)}
      style={{ width: size, height: size }}
    />
  );
}

export function LoadingState({ label = "Carregando dados…" }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-navy-800/70">
      <Spinner size={28} className="text-sky-500" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
