"use client";

/**
 * Estado compartilhado da aplicação. Carrega os dados pelos repositórios e
 * mantém uma cópia em memória para todas as áreas (aluno, professor, admin).
 * Assim, um compromisso criado pelo professor aparece imediatamente no
 * calendário dos alunos da turma escolhida.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AcademicEvent,
  AcademicEventInput,
  ISODate,
  Student,
  Teacher,
  TeachingAssignment,
} from "@/types";
import { repositories, type SchoolSnapshot } from "@/services";
import { todayISO } from "@/lib/dates";

type Status = "loading" | "ready" | "error";

interface AppDataContextValue {
  status: Status;
  error: string | null;
  today: ISODate;
  school: SchoolSnapshot;
  events: AcademicEvent[];
  completions: Record<string, string[]>;
  reload: () => void;
  createEvent: (teacherId: string, input: AcademicEventInput) => Promise<AcademicEvent>;
  updateEvent: (id: string, input: AcademicEventInput) => Promise<AcademicEvent>;
  deleteEvent: (id: string) => Promise<void>;
  setCompleted: (studentId: string, eventId: string, completed: boolean) => Promise<void>;
  updateTeacher: (id: string, patch: Pick<Teacher, "name" | "email">) => Promise<void>;
  updateStudent: (id: string, patch: Pick<Student, "name" | "classId">) => Promise<void>;
  addAssignment: (data: Omit<TeachingAssignment, "id">) => Promise<void>;
  removeAssignment: (id: string) => Promise<void>;
}

const EMPTY_SCHOOL: SchoolSnapshot = {
  admins: [],
  teachers: [],
  students: [],
  classes: [],
  subjects: [],
  assignments: [],
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [today, setToday] = useState<ISODate>("");
  const [school, setSchool] = useState<SchoolSnapshot>(EMPTY_SCHOOL);
  const [events, setEvents] = useState<AcademicEvent[]>([]);
  const [completions, setCompletions] = useState<Record<string, string[]>>({});
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setToday(todayISO());
    Promise.all([
      repositories.school.snapshot(),
      repositories.events.list(),
      repositories.completions.listAll(),
    ])
      .then(([s, e, c]) => {
        if (cancelled) return;
        setSchool(s);
        setEvents(e);
        setCompletions(c);
        setStatus("ready");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Erro ao carregar os dados.");
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  const createEvent = useCallback(async (teacherId: string, input: AcademicEventInput) => {
    const created = await repositories.events.create(teacherId, input);
    setEvents((list) => [...list, created]);
    return created;
  }, []);

  const updateEvent = useCallback(async (id: string, input: AcademicEventInput) => {
    const updated = await repositories.events.update(id, input);
    setEvents((list) => list.map((e) => (e.id === id ? updated : e)));
    return updated;
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    await repositories.events.remove(id);
    setEvents((list) => list.filter((e) => e.id !== id));
    setCompletions((map) =>
      Object.fromEntries(Object.entries(map).map(([k, ids]) => [k, ids.filter((x) => x !== id)])),
    );
  }, []);

  const setCompleted = useCallback(async (studentId: string, eventId: string, completed: boolean) => {
    const apply = (done: boolean) =>
      setCompletions((map) => {
        const current = new Set(map[studentId] ?? []);
        if (done) current.add(eventId);
        else current.delete(eventId);
        return { ...map, [studentId]: [...current] };
      });
    apply(completed); // atualização otimista
    try {
      await repositories.completions.setCompleted(studentId, eventId, completed);
    } catch (err) {
      apply(!completed);
      throw err;
    }
  }, []);

  const updateTeacher = useCallback(async (id: string, patch: Pick<Teacher, "name" | "email">) => {
    const t = await repositories.school.updateTeacher(id, patch);
    setSchool((s) => ({ ...s, teachers: s.teachers.map((x) => (x.id === id ? t : x)) }));
  }, []);

  const updateStudent = useCallback(async (id: string, patch: Pick<Student, "name" | "classId">) => {
    const st = await repositories.school.updateStudent(id, patch);
    setSchool((s) => ({ ...s, students: s.students.map((x) => (x.id === id ? st : x)) }));
  }, []);

  const addAssignment = useCallback(async (data: Omit<TeachingAssignment, "id">) => {
    const a = await repositories.school.addAssignment(data);
    setSchool((s) => ({ ...s, assignments: [...s.assignments, a] }));
  }, []);

  const removeAssignment = useCallback(async (id: string) => {
    await repositories.school.removeAssignment(id);
    setSchool((s) => ({ ...s, assignments: s.assignments.filter((a) => a.id !== id) }));
  }, []);

  const value = useMemo<AppDataContextValue>(
    () => ({
      status,
      error,
      today,
      school,
      events,
      completions,
      reload,
      createEvent,
      updateEvent,
      deleteEvent,
      setCompleted,
      updateTeacher,
      updateStudent,
      addAssignment,
      removeAssignment,
    }),
    [
      status, error, today, school, events, completions, reload, createEvent, updateEvent,
      deleteEvent, setCompleted, updateTeacher, updateStudent, addAssignment, removeAssignment,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData deve ser usado dentro de AppDataProvider");
  return ctx;
}
