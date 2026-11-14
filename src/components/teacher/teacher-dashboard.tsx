"use client";

import Link from "next/link";
import { useState } from "react";
import { SUBJECT_COLORS } from "@/lib/categories";
import { cn } from "@/lib/cn";
import { daysFrom, formatLongDate, relativeLabel } from "@/lib/dates";
import { compareByDeadline, deadlineOf, isPrivateEvent } from "@/lib/event-rules";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { EventDetailModal } from "@/components/calendar/event-detail-modal";
import { EventListItem } from "@/components/calendar/event-list-item";
import { TeacherEventActions, useEventEditor } from "./event-editor";
import { useTeacherAgenda } from "./use-teacher-agenda";

/** Painel do professor organizado por turma (sala). */
export function TeacherDashboard() {
  const { teacher, lookups, today, assignments, myEvents, subjects, classes } = useTeacherAgenda();
  const editor = useEventEditor();
  const [classId, setClassId] = useState<string>("");
  const [openId, setOpenId] = useState<string | null>(null);
  const openEvent = myEvents.find((e) => e.id === openId) ?? null;

  if (!teacher) return <EmptyState icon="user" title="Professor não encontrado" />;

  const selectedId = classes.some((c) => c.id === classId) ? classId : classes[0]?.id ?? "";
  const selected = classes.find((c) => c.id === selectedId);
  const upcomingOf = (id: string) =>
    myEvents.filter((e) => e.classId === id && daysFrom(today, deadlineOf(e)) >= 0).sort(compareByDeadline);
  const list = selected ? upcomingOf(selected.id) : [];
  const pastCount = selected
    ? myEvents.filter((e) => e.classId === selected.id && daysFrom(today, deadlineOf(e)) < 0).length
    : 0;

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-navy-900 p-6 text-white">
        <span className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/5" aria-hidden="true" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-white/70">{formatLongDate(today)}</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Olá, prof. {teacher.name.split(" ")[0]}!</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2" data-explain="Disciplinas vinculadas a este professor. O vínculo é definido pela administração.">
              <span className="text-xs font-semibold text-white/70">Disciplinas vinculadas:</span>
              {subjects.map((s) => (
                <span key={s.id} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
                  <span className={cn("h-2 w-2 rounded-full", SUBJECT_COLORS[s.color].dot)} />
                  {s.name}
                </span>
              ))}
            </div>
          </div>
          <Link
            href="/professor/calendario"
            data-explain="Abre o calendário mensal com todos os compromissos deste professor, incluindo os planejamentos privados."
            className="inline-flex h-11 items-center gap-2 self-start rounded-xl bg-white/10 px-4 text-sm font-semibold ring-1 ring-inset ring-white/20 hover:bg-white/20 sm:self-auto"
          >
            <Icon name="calendar" size={17} /> Calendário das minhas atividades
          </Link>
        </div>
      </div>

      <h2 className="mb-3 mt-6 text-[15px] font-bold text-navy-900">Turmas vinculadas — escolha a sala</h2>
      {classes.length === 0 ? (
        <Card><EmptyState icon="users" title="Nenhuma turma vinculada" description="A administração ainda não vinculou turmas a este professor." /></Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-testid="class-picker">
          {classes.map((c) => {
            const up = upcomingOf(c.id);
            const next = up[0];
            const active = c.id === selectedId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setClassId(c.id)}
                aria-pressed={active}
                data-explain="Sala (turma) em que o professor leciona. Clique para ver os próximos compromissos dessa sala e lançar um novo."
                className={cn(
                  "rounded-2xl border p-4 text-left transition-all",
                  active ? "border-navy-900 bg-white shadow-lg shadow-sky-100 ring-2 ring-navy-900" : "border-line/70 bg-white hover:-translate-y-0.5 hover:border-sky-300",
                )}
              >
                <span className="flex items-start justify-between gap-2">
                  <span>
                    <span className="block text-lg font-extrabold text-navy-900">{c.name}</span>
                    <span className="block text-xs text-navy-800/60">
                      {assignments.filter((a) => a.classId === c.id).map((a) => lookups.subject(a.subjectId)?.name).join(" · ")} · {c.shift}
                    </span>
                  </span>
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold", active ? "bg-navy-900 text-white" : "bg-head text-navy-900")}>
                    {up.length} próximo(s)
                  </span>
                </span>
                <span className="mt-3 block truncate border-t border-line/40 pt-3 text-xs text-navy-800/70">
                  {next ? (
                    <>
                      <strong className="text-navy-900">{relativeLabel(today, deadlineOf(next))}:</strong> {next.title}
                    </>
                  ) : (
                    "Nenhum compromisso futuro."
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {selected && (
        <Card className="mt-4" data-testid="class-panel">
          <div className="flex flex-col gap-3 border-b border-line/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium text-navy-800/55">Próximos compromissos</p>
              <h3 className="text-lg font-extrabold text-navy-900">{selected.name}</h3>
            </div>
            <Button
              icon="plus"
              onClick={() => editor.openCreate(undefined, selected.id)}
              data-testid="new-event"
              data-explain="Abre o formulário para lançar um compromisso (prova, atividade, trabalho, projeto, planejamento ou outro) já com esta sala selecionada."
            >
              Lançar compromisso para {selected.name}
            </Button>
          </div>
          {list.length === 0 ? (
            <EmptyState title={`Nenhum compromisso futuro para ${selected.name}`} description="Use o botão acima para lançar o primeiro." />
          ) : (
            <div className="flex flex-col gap-0.5 p-2">
              {list.map((e) => (
                <div key={e.id} className="relative">
                  <EventListItem event={e} lookups={lookups} today={today} onOpen={(ev) => setOpenId(ev.id)} />
                  {isPrivateEvent(e) && <span className="sr-only">Privado</span>}
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between border-t border-line/50 px-5 py-3 text-sm">
            <span className="text-navy-800/60">{pastCount} compromisso(s) já realizado(s) nesta sala</span>
            <Link href="/professor/compromissos" className="font-semibold text-sky-700 hover:underline" data-explain="Lista completa de compromissos cadastrados, com busca, filtros, edição e exclusão.">
              Ver todos os cadastrados
            </Link>
          </div>
        </Card>
      )}

      <EventDetailModal
        event={openEvent}
        lookups={lookups}
        onClose={() => setOpenId(null)}
        actions={
          openEvent && (
            <TeacherEventActions event={openEvent} onEdit={editor.openEdit} onDelete={editor.requestDelete} close={() => setOpenId(null)} />
          )
        }
      />
      {editor.elements}
    </>
  );
}
