/**
 * Regras de funcionamento dos compromissos.
 * Funções puras: não dependem de React nem da forma de armazenamento.
 */
import type {
  AcademicEvent,
  CalendarFilters,
  CalendarOccurrence,
  ISODate,
  Student,
  StudentEventStatus,
} from "@/types";
import { categoryMeta } from "./categories";
import { daysFrom } from "./dates";

export function isPrivateEvent(event: AcademicEvent): boolean {
  return categoryMeta(event.category).private;
}

export function isDeliverable(event: AcademicEvent): boolean {
  return categoryMeta(event.category).deliverable;
}

/** Data-limite: a data de entrega, quando existir; senão, a própria data. */
export function deadlineOf(event: AcademicEvent): ISODate {
  return event.dueDate ?? event.date;
}

/** Compromissos que um estudante pode ver: da sua turma e não privados. */
export function eventsForStudent(events: AcademicEvent[], student: Student): AcademicEvent[] {
  return events.filter((e) => e.classId === student.classId && !isPrivateEvent(e));
}

export function eventsForTeacher(events: AcademicEvent[], teacherId: string): AcademicEvent[] {
  return events.filter((e) => e.teacherId === teacherId);
}

export function studentStatus(
  event: AcademicEvent,
  completed: boolean,
  today: ISODate,
): StudentEventStatus {
  if (isDeliverable(event)) {
    if (completed) return "concluida";
    return daysFrom(today, deadlineOf(event)) < 0 ? "atrasada" : "pendente";
  }
  return daysFrom(today, event.date) < 0 ? "realizada" : "agendada";
}

export const STATUS_LABEL: Record<StudentEventStatus, string> = {
  concluida: "Concluída",
  atrasada: "Prazo vencido",
  pendente: "Pendente",
  agendada: "Agendada",
  realizada: "Realizada",
};

export function compareEvents(a: AcademicEvent, b: AcademicEvent): number {
  const byDate = a.date.localeCompare(b.date);
  if (byDate !== 0) return byDate;
  return (a.time ?? "99:99").localeCompare(b.time ?? "99:99");
}

export function compareByDeadline(a: AcademicEvent, b: AcademicEvent): number {
  return deadlineOf(a).localeCompare(deadlineOf(b)) || compareEvents(a, b);
}

export function applyFilters(events: AcademicEvent[], filters: CalendarFilters): AcademicEvent[] {
  return events.filter(
    (e) =>
      (filters.subjectIds.length === 0 || filters.subjectIds.includes(e.subjectId)) &&
      (filters.categories.length === 0 || filters.categories.includes(e.category)),
  );
}

/**
 * Converte compromissos em ocorrências de calendário. Quando há prazo de
 * entrega em outro dia, o compromisso também aparece no dia da entrega.
 */
export function buildOccurrences(events: AcademicEvent[]): Map<ISODate, CalendarOccurrence[]> {
  const map = new Map<ISODate, CalendarOccurrence[]>();
  const push = (o: CalendarOccurrence) => {
    const list = map.get(o.date) ?? [];
    list.push(o);
    map.set(o.date, list);
  };
  for (const event of events) {
    push({ key: `${event.id}:evento`, event, kind: "evento", date: event.date });
    if (event.dueDate && event.dueDate !== event.date) {
      push({ key: `${event.id}:entrega`, event, kind: "entrega", date: event.dueDate });
    }
  }
  for (const list of map.values()) {
    list.sort((a, b) => compareEvents(a.event, b.event));
  }
  return map;
}

/** Compromissos cuja data ou entrega cai entre hoje e `days` dias à frente. */
export function upcomingEvents(
  events: AcademicEvent[],
  today: ISODate,
  days: number,
): AcademicEvent[] {
  return events
    .filter((e) => {
      const d = daysFrom(today, e.date);
      const dl = daysFrom(today, deadlineOf(e));
      return (d >= 0 && d <= days) || (dl >= 0 && dl <= days);
    })
    .sort(compareByDeadline);
}

export interface StudentOverview {
  upcoming: AcademicEvent[];
  pending: AcademicEvent[];
  completed: AcademicEvent[];
  overdue: AcademicEvent[];
}

export function studentOverview(
  events: AcademicEvent[],
  completedIds: Set<string>,
  today: ISODate,
): StudentOverview {
  const deliverables = events.filter(isDeliverable);
  return {
    upcoming: upcomingEvents(events, today, 14).filter((e) => !completedIds.has(e.id)),
    pending: deliverables
      .filter((e) => studentStatus(e, completedIds.has(e.id), today) === "pendente")
      .sort(compareByDeadline),
    completed: deliverables.filter((e) => completedIds.has(e.id)).sort(compareByDeadline),
    overdue: deliverables
      .filter((e) => studentStatus(e, completedIds.has(e.id), today) === "atrasada")
      .sort(compareByDeadline),
  };
}
