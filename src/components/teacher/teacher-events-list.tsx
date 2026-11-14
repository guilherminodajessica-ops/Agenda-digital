"use client";

import { useMemo, useState } from "react";
import type { EventCategory } from "@/types";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/cn";
import { daysFrom, formatShortDate } from "@/lib/dates";
import { deadlineOf } from "@/lib/event-rules";
import { PageHeader } from "@/components/layout/brand";
import { CategoryBadge, SubjectTag } from "@/components/ui/badges";
import { Button, IconButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Select } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { EventDetailModal } from "@/components/calendar/event-detail-modal";
import { TeacherEventActions, useEventEditor } from "./event-editor";
import { useTeacherAgenda } from "./use-teacher-agenda";

type Period = "proximos" | "passados" | "todos";

export function TeacherEventsList() {
  const { lookups, today, myEvents, classes } = useTeacherAgenda();
  const editor = useEventEditor();
  const [query, setQuery] = useState("");
  const [classId, setClassId] = useState("");
  const [category, setCategory] = useState<EventCategory | "">("");
  const [period, setPeriod] = useState<Period>("proximos");
  const [openId, setOpenId] = useState<string | null>(null);
  const openEvent = myEvents.find((e) => e.id === openId) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return myEvents.filter((e) => {
      if (q && !e.title.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q)) return false;
      if (classId && e.classId !== classId) return false;
      if (category && e.category !== category) return false;
      const past = daysFrom(today, deadlineOf(e)) < 0;
      if (period === "proximos" && past) return false;
      if (period === "passados" && !past) return false;
      return true;
    });
  }, [myEvents, query, classId, category, period, today]);

  return (
    <>
      <PageHeader
        title="Compromissos cadastrados"
        description="Crie, edite e exclua os compromissos das suas turmas."
        actions={
          <Button icon="plus" onClick={() => editor.openCreate()} data-testid="new-event">
            Novo compromisso
          </Button>
        }
      />

      <Card className="mb-4 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[1fr_180px_180px_auto]" data-explain="Busca e filtros da lista: por texto, turma, categoria e período (próximos, passados ou todos).">
        <div className="relative">
          <label htmlFor="search" className="sr-only">Buscar</label>
          <Input id="search" placeholder="Buscar por título ou descrição" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <Select aria-label="Turma" value={classId} onChange={(e) => setClassId(e.target.value)}>
          <option value="">Todas as turmas</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
        <Select aria-label="Categoria" value={category} onChange={(e) => setCategory(e.target.value as EventCategory | "")}>
          <option value="">Todas as categorias</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </Select>
        <div className="flex rounded-xl bg-paper p-1 ring-1 ring-inset ring-line/70" role="group" aria-label="Período">
          {(["proximos", "passados", "todos"] as Period[]).map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={period === p}
              onClick={() => setPeriod(p)}
              className={cn(
                "h-9 flex-1 rounded-lg px-3 text-sm font-semibold capitalize transition-colors",
                period === p ? "bg-white text-navy-900 shadow-sm" : "text-navy-800/60 hover:text-navy-900",
              )}
            >
              {p === "proximos" ? "Próximos" : p}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between border-b border-line/50 px-5 py-3 text-sm text-navy-800/65">
          <span data-testid="events-count">{filtered.length} compromisso(s)</span>
        </div>
        {filtered.length === 0 ? (
          <EmptyState
            icon="list"
            title="Nenhum compromisso encontrado"
            description="Ajuste os filtros ou cadastre um novo compromisso."
            action={<Button size="sm" icon="plus" onClick={() => editor.openCreate()}>Novo compromisso</Button>}
          />
        ) : (
          <ul className="divide-y divide-line/40" data-testid="events-list" data-explain="Compromissos cadastrados pelo professor. O lápis edita e a lixeira exclui (com confirmação).">
            {filtered.map((e) => (
              <li key={e.id} className="flex items-center gap-3 px-3 py-3 sm:px-5">
                <button type="button" onClick={() => setOpenId(e.id)} className="min-w-0 flex-1 text-left">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <CategoryBadge category={e.category} />
                    <span className="text-xs font-medium text-navy-800/60">{lookups.schoolClass(e.classId)?.name}</span>
                  </span>
                  <span className="mt-1 block truncate font-semibold text-navy-900 hover:text-sky-700">{e.title}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-navy-800/60">
                    <SubjectTag subject={lookups.subject(e.subjectId)} />
                    <span className="inline-flex items-center gap-1">
                      <Icon name="calendar" size={12} /> {formatShortDate(e.date)}
                      {e.time && ` · ${e.time}`}
                    </span>
                    {e.dueDate && (
                      <span className="inline-flex items-center gap-1">
                        <Icon name="flag" size={12} /> Entrega {formatShortDate(e.dueDate)}
                      </span>
                    )}
                  </span>
                </button>
                <div className="flex shrink-0 items-center">
                  <IconButton icon="edit" label={`Editar ${e.title}`} onClick={() => editor.openEdit(e)} />
                  <IconButton icon="trash" label={`Excluir ${e.title}`} className="text-red-600 hover:bg-red-50" onClick={() => editor.requestDelete(e)} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

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
