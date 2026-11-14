"use client";

import { memo } from "react";
import type { CalendarOccurrence, ISODate, StudentEventStatus } from "@/types";
import { buildMonthMatrix, formatLongDate, WEEKDAY_LABELS } from "@/lib/dates";
import { categoryMeta } from "@/lib/categories";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/icon";

const MAX_CHIPS = 3;

/**
 * Grade mensal reproduzindo as referências: título do mês acima, cabeçalho
 * azul-claro com os dias da semana em maiúsculas, linhas finas azuis,
 * números no canto superior esquerdo e dias fora do mês vazios.
 */
export const MonthGrid = memo(function MonthGrid({
  month,
  today,
  selectedDate,
  occurrences,
  statusOf,
  onSelectDate,
  onOpenOccurrence,
}: {
  month: Date;
  today: ISODate;
  selectedDate: ISODate;
  occurrences: Map<ISODate, CalendarOccurrence[]>;
  statusOf?: (o: CalendarOccurrence) => StudentEventStatus | undefined;
  onSelectDate: (date: ISODate) => void;
  onOpenOccurrence: (o: CalendarOccurrence) => void;
}) {
  const weeks = buildMonthMatrix(month);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white" role="grid" aria-label="Calendário mensal" data-explain="Grade do mês. Cada célula é um dia; o dia de hoje fica com o número em um círculo escuro. Clique em um dia para listar os compromissos ou em um compromisso para ver os detalhes.">
      <div className="grid grid-cols-7 bg-head" role="row">
        {WEEKDAY_LABELS.map((w, i) => (
          <div
            key={w.full}
            role="columnheader"
            aria-label={w.full}
            className={cn(
              "py-2.5 text-center text-[11px] font-bold uppercase tracking-wide text-navy-900 sm:text-xs md:py-3.5 md:text-[13px]",
              i < 6 && "border-r border-line",
            )}
          >
            <span className="md:hidden">{w.short}</span>
            <span className="hidden md:inline">{w.full}</span>
          </div>
        ))}
      </div>

      {weeks.map((week, wi) => (
        <div key={week[0].iso} className="grid grid-cols-7 border-t border-line" role="row">
          {week.map((cell, ci) => {
            const border = cn(ci < 6 && "border-r border-line");
            if (!cell.inMonth) {
              return <div key={cell.iso} className={cn(border, "min-h-14 sm:min-h-20 md:min-h-28 lg:min-h-32")} role="gridcell" aria-hidden="true" />;
            }
            const list = occurrences.get(cell.iso) ?? [];
            const isToday = cell.iso === today;
            const isSelected = cell.iso === selectedDate;
            const hasOverdue = list.some((o) => statusOf?.(o) === "atrasada");
            return (
              <div
                key={cell.iso}
                role="gridcell"
                aria-selected={isSelected}
                className={cn(
                  border,
                  "group relative min-h-14 transition-colors sm:min-h-20 md:min-h-28 lg:min-h-32",
                  isSelected ? "bg-sky-50/80" : "hover:bg-sky-50/40",
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelectDate(cell.iso)}
                  aria-label={`${formatLongDate(cell.iso)}${list.length ? `, ${list.length} compromisso(s)` : ", sem compromissos"}`}
                  data-date={cell.iso}
                  className="absolute inset-0 z-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sky-500"
                />
                {isSelected && <span className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-sky-400/80" />}

                <div className="pointer-events-none relative flex flex-col items-center px-1 pt-1.5 md:items-start md:px-2.5 md:pt-2">
                  <span
                    className={cn(
                      "flex h-7 min-w-7 items-center justify-center rounded-full px-1 text-[13px] font-semibold md:h-7 md:text-[15px]",
                      isToday ? "bg-navy-900 text-white" : "text-navy-900",
                      !isToday && "md:-ml-1",
                    )}
                  >
                    {cell.day}
                  </span>

                  {/* Celular: apenas indicadores */}
                  {list.length > 0 && (
                    <span className="mt-1 flex items-center gap-0.5 md:hidden" aria-hidden="true">
                      {list.slice(0, 3).map((o) => (
                        <span
                          key={o.key}
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            statusOf?.(o) === "atrasada" ? "bg-red-500" : categoryMeta(o.event.category).dot,
                          )}
                        />
                      ))}
                      {list.length > 3 && <span className="text-[9px] font-bold leading-none text-navy-800/60">+</span>}
                    </span>
                  )}
                </div>

                {/* Telas médias e grandes: compromissos dentro do dia */}
                {list.length > 0 && (
                  <div className="pointer-events-none relative hidden flex-col gap-1 px-1.5 pb-1.5 pt-1 md:flex">
                    {list.slice(0, MAX_CHIPS).map((o) => {
                      const meta = categoryMeta(o.event.category);
                      const status = statusOf?.(o);
                      return (
                        <button
                          key={o.key}
                          type="button"
                          onClick={() => onOpenOccurrence(o)}
                          title={o.event.title}
                          className={cn(
                            "pointer-events-auto flex w-full items-center gap-1 truncate rounded-md border px-1.5 py-[3px] text-left text-[11.5px] font-semibold leading-tight transition-transform hover:-translate-y-px hover:shadow-sm",
                            meta.chip,
                            status === "atrasada" && "border-red-300 bg-red-50 text-red-800",
                            status === "concluida" && "opacity-55",
                          )}
                        >
                          {status === "concluida" ? (
                            <Icon name="check" size={11} strokeWidth={2.6} className="shrink-0" />
                          ) : status === "atrasada" ? (
                            <Icon name="alert" size={11} strokeWidth={2.2} className="shrink-0" />
                          ) : o.kind === "entrega" ? (
                            <Icon name="flag" size={11} strokeWidth={2.2} className="shrink-0" />
                          ) : meta.private ? (
                            <Icon name="lock" size={11} strokeWidth={2.2} className="shrink-0" />
                          ) : null}
                          {o.event.time && o.kind === "evento" && (
                            <span className="shrink-0 font-bold opacity-70">{o.event.time}</span>
                          )}
                          <span className={cn("truncate", status === "concluida" && "line-through")}>
                            {o.kind === "entrega" ? `Entrega: ${o.event.title}` : o.event.title}
                          </span>
                        </button>
                      );
                    })}
                    {list.length > MAX_CHIPS && (
                      <button
                        type="button"
                        onClick={() => onSelectDate(cell.iso)}
                        className="pointer-events-auto w-fit rounded px-1 text-left text-[11px] font-semibold text-sky-700 hover:underline"
                      >
                        + {list.length - MAX_CHIPS} mais
                      </button>
                    )}
                  </div>
                )}
                {hasOverdue && (
                  <span className="pointer-events-none absolute right-1.5 top-1.5 hidden h-2 w-2 rounded-full bg-red-500 md:block" aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
});
