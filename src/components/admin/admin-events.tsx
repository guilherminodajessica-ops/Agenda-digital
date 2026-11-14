"use client";

import { useMemo, useState } from "react";
import type { AcademicEvent, EventCategory } from "@/types";
import { CATEGORIES } from "@/lib/categories";
import { formatShortDate } from "@/lib/dates";
import { compareEvents, isPrivateEvent } from "@/lib/event-rules";
import { useAppData } from "@/state/app-data-context";
import { createLookups } from "@/state/selectors";
import { CategoryBadge, PrivateBadge, SubjectTag } from "@/components/ui/badges";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/field";
import { ConfirmDialog } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { EventDetailModal } from "@/components/calendar/event-detail-modal";

export function AdminEvents() {
  const { school, events, deleteEvent } = useAppData();
  const lookups = useMemo(() => createLookups(school), [school]);
  const toast = useToast();
  const [classId, setClassId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [category, setCategory] = useState<EventCategory | "">("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<AcademicEvent | null>(null);
  const [deleting, setDeleting] = useState(false);

  const list = useMemo(
    () =>
      events
        .filter((e) => (!classId || e.classId === classId) && (!teacherId || e.teacherId === teacherId) && (!category || e.category === category))
        .sort(compareEvents),
    [events, classId, teacherId, category],
  );
  const openEvent = events.find((e) => e.id === openId) ?? null;

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteEvent(toDelete.id);
      toast("Compromisso excluído.");
      setToDelete(null);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro ao excluir.", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Todos os compromissos" icon="calendar" count={list.length} />
      <div className="grid gap-2 border-b border-line/50 p-4 sm:grid-cols-3">
        <Select aria-label="Turma" value={classId} onChange={(e) => setClassId(e.target.value)}>
          <option value="">Todas as turmas</option>
          {school.classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
        <Select aria-label="Professor" value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
          <option value="">Todos os professores</option>
          {school.teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </Select>
        <Select aria-label="Categoria" value={category} onChange={(e) => setCategory(e.target.value as EventCategory | "")}>
          <option value="">Todas as categorias</option>
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </Select>
      </div>
      {list.length === 0 ? (
        <EmptyState title="Nenhum compromisso encontrado" description="Ajuste os filtros." />
      ) : (
        <ul className="divide-y divide-line/40">
          {list.map((e) => (
            <li key={e.id}>
              <button type="button" onClick={() => setOpenId(e.id)} className="flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors hover:bg-sky-50/50 sm:flex-row sm:items-center sm:gap-4 sm:px-5">
                <span className="w-24 shrink-0 text-sm font-semibold text-navy-900">{formatShortDate(e.date)}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-navy-900">{e.title}</span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-navy-800/60">
                    <SubjectTag subject={lookups.subject(e.subjectId)} />
                    <span>{lookups.schoolClass(e.classId)?.name}</span>
                    <span>{lookups.teacher(e.teacherId)?.name}</span>
                  </span>
                </span>
                <span className="flex gap-1.5">
                  <CategoryBadge category={e.category} />
                  {isPrivateEvent(e) && <PrivateBadge />}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <EventDetailModal
        event={openEvent}
        lookups={lookups}
        onClose={() => setOpenId(null)}
        actions={
          openEvent && (
            <>
              <Button variant="secondary" onClick={() => setOpenId(null)}>Fechar</Button>
              <Button
                variant="danger"
                icon="trash"
                onClick={() => {
                  setToDelete(openEvent);
                  setOpenId(null);
                }}
              >
                Excluir
              </Button>
            </>
          )
        }
      />
      <ConfirmDialog
        open={!!toDelete}
        title="Excluir compromisso?"
        message={<><strong className="text-navy-900">{toDelete?.title}</strong> será removido para todos. Esta ação não pode ser desfeita.</>}
        confirmLabel="Excluir"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </Card>
  );
}
