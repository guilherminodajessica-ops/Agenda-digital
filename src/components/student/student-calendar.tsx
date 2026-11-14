"use client";

import { STUDENT_CATEGORIES } from "@/lib/categories";
import { PageHeader } from "@/components/layout/brand";
import { CalendarView } from "@/components/calendar/calendar-view";
import { CompletionAction } from "./completion-action";
import { useStudentAgenda } from "./use-student-agenda";

export function StudentCalendar() {
  const { student, lookups, today, visible, completedIds, statusOf, subjects, toggleCompleted } = useStudentAgenda();
  return (
    <>
      <PageHeader
        title="Meu calendário"
        description={`Compromissos da turma ${lookups.schoolClass(student?.classId ?? "")?.name ?? ""}. Toque em um dia para ver a lista ou em um compromisso para ver os detalhes.`}
      />
      <CalendarView
        events={visible}
        subjects={subjects}
        categories={STUDENT_CATEGORIES}
        lookups={lookups}
        today={today}
        statusOf={statusOf}
        renderEventActions={(event, close) => (
          <CompletionAction
            event={event}
            completed={completedIds.has(event.id)}
            onToggle={toggleCompleted}
            onClose={close}
          />
        )}
      />
    </>
  );
}
