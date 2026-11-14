"use client";

import { CATEGORIES } from "@/lib/categories";
import { PageHeader } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import { CalendarView } from "@/components/calendar/calendar-view";
import { TeacherEventActions, useEventEditor } from "./event-editor";
import { useTeacherAgenda } from "./use-teacher-agenda";

export function TeacherCalendar() {
  const { lookups, today, myEvents, subjects } = useTeacherAgenda();
  const editor = useEventEditor();
  return (
    <>
      <PageHeader
        title="Calendário das minhas atividades"
        description="Inclui seus planejamentos privados (com cadeado), que não aparecem para os alunos."
        actions={
          <Button icon="plus" onClick={() => editor.openCreate()}>
            Novo compromisso
          </Button>
        }
      />
      <CalendarView
        events={myEvents}
        subjects={subjects}
        categories={CATEGORIES}
        lookups={lookups}
        today={today}
        showClass
        renderDayAction={(date) => (
          <Button size="sm" variant="soft" icon="plus" onClick={() => editor.openCreate(date)}>
            <span className="hidden sm:inline">Adicionar neste dia</span>
            <span className="sm:hidden">Adicionar</span>
          </Button>
        )}
        renderEventActions={(event, close) => (
          <TeacherEventActions event={event} onEdit={editor.openEdit} onDelete={editor.requestDelete} close={close} />
        )}
      />
      {editor.elements}
    </>
  );
}
