"use client";

import { useMemo } from "react";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/cn";
import { daysFrom } from "@/lib/dates";
import { deadlineOf, upcomingEvents } from "@/lib/event-rules";
import { useAppData } from "@/state/app-data-context";
import { createLookups } from "@/state/selectors";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon, type IconName } from "@/components/ui/icon";
import { EventListItem } from "@/components/calendar/event-list-item";

export function AdminOverview({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { school, events, today } = useAppData();
  const lookups = useMemo(() => createLookups(school), [school]);
  const upcoming = upcomingEvents(events, today, 10);
  const max = Math.max(1, ...CATEGORIES.map((c) => events.filter((e) => e.category === c.value).length));

  const numbers: { label: string; value: number; icon: IconName; tab: string }[] = [
    { label: "Professores", value: school.teachers.length, icon: "user", tab: "professores" },
    { label: "Alunos", value: school.students.length, icon: "users", tab: "alunos" },
    { label: "Turmas", value: school.classes.length, icon: "school", tab: "turmas" },
    { label: "Disciplinas", value: school.subjects.length, icon: "book", tab: "disciplinas" },
    { label: "Compromissos", value: events.length, icon: "calendar", tab: "compromissos" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 overflow-hidden rounded-3xl bg-navy-900 text-white sm:grid-cols-5" data-explain="Números gerais da escola fictícia. Clique em um número para abrir a seção correspondente.">
        {numbers.map((n, i) => (
          <button
            key={n.label}
            type="button"
            onClick={() => onNavigate(n.tab)}
            className={cn("flex flex-col gap-2 p-5 text-left transition-colors hover:bg-white/10", i === 4 && "col-span-2 sm:col-span-1", "border-white/10 sm:border-l sm:first:border-l-0")}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
              <Icon name={n.icon} size={18} />
            </span>
            <span className="text-3xl font-extrabold leading-none">{n.value}</span>
            <span className="text-xs font-semibold text-white/70">{n.label}</span>
          </button>
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-[15px] font-bold text-navy-900">Turmas</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {school.classes.map((c) => {
            const classEvents = events.filter((e) => e.classId === c.id);
            const future = classEvents.filter((e) => daysFrom(today, deadlineOf(e)) >= 0).length;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onNavigate("turmas")}
                data-explain="Resumo de uma turma: alunos, disciplinas vinculadas e compromissos futuros."
                className="rounded-2xl border border-line/70 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-sky-300"
              >
                <span className="flex items-center justify-between">
                  <span className="text-lg font-extrabold text-navy-900">{c.name}</span>
                  <span className="rounded-full bg-head px-2.5 py-1 text-xs font-bold text-navy-900">{c.shift}</span>
                </span>
                <span className="mt-3 grid grid-cols-3 gap-2 text-center">
                  {[
                    [school.students.filter((s) => s.classId === c.id).length, "alunos"],
                    [school.assignments.filter((a) => a.classId === c.id).length, "disciplinas"],
                    [future, "a realizar"],
                  ].map(([value, label]) => (
                    <span key={label} className="rounded-xl bg-paper py-2">
                      <span className="block text-lg font-extrabold leading-none text-navy-900">{value}</span>
                      <span className="mt-1 block text-[11px] text-navy-800/60">{label}</span>
                    </span>
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-2" data-explain="Quantidade de compromissos cadastrados em cada categoria (dado categórico), considerando todas as turmas.">
          <CardHeader title="Compromissos por categoria" icon="grid" />
          <ul className="flex flex-col gap-3 p-5">
            {CATEGORIES.map((c) => {
              const count = events.filter((e) => e.category === c.value).length;
              return (
                <li key={c.value}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-semibold text-navy-900">{c.plural}</span>
                    <span className="font-semibold text-navy-800/60">{count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-paper">
                    <div className={cn("h-full rounded-full transition-all", c.dot)} style={{ width: `${(count / max) * 100}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader
            title="Próximos 10 dias (todas as turmas)"
            icon="calendar"
            count={upcoming.length}
            action={
              <button type="button" onClick={() => onNavigate("compromissos")} className="text-xs font-semibold text-sky-700 hover:underline">
                Ver todos
              </button>
            }
          />
          {upcoming.length === 0 ? (
            <EmptyState title="Nenhum compromisso nos próximos 10 dias" />
          ) : (
            <div className="flex flex-col gap-0.5 p-2">
              {upcoming.slice(0, 6).map((e) => (
                <EventListItem key={e.id} event={e} lookups={lookups} today={today} showClass onOpen={() => onNavigate("compromissos")} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
