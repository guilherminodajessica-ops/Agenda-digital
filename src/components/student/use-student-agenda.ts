"use client";

import { useCallback, useMemo } from "react";
import type { AcademicEvent, StudentEventStatus } from "@/types";
import { eventsForStudent, studentStatus } from "@/lib/event-rules";
import { useAppData } from "@/state/app-data-context";
import { createLookups } from "@/state/selectors";
import { useSession } from "@/state/session-context";

/** Dados da agenda do estudante logado na sessão demonstrativa. */
export function useStudentAgenda() {
  const { session } = useSession();
  const { school, events, completions, today, setCompleted } = useAppData();
  const student = school.students.find((s) => s.id === session?.userId) ?? null;
  const lookups = useMemo(() => createLookups(school), [school]);

  const visible = useMemo(() => (student ? eventsForStudent(events, student) : []), [events, student]);
  const completedIds = useMemo(
    () => new Set(student ? completions[student.id] ?? [] : []),
    [completions, student],
  );

  const statusOf = useCallback(
    (e: AcademicEvent): StudentEventStatus => studentStatus(e, completedIds.has(e.id), today),
    [completedIds, today],
  );

  const subjects = useMemo(() => {
    if (!student) return [];
    const ids = new Set(school.assignments.filter((a) => a.classId === student.classId).map((a) => a.subjectId));
    return school.subjects.filter((s) => ids.has(s.id));
  }, [school, student]);

  const toggleCompleted = useCallback(
    (eventId: string, done: boolean) => (student ? setCompleted(student.id, eventId, done) : Promise.resolve()),
    [setCompleted, student],
  );

  return { student, lookups, today, visible, completedIds, statusOf, subjects, toggleCompleted };
}
