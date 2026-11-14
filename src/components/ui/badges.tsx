import type { EventCategory, StudentEventStatus, Subject } from "@/types";
import { categoryMeta, SUBJECT_COLORS } from "@/lib/categories";
import { STATUS_LABEL } from "@/lib/event-rules";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";

export function CategoryBadge({ category, className }: { category: EventCategory; className?: string }) {
  const meta = categoryMeta(category);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset",
        meta.badge,
        className,
      )}
    >
      {meta.private && <Icon name="lock" size={11} strokeWidth={2.2} />}
      {meta.label}
    </span>
  );
}

export function SubjectTag({ subject, className }: { subject?: Subject; className?: string }) {
  if (!subject) return null;
  const color = SUBJECT_COLORS[subject.color];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold", color.text, className)}>
      <span className={cn("h-2 w-2 rounded-full", color.dot)} />
      {subject.name}
    </span>
  );
}

const STATUS_STYLE: Record<StudentEventStatus, string> = {
  concluida: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  atrasada: "bg-red-50 text-red-700 ring-red-200",
  pendente: "bg-sky-50 text-sky-700 ring-sky-200",
  agendada: "bg-white text-navy-800 ring-line",
  realizada: "bg-slate-50 text-slate-500 ring-slate-200",
};

export function StatusBadge({ status }: { status: StudentEventStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset", STATUS_STYLE[status])}>
      {status === "concluida" && <Icon name="check" size={11} strokeWidth={2.6} />}
      {status === "atrasada" && <Icon name="alert" size={11} strokeWidth={2.2} />}
      {STATUS_LABEL[status]}
    </span>
  );
}

export function PrivateBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-300">
      <Icon name="lock" size={11} strokeWidth={2.2} />
      Privado
    </span>
  );
}
