"use client";

import { useCallback, useState } from "react";
import type { AcademicEvent, AcademicEventInput, ISODate } from "@/types";
import { useAppData } from "@/state/app-data-context";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { EventFormModal } from "@/components/forms/event-form-modal";
import { useTeacherAgenda } from "./use-teacher-agenda";

/**
 * Concentra criação, edição e exclusão de compromissos do professor.
 * Retorna funções para abrir as janelas e os elementos a renderizar.
 */
export function useEventEditor() {
  const { teacher, assignments, lookups, today } = useTeacherAgenda();
  const { createEvent, updateEvent, deleteEvent } = useAppData();
  const toast = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AcademicEvent | null>(null);
  const [defaultDate, setDefaultDate] = useState<ISODate>(today);
  const [toDelete, setToDelete] = useState<AcademicEvent | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [defaultClassId, setDefaultClassId] = useState<string | undefined>();

  const openCreate = useCallback(
    (date?: ISODate, classId?: string) => {
      setEditing(null);
      setDefaultDate(date ?? today);
      setDefaultClassId(classId);
      setFormOpen(true);
    },
    [today],
  );

  const openEdit = useCallback((event: AcademicEvent) => {
    setEditing(event);
    setFormOpen(true);
  }, []);

  const submit = async (input: AcademicEventInput) => {
    if (!teacher) return;
    if (editing) {
      await updateEvent(editing.id, input);
      toast("Compromisso atualizado. A agenda dos alunos já reflete a alteração.");
    } else {
      await createEvent(teacher.id, input);
      const className = lookups.schoolClass(input.classId)?.name ?? "";
      toast(
        input.category === "planejamento"
          ? "Planejamento salvo como privado."
          : `Compromisso publicado para a turma ${className}.`,
      );
    }
    setFormOpen(false);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteEvent(toDelete.id);
      toast("Compromisso excluído.");
      setToDelete(null);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Não foi possível excluir.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const elements = (
    <>
      <EventFormModal
        open={formOpen}
        event={editing}
        defaultDate={defaultDate}
        defaultClassId={defaultClassId}
        assignments={assignments}
        lookups={lookups}
        onClose={() => setFormOpen(false)}
        onSubmit={submit}
      />
      <ConfirmDialog
        open={!!toDelete}
        title="Excluir compromisso?"
        message={
          <>
            <strong className="text-navy-900">{toDelete?.title}</strong> será removido da sua agenda e da agenda dos
            alunos. Esta ação não pode ser desfeita.
          </>
        }
        confirmLabel="Excluir"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );

  return { openCreate, openEdit, requestDelete: setToDelete, elements };
}

/** Botões de editar/excluir para a janela de detalhes. */
export function TeacherEventActions({
  event,
  onEdit,
  onDelete,
  close,
}: {
  event: AcademicEvent;
  onEdit: (e: AcademicEvent) => void;
  onDelete: (e: AcademicEvent) => void;
  close: () => void;
}) {
  return (
    <>
      <Button
        variant="ghost"
        icon="trash"
        className="text-red-600 hover:bg-red-50 sm:mr-auto"
        onClick={() => {
          close();
          onDelete(event);
        }}
      >
        Excluir
      </Button>
      <Button
        icon="edit"
        onClick={() => {
          close();
          onEdit(event);
        }}
      >
        Editar
      </Button>
    </>
  );
}
