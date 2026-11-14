import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./icon";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-2xl border border-line/70 bg-white shadow-[0_1px_2px_rgba(11,42,91,0.04)]", className)}
      {...props}
    />
  );
}

export function CardHeader({
  title,
  icon,
  count,
  action,
  tone = "default",
}: {
  title: string;
  icon?: IconName;
  count?: number;
  action?: ReactNode;
  tone?: "default" | "danger" | "success";
}) {
  const toneClass =
    tone === "danger" ? "bg-red-50 text-red-600" : tone === "success" ? "bg-emerald-50 text-emerald-600" : "bg-sky-50 text-sky-600";
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line/50 px-5 py-4">
      <div className="flex min-w-0 items-center gap-2.5">
        {icon && (
          <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", toneClass)}>
            <Icon name={icon} size={17} />
          </span>
        )}
        <h2 className="truncate text-[15px] font-bold text-navy-900">{title}</h2>
        {count !== undefined && (
          <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-semibold text-navy-800">{count}</span>
        )}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  tone = "sky",
}: {
  label: string;
  value: number | string;
  icon: IconName;
  tone?: "sky" | "red" | "emerald" | "amber";
}) {
  const tones = {
    sky: "bg-sky-50 text-sky-600",
    red: "bg-red-50 text-red-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <Card className="flex items-center gap-3 p-4">
      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", tones[tone])}>
        <Icon name={icon} size={21} />
      </span>
      <div className="min-w-0">
        <p className="text-2xl font-extrabold leading-none text-navy-900">{value}</p>
        <p className="mt-1 truncate text-xs font-medium text-navy-800/70">{label}</p>
      </div>
    </Card>
  );
}
