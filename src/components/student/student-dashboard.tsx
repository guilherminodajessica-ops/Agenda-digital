"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { AcademicEvent } from "@/types";
import { categoryMeta } from "@/lib/categories";
import { cn } from "@/lib/cn";
import { addDaysISO, daysFrom, formatDayMonth, formatLongDate, fromISODate, relativeLabel, WEEKDAY_LABELS } from "@/lib/dates";
import { buildOccurrences, studentOverview } from "@/lib/event-rules";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon, type IconName } from "@/components/ui/icon";
import { EventDetailModal } from "@/components/calendar/event-detail-modal";
import { EventListItem } from "@/components/calendar/event-list-item";
import { CompletionAction } from "./completion-action";
import { useStudentAgenda } from "./use-student-agenda";

type TabId = "fazer" | "atrasadas" | "concluidas";

/** Anel de progresso das entregas concluídas. */
function ProgressRing({ done, total }: { done: number; total: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const pct = total === 0 ? 0 : done / total;
  return (
    <div className="relative h-24 w-24 shrink-0" data-explain="Proporção das entregas (atividades, trabalhos e projetos) que este aluno já marcou como concluídas.">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="8" />
        <circle
          cx="40" cy="40" r={r} fill="none" stroke="var(--color-accent)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)} className="ring-progress"
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="text-xl font-extrabold" data-testid="progress-count">{done}/{total}</span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-white/70">entregas</span>
      </span>
    </div>
  );
}

export function StudentDashboard() {
  const { student, lookups, today, visible, completedIds, statusOf, toggleCompleted } = useStudentAgenda();
  const [openId, setOpenId] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>("fazer");
  const [day, setDay] = useState(today);

  const overview = useMemo(() => studentOverview(visible, completedIds, today), [visible, completedIds, today]);
  const occurrences = useMemo(() => buildOccurrences(visible), [visible]);
  const openEvent = visible.find((e) => e.id === openId) ?? null;

  if (!student) return <EmptyState icon="user" title="Aluno não encontrado" />;

  const schoolClass = lookups.schoolClass(student.classId);
  const nextExam = visible
    .filter((e) => e.category === "prova" && daysFrom(today, e.date) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  const totalDeliverables = overview.pending.length + overview.completed.length + overview.overdue.length;
  const week = Array.from({ length: 7 }, (_, i) => addDaysISO(today, i));
  const dayList = occurrences.get(day) ?? [];

  const tabs: { id: TabId; label: string; icon: IconName; items: AcademicEvent[]; empty: string }[] = [
    { id: "fazer", label: "A fazer", icon: "clock", items: overview.upcoming, empty: "Nenhum compromisso nos próximos 14 dias." },
    { id: "atrasadas", label: "Atrasadas", icon: "alert", items: overview.overdue, empty: "Nenhuma atividade com prazo vencido." },
    { id: "concluidas", label: "Concluídas", icon: "check", items: overview.completed, empty: "Nenhuma atividade concluída. Abra uma atividade para marcar." },
  ];
  const current = tabs.find((t) => t.id === tab)!;

  return (
    <>
      {/* Faixa de boas-vindas */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-3xl bg-navy-900 p-6 text-white lg:col-span-2">
          <span className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/5" aria-hidden="true" />
          <span className="absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-sky-500/20" aria-hidden="true" />
          <div className="relative flex items-center gap-5">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white/70" data-testid="today-label">{formatLongDate(today)}</p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Olá, {student.name.split(" ")[0]}!</h1>
              <p className="mt-1 text-sm text-white/75">
                {schoolClass?.name} · turno da {schoolClass?.shift.toLowerCase()}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-white/10 px-3 py-1.5" data-explain="Quantidade de compromissos da turma nos próximos 14 dias que ainda não foram concluídos.">
                  {overview.upcoming.length} nos próximos 14 dias
                </span>
                <span className={cn("rounded-full px-3 py-1.5", overview.overdue.length ? "bg-red-500/90" : "bg-white/10")} data-explain="Atividades cujo prazo de entrega já passou e que o aluno não marcou como concluídas.">
                  {overview.overdue.length} com prazo vencido
                </span>
              </div>
            </div>
            <ProgressRing done={overview.completed.length} total={totalDeliverables} />
          </div>
        </div>

        <button
          type="button"
          disabled={!nextExam}
          onClick={() => nextExam && setOpenId(nextExam.id)}
          data-testid="next-exam"
          data-explain="Destaque da próxima prova da turma, com a contagem de dias. Clique para ver os detalhes."
          className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-line/70 bg-white p-6 text-left transition-shadow hover:shadow-md hover:shadow-sky-100"
        >
          <span className="absolute right-0 top-0 h-full w-1.5 bg-accent" aria-hidden="true" />
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-navy-800/60">
            <Icon name="flag" size={14} /> Próxima prova
          </span>
          {nextExam ? (
            <>
              <span className="mt-3 block text-4xl font-extrabold leading-none text-navy-900">
                {relativeLabel(today, nextExam.date)}
              </span>
              <span className="mt-2 block font-semibold text-navy-900">{nextExam.title}</span>
              <span className="mt-1 block text-sm text-navy-800/65">
                {lookups.subject(nextExam.subjectId)?.name} · {formatDayMonth(nextExam.date)}
                {nextExam.time ? ` · ${nextExam.time}` : ""}
              </span>
            </>
          ) : (
            <span className="mt-3 block text-sm text-navy-800/65">Nenhuma prova agendada.</span>
          )}
        </button>
      </div>

      {/* Semana */}
      <Card className="mt-4 p-4 sm:p-5" data-testid="week-strip" data-explain="Os próximos 7 dias. Os pontos coloridos indicam compromissos; clique em um dia para listar o que há nele.">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-navy-900">Próximos 7 dias</h2>
          <Link href="/aluno/calendario" className="inline-flex items-center gap-1 text-sm font-semibold text-sky-700 hover:underline" data-explain="Abre o calendário mensal completo, com filtros por disciplina e categoria.">
            Abrir calendário <Icon name="chevronRight" size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {week.map((iso) => {
            const d = fromISODate(iso);
            const list = occurrences.get(iso) ?? [];
            const selected = iso === day;
            return (
              <button
                key={iso}
                type="button"
                onClick={() => setDay(iso)}
                aria-pressed={selected}
                data-day={iso}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl border px-1 py-2.5 transition-all",
                  selected ? "border-navy-900 bg-navy-900 text-white shadow-md" : "border-line/70 bg-white text-navy-900 hover:-translate-y-0.5 hover:border-sky-300",
                )}
              >
                <span className={cn("text-[10px] font-bold uppercase", selected ? "text-white/70" : "text-navy-800/55")}>
                  {iso === today ? "Hoje" : WEEKDAY_LABELS[d.getDay()].short}
                </span>
                <span className="text-lg font-extrabold leading-none">{d.getDate()}</span>
                <span className="flex h-1.5 items-center gap-0.5">
                  {list.slice(0, 3).map((o) => (
                    <span key={o.key} className={cn("h-1.5 w-1.5 rounded-full", selected ? "bg-accent" : categoryMeta(o.event.category).dot)} />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 rounded-2xl bg-paper p-1.5" data-testid="week-day-list">
          {dayList.length === 0 ? (
            <p className="px-3 py-3 text-sm text-navy-800/60">Sem compromissos em {formatDayMonth(day)}.</p>
          ) : (
            dayList.map((o) => (
              <EventListItem key={o.key} event={o.event} kind={o.kind} lookups={lookups} today={today} status={statusOf(o.event)} dateMode="none" onOpen={(e) => setOpenId(e.id)} />
            ))
          )}
        </div>
      </Card>

      {/* Listas em abas */}
      <Card className="mt-4" data-testid="student-lists">
        <div role="tablist" aria-label="Listas de atividades" className="flex gap-1 border-b border-line/50 p-2" data-explain="Abas que separam os compromissos: o que falta fazer, o que está atrasado e o que já foi concluído.">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl px-1.5 text-[13px] font-semibold transition-colors sm:flex-none sm:gap-2 sm:px-3 sm:text-sm",
                tab === t.id ? "bg-head text-navy-900" : "text-navy-800/60 hover:bg-sky-50",
              )}
            >
              <Icon name={t.icon} size={16} className="hidden sm:block" />
              {t.label}
              <span className={cn("rounded-full px-1.5 text-xs font-bold", t.id === "atrasadas" && t.items.length ? "bg-red-100 text-red-700" : "bg-white text-navy-800")}>
                {t.items.length}
              </span>
            </button>
          ))}
        </div>
        <div role="tabpanel" key={tab} className="animate-fade-in" data-testid={`list-${tab}`}>
          {current.items.length === 0 ? (
            <EmptyState icon={current.icon} title={current.empty} />
          ) : (
            <div className="flex flex-col gap-0.5 p-2">
              {current.items.map((e) => (
                <EventListItem key={e.id} event={e} lookups={lookups} today={today} status={statusOf(e)} onOpen={(ev) => setOpenId(ev.id)} />
              ))}
            </div>
          )}
        </div>
      </Card>

      <EventDetailModal
        event={openEvent}
        lookups={lookups}
        status={openEvent ? statusOf(openEvent) : undefined}
        onClose={() => setOpenId(null)}
        actions={
          openEvent && (
            <CompletionAction event={openEvent} completed={completedIds.has(openEvent.id)} onToggle={toggleCompleted} onClose={() => setOpenId(null)} />
          )
        }
      />
    </>
  );
}
