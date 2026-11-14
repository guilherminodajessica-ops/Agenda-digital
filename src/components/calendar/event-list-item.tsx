"use client";

import type { AcademicEvent, ISODate, OccurrenceKind, StudentEventStatus } from "@/types";
import { categoryMeta } from "@/lib/categories";
import { deadlineOf } from "@/lib/event-rules";
import { formatDayMonth, relativeLabel } from "@/lib/dates";
import { cn } from "@/lib/cn";
import type { Lookups } from "@/state/selectors";
import { CategoryBadge, StatusBadge, SubjectTag } from "@/components/ui/badges";
import { Icon } from "@/components/ui/icon";

/** Linha de compromisso usada nas listas (painéis e agenda do dia). */
export function EventListItem({
  event,
  lookups,
  today,
  status,
  kind,
  showClass,
  dateMode = "deadline",
  onOpen,
}: {
  event: AcademicEvent;
  lookups: Lookups;
  today: ISODate;
  status?: StudentEventStatus;
  kind?: OccurrenceKind;
  showClass?: boolean;
  /** Qual data destacar à direita. "none" quando a lista já é de um dia. */
  dateMode?: "deadline" | "date" | "none";
  onOpen: (event: AcademicEvent) => void;
}) {
  const meta = categoryMeta(event.category);
  const subject = lookups.subject(event.subjectId);
  const shownDate = dateMode === "date" ? event.date : deadlineOf(event);
  const isDeadline = dateMode === "deadline" && !!event.dueDate;

  return (
    <button
      type="button"
      onClick={() => onOpen(event)}
      className={cn(
        "group flex w-full items-stretch gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-sky-50/70",
        "focus-visible:outline-2 focus-visible:outline-sky-500",
      )}
    >
      <span className={cn("w-1 shrink-0 rounded-full", status === "atrasada" ? "bg-red-400" : meta.dot)} aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-1.5">
          <CategoryBadge category={event.category} />
          {kind === "entrega" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-navy-900/5 px-2 py-0.5 text-xs font-semibold text-navy-800">
              <Icon name="flag" size={11} strokeWidth={2.2} /> Entrega
            </span>
          )}
          {status && status !== "agendada" && <StatusBadge status={status} />}
        </span>
        <span
          className={cn(
            "mt-1.5 block truncate text-[15px] font-semibold text-navy-900",
            status === "concluida" && "text-navy-800/50 line-through",
          )}
        >
          {event.title}
        </span>
        <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-navy-800/60">
          <SubjectTag subject={subject} />
          {showClass && <span>{lookups.schoolClass(event.classId)?.name}</span>}
          {event.time && kind !== "entrega" && (
            <span className="inline-flex items-center gap-1">
              <Icon name="clock" size={12} /> {event.time}
            </span>
          )}
        </span>
      </span>
      {dateMode !== "none" && (
        <span className="flex shrink-0 flex-col items-end justify-center text-right">
          <span className={cn("text-xs font-bold", status === "atrasada" ? "text-red-600" : "text-navy-900")}>
            {relativeLabel(today, shownDate)}
          </span>
          <span className="mt-0.5 text-[11px] text-navy-800/55">
            {isDeadline ? "entrega " : ""}
            {formatDayMonth(shownDate)}
          </span>
        </span>
      )}
      <Icon name="chevronRight" size={16} className="shrink-0 self-center text-navy-800/30 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}
