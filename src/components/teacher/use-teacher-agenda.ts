"use client";

import { useMemo } from "react";
import { eventsForTeacher, compareEvents } from "@/lib/event-rules";
import { useAppData } from "@/state/app-data-context";
import { assignmentsOfTeacher, createLookups } from "@/state/selectors";
import { useSession } from "@/state/session-context";

/** Dados do professor logado na sessão demonstrativa. */
export function useTeacherAgenda() {
  const { session } = useSession();
  const { school, events, today } = useAppData();
  const teacher = school.teachers.find((t) => t.id === session?.userId) ?? null;
  const lookups = useMemo(() => createLookups(school), [school]);
  const assignments = useMemo(
    () => (teacher ? assignmentsOfTeacher(school, teacher.id) : []),
    [school, teacher],
  );
  const myEvents = useMemo(
    () => (teacher ? eventsForTeacher(events, teacher.id).sort(compareEvents) : []),
    [events, teacher],
  );
  const subjects = useMemo(() => {
    const ids = new Set(assignments.map((a) => a.subjectId));
    return school.subjects.filter((s) => ids.has(s.id));
  }, [assignments, school.subjects]);
  const classes = useMemo(() => {
    const ids = new Set(assignments.map((a) => a.classId));
    return school.classes.filter((c) => ids.has(c.id));
  }, [assignments, school.classes]);

  return { teacher, lookups, today, assignments, myEvents, subjects, classes };
}
