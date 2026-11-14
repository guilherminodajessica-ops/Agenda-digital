"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import type {
  AcademicEvent,
  CalendarFilters,
  CalendarOccurrence,
  ISODate,
  StudentEventStatus,
  Subject,
} from "@/types";
import type { CategoryMeta } from "@/lib/categories";
import { applyFilters, buildOccurrences } from "@/lib/event-rules";
import { formatLongDate, fromISODate, shiftMonth, toISODate } from "@/lib/dates";
import type { Lookups } from "@/state/selectors";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { CalendarFiltersBar } from "./calendar-filters";
import { CalendarToolbar } from "./calendar-toolbar";
import { EventDetailModal } from "./event-detail-modal";
import { EventListItem } from "./event-list-item";
import { MonthGrid } from "./month-grid";

export interface CalendarViewProps {
  events: AcademicEvent[];
  subjects: Subject[];
  categories: CategoryMeta[];
  lookups: Lookups;
  today: ISODate;
  statusOf?: (event: AcademicEvent) => StudentEventStatus | undefined;
  /** Ações no rodapé da janela de detalhes (concluir, editar, excluir…). */
  renderEventActions?: (event: AcademicEvent, close: () => void) => ReactNode;
  /** Ação extra exibida no cabeçalho da agenda do dia (ex.: criar compromisso). */
  renderDayAction?: (date: ISODate) => ReactNode;
  showClass?: boolean;
}

/**
 * Calendário completo: navegação, filtros, grade mensal, lista do dia
 * selecionado e janela de detalhes. Usado pelas áreas de aluno e professor.
 */
export function CalendarView({
  events,
  subjects,
  categories,
  lookups,
  today,
  statusOf,
  renderEventActions,
  renderDayAction,
  showClass,
}: CalendarViewProps) {
  const [month, setMonth] = useState<Date>(() => shiftMonth(fromISODate(today), 0));
  const [selectedDate, setSelectedDate] = useState<ISODate>(today);
  const [filters, setFilters] = useState<CalendarFilters>({ subjectIds: [], categories: [] });
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => applyFilters(events, filters), [events, filters]);
  const occurrences = useMemo(() => buildOccurrences(filtered), [filtered]);
  const dayList = occurrences.get(selectedDate) ?? [];
  const openEvent = openId ? events.find((e) => e.id === openId) ?? null : null;

  const occurrenceStatus = useCallback(
    (o: CalendarOccurrence) => statusOf?.(o.event),
    [statusOf],
  );

  const changeMonth = (next: Date) => {
    setMonth(next);
    const sameMonth = (iso: ISODate) => {
      const d = fromISODate(iso);
      return d.getFullYear() === next.getFullYear() && d.getMonth() === next.getMonth();
    };
    if (!sameMonth(selectedDate)) setSelectedDate(sameMonth(today) ? today : toISODate(next));
  };

  const goToday = () => {
    setMonth(shiftMonth(fromISODate(today), 0));
    setSelectedDate(today);
  };

  const close = () => setOpenId(null);

  return (
    <div>
      <CalendarToolbar month={month} onChange={changeMonth} onToday={goToday} />
      <CalendarFiltersBar filters={filters} onChange={setFilters} subjects={subjects} categories={categories} />

      <MonthGrid
        month={month}
        today={today}
        selectedDate={selectedDate}
        occurrences={occurrences}
        statusOf={statusOf ? occurrenceStatus : undefined}
        onSelectDate={setSelectedDate}
        onOpenOccurrence={(o) => setOpenId(o.event.id)}
      />

      <Legend categories={categories} />

      <Card className="mt-5" data-testid="day-agenda" data-explain="Lista dos compromissos do dia selecionado no calendário. No celular, é aqui que os compromissos aparecem por extenso.">
        <div className="flex items-center justify-between gap-3 border-b border-line/50 px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-medium text-navy-800/55">
              {selectedDate === today ? "Hoje" : "Dia selecionado"}
            </p>
            <h3 className="truncate text-[15px] font-bold text-navy-900">{formatLongDate(selectedDate)}</h3>
          </div>
          {renderDayAction?.(selectedDate)}
        </div>
        {dayList.length === 0 ? (
          <EmptyState
            title="Nenhum compromisso neste dia"
            description={
              filters.subjectIds.length || filters.categories.length
                ? "Alguns compromissos podem estar ocultos pelos filtros."
                : "Selecione outro dia no calendário."
            }
          />
        ) : (
          <div className="flex flex-col gap-0.5 p-2">
            {dayList.map((o) => (
              <EventListItem
                key={o.key}
                event={o.event}
                kind={o.kind}
                lookups={lookups}
                today={today}
                status={statusOf?.(o.event)}
                showClass={showClass}
                dateMode="none"
                onOpen={(e) => setOpenId(e.id)}
              />
            ))}
          </div>
        )}
      </Card>

      <EventDetailModal
        event={openEvent}
        lookups={lookups}
        status={openEvent ? statusOf?.(openEvent) : undefined}
        onClose={close}
        actions={openEvent && renderEventActions ? renderEventActions(openEvent, close) : undefined}
      />
    </div>
  );
}

function Legend({ categories }: { categories: CategoryMeta[] }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-navy-800/65" aria-label="Legenda" data-explain="Legenda das cores: cada categoria de compromisso tem uma cor; vermelho indica prazo vencido.">
      {categories.map((c) => (
        <span key={c.value} className="inline-flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${c.dot}`} />
          {c.label}
        </span>
      ))}
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-red-500" /> Prazo vencido
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-navy-900" />
        Hoje
      </span>
    </div>
  );
}
